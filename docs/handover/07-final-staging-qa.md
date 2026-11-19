# RAPT & Co — Independent Hostinger Staging QA (13 November 2026)

## Deployment under test
- Temporary site: https://darkslateblue-owl-219432.hostingersite.com/
- Hostinger Business Web Hosting, separate Node.js staging app
- GitHub: AmbitGrow/Rapt-co; branch: deploy/hostinger-staging-20261113
- Last independently tested live commit before email changes: c876f26
- Staging setting: RAPT_STAGING=true
- Existing client domain, business email DNS and other website unchanged

## Live staging verification
- **33 of 33 browser route/viewport smoke checks passed**: 11 routes across desktop 1440px, tablet 768px and mobile 390px.
- Checked Home, Expertise, Insights, About, Contact and all six Insights article URLs directly.
- No observed page-wide horizontal scrolling, browser JavaScript errors or failed images at the tested dimensions.
- Mobile navigation opened at 390px and 768px with expected links and consultation CTA.
- Contact form includes required input fields and a honeypot field.
- HTTP: pages/article/PDF 200; sitemap 404 before canonical production origin is configured; GET on contact API 405; cross-origin POST 403.
- Security headers: X-Robots-Tag noindex/nofollow, X-Content-Type-Options nosniff, X-Frame-Options DENY.
- Hostinger's edge-served robots.txt currently says Googlebot Disallow / but User-agent * Allow /. This differs from Express's staging robots route and warrants further checking; the staging HTML noindex header is present.

## Sole client email correction, pending live redeployment
Client-approved only address: **info@theraptconsulting.com**

- UI contact data and mailto now contain only the approved address.
- Contact API recipient is fixed to that address, not configurable via a stale CONTACT_TO_EMAIL value.
- The 20-page company-profile PDF's last-page contact line has been changed to the approved address; extracted text no longer contains either old Gmail address.
- Page 20 rendered PDF comparison changed only the email line (1600x900 pixel diff bbox 577,663 to 1001,679); layout was visually inspected.
- Handover instructions updated to supersede older recipient instructions.

## Corrected source checks
- Hostinger integration tests: **12 of 12 passed**, including mocked Resend request confirming exactly one approved recipient.
- Lint: zero warnings/errors. Production build: success.
- Production npm dependency audit: zero reported vulnerabilities.
- No real email was sent by mock or browser smoke tests.

## Release gates still open
1. Redeploy this updated staging branch and confirm the new live commit and visible single email / PDF.
2. **Real Resend delivery remains unverified.** Staging was initially configured only with RAPT_STAGING=true; no sending API key was provided.
3. Use a client-authorized Resend account; verify the theraptconsulting.com sending domain, preserving all existing Hostinger email DNS settings.
4. Configure server-only RESEND_API_KEY and a verified CONTACT_FROM_EMAIL in Hostinger. Sender can be info@theraptconsulting.com only if approved and verified with Resend. Never paste keys into chat or source control.
5. Submit one labelled staging enquiry and confirm actual delivery in the approved mailbox and in Resend logs, including Reply-To.
6. Obtain final stakeholder visual review, Insights scrolling/interaction signoff and performance review.
7. Approve PR #4 for merge only after deployment and mail checks. Production domain DNS/SSL/SEO/canonical setup is a separate release task, with RAPT_STAGING=false.

**Current status:** Hostinger runtime and functional smoke tests passed. Updated email source is locally tested. Actual email delivery and final approval remain pending.

## PR #5 responsive integration — 14 November 2026

