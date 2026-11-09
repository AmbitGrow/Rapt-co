# RAPT & Co. Website — Technical Handover

Prepared by AmbitGrow · November 2026 · Repository: `github.com/saravanan1819/Rapt-co`

This document is for the developer who maintains the site after handover. It describes how the site is built, where everything lives and how to change it safely. No credentials are included; see [Environment variables](#environment-variables).

## 1. Overview

The site is a single-page application (SPA) for RAPT & Co., a compliance and advisory firm in Chennai. It has five main pages, six article pages, a 404 page and one backend endpoint that emails consultation enquiries to RAPT & Co.

| Item | Value |
|---|---|
| Live site | https://rapt-co.vercel.app/ (Vercel production; custom domain not yet confirmed) |
| Hosting | Vercel, project `rapt-co`, deployed automatically from the `main` branch |
| Framework | React 19 + Vite 8 (static build) |
| Backend | One Vercel serverless function: `api/contact.js` |
| Email | Resend (https://resend.com), called over its REST API |
| Database / CMS | None. All content is in source files under `src/Data/` |

## 2. Technology stack

| Purpose | Package |
|---|---|
| UI | `react`, `react-dom` 19 |
| Routing | `react-router-dom` 7 |
| Build / dev server | `vite` 8, `@vitejs/plugin-react` |
| Animation | `gsap` (+ ScrollTrigger) |
| 3D globe (homepage) | `three`, `@react-three/fiber`, `@react-three/drei` |
| Icons | `react-icons` |
| Lint | `oxlint` |

Node 22 was used for development and testing.

## 3. Folder structure

```
api/contact.js                 Serverless function: validates and emails consultation enquiries
public/                        Copied as-is to the site root
  company-profile.pdf          Downloadable company profile (20 pages, exported from the client's deck)
  fonts/                       Self-hosted Inter (woff2) + Inter-OFL.txt licence
  favicon.svg
src/
  main.jsx, App.jsx            Entry point; routes; persistent header
  App.css                      Global styles
  Component/                   Shared layout pieces
    Header/Newheader.jsx       Main header (white, used on the five main pages)
    Header/Header.jsx          Dark-text header (article pages and 404, which have light backgrounds)
    Footer/Footer.jsx
    NewHeroSection/            Hero used by all five main pages (portrait crop on phones)
    PageMeta.jsx               Per-route <title>, description, Open Graph, canonical, robots
    ScrollToTop.jsx
  Components/                  Insights components (InsightCard, RelatedInsights)
  Data/                        ALL site content and settings (see section 6)
  Pages/                       One folder per page
    Homepage/                  Homepage.jsx (sections, also exports shared CTA, FAQ, Insights, Leadership)
                               NewHomepage.jsx (hero + Homepage), GlobeArtwork.jsx (3D globe)
    Aboutpage/  Servicepage/ (= /expertise)  Insightspage/ (list + InsightDetail)  Contactpage/  NotFound/
  assets/                      Images (only files imported by code are bundled)
docs/handover/                 These documents
vercel.json                    Rewrites (SPA fallback) and response headers
vite.config.js                 Build plugins: robots.txt/sitemap generation, hero-image preload
.env.example                   Required environment variables (names only)
```

Note: `Component/` and `Components/` are both in use (historical naming). They were not merged, to avoid churn.

## 4. Pages and routing

Routing is in `src/App.jsx`. Every page is lazy-loaded.

| URL | Page | Notes |
|---|---|---|
| `/` | Home | Hero, experience + 3D globe, Protect/Govern/Grow, expertise carousel, insights, leadership, FAQ, CTA |
| `/expertise` | Expertise | 10-service accordion. `/expertise#<slug>` opens and scrolls to that service |
| `/insights` | Insights list | Featured article, category filter, article grid, trending, company-profile download |
| `/insights/:slug` | Article | Unknown slugs show "Insight Not Found" (noindex) |
| `/about` | About | Who we are, journey, vision/mission, insights, leadership |
| `/contact` | Contact | Contact details, consultation form (`#get-in-touch`), FAQ |
| anything else | 404 | "Page Not Found" (noindex) |

**SPA fallback:** `vercel.json` rewrites every path except `/api/*`, `/sitemap.xml` and `/robots.txt` to `/index.html`, so direct visits and refreshes on any route work. Real files (assets, PDF, fonts) are served before rewrites apply.

**Service slugs** (used in `/expertise#…` links): `dpdpa-compliance`, `soc-audits`, `privacy-audits`, `income-tax-services`, `gst-services`, `governance-risk-compliance`, `dri-services`, `cepa-services`, `project-finance`, `rpa-services`.

## 5. Consultation form workflow

```
Visitor clicks any "Book a Consultation" / "Book Demo"
  → /contact#get-in-touch (page scrolls to the form)
  → fills Name, Email, Phone, Company (optional), Service, Message
  → browser validates; errors shown per field, focus moves to the first error
  → POST /api/contact (JSON)
  → api/contact.js: method + origin check → spam checks → rate limit → validation
        → duplicate check → Resend API → 200
  → Resend emails the enquiry to CONTACT_TO_EMAIL (reply-to = the visitor's email)
  → visitor sees a success message; the form clears
```

This is an **enquiry form**, not an appointment-booking system: there are no calendars, time slots or booking confirmations. RAPT & Co. replies to each enquiry by email or phone.

**Front end** (`src/Pages/Contactpage/Contactpage.jsx`):
- Validation: name required; email format; phone 7–15 digits (`+`, spaces, `()`, `-` allowed); service required; message at least 10 characters. `maxLength` matches the server limits.
- While sending, the button shows "Sending…" and is disabled; a ref-based guard prevents double submission.
- Success: confirmation message, form cleared. Failure: error message with RAPT & Co.'s phone and email as a fallback; the entered data is kept for a retry.

**Back end** (`api/contact.js`):

| Check | Behaviour |
|---|---|
| Method | Only `POST` (others → 405) |
| Origin | A browser POST from another website → 403 |
| Honeypot | Hidden `website` field filled → silently accepted, not emailed |
| Fill time | Submitted < 3 s after the form loaded → silently accepted, not emailed |
| Rate limit | More than 5 requests per IP per 10 minutes → 429 |
| Validation | Same rules as the front end, plus maximum lengths (name 100, email 254, phone 20, company 150, service 120, message 5000) → 422 with per-field messages. Over-long input is rejected, never truncated |
| Duplicates | Same email + message within 10 minutes → acknowledged, not emailed again |
| Missing configuration | `RESEND_API_KEY` or `CONTACT_TO_EMAIL` unset → 503 |
| Provider failure | Resend error or network failure → 502 |

All user input is HTML-escaped before it goes into the email. Errors return short generic messages; details go only to the Vercel function log.

The rate limit and duplicate guard are held in memory per running function instance, so they are best-effort. For stronger protection, add a shared store (e.g. Vercel KV) or a CAPTCHA such as Cloudflare Turnstile.

**Email content:** subject `Consultation request: <Service> (<Name>)`; HTML and plain-text bodies listing every field; `reply_to` is the visitor's address, so replying in the mail client answers the visitor directly.

## 6. Content: where to edit what

| Content | File |
|---|---|
| Services (10): titles, descriptions, scope points, client benefits | `src/Data/services.js` |
| Leadership profiles (4) and photos | `src/Data/leadership.js`, photos in `src/assets/leadership/` |
| Insights articles | `src/Data/insights.js` |
| Phone, emails, office location, LinkedIn URL | `src/Data/site.js` |
| Page titles and meta descriptions | `src/Component/PageMeta.jsx` |
| FAQs | `faqs` in `src/Pages/Homepage/Homepage.jsx` |
| Business details for search engines (JSON-LD) | `index.html` |
| Company profile PDF | replace `public/company-profile.pdf` (keep the file name) |

Sources: the services and leadership text is verbatim from *R A P T & Co_Profile&Scope_Deck.pptx* and *RAPT_Audit-Services_Portfolio.docx* (both in the repository).

## 7. Insights implementation

There is **no API or CMS**. Articles are objects in `src/Data/insights.js` and are bundled with the site, so a change appears only after a new deployment. No fetching, caching or loading states are involved.

Each article has `slug` (URL), `title`, `category`, `excerpt`, `featuredImage`, `seo`, `tableOfContents`, `keyTakeaways` and `content` blocks (`heading`, `paragraph`, `list`, `highlight`, `image`, `quote`, `source`). Reading time is calculated from the text. Categories on the Insights page are derived from the articles. For card images, add a 720 px variant to `CARD_IMAGES`.

To add an article: add an object with a unique `slug`, import its image at the top of the file and deploy. The sitemap picks up new slugs automatically once `VITE_SITE_URL` is set.

## 8. Assets and performance

- Only images imported by code are bundled (hashed names under `/assets/`, cached for one year). Several files in `src/assets/` are **unbundled originals** kept deliberately: the client's original photos, the JPEG originals of the article images, the old `*-bg.jpg` heroes and the 8K cloud texture.
- **Hero:** each page's hero image is preloaded by an inline script that the `rapt-hero-preload` plugin in `vite.config.js` injects at build time. Portrait phones get `Herosection/<n>-portrait.webp`, a 3:4 crop at the mobile `object-position` (68%), so the visible area is unchanged. If you replace a hero image, regenerate its portrait crop.
- **Font:** Inter is self-hosted from `public/fonts` (latin and latin-ext subsets). `@font-face` is inlined in `index.html` and the main file is preloaded.
- **3D globe:** loads only after the visitor's first scroll or interaction (`Homepage.jsx`), then mounts when near the viewport. It is the largest chunk (about 233 KB gzipped).
- Advisory card backgrounds are applied only when that section approaches the viewport. Article cards use `srcset` with 720 px variants.

## 9. SEO

- Per-route titles, descriptions, Open Graph and Twitter tags (`PageMeta.jsx`; articles in `InsightDetail.jsx`, which also adds Article JSON-LD).
- Organisation JSON-LD (`ProfessionalService`) in `index.html`.
- `robots.txt` is generated at build time. **`sitemap.xml`, canonical URLs and `og:url` are only produced when `VITE_SITE_URL` is set**, so the `vercel.app` address is never declared canonical. Until then `/sitemap.xml` returns 404.
- Unknown URLs and missing articles are served with `noindex`.

## 10. Environment variables

Set in Vercel → Project → Settings → Environment Variables, for both **Production and Preview**. Names and purposes are listed in `.env.example`. Values are held by the account owner and never committed.

| Variable | Used by | Required | Purpose |
|---|---|---|---|
| `RESEND_API_KEY` | `api/contact.js` (server only) | Yes, for email | Resend API key |
| `CONTACT_TO_EMAIL` | `api/contact.js` | Yes, for email | Enquiry recipient(s), comma-separated |
| `CONTACT_FROM_EMAIL` | `api/contact.js` | Recommended | Sender on a Resend-verified domain. Without it Resend's test sender is used, which only delivers to the Resend account owner |
| `VITE_SITE_URL` | build (public) | When the domain is confirmed | Enables canonical URLs and the sitemap |

Changing a variable takes effect on the next deployment (redeploy from the Vercel dashboard).

## 11. Vercel configuration (`vercel.json`)

- **Rewrites:** SPA fallback to `/index.html`, excluding `/api/`, `/sitemap.xml` and `/robots.txt`.
- **Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy` disabling camera, microphone, geolocation, payment and USB on all routes. `/assets/*` and `/fonts/*` are cached for one year (immutable); `/company-profile.pdf` is sent as a download named `RAPT-and-Co-Company-Profile.pdf`. Vercel adds HSTS itself.
- Functions in `api/` are detected automatically. Default Node runtime; no extra configuration.

## 12. Build, run and deploy

```bash
npm ci            # install exact locked versions
npm run lint
npm run build     # outputs dist/
npm run preview   # serve dist/ at http://localhost:4173 (no /api)
vercel dev        # full local stack including /api/contact (needs Vercel CLI login + .env.local)
```

**Deployments:** every push to `main` deploys to production. Pushes to other branches create Preview deployments on Vercel. Use a branch and a pull request, check the Preview, then merge.

**Content updates** (services, articles, contacts) are code changes: edit the file under `src/Data/`, open a pull request, check the Preview, merge.
