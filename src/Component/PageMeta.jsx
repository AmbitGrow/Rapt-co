import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl } from "../Data/seo";

const SITE_NAME = "RAPT & Co.";

const PAGE_META = {
  "/": {
    title: "RAPT & Co. | Audit, Tax, Compliance, Risk & Governance Advisory",
    description:
      "From DPDPA Compliance and SOC Audits to Taxation, GST Appeals, Privacy, and GRC, RAPT & Co. delivers integrated advisory solutions tailored for modern enterprises.",
  },
  "/expertise": {
    title: "Expertise | RAPT & Co.",
    description:
      "From governance and regulatory compliance to taxation, digital privacy, and enterprise risk, RAPT & Co. provides integrated advisory services designed to help organizations operate with confidence.",
  },
  "/insights": {
    title: "Insights & Perspectives | RAPT & Co.",
    description:
      "Regulatory updates, expert perspectives, and practical guidance on data protection, governance, privacy, and taxation from RAPT & Co.",
  },
  "/about": {
    title: "About | RAPT & Co.",
    description:
      "Technology-driven advisory helping organizations navigate governance, taxation, privacy, risk, and regulatory compliance through trusted expertise and integrated solutions.",
  },
  "/contact": {
    title: "Contact | RAPT & Co.",
    description:
      "Tell us about your compliance, governance, or advisory requirements, and RAPT & Co. will connect you with the right experts.",
  },
};

const NOT_FOUND_META = {
  title: "Page Not Found | RAPT & Co.",
  description: "The page you requested could not be found.",
};

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!href) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value),
  );
}

// Per-route title/description/canonical. Insight articles manage their own metadata.
export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/insights/")) return;
    const known = PAGE_META[pathname];
    const meta = known || NOT_FOUND_META;
    const url = known ? absoluteUrl(pathname) : "";
    setLink("canonical", url);
    if (url) setMeta('meta[property="og:url"]', { property: "og:url", content: url });
    else document.head.querySelector('meta[property="og:url"]')?.remove();
    if (known) document.head.querySelector('meta[name="robots"]')?.remove();
    else setMeta('meta[name="robots"]', { name: "robots", content: "noindex" });
    document.title = meta.title;
    setMeta('meta[name="description"]', { name: "description", content: meta.description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: meta.description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: meta.title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: meta.description });
  }, [pathname]);

  return null;
}
