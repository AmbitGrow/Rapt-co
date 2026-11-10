# RAPT & Co. — Independent Pre-Launch QA / Release Gate

**Date:** 9 November 2026 (IST)
**Authority:** AmbitGrow project owner final approval required
**Current source baseline:** `AmbitGrow/Rapt-co`, `main` @ `23fbd459` (PR #2 merged)
**Current public preview:** https://rapt-co.vercel.app/
**Client domain:** https://theraptconsulting.com/ (parked at the time of this review)
**Status:** **NOT APPROVED FOR CLIENT FINAL SIGN-OFF OR PRODUCTION DOMAIN SWITCH**

## Source and evidence

- The developer handover documents are in `docs/handover/01–04`; they contain detailed test results, but some statuses are stale (they still say `final-audit` is not merged).
- Independent HTTP and Chrome/Puppeteer checks were run against the current preview. Chrome render timing occasionally caused blank/partial captures. Do not classify those alone as defects.
- The unslop skill `heydamir/unslop` was read and run in **read-only plan mode** via Claude Code. Its report is at `~/.local/share/rapt-audit-tools/unslop-review-20261109.txt`. No autonomous design changes were made.
- Site screenshots are at `~/.local/share/rapt-audit-tools/screenshots/`; some About/Contact captures occurred before rendering and **must not** be used as final visual proof.
- No real consultation submission, production configuration, domain change, push, PR, or deployment was performed during this pass.

## Independently verified on the public preview

| Check | Result |
|---|---|
| Home, Expertise, About, Contact and representative article routes | Served HTTP 200; primary content rendered when allowed to settle |
| Home Learn more links | Direct to Expertise service deep links |
| Home/About Read Article links | Navigate to article detail routes |
| Two article-detail bodies | Substantial actual body content rendered |
| Leadership names | Four expected names appear |
| Ten-service list / Contact FAQ | Ten approved services present |
| Company profile PDF | HTTP 200, `application/pdf`, 246,753 bytes, 20 pages |
| Security headers | `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` present |
| Cross-origin POST protection | Invalid empty payload with foreign Origin returned HTTP 403; no email submitted |
| `/sitemap.xml` | HTTP 404 (appropriate temporary behavior before confirmed production-origin build) |
| Custom domain | Still Hostinger parked page; not the website |
| Chrome/mobile checks | Partial; re-run on correction preview with full asset settle |
| Actual client email delivery | **NOT TESTED** |
| Vercel environment variables / account plan | **NOT VERIFIED** |

## Changes prepared on separate local QA branch (NOT DEPLOYED)

Branch: `audit/rapt-prelaunch-corrections-20261109` in local QA copy `~/AmbitGrow/R A P T&Co/Rapt-qa-main`.

1. `src/Data/site.js`: set client-provided official LinkedIn URL `https://www.linkedin.com/in/r-a-p-t-co-6126613b9/`; footer can now show the approved icon.
2. `src/Data/services.js`: restore **ISO 27001** in both Privacy Audits scope bullets, matching the final authoritative `RAPT_Audit-Services_Portfolio.docx` rather than the historical profile deck.
3. `src/Pages/Homepage/Homepage.jsx`: update the experience stat from six integrated practices to **ten advisory services**; show approved GRC and GST service titles on featured cards.
4. `src/Component/Header/Newheader.jsx`: replace misleading **Book Demo** copy with **Book a Consultation** and add an accessible label to the visually letter-spaced logo.

Source assertions and Git whitespace checks passed. Full tracked assets were restored without changing the original repository. Dependency installation, Vite production build and the production dependency audit (zero known vulnerabilities) passed. The 21-case local Puppeteer smoke test (7 routes at 1440/768/390 px) rendered without observed JavaScript errors, horizontal overflow or failed images. HTTP 304s on repeated locally cached visits were expected and are not release failures. Lighthouse and deployed Preview checks remain pending.

## Issues requiring targeted final pass

**P1 — before final client approval**
- [ ] Review the prepared branch; compare the client-approved source content against every service bullet and benefit, preserving the original wording.
- [x] Replaced unsupported homepage illustrative scores (92% Compliance Readiness / 87% Governance Score) with descriptive advisory-focus labels; removed the decorative progress arc. Corrected locally, awaiting deployed Preview validation.
- [ ] Deploy a controlled Preview of the reviewed fixes, verify longer service/CTA labels do not wrap or overflow, then check all routes including mobile, tablet and article refresh.
- [ ] Configure the agreed Resend sender and recipient securely in the client's chosen hosting environment. Make **one clearly labelled test enquiry**, verify inbox receipt, reply-to and Resend Delivered status; do not use genuine visitor information for QA.
- [ ] Verify that no placeholder links, testimonials or inactive submission forms remain; check all four original leadership photographs.

**P2 — after P1, before domain switch/handover**
- [ ] Choose hosting: a commercial Vercel plan is technically simplest for the existing Vercel `/api/contact` function; Hostinger is viable only once the actual plan and backend compatibility are confirmed.
- [ ] Verify domain ownership and snapshot current Hostinger DNS records (MX, SPF, DKIM, DMARC) before any change.
- [ ] Connect custom domain and SSL; set `VITE_SITE_URL` to the confirmed canonical production origin and redeploy; require valid sitemap, canonical and Open Graph URLs.
- [ ] Review official public contact-email display choice separately from the enquiry recipient. Existing Gmail addresses were in historical approved material; do not replace them without confirmation.
- [ ] Update handover documentation: current `main` SHA, approved LinkedIn and domain, actual email delivery, ownership, Vercel plan, GitHub repository visibility and renewal responsibilities.
- [ ] Obtain client acceptance on the final working site; close the ₹18,000 client final milestone and the separately agreed ₹10,000 Karthick settlement according to the commercial arrangement.

## Unslop: restrained visual findings

The read-only source-led audit found probable reduced-motion gaps for GSAP entrance effects, small 9–11 px text, some weaker muted text contrast, decorative infinite animation, and minor mobile-menu keyboard focus behavior. These are **candidate corrections for developer confirmation**, not an authorization to redesign. Preserve approved hero photographs, navy/blue-grey palette, warmth/gold restraint, existing editorial hierarchy and page-specific imagery. Do not globally apply unslop's taste-based style rules. Do not generate or buy imagery.

## Go/no-go decision

**NO-GO for final client sign-off and DNS deployment** until the corrected branch is previewed and independently retested, illustrative claims are resolved, the consultation form proves real delivery, and the hosting/domain arrangement is agreed. All other improvements should be kept small and tied to a documented defect.