Merged GitHub main at 17298bf (PR #5, "Final responsive improvements for mobile and tablet") into the isolated Hostinger deployment branch via merge commit 0e4ed7f. The responsive PR changed ten frontend CSS/JSX files; no host runtime, contact recipient, or approved PDF content was overwritten.

Local post-merge verification:
- npm ci, npm run lint, npm run build and npm audit --omit=dev --audit-level=moderate: passed (zero known production dependency vulnerabilities).
- npm run test:hostinger: 12 of 12 passed, including startup, contact API, approved single-recipient and security checks.
- Headless Chrome through local Express host: 11 routes across 320, 390, 767, 768, 1024 and 1440 px: **66/66 route checks** with no reported page-wide horizontal overflow, failed images, JS page errors or broken HTTP navigation. HTTP 304 on repeated local cache validation was expected.
- About-page journey controls: 6 of 6 interaction checks passed after allowing the GSAP 0.8-second transition to finish. On widths 320, 390 and 767 px the active stage content appeared inside its selected timeline item; at 768, 1024 and 1440 px it stayed outside the timeline. No horizontal overflow observed.
- Live Hostinger deployment of these latest responsive changes remains a **separate verification** after pushing and redeploying the branch; these 66 + 6 checks are for local production build served by Express, not proof of the latest Hostinger release.


## Independent staging review and hardening — 19 November 2026

Baseline: Hostinger temporary site https://darkslateblue-owl-219432.hostingersite.com/ ; deployment branch head a68adc48c3b53ac634256e1c8d03a789400c8fd8 before the local hardening changes below. PR #4 remains unmerged.

### Live evidence (supersedes older pending statements)
- Client-owned Resend domain verified. User supplied screenshots of a successful labelled consultation submission, Resend Delivered status, receipt in info@theraptconsulting.com Hostinger inbox and reply received at the submitter's mailbox. End-to-end email workflow passed on staging.
- Five main and linked article route checks, direct refresh, 18/18 rendered article scroll/body checks, 7/7 anchor checks, mobile form validation and responsive checks passed. Earlier 33 route/width checks (plus narrow/wide additional principal-page checks) had no reported overflow. All ten services and 88 description/scope/benefit entries matched approved DOCX ignoring whitespace.
- Profile PDF valid and downloadable; source/deployed PDF matched by checksum. **P1: approved 17-slide source vs existing 20-page PDF and associated leadership qualification discrepancy awaits client confirmation. Sabarish explicitly instructed retaining the 20-page PDF and leadership content for now. No change made.**
- Existing Hostinger MX/SPF preserved; Resend DNS verification completed. Do not modify mail records during domain connection.
- Lighthouse 13.6.0, actual Hostinger staging, mobile/desktop performance: Home 96/100, Expertise 97/100, Insights 97/100, About 93/93, Contact 97/100. Best practices 100/100 in all ten successful runs. Mobile LCP 2.30–2.58 s. Accessibility baseline Home 100/100, Expertise 95/95, Insights 100/100, About 96/96, Contact 100/100. SEO 63–66 on staging; intentional noindex and production canonical/sitemap not yet active. Raw JSON in /tmp/rapt-lighthouse.qyANUX on reviewer device (temporary, not committed).
- Representative article Lighthouse runs returned NO_FCP / CHROME_INTERSTITIAL_ERROR with no valid score; independent browser recheck returned HTTP 200 and rendered title/body. Article performance metrics remain unverified.

### Locally implemented (not yet deployed)
- Contact API now uses validated rightmost forwarded IP per Hostinger CDN guidance, socket fallback, bounded per-IP history, in-flight duplicate suppression, successful-only deduplication, retry on provider failure, and logs provider status without response payload. Before changes mock reproduction: 6/6 requests with spoofed first IP generated email attempts; 2 simultaneous identical submissions generated 2 attempts. Four mock regression tests added; no real email sent. Rate limiting and deduplication remain best-effort per process. Verify trusted edge headers/direct-origin exposure; distributed abuse controls are not guaranteed.
- Corrected header accessible name, About timeline text contrast, Expertise animation-induced low contrast, and industry numbering contrast without changing approved page layout or hero. Local Chrome/axe targeted contrast and label-content-name-mismatch checks on Home, Expertise, About at 390 and 1440 px: 6/6 with zero reported violations, no horizontal overflow; incomplete image/background contrast checks still require manual review. Not a full WCAG conformance statement.
- Final local build successful; lint zero warnings/errors, git diff --check clean; 16/16 host integration and mock contact abuse tests passed. Previous production dependency audit zero reported vulnerabilities. PDF and leadership copy unchanged.

### Release gates
1. Review and push the local hardening changes to the deployment branch, redeploy Hostinger staging and confirm deployed commit. Repeat targeted browser checks and representative article Lighthouse; confirm current production-like contact delivery with a single labelled test as needed.
2. Obtain client disposition of P1 and final staging approval. No final approval or production deployment claimed.
3. On approved production cutover, set VITE_SITE_URL=https://theraptconsulting.com at build time and RAPT_STAGING=false only for production; preserve server-only Resend configuration. Verify apex/www redirect, valid TLS, production indexability, canonical/Open Graph, robots.txt and sitemap (earlier local production build emitted 11 URLs), all direct article routes, PDF, and form delivery. Preserve Hostinger mail DNS.
4. Final QA signoff, client acceptance, PR #4 merge only when authorized; handover, invoice and separate commercial closure.


## P1 authoritative profile decision — 19 November 2026

Client (CMA Pavithra Mucherla) provided the revised 20-slide profile/scope deck and approved the revised Competitive Landscape slide by WhatsApp at 19:57 IST ("Ya..perfect"). The heading is "Large Consulting Firms" with named Big Four/examples removed; other slide wording remains as supplied/approved, including the generic comparison in the advantage bullet. This supersedes the earlier P1 source-version uncertainty. Slide 16 explicitly includes the AISA qualification already present on the site; no leadership biography change required. The DOCX remains authoritative for the ten-service website portfolio.

Source verification: local client file and attached file identical SHA-256 507893eb03d4a5491cf54976f4e27fc9ad0ac902890a61dadbdbe53143afa5d0. Repository source deck replaced with this exact file. Approved slide 13 exported from the verified source, incorporated into the existing 20-page public PDF to preserve the established visual layout and previously approved official email on page 20. All other 19 pages were pixel-identical at 72 dpi to the prior PDF and extracted text was exactly unchanged; slide 13 and page 20 visually inspected. Optimized PDF 368736 bytes, SHA-256 41602d7e4ddd0dbf0faf868187550060c4db0f62e00f01de44804e057e0947a6, rendered identically to the verified assembly on all 20 pages. Named firm examples absent from slide 13, public mailbox info@theraptconsulting.com, no Gmail addresses in public PDF.

Local lint, build, 16/16 Hostinger tests and diff check passed. P1 client disposition closed; revised PDF/source must still be committed/pushed and verified on the Hostinger staging deployment. Approval of slide 13 is not final acceptance of the entire website. Final site approval, PR #4 integration, production custom domain/SSL/SEO and commercial handover remain pending. Live commit 497efcc was independently verified prior to this update; no production or DNS change authorized.


## Final contrast follow-up and approved profile release candidate — 19 November 2026

Live Hostinger commit 497efcc was independently verified after redeploy (exact HTML SHA-256 match, PDF match, 12 route/width checks, live invalid enquiry returned HTTP 422 without email, staging noindex preserved). Representative article mobile Lighthouse retry succeeded: performance 96, accessibility 96, best practices 100, SEO 66 (staging), LCP 2.6 s.

Final local changes: darkened Insights/article labels, image captions, navigation labels, card metadata, case-card labels, ranking numbers and shared footer copy; adjusted Contact detail labels, form button/hover, focus/floating labels and map-link hover contrast. No approved copy, layout, service descriptions, or leadership changes. The existing decorative Expertise chapter numerals are intentionally aria-hidden and visually muted; automated contrast flags on these decorative numerals are retained as a documented exception (chapter text conveys the content). No claim of full WCAG conformance; image/background contrast checks still have automated incomplete results.

Full-scroll local Chromium/axe checks: all 11 routes at 390 and 1440 px (22 route/width checks) returned HTTP 200 or expected cache 304, no horizontal overflow or JS errors, all 12 article checks rendered body text. Initial scan found ranking/contact contrast flags in addition to decorative chapter numerals. Final rebuilt targeted Insights, Contact (focused form) and representative article retest: 6/6 passed, zero detected contrast or accessible-name violations, no overflow/JS errors. Lint clean, build successful, 16/16 tests passed; public and built approved profile SHA-256 match 41602d7e4ddd0dbf0faf868187550060c4db0f62e00f01de44804e057e0947a6. No actual emails sent during local/browser checks.

Next: commit and push to existing isolated deployment branch, verify matching Hostinger staging release including PDF page 13 and official email; seek final whole-site client acceptance. Do not merge PR #4 or switch domain/indexability until authorized.
