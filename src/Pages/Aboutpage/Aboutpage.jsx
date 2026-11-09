import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewHeroSection from "../../Component/NewHeroSection/NewHeroSection";
import aboutBg from "../../assets/Herosection/4.webp";
import aboutBgPortrait from "../../assets/Herosection/4-portrait.webp";
import Footer from "../../Component/Footer/Footer";
import {
  CallToAction,
  InsightsResources,
  LeadershipTeam,
} from "../Homepage/Homepage";
import purposeBackground from "../../assets/Client_bg.webp";
import "./Aboutpage.css";

gsap.registerPlugin(ScrollTrigger);

const journeyStages = [
  {
    title: "Foundation",
    subtitle: "Every strong partnership begins with a shared purpose.",
    description:
      "RAPT & Co. was established by industry veterans with decades of experience across taxation, compliance, governance, and regulatory advisory. Their vision was simple to create a firm where businesses could rely on experienced professionals for every critical compliance need.",
  },
  {
    title: "Building Expertise",
    subtitle: "Experience shaped through complex engagements.",
    description:
      "Over the years, the team developed deep expertise in DPDPA Compliance, SOC Audits, Privacy Audits, Income Tax Representation, International Taxation, GST Appeals, and Governance, Risk & Compliance—serving organizations across highly regulated industries.",
  },
  {
    title: "One Integrated Firm",
    subtitle: "One trusted partner instead of many.",
    description:
      "Rather than separating compliance, taxation, cybersecurity, and governance into different service providers, RAPT & Co. built an integrated advisory model that delivers complete regulatory coverage through a single accountable firm.",
  },
  {
    title: "Technology-Driven Advisory",
    subtitle: "Modern regulations require modern thinking.",
    description:
      "As privacy laws, cybersecurity standards, and cross-border regulations evolved, RAPT & Co. embraced technology-driven frameworks that simplify compliance, strengthen governance, and help organizations stay ahead of regulatory change.",
  },
  {
    title: "Growing with Every Client",
    subtitle: "Building confidence for the future.",
    description:
      "Today, RAPT & Co. continues to partner with businesses across banking, manufacturing, healthcare, telecom, financial services, and technology—helping organizations protect their interests, strengthen internal controls, and achieve sustainable growth through trusted advisory.",
  },
];

