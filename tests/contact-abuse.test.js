import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/contact.js";

const env = {
  RESEND_API_KEY: "mock-only",
  CONTACT_FROM_EMAIL: "QA <qa@example.invalid>",
};
const valid = (message) => ({
  name: "QA",
  email: "qa@example.invalid",
  phone: "9876543210",
  service: "Privacy Audits",
  message,
  startedAt: Date.now() - 5000,
});

async function post({ forwarded, socket, message, fetchImpl }) {
  let payload;
  const response = {
    statusCode: 0,
    setHeader() {},
    end(text) { payload = JSON.parse(text); },
  };
  await handler({
    method: "POST",
    headers: { "x-forwarded-for": forwarded },
    socket: socket ? { remoteAddress: socket } : undefined,
    body: valid(message),
  }, response, { env, fetchImpl });
  return { status: response.statusCode, payload };
}

test("spoofed leftmost forwarded IP cannot evade the last-hop rate limit", async () => {
  let attempts = 0;
  const fetchImpl = async () => { attempts++; return { ok: true }; };
  for (let i = 0; i < 6; i++) {
    const result = await post({
      forwarded: `198.51.100.${i + 1}, 203.0.113.101`,
      message: `Distinct test request ${i}`, fetchImpl,
    });
    assert.equal(result.status, i < 5 ? 200 : 429);
  }
  assert.equal(attempts, 5);
});

test("invalid or absent forwarded IP falls back to socket address", async () => {
  let attempts = 0;
  const fetchImpl = async () => { attempts++; return { ok: true }; };
  for (let i = 0; i < 6; i++) {
    const result = await post({
      forwarded: i % 2 ? "" : "198.51.100.5, invalid",
      socket: "203.0.113.102",
      message: `Socket fallback request ${i}`, fetchImpl,
    });
    assert.equal(result.status, i < 5 ? 200 : 429);
  }
  assert.equal(attempts, 5);
});

test("concurrent duplicate enquiries share one provider attempt and retries deduplicate", async () => {
  let attempts = 0;
  const fetchImpl = async () => {
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return { ok: true };
  };
  const request = {
    forwarded: "203.0.113.103",
    message: "Identical concurrent request", fetchImpl,
  };
  const results = await Promise.all([post(request), post(request)]);
  assert.deepEqual(results.map((r) => r.status), [200, 200]);
  assert.equal(results.filter((r) => r.payload.duplicate).length, 1);
  assert.equal((await post(request)).payload.duplicate, true);
  assert.equal(attempts, 1);
});

test("concurrent provider failure is not acknowledged as delivered; retry can succeed", async () => {
  let attempts = 0;
  const fetchImpl = async () => {
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return attempts === 1 ? { ok: false, status: 503 } : { ok: true };
  };
  const request = {
    forwarded: "203.0.113.104",
    message: "Retry after provider failure", fetchImpl,
  };
  const results = await Promise.all([post(request), post(request)]);
  assert.deepEqual(results.map((r) => r.status), [502, 502]);
  assert.equal(attempts, 1);
  assert.equal((await post(request)).status, 200);
  assert.equal(attempts, 2);
});
