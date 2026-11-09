import { useLayoutEffect, useRef } from "react";
import { FaLinkedinIn } from "react-icons/fa6";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { serviceHref } from "../../Data/services";
import { COMPANY_LINKEDIN_URL } from "../../Data/site";
import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const expertiseLinks = [
  { label: "DPDPA Compliance", slug: "dpdpa-compliance" },
  { label: "SOC & Privacy Audits", slug: "soc-audits" },
  { label: "Income Tax Representation", slug: "income-tax-services" },
  { label: "International Taxation", slug: "income-tax-services" },
  { label: "GST Appeals & GSTAT", slug: "gst-services" },
  { label: "Governance, Risk & Compliance (GRC)", slug: "governance-risk-compliance" },
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Expertise", to: "/expertise" },
  { label: "Insights & Resources", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

// Only the official LinkedIn page is listed, and only once its URL is configured.
const socialLinks = COMPANY_LINKEDIN_URL
  ? [{ label: "RAPT & Co. on LinkedIn", href: COMPANY_LINKEDIN_URL, Icon: FaLinkedinIn }]
  : [];

export default function Footer() {
  const footerRef = useRef(null);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(footerRef.current, { autoAlpha: 0, y: 55 }, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 92%", once: true },
      });
    }, footerRef);
    return () => context.revert();
  }, []);

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="site-footer__content">
        <section className="site-footer__brand" aria-labelledby="footer-brand-heading">
          <h2 id="footer-brand-heading">RAPT &amp; Co.</h2>
          <h3>Compliance · Governance · Digital Security</h3>
          <p>We appreciate your time and look forward to partnering with you on your compliance, governance, and growth journey.</p>
          {socialLinks.length > 0 && (
            <div className="site-footer__socials">
              {socialLinks.map(({ label, href, Icon }) => (
                <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer" key={label}><Icon aria-hidden="true" /></a>
              ))}
            </div>
          )}
        </section>

        <nav className="site-footer__links" aria-labelledby="footer-expertise-heading">
          <h3 id="footer-expertise-heading">Expertise</h3>
          {expertiseLinks.map(({ label, slug }) => <Link to={serviceHref(slug)} key={label}>{label}</Link>)}
        </nav>

        <nav className="site-footer__links" aria-labelledby="footer-quick-links-heading">
          <h3 id="footer-quick-links-heading">Quick Links</h3>
          {quickLinks.map(({ label, to }) => (
            <Link to={to} key={to}>{label}</Link>
          ))}
        </nav>
      </div>

      <div className="site-footer__watermark" aria-hidden="true">RAPT &amp; CO</div>
    </footer>
  );
}
