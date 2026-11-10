import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import articlesCardBackground from "../../assets/ArticlesCard.webp";
import ctaBackground from "../../assets/CTA_section_bg_1920.webp";
import panIndiaImage from "../../assets/PanIndia-200.webp";
import technologyDrivenImage from "../../assets/Technology-driven-200.webp";
import oneFirmImage from "../../assets/one-firm-200.webp";
import dpdpaIllustration from "../../assets/DPDPA_svg_600.webp";
import socIllustration from "../../assets/SOC_svg_600.webp";
import privacyIllustration from "../../assets/Privacy_svg_600.webp";
import expertiseArrow from "../../assets/Arrow.png";
import Footer from "../../Component/Footer/Footer";
import { insights } from "../../Data/insights";
import { leadershipTeam } from "../../Data/leadership";
import { serviceHref } from "../../Data/services";
import "./Homepage.css";

const GlobeArtwork = lazy(() => import("./GlobeArtwork"));

const features = [
  { title: "Pan-India", subtitle: "Vision & Reach", icon: "pan-india" },
  { title: "Technology-Driven", subtitle: "Compliance Frameworks", icon: "technology-driven" },
  { title: "One Firm", subtitle: "Complete Coverage", icon: "one-firm" },
];

const featureImages = {
  "pan-india": panIndiaImage,
  "technology-driven": technologyDrivenImage,
  "one-firm": oneFirmImage,
};

const advisoryServices = [
  {
    number: "[ 1 ]",
    title: "Protect",
    tagline: "Secure Your Business Foundation",
    description: "Strengthen privacy, security, and compliance to reduce risk and build lasting stakeholder trust",
    theme: "protect",
    href: serviceHref("dpdpa-compliance"),
    pills: ["DPDPA Compliance", "Privacy Audits", "SOC Audits"],
    metricLabel: "Advisory Focus",
    metric: "Privacy",
    status: "Compliance & Assurance",
  },
  {
    number: "[ 2 ]",
    title: "Govern",
    tagline: "Build Strong Governance",
    description: "Establish effective controls, manage enterprise risks, and strengthen confident decision-making.",
    theme: "govern",
    href: serviceHref("governance-risk-compliance"),
    pills: ["GRC Advisory", "Risk Management", "Internal Controls"],
    metricLabel: "Advisory Focus",
    metric: "Controls",
    status: "Governance & Risk",
  },
  {
    number: "[ 3 ]",
    title: "Grow",
    tagline: "Enable Sustainable Growth",
    description: "Navigate taxation and regulatory complexity with strategic advisory that supports long-term business growth.",
    theme: "grow",
    href: serviceHref("income-tax-services"),
    pills: ["Income Tax Advisory", "GST Services", "International Taxation"],
    metricLabel: "Advisory Focus",
    metric: "Taxation",
    status: "Planning & Representation",
  },
];

const whyRaptStories = [
  {
    title: "Senior-Led Advisory",
    description: "Every engagement is led by experienced professionals with over 20 years of expertise across taxation, compliance, governance, and regulatory advisory—ensuring informed decisions and reliable outcomes from day one.",
  },
  {
    title: "One Firm. Complete Coverage.",
    description: "A single advisory partner for every regulatory need.",
    services: ["DPDP Compliance", "SOC Audits", "Privacy Audits", "GST Appeals", "GRC", "Income Tax Representation"],
  },
  {
    title: "Technology-Driven Execution",
    description: "Modern regulatory challenges demand modern solutions. Our technology-enabled frameworks simplify compliance, strengthen internal controls, and help organizations stay prepared for evolving regulations.",
  },
  {
    title: "Built for Sustainable Growth",
    description: "We don't just help organizations remain compliant—we build governance frameworks that strengthen resilience, reduce risk, and create the confidence needed for long-term business growth.",
  },
];

