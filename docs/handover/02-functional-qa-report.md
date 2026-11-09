# RAPT & Co. Website — Functional QA Report

Prepared by AmbitGrow · Final audit, 9 November 2026

## Scope and method

All results come from automated browser tests (Chrome via Puppeteer) and Lighthouse runs. Nothing below is assumed from reading code.

| Environment | What it is | Code |
|---|---|---|
| **Production (deployed)** | https://rapt-co.vercel.app | `main` @ `040281a` |
| **Local** | Production build of branch `final-audit`, served locally | `578c3e4` = `040281a` + audit fixes |
| **Local + real API** | Same build behind a local server that copies Vercel's routing and runs the real `api/contact.js`. Only the email provider (Resend) is replaced by a recorder | `578c3e4` |

No valid consultation enquiry was submitted to production: doing so could send a real email to RAPT & Co. Production form checks were limited to requests that cannot trigger an email.

Status key: **PASS** tested successfully · **FIXED** defect corrected and retested · **FAIL** open defect · **BLOCKED** external dependency · **N/A** feature does not exist.

## 1. Summary

| Area | Local | Production |
|---|---|---|
| Consultation CTAs (click-through, desktop + mobile) | 50/50 PASS | 50/50 PASS |
| Consultation form, browser → API → email payload | 41/41 PASS | Validation, spam and error paths PASS; delivery BLOCKED |
| Navigation, links, routing, content | 40/40 PASS | Routes and assets spot-checked PASS |
| Responsive layout (9 routes × 6 viewports) | 54/54 PASS | not re-run (same layout code) |
| Content vs client documents | 143/143 verbatim | same data |
| Lighthouse (5 pages × mobile/desktop) | recorded, see §7 | recorded, see §7 |
| Actual email delivery | **BLOCKED** | **BLOCKED** |

## 2. Consultation system

### 2.1 Every "Book a Consultation" entry point

Each CTA was clicked in a fresh page, and the test checked that it lands on `/contact#get-in-touch` with the form visible, the mobile menu closed and no errors. CTAs inside collapsed Expertise panels were clicked after opening the panel, as a visitor would.

| Page | CTAs | Desktop 1440 | Mobile 390 |
|---|---|---|---|
| Home | header "Book Demo" (in the mobile menu on phones), hero, CTA band | PASS | PASS |
| About | header, CTA band | PASS | PASS |
| Expertise | header, hero, 10 service panels, CTA band | PASS | PASS |
| Insights | header, hero | PASS | PASS |
| Contact | header, hero (same-page link scrolls to the form) | PASS | PASS |
| Article page | header, CTA band | PASS | PASS |
| 404 page | header | PASS | PASS |
| Footer | contains no consultation CTA | N/A | N/A |

Total: **50/50 PASS locally and 50/50 PASS on production.**

**FIXED: keyboard access to hidden CTAs.** On Expertise, the 9 collapsed panels kept their "Book a Consultation" links in the Tab order while invisible. Production: 9 of 31 focus stops were inside collapsed panels. Local after the fix (`inert`): 0 of 22. This is not yet deployed.

### 2.2 Form behaviour (local, real form)

| Test | Result |
|---|---|
| Empty submission → errors on Name, Email, Phone, Service, Message; no request sent; focus moves to Name | PASS |
| Invalid email and invalid phone rejected before sending | PASS |
| Valid submission (desktop) → success message, form cleared | PASS |
| Valid submission (mobile 390 px) | PASS |
| Loading state: during a 2 s request the button shows "Sending…", is disabled and the form is `aria-busy` | PASS |
| Triple-click on Submit sends exactly 1 request | FIXED (before: a fast double-click could send 2) |
| Same enquiry re-submitted within 10 min → acknowledged, emailed only once | FIXED (new) |
| Message longer than 5,000 characters → field stops at 5,000 | FIXED (new `maxLength`) |
| Server receives over-long input → 422 with field message, nothing truncated | FIXED (was silently truncated) |
| Server-side field errors → "Please correct the highlighted fields" | FIXED (previously said "couldn't send") |
| Email provider not configured → error with RAPT & Co. phone and email; input kept | PASS |
| Email provider failing → same, no internal details shown | PASS |
| Consent checkbox | N/A (no consent field exists) |

