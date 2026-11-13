import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import contactHandler from "../api/contact.js";

const app = express();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");
const indexFile = path.join(distDir, "index.html");
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

app.disable("x-powered-by");

function isStagingRequest(req) {
  const hostname = String(req.headers.host || "").split(":")[0].toLowerCase();
  return process.env.RAPT_STAGING === "true" || hostname.endsWith(".hostingersite.com");
}

app.use((req, res, next) => {
  for (const [header, value] of Object.entries(securityHeaders)) {
    res.setHeader(header, value);
  }
  if (isStagingRequest(req)) res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
});

// Vite's production robots.txt permits indexing; override on staging.
app.get("/robots.txt", (req, res, next) => {
  if (!isStagingRequest(req)) return next();
  res.type("text/plain").set("Cache-Control", "no-store").send("User-agent: *\nDisallow: /\n");
});

// Reuse the validated contact handler and enforce a bounded JSON request body.
app.use("/api/contact", express.json({ limit: "16kb" }));
app.all("/api/contact", async (req, res, next) => {
  if (req.method === "POST" && !req.is("application/json")) {
    return res.status(415).json({ ok: false, error: "Content-Type must be application/json." });
  }
  try {
    await contactHandler(req, res);
  } catch (error) {
    next(error);
  }
});

// Never serve the frontend for nonexistent API endpoints.
app.use("/api", (_req, res) => {
  res.status(404).json({ ok: false, error: "Not found." });
});

app.use(express.static(distDir, {
  index: false,
  setHeaders(res, filename) {
    const normalizedPath = filename.replace(/\\/g, "/");
    if (normalizedPath.includes("/assets/") || normalizedPath.includes("/fonts/")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else if (normalizedPath.endsWith("/company-profile.pdf")) {
      res.setHeader("Content-Disposition", 'attachment; filename="RAPT-and-Co-Company-Profile.pdf"');
    } else if (normalizedPath.endsWith("/index.html")) {
      res.setHeader("Cache-Control", "no-cache");
    }
  },
}));

// Direct navigation and refresh of SPA pages, including Insights articles.
app.use((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }
  if (req.path.startsWith("/assets/") || path.posix.extname(req.path)) {
    return res.status(404).send("Not found.");
  }
  res.setHeader("Cache-Control", "no-cache");
  return res.sendFile(indexFile);
});

app.use((error, req, res, _next) => {
  if (req.path.startsWith("/api/") && (error.type === "entity.too.large" || error instanceof SyntaxError)) {
    return res.status(error.type === "entity.too.large" ? 413 : 400)
      .json({ ok: false, error: "Invalid request body." });
  }
  console.error("[rapt-hostinger] Request error", error);
  if (res.headersSent) return;
  res.status(500).json({ ok: false, error: "Internal server error." });
});

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "0.0.0.0";
  app.listen(port, host, () => console.log("[rapt-hostinger] Listening on port", port));
}

export default app;
