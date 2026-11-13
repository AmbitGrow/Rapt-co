import { PRIMARY_CONTACT_EMAIL } from "../src/Data/site.js";

// Vercel serverless function: POST /api/contact
// Sends consultation requests by email through the Resend REST API (https://resend.com).
//
// Required environment variables (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY      Resend API key (server-side only, never exposed to the browser)
//   Recipient is fixed to the client-approved PRIMARY_CONTACT_EMAIL in src/Data/site.js
// Optional:
//   CONTACT_FROM_EMAIL  Verified sender, e.g. "RAPT & Co. Website <website@yourdomain.com>"
//                       (defaults to Resend's test sender, which only delivers to the account owner)

const MAX_LENGTHS = { name: 100, email: 254, phone: 20, company: 150, service: 120, message: 5000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
const MIN_FILL_MS = 3000; // faster submissions are treated as bots
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const recentSubmissions = new Map(); // best-effort, per warm instance
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const recentEnquiries = new Map(); // email+message -> time sent (best-effort duplicate guard)
const FIELD_LABELS = { name: "Name", email: "Email", phone: "Phone number", company: "Company", service: "Service", message: "Message" };

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function prune(map, maxAgeMs, now) {
  if (map.size < 1000) return;
  for (const [key, value] of map) {
    const latest = Array.isArray(value) ? value[value.length - 1] : value;
    if (now - latest > maxAgeMs) map.delete(key);
  }
}

export function validate(body) {
  const data = Object.fromEntries(
    Object.keys(MAX_LENGTHS).map((field) => [field, clean(body?.[field])]),
  );
  const errors = {};
  // Over-long input is rejected rather than silently truncated, so no enquiry text is lost.
  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    if (data[field].length > max) errors[field] = `${FIELD_LABELS[field]} is too long (maximum ${max} characters).`;
  }
  if (!data.name) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(data.email)) errors.email = "Please enter a valid email address.";
  const digits = data.phone.replace(/\D/g, "");
  if (!PHONE_PATTERN.test(data.phone) || digits.length < 7 || digits.length > 15) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!data.service) errors.service = "Please select a service.";
  if (data.message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  return { data, errors };
}

function isRateLimited(ip, now = Date.now()) {
  const history = (recentSubmissions.get(ip) || []).filter((time) => now - time < RATE_LIMIT.windowMs);
  history.push(now);
  recentSubmissions.set(ip, history);
  prune(recentSubmissions, RATE_LIMIT.windowMs, now);
  return history.length > RATE_LIMIT.max;
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res, { fetchImpl = globalThis.fetch, env = process.env } = {}) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "Method not allowed." });
  }

  // Browsers always send Origin on cross-site POSTs: only accept the site's own pages.
  const origin = req.headers?.origin;
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      // malformed Origin header: treated as foreign below
    }
    if (originHost !== req.headers?.host) return send(res, 403, { ok: false, error: "Forbidden." });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { ok: false, error: "Invalid request." });
  }

  // Spam protection: hidden honeypot field + minimum time on the form.
  const startedAt = Number(body?.startedAt);
  if (body?.website || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    // Respond as if accepted so bots get no signal.
    return send(res, 200, { ok: true });
  }

  const ip = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return send(res, 429, { ok: false, error: "Too many requests. Please try again later." });
  }

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return send(res, 422, { ok: false, errors });

  // The same enquiry re-sent within 10 minutes (double click, retry) is acknowledged, not re-emailed.
  const enquiryKey = `${data.email.toLowerCase()}
${data.message}`;
  const sentAt = recentEnquiries.get(enquiryKey);
  if (sentAt && Date.now() - sentAt < DUPLICATE_WINDOW_MS) return send(res, 200, { ok: true, duplicate: true });

  const apiKey = env.RESEND_API_KEY;
  const to = [PRIMARY_CONTACT_EMAIL];
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not configured.");
    return send(res, 503, { ok: false, error: "The contact service is not configured yet." });
  }

  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company", data.company || "-"],
    ["Service", data.service],
  ];
  const html = `<h2>New consultation request</h2>
<table cellpadding="6">${rows.map(([label, value]) => `<tr><th align="left">${label}</th><td>${escapeHtml(value)}</td></tr>`).join("")}</table>
<h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`;
  const text = `${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nMessage:\n${data.message}`;

  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL || "RAPT & Co. Website <onboarding@resend.dev>",
        to,
        reply_to: data.email,
        subject: `Consultation request: ${data.service} (${data.name})`,
        html,
        text,
      }),
    });
    if (!response.ok) {
      console.error("[contact] Resend error", response.status, await response.text());
      return send(res, 502, { ok: false, error: "We could not send your request. Please try again." });
    }
  } catch (error) {
    console.error("[contact] Network error", error);
    return send(res, 502, { ok: false, error: "We could not send your request. Please try again." });
  }

  recentEnquiries.set(enquiryKey, Date.now());
  prune(recentEnquiries, DUPLICATE_WINDOW_MS, Date.now());
  return send(res, 200, { ok: true });
}
