# RAPT & Co. website

Corporate website for RAPT & Co. — React 19 + Vite SPA (React Router, GSAP, react-three-fiber).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build into `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run Oxlint

## Routes

`/`, `/expertise`, `/insights`, `/insights/:slug`, `/about`, `/contact` (consultation CTAs link to `/contact#get-in-touch`).

## Deployment

Deployed on Vercel. `vercel.json` rewrites all paths to `/index.html` so direct URLs and refreshes work for the SPA.

The "Download Company Profile" buttons link to `/company-profile.pdf`; place the file at `public/company-profile.pdf`.
