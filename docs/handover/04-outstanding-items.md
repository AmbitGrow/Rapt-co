# RAPT & Co. Website — Outstanding Items Report

Prepared by AmbitGrow · 9 November 2026

## 1. Completed (earlier delivery, now in production on `main` @ `040281a`)

- Learn More, Read Article, consultation CTAs, footer and service deep links all working.
- Leadership: 4 profiles, verbatim from the deck, with the client's own photographs.
- 10 services (6 from the deck + 4 from the services portfolio), FAQs aligned to the deck, Vision and Mission from the deck.
- Company profile PDF (20 pages) linked from every download button.
- Fabricated testimonials, placeholder social links, invented case studies and dead links removed.
- Consultation form with validation, spam protection and the email backend (`api/contact.js`).
- SEO metadata, structured data, `robots.txt`, 404 page.
- Performance: deferred 3D globe, optimised images, hero preload, self-hosted font.

## 2. Fixed during the final audit (branch `final-audit`, commit `578c3e4`, not yet deployed)

| # | Fix |
|---|---|
| 1 | Keyboard users could tab into 9 invisible "Book a Consultation" links in collapsed Expertise panels |
| 2 | A fast double-click could submit the same enquiry twice |
| 3 | Over-long input was silently truncated on the server; it is now rejected with a clear message, and fields have matching length limits |
| 4 | The same enquiry re-sent within 10 minutes is no longer emailed twice |
| 5 | The API accepted POSTs from other websites; now rejected |
| 6 | Server-side validation errors were shown as "couldn't send"; now "correct the highlighted fields" |
| 7 | Security headers added (`nosniff`, frame protection, referrer and permissions policies) |
| 8 | `/sitemap.xml` returned the homepage with status 200; now a proper 404 until a sitemap exists |
| 9 | 6 dependency advisories fixed (0 remaining); 2 unused packages removed |
| 10 | `.env.example`, updated README and these handover documents added |

## 3. Verified locally

Everything in sections 1 and 2, on the `final-audit` production build:
- 50/50 consultation CTA clicks
- 41/41 form and API end-to-end checks, with the real API handler and a recording stand-in for Resend
- 40/40 navigation and routing checks
- 54/54 responsive checks
- 143/143 content items verbatim
- Lighthouse, lint, build and `npm audit` (0 vulnerabilities)

## 4. Verified on the deployed site

Production (https://rapt-co.vercel.app, `040281a`):
- 50/50 consultation CTA clicks
- API rejects GET, malformed input and invalid fields; the honeypot path works
- Direct article and unknown URLs load
- PDF download with the correct headers; fonts and `robots.txt` served
- Lighthouse recorded: mobile 82–92, desktop 97–100

**Not yet verified on any deployment:** the section 2 fixes. They need a Preview of `final-audit`.

## 5. Awaiting client approval or information

| # | Item | Why it matters | What is needed |
|---|---|---|---|
| A1 | **Official LinkedIn URL** | Footer shows no social link until provided | The company page URL |
| A2 | **Primary enquiry recipient** | Single client-approved enquiry inbox | Confirmed: info@theraptconsulting.com (13 Nov 2026) |
| A3 | **Production domain** | Canonical URLs, sitemap, professional sender address | The domain, plus access to its DNS |
| A4 | **DRI terminology** | Expertise says "DRI = Documentation, Registration and Regulatory Interface" (services portfolio); the Insights article says "Directorate of Revenue Intelligence" | Confirm which is intended, or whether both are offered |
| A5 | **Homepage dashboard figures** | The Protect/Govern panels show "92% Compliance Readiness" and "87% Governance Score", design mock-ups not sourced from client material | Approve as illustrative, or supply/remove |
| A6 | ISO standard on Privacy Audits | Set to ISO 27701 (deck) where the services portfolio said ISO 27001 | Confirm |
| A7 | Header button label "Book Demo" | Leads to the consultation form; "Book a Consultation" may suit an advisory firm better | Optional wording decision |

## 6. Awaiting infrastructure configuration

| # | Item | Owner | Blocks |
|---|---|---|---|
| I1 | Resend account and verified sending domain; RESEND_API_KEY and approved CONTACT_FROM_EMAIL in Hostinger runtime | RAPT & Co. / AmbitGrow | Delivery to info@theraptconsulting.com still requires live test |
| I2 | Real test enquiry on a Preview, confirmed received | AmbitGrow, with RAPT & Co.'s agreement | Sign-off of the consultation system |
| I3 | Push `final-audit`, review its Preview, merge to `main` | AmbitGrow (needs authorisation) | Deploying the section 2 fixes |
| I4 | Vercel Preview settings for all branches (`final-delivery` never got a Preview) | Vercel project owner | Reliable review of future changes |
| I5 | Connect the domain; set `VITE_SITE_URL` | Domain owner | Canonical URLs and sitemap |
| I6 | Transfer or share ownership of GitHub, Vercel and Resend; confirm the Vercel plan; decide on repository visibility (currently public) | RAPT & Co. + AmbitGrow | Clean handover |

## Production readiness

**The site is live and functionally sound, but not ready for client sign-off.**
- The consultation form cannot be confirmed to deliver enquiries (I1, I2).
- The audit fixes, including the API hardening, are not yet deployed (I3).

Once I1–I3 are done, the website is ready for handover. The remaining items (A1–A7, I4–I6) are content or ownership decisions that do not block operation.

## Update — 13 November 2026

The client has confirmed info@theraptconsulting.com as the sole published contact email and sole consultation enquiry recipient. Hostinger staging is active on the existing Business Web Hosting plan; PR #4 contains the adapter. Earlier historical status rows about Vercel, draft content and example recipient addresses should not be treated as current release instructions. The latest setup is in 06-hostinger-staging-runbook.md and 07-final-staging-qa.md.
