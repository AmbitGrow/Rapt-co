# RAPT & Co. Website — Client Handover Checklist

Prepared by AmbitGrow · November 2026

For RAPT & Co. and AmbitGrow to confirm together at handover. No passwords or keys belong in this document; share credentials only through a password manager or the platform's own invite feature.

Status key: ✅ done · ⏳ needs action · ❓ needs a decision

## 1. Source code

| Item | Status | Detail |
|---|---|---|
| Repository | ✅ | `github.com/saravanan1819/Rapt-co` (public). Currently owned by an AmbitGrow developer account |
| Repository ownership | ❓ | Decide whether to transfer it to a RAPT & Co. GitHub account/organisation or keep it with AmbitGrow under a maintenance agreement. **Note: the repository is public**, so make it private if the source should not be visible |
| Production branch | ✅ | `main` at `040281a` (merge of PR #1); deployed to production on 9 Nov 2026 |
| Final-audit fixes | ⏳ | Branch `final-audit` (local, not yet pushed), on top of `040281a`. Must go through a Preview and pull request before reaching production |
| Earlier branches | ✅ | `final-delivery` (`b60cc03`) and `perf-mobile` (`c530c57`, `a640cdb`) are fully contained in `main` and can be deleted after handover |
| Client source documents | ✅ | Profile deck (`.pptx`), services portfolio (`.docx`) and original photos are kept in the repository |

## 2. Hosting (Vercel)

| Item | Status | Detail |
|---|---|---|
| Vercel project | ✅ | `rapt-co` under the `saravanans-projects-154c59c9` account |
| Hosting ownership | ❓ | Transfer the project to a RAPT & Co. Vercel account/team, or invite RAPT & Co. as a member. The project owner controls deployments, domains and environment variables |
| Production deployments | ✅ | Automatic on every push to `main` |
| Preview deployments | ⏳ | Work for some branches (`perf-mobile` got one) but not others (`final-delivery` never did). Check *Settings → Git* so every branch gets a Preview |
| Plan | ❓ | Confirm the Vercel plan suits a commercial website (Vercel's Hobby plan is for non-commercial use) |

## 3. Domain

| Item | Status | Detail |
|---|---|---|
| Production domain | ❓ | Not confirmed. The site runs on `rapt-co.vercel.app` |
| Domain ownership | ❓ | The domain should be registered in RAPT & Co.'s name, with registrar access held by RAPT & Co. |
| Connect domain | ⏳ | Vercel → Project → Settings → Domains; then set `VITE_SITE_URL` and redeploy (enables canonical URLs and the sitemap) |

## 4. Environment variables

| Variable | Status | Owner / action |
|---|---|---|
| `RESEND_API_KEY` | ❓ unknown | Not verifiable from outside Vercel. Create in the RAPT & Co. Resend account and add to Vercel (Production + Preview) |
| `CONTACT_TO_EMAIL` | ❓ | RAPT & Co. to choose the enquiry inbox. The profile lists both `raptconsulting@gmail.com` and `rapt.info1@gmail.com`; both can be entered, comma-separated |
| `CONTACT_FROM_EMAIL` | ⏳ | Needs a sending address on a domain verified in Resend (normally the production domain) |
| `VITE_SITE_URL` | ⏳ | Set once the domain is confirmed |

Names and descriptions are in `.env.example`.

## 5. Email service (Resend)

| Item | Status | Detail |
|---|---|---|
| Account | ❓ | Create a Resend account owned by RAPT & Co. (free tier: 3,000 emails/month, enough for an enquiry form) |
| Domain verification | ⏳ | Verify the production domain in Resend (DNS records) so enquiries come from a RAPT & Co. address and are not marked as spam |
| Live delivery test | ⏳ | **Not yet done.** After configuration: submit one test enquiry on the Preview and confirm it arrives, with the correct reply-to |

## 6. Content and profiles

| Item | Status | Detail |
|---|---|---|
| Company profile PDF | ✅ | `public/company-profile.pdf`: 20 pages from the approved deck; downloads on all pages |
| LinkedIn | ⏳ | Official company LinkedIn URL not supplied. Add it to `COMPANY_LINKEDIN_URL` in `src/Data/site.js` and the footer icon appears |
| Leadership, services, FAQs | ✅ | Verbatim from the approved deck and services portfolio |
| Items awaiting approval | ❓ | See *04-outstanding-items.md* |

## 7. Responsibilities after handover

| Task | Who | How |
|---|---|---|
| Answer enquiries | RAPT & Co. | Reply from the inbox set in `CONTACT_TO_EMAIL` (replies go straight to the visitor) |
| Content changes (services, team, articles) | Developer (AmbitGrow or other) | Edit `src/Data/*`, pull request, check Preview, merge (see the technical handover, section 6) |
| Monitor the form | RAPT & Co. / developer | Resend dashboard (delivery log); Vercel → Logs for `api/contact` errors |
| Renewals | Owner | Domain registration, Vercel plan, Resend plan |
| Dependency updates | Developer | Quarterly: `npm audit`, update within major versions, build, check Preview |

## 8. Maintenance recommendations

1. **Before go-live:** configure Resend and send one real test enquiry. The form cannot email anyone until then.
2. Connect the production domain and set `VITE_SITE_URL`.
3. Make the repository private, or confirm that a public repository is acceptable.
4. Run `npm audit` quarterly. 0 vulnerabilities as of 9 Nov 2026.
5. If spam increases, add Cloudflare Turnstile to the form and a shared rate-limit store.
6. Consider adding a Content-Security-Policy header after go-live (needs testing against the inline scripts and the 3D globe).
7. Keep at least two people with admin access to GitHub, Vercel, Resend and the domain registrar.