export default function Aboutpage() {
  const [activeJourneyStage, setActiveJourneyStage] = useState(0);
  const whoWeAreRef = useRef(null);
  const journeyContentRef = useRef(null);
  const journeyActiveLineRef = useRef(null);
  const journeyTimelineRef = useRef(null);
  const journeyHasChangedRef = useRef(false);
  const journeyTransitionRef = useRef(null);
  const purposeRef = useRef(null);

  useLayoutEffect(() => {
    let frame = 0;
    const updateProgressScale = () => {
      frame = 0;
      const timeline = journeyTimelineRef.current;
      const activeLine = journeyActiveLineRef.current;
      const selectedDot = timeline?.querySelector(
        `[data-stage-index="${activeJourneyStage}"] .journey-timeline__dot`,
      );
      const timelineBounds = timeline?.getBoundingClientRect();
      const dotBounds = selectedDot?.getBoundingClientRect();
      if (!timeline || !activeLine || !timelineBounds || !dotBounds) return;
      const progress =
        dotBounds.left -
        timelineBounds.left +
        timeline.scrollLeft +
        dotBounds.width / 2;
      gsap.set(activeLine, {
        scaleX: progress / timelineBounds.width,
        transformOrigin: "left center",
      });
    };
    const handleResize = () => {
      if (!frame) frame = requestAnimationFrame(updateProgressScale);
    };

    updateProgressScale();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeJourneyStage]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        [
          ".who-we-are__label",
          ".who-we-are__title",
          ".who-we-are__paragraph",
        ],
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: whoWeAreRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, whoWeAreRef);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    if (!journeyHasChangedRef.current) return;

    const tween = gsap.fromTo(
      journeyContentRef.current,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" },
    );

    return () => tween.kill();
  }, [activeJourneyStage]);

  useLayoutEffect(
    () => () => {
      journeyTransitionRef.current?.kill();
      gsap.killTweensOf([
        journeyContentRef.current,
        journeyActiveLineRef.current,
      ]);
    },
    [],
  );

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: purposeRef.current,
            start: "top 78%",
            once: true,
          },
        })
        .fromTo(
          ".our-purpose__header",
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
        )
        .fromTo(
          ".purpose-card",
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: "power3.out",
          },
          "-=0.25",
        );
    }, purposeRef);

    return () => context.revert();
  }, []);

  const selectJourneyStage = (stageIndex) => {
    if (stageIndex === activeJourneyStage) return;

    const timeline = journeyTimelineRef.current;
    const selectedDot = timeline?.querySelector(
      `[data-stage-index="${stageIndex}"] .journey-timeline__dot`,
    );
    const timelineBounds = timeline?.getBoundingClientRect();
    const dotBounds = selectedDot?.getBoundingClientRect();
    const progressScale =
      timeline && timelineBounds && dotBounds
        ? (dotBounds.left -
            timelineBounds.left +
            timeline.scrollLeft +
            dotBounds.width / 2) /
          timelineBounds.width
        : 0;

    gsap.killTweensOf([
      journeyContentRef.current,
      journeyActiveLineRef.current,
    ]);

    journeyTransitionRef.current = gsap.timeline({
        onComplete: () => {
          journeyHasChangedRef.current = true;
          setActiveJourneyStage(stageIndex);
        },
      })
      .to(
        journeyContentRef.current,
        { autoAlpha: 0, y: -30, duration: 0.35, ease: "power3.out" },
        0,
      )
      .to(
        journeyActiveLineRef.current,
        {
          scaleX: progressScale,
          duration: 0.8,
          ease: "power3.inOut",
        },
        0,
      );
  };

  const activeJourneyContent = journeyStages[activeJourneyStage];

  return (
    <>
      <main className="about-page">
        <NewHeroSection
          id="about-hero-title"
          title="Welcome to RAPT & Co."
          subtitle="Building Confidence Through Intelligent Advisory."
          description="Technology-driven advisory helping organizations navigate governance, taxation, privacy, risk, and regulatory compliance through trusted expertise, integrated solutions, and long-term strategic partnerships."
          backgroundImage={aboutBg}
          mobileBackgroundImage={aboutBgPortrait}
          scrollTo="#who-we-are-title"
        />

        <section
          className="who-we-are"
          aria-labelledby="who-we-are-title"
          ref={whoWeAreRef}
        >
          <div className="who-we-are__container">
            <span className="who-we-are__label">WHO WE ARE</span>

            <h2 className="who-we-are__title" id="who-we-are-title">
              More Than Compliance.
              <br />
              A <em>Strategic Advisory Partner.</em>
            </h2>

            <div className="who-we-are__content">
              <p className="who-we-are__paragraph">
                RAPT &amp; Co. is a multidisciplinary advisory firm that brings
                together compliance, governance, taxation, privacy, and
                regulatory expertise under one trusted practice. We help
                organizations simplify complex regulations, strengthen internal
                controls, and make confident business decisions through
                practical, technology-enabled advisory solutions.
              </p>
              <p className="who-we-are__paragraph">
                From emerging businesses to established enterprises, our focus
                remains the same delivering reliable guidance that protects
                organizations while enabling sustainable growth.
              </p>
            </div>
          </div>
        </section>

        <section className="our-journey" aria-labelledby="our-journey-title">
          <header className="our-journey__header">
           <div><span className="our-journey__label">OUR JOURNEY</span></div> 
            <div><h2 className="our-journey__title" id="our-journey-title">
              A Journey of Experience, Trust,
              <br />
              and Strategic Advisory
            </h2></div>
          </header>

          <nav
            className="journey-timeline"
            aria-label="Our journey stages"
            ref={journeyTimelineRef}
          >
            <div className="journey-timeline__background" aria-hidden="true" />
            <div className="journey-timeline__progress-zone" aria-hidden="true">
              <div
                className="journey-timeline__active"
                ref={journeyActiveLineRef}
              />
            </div>

            <ol className="journey-timeline__stages">
              {journeyStages.map((stage, index) => (
                <li
                  className="journey-timeline__stage"
                  data-stage-index={index}
                  key={stage.title}
                >
                  <button
                    className={`journey-timeline__button${
                      activeJourneyStage === index ? " is-active" : ""
                    }`}
                    type="button"
                    aria-current={
                      activeJourneyStage === index ? "step" : undefined
                    }
                    onClick={() => selectJourneyStage(index)}
                  >
                    Stage {String(index + 1).padStart(2, "0")}
                  </button>
                  <span className="journey-timeline__dot" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </nav>

          <article
            className="our-journey__content"
            ref={journeyContentRef}
            aria-live="polite"
          >
            <h3 className="our-journey__stage-title">
              {activeJourneyContent.title}
            </h3>
            <p className="our-journey__stage-subtitle">
              {activeJourneyContent.subtitle}
            </p>
            <p className="our-journey__stage-description">
              {activeJourneyContent.description}
            </p>
          </article>
        </section>

        <section
          className="our-purpose"
          aria-labelledby="our-purpose-title"
          ref={purposeRef}
        >
          <img
            className="our-purpose__background"
            src={purposeBackground}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />

          <div className="our-purpose__wrapper">
            <header className="our-purpose__header">
              <span className="our-purpose__label">OUR PURPOSE</span>
              <h2 className="our-purpose__title" id="our-purpose-title">
                The Future We&apos;re Building.
              </h2>
              <p className="our-purpose__description">
                Our vision defines where we aspire to go, while our mission
                shapes how we help organizations navigate an evolving
                regulatory landscape with confidence, integrity, and lasting
                impact.
              </p>
            </header>

            <div className="our-purpose__cards">
              <article className="purpose-card">
                <h3 className="purpose-card__title">VISION</h3>
                <p className="purpose-card__subtitle">
                  BUILDING A FUTURE WHERE CONFIDENCE DRIVES EVERY DECISION.
                </p>
                <p className="purpose-card__description">
                  To be India&rsquo;s most trusted advisory firm in technology,
                  taxation, and regulatory compliance &mdash; empowering
                  organizations to operate with confidence, transparency, and
                  resilience in an increasingly complex and digital business
                  landscape.
                </p>
              </article>

              <article className="purpose-card">
                <h3 className="purpose-card__title">MISSION</h3>
                <p className="purpose-card__subtitle">
                  HELPING BUSINESSES NAVIGATE COMPLEXITY WITH CLARITY.
                </p>
                <p className="purpose-card__description">
                  We are committed to delivering comprehensive, technology-driven
                  compliance and advisory solutions that protect our clients&rsquo;
                  interests and fuel their growth. Through deep expertise in DPDP
                  Compliance, SOC &amp; Privacy Audits, Income Tax Representation,
                  International Taxation, GST Appeals, and Governance, Risk &amp;
                  Compliance (GRC), we serve as a single, accountable partner for
                  every regulatory need.
                </p>
              </article>
            </div>
          </div>
        </section>

        <InsightsResources />
        <LeadershipTeam />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
