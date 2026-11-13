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