const expertiseServices = [
  { title: "DPDPA Compliance", slug: "dpdpa-compliance", description: "We help organizations navigate India's landmark data privacy legislation with end-to-end compliance solutions, ensuring every regulatory obligation is met while building lasting digital trust.", theme: "blue", icon: "lock" },
  { title: "SOC Audits", slug: "soc-audits", description: "Independent SOC attestation services that demonstrate your commitment to security, confidentiality, and operational excellence while building stakeholder trust.", theme: "orange", icon: "audit" },
  { title: "Privacy Audits", slug: "privacy-audits", description: "Independent assurance that your organization's data handling practices meet regulatory requirements and industry best practices.", theme: "green", icon: "privacy" },
  { title: "Income Tax Services", slug: "income-tax-services", description: "Strategic income tax planning, representation, assessments, appeals, international taxation, and dispute resolution.", theme: "blue", icon: "tax" },
  { title: "Governance, Risk & Compliance (GRC)", slug: "governance-risk-compliance", description: "Integrated governance, risk, and compliance frameworks that strengthen oversight, improve controls, and support confident decisions.", theme: "green", icon: "grc" },
  { title: "GST Services", slug: "gst-services", description: "Practical GST compliance, advisory, audit support, and representation designed to reduce exposure and enable efficient operations.", theme: "orange", icon: "gst" },
];

const expertiseImages = {
  lock: dpdpaIllustration,
  audit: socIllustration,
  privacy: privacyIllustration,
  tax: dpdpaIllustration,
  grc: privacyIllustration,
  gst: socIllustration,
};

// Home/About "Insights & Resources" slider: real articles from src/Data/insights.js, each linking to its detail page.
const FEATURED_ARTICLE_SLUGS = [
  "rbi-draft-guidance-data-governance",
  "schools-children-data-privacy",
  "critical-infrastructure-data-security",
  "directorate-revenue-intelligence-dri",
];
const featuredArticles = FEATURED_ARTICLE_SLUGS
  .map((slug) => insights.find((article) => article.slug === slug))
  .filter(Boolean)
  .map((article) => ({
    slug: article.slug,
    title: article.category,
    subtitle: article.title,
    description: article.excerpt,
    backgroundImage: articlesCardBackground,
  }));

const faqs = [
  { question: "What services does RAPT & Co. provide?", answer: "Our six principal practices are DPDPA Compliance, SOC Audits, Privacy Audits, Income Tax Services (including International Taxation and appellate representation), GST Services (including GST Appeals and GSTAT representation), and Governance, Risk & Compliance (GRC). We also offer DRI Services, CEPA Services, Project Finance and Fund Arrangement Services, and RPA (Robotic Process Automation) Services." },
  { question: "Which industries do you serve?", answer: "Our team has delivered results across regulated and non-regulated sectors, from banking and financial services to manufacturing, healthcare, telecom, and technology, working with MNCs, SMEs, and high-growth enterprises." },
  { question: "Are engagements led by senior professionals?", answer: "Yes. Engagements are senior-led, drawing on 20+ years of hands-on expertise in cost accounting, taxation, and compliance, and are not delegated to junior staff." },
  { question: "Do you serve clients across India?", answer: "Yes. We are based in Chennai, and our national network ensures seamless service wherever you do business." },
  { question: "How do you protect confidential information?", answer: "Every engagement follows our Trust & Safeguard Framework: a Non-Disclosure Agreement executed before any data exchange, conflict of interest screening, encrypted data transfers with restricted access and retention/destruction policies aligned with DPDPA standards, a formal engagement letter, and multi-level quality review with partner sign-off." },
  { question: "Do you handle tax and regulatory representation?", answer: "Yes. We represent clients in income tax matters before CIT (Appeals), ITAT, and DRP, in GST appeals before the GST Appellate Tribunal (GSTAT), and in other litigation, appeals, and dispute resolution before the relevant forums." },
];

