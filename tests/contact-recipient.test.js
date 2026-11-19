import { test } from "node:test";
import assert from "node:assert/strict";
import contactHandler from "../api/contact.js";
import { CONTACT_EMAILS, PRIMARY_CONTACT_EMAIL } from "../src/Data/site.js";

test("only the approved RAPT address is displayed and used for enquiries", async () => {
  assert.equal(PRIMARY_CONTACT_EMAIL, "info@theraptconsulting.com");
  assert.deepEqual(CONTACT_EMAILS, ["info@theraptconsulting.com"]);

  let sentPayload;
  let emailAttempts = 0;
  let status = 0;
  let bodyResponse;
  const now = Date.now();
  const request = {
    method: "POST",
    headers: {
      host: "staging.local",
      origin: "https://staging.local",
      "x-forwarded-for": "qa-recipient-fixture-20261113",
    },
    body: {
      name: "QA verification only",
      email: "valid@example.invalid",
      phone: "9876543210",
      company: "AmbitGrow test",
      service: "Privacy Audits",
      message: "Mock request. No real email must be sent.",
      startedAt: now - 30_000,
    },
  };

  const response = {
    setHeader() {},
    end(text) { bodyResponse = JSON.parse(text); },
    set statusCode(value) { status = value; },
    get statusCode() { return status; },
  };

  await contactHandler(request, response, {
    env: {
      RESEND_API_KEY: "test-value-not-a-real-key",
      CONTACT_FROM_EMAIL: "RAPT Website <verified@example.invalid>",
      CONTACT_TO_EMAIL: "unapproved@example.invalid",
    },
    fetchImpl: async (_url, options) => {
      emailAttempts++;
      sentPayload = JSON.parse(options.body);
      return { ok: true };
    },
  });

  assert.equal(status, 200);
  assert.equal(bodyResponse.ok, true);
  assert.equal(emailAttempts, 1);
  assert.deepEqual(sentPayload.to, ["info@theraptconsulting.com"]);
  assert.equal(sentPayload.reply_to, "valid@example.invalid");
});
