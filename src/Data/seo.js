// Confirmed production origin, e.g. "https://www.example.com". Set VITE_SITE_URL in the
// Vercel project's environment variables once the domain is confirmed. While it is unset,
// canonical / og:url tags are omitted, so the preview domain is never declared canonical.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "").trim().replace(/\/+$/, "");

export const absoluteUrl = (path) => (SITE_URL ? `${SITE_URL}${path}` : "");