export function InsightsResources() {
  const [activeArticle, setActiveArticle] = useState(0);
  const articleTrackRef = useRef(null);

  const selectArticle = (nextIndex) => {
    if (nextIndex !== activeArticle) setActiveArticle(nextIndex);
  };

  useEffect(() => {
    articleTrackRef.current?.style.setProperty("--active-article", activeArticle);
  }, [activeArticle]);

  return (
    <section className="insights-resources" aria-labelledby="insights-heading">
      <div className="insights-resources__container">
        <header className="insights-resources__header">
          <h2 id="insights-heading">Insights &amp; Resources</h2>
          <p>Stay informed with expert perspectives, regulatory updates, and practical guidance designed to help your business navigate an evolving compliance landscape.</p>
        </header>

        <div className="insights-resources__content">
          <nav className="featured-articles" aria-label="Featured articles">
            {featuredArticles.map((item, index) => (
              <button type="button" className={index === activeArticle ? "is-active" : ""} onClick={() => selectArticle(index)} aria-current={index === activeArticle ? "true" : undefined} key={item.title}>
                <span aria-hidden="true">{index === activeArticle ? "▶" : ""}</span>
                Featured Article {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </nav>

          <article className="featured-article-card" aria-live="polite">
            <div className="featured-article-card__viewport">
              <div className="featured-article-card__track" ref={articleTrackRef}>
                {featuredArticles.map((item, index) => (
                  <div className={`featured-article-card__slide ${index === activeArticle ? "is-active" : ""}`} aria-hidden={index !== activeArticle} key={item.title}>
                    <img src={item.backgroundImage} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                    <div className="featured-article-card__content">
                      <div className="featured-article-card__copy">
                        <h3>{item.title}</h3>
                        <p className="featured-article-card__subtitle">{item.subtitle}</p>
                        <p className="featured-article-card__description">{item.description}</p>
                      </div>
                      <Link to={`/insights/${item.slug}`} tabIndex={index === activeArticle ? undefined : -1} aria-label={`Read article: ${item.subtitle}`}><span>Read Article</span><span aria-hidden="true">↗</span></Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function LeadershipTeam() {
  const [activeLeader, setActiveLeader] = useState(0);
  const leadershipTrackRef = useRef(null);

  useEffect(() => {
    leadershipTrackRef.current?.style.setProperty("--active-leader", activeLeader);
  }, [activeLeader]);

  return (
    <section className="leadership-team" aria-labelledby="leadership-heading">
      <div className="leadership-team__container">
        <div className="leadership-team__left">
          <header className="leadership-team__header">
            <span className="leadership-team__label">LEADERSHIP TEAM</span>
            <h2 id="leadership-heading">The People Behind<br />Your Confidence.</h2>
            <p>Behind every confident business decision is a team of experienced advisors committed to protecting, governing, and growing your organization.</p>
          </header>

          <div className="leadership-team__selector" aria-label="Leadership team members">
            {leadershipTeam.map((leader, index) => (
              <button type="button" className={index === activeLeader ? "is-active" : ""} onClick={() => setActiveLeader(index)} aria-pressed={index === activeLeader} key={leader.name}>
                <img src={leader.image} alt="" loading="lazy" decoding="async" width="70" height="70" />
                <span className="leadership-team__selector-name">{leader.name}</span>
                <span className="leadership-team__selector-role">{leader.qualifications}</span>
              </button>
            ))}
          </div>
        </div>

        <article className="leadership-profile" aria-live="polite">
          <div className="leadership-profile__viewport">
            <div className="leadership-profile__track" ref={leadershipTrackRef}>
              {leadershipTeam.map((leader, index) => (
                <div className={`leadership-profile__slide ${index === activeLeader ? "is-active" : ""}`} aria-hidden={index !== activeLeader} key={leader.name}>
                  <header className="leadership-profile__header">
                    <img src={leader.image} alt={`Portrait of ${leader.name}`} loading="lazy" decoding="async" width="120" height="120" />
                    <div><h3>{leader.name}</h3><p>{leader.qualifications}</p></div>
                  </header>
                  <div className="leadership-profile__body" tabIndex={index === activeLeader ? 0 : -1} aria-label={`${leader.name} profile details`}>
                    {leader.sections.map((section) => (
                      <section className="leadership-profile__section" key={section.heading}>
                        <h4>{section.heading}</h4>
                        <ul>
                          {section.points.map((point) => <li key={point}>{point}</li>)}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function FrequentlyAskedQuestions() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-section__container">
        <header className="faq-section__header">
          <span className="faq-section__label">FAQ</span>
          <h2 id="faq-heading">Frequently<br />Asked Questions</h2>
          <p>Find answers to common questions about our services, expertise, and engagement process.</p>
        </header>

        <div className="faq-accordion">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const answerId = `faq-answer-${index}`;
            return (
              <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
                <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={answerId}>
                  <span>{faq.question}</span><span className="faq-item__icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-item__answer" id={answerId} role="region">
                  <p>{faq.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const CallToAction = memo(function CallToAction({
  heading = "Let's Build Confidence Together.",
  description = "Whether you're strengthening governance, preparing for audits, navigating taxation, or building a future-ready compliance program, our experts are ready to support your next step.",
}) {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <img className="cta-section__background" src={ctaBackground} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="cta-section__content">
        <span className="cta-section__label">READY TO MOVE FORWARD?</span>
        <h2 id="cta-heading">{heading}</h2>
        <p>{description}</p>
        <div className="cta-section__button-glow">
          <Link to="/contact#get-in-touch">Book a Consultation</Link>
        </div>
      </div>
    </section>
  );
});

function HorizontalCarousel({ items }) {
  const sliderRef = useRef(null);
  const cardStepRef = useRef(415);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [scrollEdges, setScrollEdges] = useState({
    atStart: true,
    atEnd: false,
  });

  const goTo = useCallback((nextIndex) => {
    const boundedIndex = Math.max(0, Math.min(items.length - 1, nextIndex));
    const slider = sliderRef.current;
    setIsCarouselActive(boundedIndex > 0);
    slider?.scrollTo({
      left: boundedIndex * cardStepRef.current,
      behavior: "smooth",
    });
    setActiveIndex(boundedIndex);
  }, [items.length]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return undefined;
    let frame;
    const measureCards = () => {
      const firstCard = slider.firstElementChild;
      const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;
      cardStepRef.current = firstCard
        ? firstCard.getBoundingClientRect().width + gap
        : 415;
    };
    const syncIndex = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const nextIndex = Math.min(
          items.length - 1,
          Math.max(0, Math.round(slider.scrollLeft / cardStepRef.current)),
        );
        const nextEdges = {
          atStart: slider.scrollLeft <= 2,
          atEnd: slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 2,
        };
        setActiveIndex((current) => current === nextIndex ? current : nextIndex);
        setScrollEdges((current) => (
          current.atStart === nextEdges.atStart && current.atEnd === nextEdges.atEnd
            ? current
            : nextEdges
        ));
        setIsCarouselActive((current) => {
          const nextActive = slider.scrollLeft > 2;
          return current === nextActive ? current : nextActive;
        });
      });
    };
    const handleResize = () => {
      measureCards();
      syncIndex();
    };
    measureCards();
    syncIndex();
    slider.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      slider.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", handleResize);
    };
  }, [items.length]);

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    goTo(activeIndex + (event.deltaY > 0 ? 1 : -1));
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(activeIndex - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(activeIndex + 1); }
  };

  return (
    <div
      className={`expertise-carousel${isCarouselActive ? " is-active" : ""}${scrollEdges.atEnd ? " is-at-end" : ""}`}
    >
      {!scrollEdges.atStart && (
        <button
          className="expertise-carousel__control expertise-carousel__control--previous"
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous expertise service"
        >
          <FaChevronLeft aria-hidden="true" />
        </button>
      )}
      {!scrollEdges.atEnd && (
        <button
          className="expertise-carousel__control expertise-carousel__control--next"
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next expertise service"
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      )}
      <div className="expertise-carousel__viewport" ref={sliderRef} onWheel={handleWheel} onKeyDown={handleKeyDown} tabIndex="0" role="region" aria-label="Advisory services carousel">
        {items.map((service) => (
          <article className={`expertise-card expertise-card--${service.theme}`} key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className="expertise-card__illustration">
              <img
                src={expertiseImages[service.icon]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </div>
            <Link
              to={serviceHref(service.slug)}
              aria-label={`Learn more about ${service.title}`}
            >
              <img src={expertiseArrow} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function Homepage({ hero = null }) {
  const globeHostRef = useRef(null);
  const advisoryRef = useRef(null);
  const [shouldRenderGlobe, setShouldRenderGlobe] = useState(false);
  const [isGlobeVisible, setIsGlobeVisible] = useState(false);

  // Mount the globe when it nears the viewport and pause its render loop when it leaves,
  // so the WebGL canvas doesn't compete with scrolling elsewhere on the page.
  useEffect(() => {
    const host = globeHostRef.current;
    if (!host) return undefined;
    if (!("IntersectionObserver" in window)) {
      setShouldRenderGlobe(true);
      setIsGlobeVisible(true);
      return undefined;
    }

    // The globe (three.js + ~2 MB of textures) only starts loading after the visitor's first
    // scroll or interaction, so it no longer competes with the initial page load.
    let observer;
    const interactionEvents = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"];
    const removeInteractionListeners = () =>
      interactionEvents.forEach((type) => window.removeEventListener(type, start));
    function start() {
      removeInteractionListeners();
      if (observer) return;
      import("./GlobeArtwork"); // warm the chunk while the section scrolls into view
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setShouldRenderGlobe(true);
          setIsGlobeVisible(entry.isIntersecting);
        },
        { rootMargin: "400px 0px" },
      );
      observer.observe(host);
    }
    interactionEvents.forEach((type) =>
      window.addEventListener(type, start, { passive: true }),
    );
    if (window.scrollY > 0) start();
    return () => {
      removeInteractionListeners();
      observer?.disconnect();
    };
  }, []);

  // Below-the-fold card artwork (CSS backgrounds) is applied only once the section is
  // within 600px of the viewport, so it no longer competes with the initial load.
  useEffect(() => {
    const section = advisoryRef.current;
    if (!section) return undefined;
    if (!("IntersectionObserver" in window)) {
      section.classList.add("is-near");
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-near");
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pills = document.querySelectorAll(".advisory-panel__pills span");
    const cleanups = [];

    pills.forEach((pill) => {
      let frameId = 0;
      let clientX = 0;
      let clientY = 0;
      let pointerX = 50;
      let pointerY = 50;

      const renderReflection = () => {
        frameId = 0;
        const bounds = pill.getBoundingClientRect();
        pointerX = ((clientX - bounds.left) / bounds.width) * 100;
        pointerY = ((clientY - bounds.top) / bounds.height) * 100;
        pill.style.setProperty("--mouse-x", `${pointerX}%`);
        pill.style.setProperty("--mouse-y", `${pointerY}%`);
        pill.style.setProperty("--reflection-x", `${(pointerX - 50) * 0.08}px`);
        pill.style.setProperty("--reflection-y", `${(pointerY - 50) * 0.05}px`);
      };

      const handlePointerMove = (event) => {
        clientX = event.clientX;
        clientY = event.clientY;
        if (!frameId) frameId = window.requestAnimationFrame(renderReflection);
      };

      const handlePointerLeave = () => {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        pill.style.setProperty("--mouse-x", "50%");
        pill.style.setProperty("--mouse-y", "50%");
        pill.style.setProperty("--reflection-x", "0px");
        pill.style.setProperty("--reflection-y", "0px");
      };

      pill.addEventListener("pointermove", handlePointerMove, { passive: true });
      pill.addEventListener("pointerleave", handlePointerLeave);
      cleanups.push(() => {
        pill.removeEventListener("pointermove", handlePointerMove);
        pill.removeEventListener("pointerleave", handlePointerLeave);
        if (frameId) window.cancelAnimationFrame(frameId);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <>
    <main>
      {hero}
      <div className="hr-line"></div>
      <section className="experience" aria-labelledby="experience-heading">
        <div className="experience__container">
          <div className="experience__wrapper">
            <div className="experience__left">
              <h2 id="experience-heading" className="experience__heading">Built on Experience.<br />Trusted by Expertise.</h2>
              <figure className="experience__visual" ref={globeHostRef}>
                {shouldRenderGlobe ? (
                  <Suspense fallback={null}>
                    <GlobeArtwork active={isGlobeVisible} />
                  </Suspense>
                ) : null}
              </figure>
            </div>

            <div className="experience__right">
              <p className="experience__intro">Our experience, integrated advisory approach, and technology-driven execution help<br className="experience__desktop-break" /> organizations navigate complex regulatory environments with confidence.</p>

              <dl className="experience__statistics">
                <div className="experience__stat"><dd>20 +</dd><dt>Years of Experience</dt></div>
                <div className="experience__stat"><dd>10</dd><dt>Advisory Services</dt></div>
              </dl>

              <div className="experience__features">
                {features.map((feature) => (
                  <article className="experience-card" key={feature.title}>
                    <h2>{feature.title}</h2>
                    <p>{feature.subtitle}</p>
                    <img
                      src={featureImages[feature.icon]}
                      alt={feature.title}
                      className={`experience-card__image experience-card__image--${feature.icon}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="advisory-philosophy" aria-labelledby="advisory-heading" ref={advisoryRef}>
        <div className="advisory-philosophy__container">
          <header className="advisory-philosophy__header">
            <div className="advisory-philosophy__title-group">
              <span className="advisory-philosophy__label">OUR ADVISORY PHILOSOPHY</span>
              <h2 id="advisory-heading" className="advisory-philosophy__heading">Protect.<br />Govern. Grow.</h2>
            </div>
            <p className="advisory-philosophy__intro">Every business faces unique regulatory, operational, and strategic challenges. Our integrated advisory approach helps organizations protect what matters, strengthen governance, and create a foundation for sustainable growth.</p>
          </header>

          <div className="advisory-philosophy__cards">
            {advisoryServices.map((service) => (
              <article className="advisory-service" key={service.title}>
                <div className="advisory-service__summary">
                  <span className="advisory-service__number">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p className="advisory-service__tagline">{service.tagline}</p>
                  <p className="advisory-service__description">{service.description}</p>
                </div>

                <div className={`advisory-panel advisory-panel--${service.theme}`}>
                  <div className="advisory-panel__glass">
                    <header className="advisory-panel__header">
                      <h4>{service.title}</h4>
                      <span className="advisory-panel__menu" aria-hidden="true"><span /><span /><span /></span>
                    </header>

                    <div className="advisory-panel__pills">
                      {service.pills.map((pill) => <span key={pill}>{pill}</span>)}
                    </div>

                    <div className="advisory-panel__metric">
                      {service.theme === "protect" ? (
                        <div className="advisory-panel__protect-metric">
                          <div className="advisory-panel__gauge">
                            <svg className="advisory-panel__gauge-ring" viewBox="0 0 120 120" aria-hidden="true">
                              <circle className="advisory-panel__gauge-track" cx="60" cy="60" r="53" />
                            </svg>
                            <strong>Risk</strong><small>Assessment</small></div>
                          <div><span>{service.metricLabel}</span><strong>{service.metric}</strong><small><i />{service.status}</small></div>
                        </div>
                      ) : (
                        <div className="advisory-panel__standard-metric">
                          <span>{service.metricLabel}</span><strong>{service.metric}</strong><small><i />{service.status}</small>
                        </div>
                      )}
                    </div>

                    <Link className="advisory-panel__cta" to={service.href} aria-label={`Learn more about ${service.title}: ${service.pills.join(", ")}`}><span>Learn more</span><span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="why-rapt" aria-labelledby="why-rapt-heading">
        <div className="why-rapt__container">
          <header className="why-rapt__header">
            <span className="why-rapt__label">WHY RAPT &amp; CO</span>
            <h2 id="why-rapt-heading" className="why-rapt__heading">More Than Compliance.<br />A Strategic Advisory Partner.</h2>
            <p className="why-rapt__intro">RAPT &amp; Co. brings together decades of regulatory expertise, technology-driven advisory, and a unified approach to compliance. From governance and privacy to taxation and risk management, we help organizations navigate complexity with clarity and confidence.</p>
          </header>

          <div className="why-rapt__grid">
            {whyRaptStories.map((story, index) => (
              <article className="why-rapt-card" key={story.title}>
                <h3>{story.title}</h3>
                <p>{story.description}</p>
                {story.services && (
                  <div className="why-rapt-card__services">
                    <span className="why-rapt-card__services-label">Services :</span>
                    <div className="advisory-panel__pills why-rapt-card__pills">
                      {story.services.map((service) => <span key={service}>{service}</span>)}
                    </div>
                  </div>
                )}
                <span className="why-rapt-card__story">Story {String(index + 1).padStart(2, "0")}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="our-expertise" aria-labelledby="expertise-heading">
        <div className="our-expertise__container">
          <header className="our-expertise__header">
            <span className="our-expertise__label">OUR EXPERTISE</span>
            <h2 id="expertise-heading" className="our-expertise__heading">Comprehensive<br />Advisory Services</h2>
            <p className="our-expertise__intro">We deliver technology-driven compliance and advisory solutions across privacy, taxation, governance, risk management, and regulatory compliance—helping organizations operate with confidence in an increasingly complex business environment.</p>
          </header>
          <HorizontalCarousel items={expertiseServices} />
        </div>
      </section>

      <InsightsResources />
      <LeadershipTeam />
      <FrequentlyAskedQuestions />
      <CallToAction />
    </main>
    <Footer />
    </>
  );
}
