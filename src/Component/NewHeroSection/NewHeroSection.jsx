import { useLayoutEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import "./NewHeroSection.css";

function HeroAction({ action, variant }) {
  if (!action) return null;
  const className = `new-hero__button new-hero__button--${variant}`;
  const { label, to, href, download } = action;

  if (to) {
    return (
      <NavLink className={className} to={to}>
        {label}
      </NavLink>
    );
  }
  return (
    <a className={className} href={href} download={download || undefined}>
      {label}
    </a>
  );
}

/**
 * Shared corporate hero. Pages supply their own content and background.
 * `title` may be a string or JSX (use <em> for emphasis).
 */
export default function NewHeroSection({
  eyebrow,
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  scrollTo,
  id = "new-hero-title",
}) {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(
          ".new-hero__background",
          { scale: 1.04 },
          { scale: 1, duration: 1.6, clearProps: "transform" },
          0,
        )
        .fromTo(
          [
            ".new-hero__eyebrow",
            ".new-hero__title",
            ".new-hero__subtitle",
            ".new-hero__description",
            ".new-hero__actions",
            ".new-hero__scroll",
          ].filter((selector) => heroRef.current?.querySelector(selector)),
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 },
          0.2,
        );
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <section className="new-hero" aria-labelledby={id} ref={heroRef}>
      <img
        className="new-hero__background"
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
      />
      <div className="new-hero__overlay" aria-hidden="true" />

      <div className="new-hero__content">
        {eyebrow && <span className="new-hero__eyebrow">{eyebrow}</span>}
        <h1 className="new-hero__title" id={id}>
          {title}
        </h1>
        {subtitle && <p className="new-hero__subtitle">{subtitle}</p>}
        {description && <p className="new-hero__description">{description}</p>}
        {(primaryAction || secondaryAction) && (
          <div className="new-hero__actions">
            <HeroAction action={primaryAction} variant="primary" />
            <HeroAction action={secondaryAction} variant="secondary" />
          </div>
        )}
      </div>

      {scrollTo && (
        <a className="new-hero__scroll" href={scrollTo}>
          Scroll Down <span aria-hidden="true">↓</span>
        </a>
      )}
    </section>
  );
}
