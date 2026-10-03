import { useLayoutEffect, useRef } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const expertiseLinks = [
  "DPDPA Compliance",
  "SOC & Privacy Audits",
  "Income Tax Representation",
  "International Taxation",
  "GST Appeals & GSTAT",
  "Governance, Risk & Compliance (GRC)",
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Expertise", to: "/expertise" },
  { label: "Insights & Resources", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

const socialLinks = [
  { label: "X / Twitter", href: "#twitter", Icon: FaXTwitter },
  { label: "Facebook", href: "#facebook", Icon: FaFacebookF },
  { label: "Instagram", href: "#instagram", Icon: FaInstagram },
];

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
          <div className="site-footer__socials">
            {socialLinks.map(({ label, href, Icon }) => <a href={href} aria-label={label} key={label}><Icon aria-hidden="true" /></a>)}
          </div>
        </section>

        <nav className="site-footer__links" aria-labelledby="footer-expertise-heading">
          <h3 id="footer-expertise-heading">Expertise</h3>
          {expertiseLinks.map((link) => <Link to="/expertise" key={link}>{link}</Link>)}
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