Note: the form card fades in over about 0.5 s on page load and cannot be clicked until it is visible. Typed text is never lost.

### 2.3 API (`POST /api/contact`)

| Test | Local | Production |
|---|---|---|
| `GET` → 405 | PASS | PASS |
| Malformed JSON → 400, generic message, no stack trace | PASS | PASS |
| Honeypot filled → 200, **no email** | PASS | PASS (200) |
| Bot-speed submission (< 3 s) → 200, no email | PASS | not tested (cannot prove no email) |
| Invalid fields → 422 with per-field messages | PASS | PASS |
| Email format: accepts `a@b.co`, `first.last+tag@sub.example.in`; rejects `no-at-sign.com`, `a@b`, `a b@c.com` | PASS | – |
| Phone: accepts `+91 91768 84914`, `(044) 2345-6789`; rejects `12345`, 20 digits, letters | PASS | – |
| Rate limit: 6th request from one IP in 10 min → 429 | PASS | not tested |
| POST from another website (Origin header) → 403 | FIXED (PASS locally) | **FAIL: accepted; fix not yet deployed** |
| Payload sent to the provider: `to`/`from` from env vars; `reply_to` = visitor; subject `Consultation request: SOC Audits (QA Tester)`; HTML and text bodies contain all six fields; HTML-escaped | PASS | – |
| API key only in the server-side `Authorization` header; absent from the site bundle and Git history | PASS | PASS |

### 2.4 Actual email delivery — **BLOCKED**

No real email has been sent or received. Whether `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set in Vercel cannot be checked from outside without sending a real enquiry. To complete this check:

1. Set the three variables in Vercel (Production and Preview), using an inbox agreed with RAPT & Co.
2. Redeploy, open the **Preview**, and submit one enquiry clearly marked as a test.
3. Confirm it arrives, then check the sender, the reply-to (visitor's address), the subject and all six fields.
4. Check the Resend dashboard log shows "Delivered".

## 3. Navigation and links (local, 40 checks: all PASS)

- Protect/Govern/Grow "Learn more" → `/expertise#dpdpa-compliance`, `#governance-risk-compliance`, `#income-tax-services`, which open and scroll to the matching service.
- Six expertise carousel arrows → their service on the Expertise page.
- "Read Article" buttons on Home and About (4 each) → the correct article, opened at the top.
- Footer expertise links → the matching service; footer quick links → the five pages.
- No placeholder social links remain. The LinkedIn icon is hidden until a URL is configured (BLOCKED, see outstanding items).
- Mobile menu opens, closes with Escape, and closes after navigating.
- Insights: category filter, 6 articles listed, reading time shown, no empty fields, company-profile download.
- Browser back/forward, direct URL load and refresh of an article page.
- Missing article → "Insight Not Found" with `noindex`; unknown URL → 404 page with `noindex`.
- Leadership: 4 real photos load; the selector switches between all 4 profiles.

**Production spot checks (PASS):** `/expertise`, an article URL and an unknown URL load via direct visit; `/company-profile.pdf` returns 200, `application/pdf`, 246,753 bytes, sent as a download; fonts load from `/fonts/`; `robots.txt` is served.

**FAIL on production, FIXED locally:** `/sitemap.xml` returned the homepage HTML with status 200 because no sitemap exists until the domain is set. It now returns 404 until `VITE_SITE_URL` is configured.

## 4. Company profile PDF

| Check | Result |
|---|---|
| 20 pages, all 960 × 540 pt (16:9, matching the deck) | PASS |
| Every page rendered and checked for clipping | PASS |
| Text kept as selectable vector text | PASS |
| All "Download Company Profile" buttons (Home, Expertise, Contact, Insights resource) → `/company-profile.pdf` | PASS |
| Served with `Content-Disposition: attachment` on production | PASS |

Slide 3 contains an auto-updating date field, so the PDF shows its export date.

## 5. Content audit (143/143 PASS)

