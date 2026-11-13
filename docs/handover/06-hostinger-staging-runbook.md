# RAPT & Co — Hostinger staging deployment runbook

**Scope:** Separate staging app on the existing Hostinger Business Web Hosting plan.
**Source of truth:** `AmbitGrow/Rapt-co` with prelaunch corrections from merged PR #3.
**Deployment branch:** `deploy/hostinger-staging-20261113`.
**Do not modify:** the existing `marudhammarachekku.com` website, RAPT's DNS, business email records, or production site.

## 1. Architecture

The React/Vite frontend is still built with `npm run build` into `dist/`.
Hostinger's `server/index.js` calls listen() unconditionally (also when imported by a loader), while the testable Express app is in `server/app.js`:
- serves Vite's static assets, the 20-page company PDF, and SPA deep links;
- handles `POST /api/contact` through the **same** existing validation, anti-spam and Resend logic in `api/contact.js`;
- limits contact JSON request bodies to 16 KB and rejects invalid JSON without sending mail;
- preserves the essential security headers and immutable caching on hashed assets;
- blocks indexing while `RAPT_STAGING=true` or when the host ends in `.hostingersite.com`;
- returns a genuine 404 for missing asset files and nonexistent API routes.

No new database is required. No Resend API key or other secrets are stored in Git.

## 2. Hostinger setup (account owner / authorized operator)

In hPanel, select **Websites → Create site → Web App**, on the **existing Business Web Hosting subscription** currently used by `marudhammarachekku.com`.

1. Select **Use temporary domain**. Do **not** choose `theraptconsulting.com`, its `www` host, or the existing hosted website.
2. Select **Import your Git repository** → GitHub. Grant the Hostinger GitHub App the minimum access required for **AmbitGrow/Rapt-co**; never paste credentials into the site.
3. **Warning:** Hostinger supports only one connected GitHub account per hosting plan for Node.js apps. If it says a different account is already connected, stop. Do not disconnect or replace an existing integration without confirming impact.
4. Choose repository **AmbitGrow/Rapt-co**, branch **deploy/hostinger-staging-20261113**. Do not choose `main` or create a duplicate public-repository fork.
5. Build settings:
   - Framework preset: **Express** (if unavailable/misdetected, choose **Other** with the explicit entry file below)
   - Node version: **22.x**
   - Root directory: `./`
   - Package manager: **npm**
   - Build command: `npm run build`
   - Entry file: `server/index.js`
   - Start command (if requested): `npm start`
   - Static build directory (if requested): `dist`
   - Port: use the `PORT` assigned by Hostinger; do not hardcode a production port
6. Set **RAPT_STAGING=true** as a **runtime** environment variable. Leave `VITE_SITE_URL` empty for temporary staging so there are no production canonical tags or sitemap URLs.
7. For the first smoke test, **do not enter Resend secrets**. The frontend and navigation should work, and the API should fail closed with a 503 for valid enquiries until the secret and recipient are deliberately configured.
8. Deploy; record the **actual temporary `hostingersite.com` URL** and deployment log. Never invent or assume its address.

If any deployment setting is missing or named differently, inspect the Hostinger-detected framework settings before continuing. Do not alter existing DNS or hosting configuration to get past setup.

## 3. Enquiry email — separate release gate

After the staging website passes static and navigation QA, confirm the correct recipient address with the client and confirm Resend domain/sender verification. Then set these **server-side** runtime variables in hPanel's Environment Variables screen:
- `RESEND_API_KEY`: valid, secret Resend key
- `CONTACT_TO_EMAIL`: explicitly approved test/live recipient(s)
- `CONTACT_FROM_EMAIL`: verified sender, e.g. `RAPT & Co. Website <website@theraptconsulting.com>` **only if verified and approved**

Do **not** place secrets in `VITE_*` variables, commit `.env` files, or rely on Resend's test sender as evidence of delivery to the client's inbox.
Perform **one clearly labelled test enquiry**, then check both recipient inbox and Resend delivery log.
Contact form sends only after these are confirmed.

## 4. Technical validation

Run locally:

```bash
npm ci
npm run lint
npm run build
npm run test:hostinger
npm audit --omit=dev --audit-level=moderate
npm start
```

On temporary Hostinger URL, test:
- Home, Expertise (all ten service entries), Insights and direct article refresh, About, Contact
- Header consultation CTA and mobile navigation at desktop/tablet/mobile widths
- `/company-profile.pdf` downloads as a PDF
- `/robots.txt` disallows indexing and responses have `X-Robots-Tag: noindex, nofollow`
- `/sitemap.xml` is 404 until production canonical host is configured
- invalid/malformed contact POSTs are rejected, and only after configuration real contact email delivery succeeds
- security headers, browser console, broken images, and performance on the actual host

**Do not merge this staging branch to `main` or connect a client domain until independent QA and explicit release approval.**

## 5. Production cutover later (not part of staging)

When approved: choose the final repository branch and set `RAPT_STAGING=false` for production. Set `VITE_SITE_URL` to the **confirmed** canonical production origin and rebuild; verify an 11-URL sitemap, robots.txt, canonical/OG tags, and domain SSL. Change only the necessary website DNS records with a recorded rollback plan. Preserve and validate the existing Hostinger MX, SPF, DKIM and DMARC records and business mail service. Test production contact delivery.
