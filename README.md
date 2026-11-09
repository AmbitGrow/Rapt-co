# RAPT & Co. website

Corporate website for RAPT & Co. — React 19 + Vite SPA (React Router, GSAP, react-three-fiber), hosted on Vercel, with one serverless function for the consultation form.

## Scripts

- `npm run dev` — start the dev server (the `/api/contact` function does not run here; use `vercel dev` to test the form locally)
- `npm run build` — production build into `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run Oxlint

## Routes

`/`, `/expertise` (`/expertise#<service-slug>` opens a service), `/insights`, `/insights/:slug`, `/about`, `/contact` (all consultation CTAs link to `/contact#get-in-touch`), plus a 404 page for anything else. `POST /api/contact` receives consultation enquiries.

## Configuration

Copy `.env.example` and set the variables in Vercel (Production and Preview). The consultation form cannot send email until `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set.

## Documentation

See [docs/handover/](docs/handover/) for the technical handover, QA report, client handover checklist and outstanding items.
