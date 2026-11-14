import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import app from "../server/app.js";

process.env.RAPT_STAGING = "true";

let server;
let baseUrl;

before(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  baseUrl = "http://127.0.0.1:" + server.address().port;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

const get = (route) => fetch(baseUrl + route);

const post = (body, headers = {}) => fetch(baseUrl + "/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json", ...headers },
  body: typeof body === "string" ? body : JSON.stringify(body),
});

test("Hostinger SPA serves homepage, contact, and direct insights URLs", async () => {
  for (const route of ["/", "/contact", "/expertise", "/insights", "/insights/schools-children-data-privacy"]) {
    const response = await get(route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type"), /text\/html/i);
    assert.match(await response.text(), /RAPT/i);
  }
});

test("staging routes never signal search engines to index", async () => {
  const response = await get("/");
  assert.match(response.headers.get("x-robots-tag"), /noindex/i);
  const robots = await get("/robots.txt");
  assert.equal(robots.status, 200);
  assert.equal(await robots.text(), "User-agent: *\nDisallow: /\n");
  assert.equal((await get("/sitemap.xml")).status, 404);
});

test("security headers match the existing Vercel deployment", async () => {
  const headers = (await get("/")).headers;
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(headers.get("permissions-policy"), /camera=\(\)/);
  assert.equal(headers.get("x-powered-by"), null);
});

test("static assets are cached and the company profile remains a PDF download", async () => {
  const assets = readdirSync(new URL("../dist/assets/", import.meta.url));
  const asset = assets.find((file) => file.endsWith(".js"));
  assert.ok(asset, "Vite output must have a JS asset");
  const assetResponse = await get("/assets/" + asset);
  assert.equal(assetResponse.status, 200);
  assert.match(assetResponse.headers.get("cache-control"), /immutable/);

  const pdf = await get("/company-profile.pdf");
  assert.equal(pdf.status, 200);
  assert.match(pdf.headers.get("content-type"), /application\/pdf/);
  assert.match(pdf.headers.get("content-disposition"), /RAPT-and-Co-Company-Profile.pdf/);
  assert.ok((await pdf.arrayBuffer()).byteLength > 100_000);
});

test("missing assets and API routes do not fall back to the SPA", async () => {
  assert.equal((await get("/assets/not-found-file.js")).status, 404);
  const missingApi = await get("/api/not-real");
  assert.equal(missingApi.status, 404);
  assert.match(missingApi.headers.get("content-type"), /application\/json/);
});

test("contact endpoint only accepts POST", async () => {
  const response = await get("/api/contact");
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
});

test("contact endpoint blocks cross-site Origins", async () => {
  const response = await post({}, { Origin: "https://another-site.invalid" });
  assert.equal(response.status, 403);
});

test("contact endpoint enforces Content-Type and JSON validity", async () => {
  assert.equal((await post("text", { "Content-Type": "text/plain" })).status, 415);
  assert.equal((await post("{invalid-json")).status, 400);
  assert.equal((await post("x".repeat(20_000))).status, 413);
});

test("validation rejects invalid fields, and honeypot never sends mail", async () => {
  const invalid = await post({ startedAt: Date.now() - 30_000 });
  assert.equal(invalid.status, 422);
  const invalidBody = await invalid.json();
  assert.ok(invalidBody.errors.name);

  const bot = await post({ startedAt: Date.now() - 30_000, website: "spammer.invalid" });
  assert.equal(bot.status, 200);
  assert.equal((await bot.json()).ok, true);
});

test("valid contact request without Resend config fails closed; never emails", async () => {
  const oldKey = process.env.RESEND_API_KEY;
  const oldRecipient = process.env.CONTACT_TO_EMAIL;
  process.env.RESEND_API_KEY = "";
  process.env.CONTACT_TO_EMAIL = "";
  try {
    const response = await post({
      startedAt: Date.now() - 30_000,
      name: "Local QA Tester",
      email: "noreply@example.invalid",
      phone: "9876543210",
      service: "GRC Advisory",
      message: "Local deployment check only. Do not email.",
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, false);
  } finally {
    if (oldKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = oldKey;
    if (oldRecipient === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = oldRecipient;
  }
});