Every leadership heading and bullet, every qualification line, all 10 service titles and descriptions, 74 scope points and 4 client-benefit statements were compared, after normalising whitespace and dash characters, against *R A P T & Co_Profile&Scope_Deck.pptx* and *RAPT_Audit-Services_Portfolio.docx*: **143 matches, 0 differences.** The testimonials section is absent. Contact details match deck slide 20. FAQs are written from the deck, so they are not verbatim.

## 6. Responsive and visual QA (local)

Viewports: 1920×1080, 1440×900, 1366×768, 768×1024, 390×844, 375×812. Routes: the 5 pages, 2 articles, a missing article and a 404. **54/54 PASS**: no horizontal scrolling, no console errors, no failed requests, no broken images, no dead or placeholder links, one `<h1>` per page.

Touch targets under 24 px are flagged only for inline text links (footer link lists, breadcrumbs, article contents list), which WCAG 2.5.8 exempts. Earlier screenshot reviews covered the hero, leadership, advisory cards, insights and form at desktop, tablet and mobile.

## 7. Lighthouse

Mobile figures are the median of 3 runs (Lighthouse default mobile throttling); desktop is 1 run (Lighthouse desktop preset). Scores: Performance / Accessibility / Best Practices / SEO.

| Page | Production mobile | Production desktop | Local mobile | Local desktop |
|---|---|---|---|---|
| Home | 85 / 100 / 100 / 100 | 99 / 100 / 100 / 100 | 75 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |
| About | 90 / 100 / 100 / 100 | 99 / 96 / 100 / 100 | 77 / 100 / 100 / 100 | 99 / 96 / 100 / 100 |
| Expertise | 82 / 95 / 100 / 100 | 100 / 95 / 100 / 100 | 80 / 95 / 100 / 100 | 99 / 95 / 100 / 100 |
| Insights | 89 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 84 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |
| Contact | 92 / 100 / 100 / 100 | 97 / 100 / 100 / 100 | 91 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

- **Production mobile metrics:** first content 1.3–1.4 s, largest content 2.6–2.8 s, layout shift ≤ 0.032.
- Production scores higher than local because Vercel's CDN compresses and caches files.
- **Accessibility 95/96:** caused by contrast while the approved fade-in animations play on Expertise ("Phase" labels) and About. The final colours pass. Left as approved design.

## 8. Security

| Check | Result |
|---|---|
| Secrets in site bundle / Git history / committed `.env` | None found (PASS) |
| `npm audit` | 6 issues (dev server and build tooling; react-router issue applies only to an unused feature) → fixed within existing version ranges → **0 vulnerabilities** (FIXED) |
| Unused dependencies | `@react-three/postprocessing`, `postprocessing` removed (FIXED) |
| Security headers on production | Only HSTS → added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` (FIXED locally, not deployed; must be checked on a Preview) |
| CORS | No CORS headers, so browsers block cross-site reads; cross-site POSTs now rejected by an Origin check (FIXED locally) |
| Input handling | Validated server-side, length-limited, HTML-escaped in emails (PASS) |
| Errors and logs | Generic messages to users; logs contain no visitor data or keys (PASS) |
| Content-Security-Policy | Not set; recommended after go-live (needs testing with inline scripts and WebGL) |

## 9. Build

`npm ci` (lockfile uses HTTPS registry URLs only), `npm run lint` (0 issues), `npm run build` (succeeds) — all PASS. There is no automated test suite in the repository; the browser test scripts above were run from outside the project.

## 10. Open defects and blocked items

| ID | Item | Status |
|---|---|---|
| D1 | Cross-site POSTs accepted by production API | FIXED in `578c3e4`, **awaiting deployment** |
| D2 | Hidden Expertise CTAs reachable by keyboard on production | FIXED in `578c3e4`, awaiting deployment |
| D3 | `/sitemap.xml` returns HTML with status 200 on production | FIXED in `578c3e4`, awaiting deployment |
| D4 | Missing security headers on production | FIXED in `578c3e4`, awaiting deployment |
| B1 | Actual email delivery | BLOCKED (email configuration) |
| B2 | Vercel Preview of `final-audit` | BLOCKED (branch not pushed; needs authorisation) |
