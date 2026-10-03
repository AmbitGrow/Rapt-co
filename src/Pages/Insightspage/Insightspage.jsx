import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBookOpen,
  FaDownload,
  FaRegCalendar,
  FaShieldAlt,
} from "react-icons/fa";
import { LuClock3, LuSparkles } from "react-icons/lu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewHeroSection from "../../Component/NewHeroSection/NewHeroSection";
import insightsBg from "../../assets/Herosection/3.webp";
import Footer from "../../Component/Footer/Footer";
import InsightCard from "../../Components/InsightCard";
import { insights } from "../../Data/insights";
import "./Insightspage.css";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  "Digital Transformation",
  "Artificial Intelligence",
  "Cybersecurity",
  "UI / UX",
  "Web Development",
  "Branding",
  "Automation",
  "Business Strategy",
  "Cloud",
  "Innovation",
];

const caseStudies = [
  {
    client: "Growth-Stage Technology Company",
    challenge: "Fragmented systems limited operational visibility.",
    solution:
      "A unified transformation roadmap connecting workflows, data, and governance.",
    result: "Faster execution with clearer ownership across teams.",
    metric: "38% faster delivery",
  },
  {
    client: "Financial Services Enterprise",
    challenge: "Complex security requirements slowed digital initiatives.",
    solution:
      "A practical risk framework embedded directly into product delivery.",
    result: "Stronger controls without compromising innovation velocity.",
    metric: "45% fewer control gaps",
  },
  {
    client: "Consumer Brand",
    challenge: "An inconsistent digital experience weakened engagement.",
    solution:
      "A refreshed brand system and customer-first experience strategy.",
    result: "A clearer market position and more meaningful interactions.",
    metric: "2.4× engagement",
  },
];

const resources = [
  {
    Icon: LuSparkles,
    title: "Digital Transformation Guide",
    description:
      "A focused roadmap for turning transformation priorities into measurable progress.",
  },
  {
    Icon: FaBookOpen,
    title: "Website Performance Checklist",
    description:
      "The essential checks for delivering fast, accessible, high-confidence digital experiences.",
  },
  {
    Icon: FaShieldAlt,
    title: "Cybersecurity Readiness",
    description:
      "A practical assessment guide for strengthening resilience across your organization.",
  },
  {
    Icon: FaRegCalendar,
    title: "Brand Strategy Workbook",
    description:
      "Clarify your positioning, audience, story, and strategic direction with guided exercises.",
  },
];

const featuredInsight = insights[0];
const trendingInsights = insights.slice(0, 4);

export default function Insightspage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.utils.toArray(".insights-page__reveal").forEach((section) => {
        const items = section.querySelectorAll(".insights-page__stagger");
        gsap.fromTo(
          items.length ? items : section,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          },
        );
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  const preventSubmit = (event) => event.preventDefault();

  return (
    <div className="insights-page" ref={pageRef}>
      <main>
        <NewHeroSection
          id="insights-page-title"
          title="Insights & Perspectives"
          description="Explore industry trends, strategic thinking, technology innovations, design inspiration, and practical knowledge that help businesses grow confidently in the digital era."
          primaryAction={{ label: "Explore Articles", href: "#latest-insights" }}
          secondaryAction={{
            label: "Book a Consultation",
            to: "/contact#get-in-touch",
          }}
          backgroundImage={insightsBg}
          scrollTo="#featured-insight"
        />

        <section
          className="featured-insight insights-page__section insights-page__reveal"
          id="featured-insight"
          aria-labelledby="featured-insight-title"
        >
          <div className="insights-page__container">
            <header className="insights-section-heading insights-page__stagger">
              <span className="insights-label">FEATURED INSIGHT</span>
              <h2 id="featured-insight-title">Thinking Beyond What&apos;s Next.</h2>
            </header>

            <article className="featured-insight__card insights-page__stagger">
              <div className="featured-insight__media">
                  {featuredInsight.featuredImage ? (
                    <img
                      src={featuredInsight.featuredImage}
                      alt={`Cover for ${featuredInsight.title}`}
                      loading="lazy"
                      decoding="async"
                      width="1200"
                      height="900"
                    />
                  ) : null}
                <span>Featured</span>
              </div>
              <div className="featured-insight__content">
                <span className="insights-card-category">{featuredInsight.category}</span>
                <h3>{featuredInsight.title}</h3>
                <p>{featuredInsight.excerpt}</p>
                <div className="insights-card-meta">
                  <span><LuClock3 aria-hidden="true" /> {featuredInsight.readingTime}</span>
                  <span>{featuredInsight.publishDate}</span>
                </div>
                <Link
                  className="insights-inline-link"
                  to={`/insights/${featuredInsight.slug}`}
                >
                  Read More <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section
          className="insight-categories insights-page__reveal"
          aria-label="Insight categories"
        >
          <div className="insights-page__container">
            <div className="insight-categories__viewport insights-page__stagger">
              <div className="insight-categories__track">
                {[false, true].map((isDuplicate) => (
                  <div
                    className="insight-categories__group"
                    aria-hidden={isDuplicate || undefined}
                    key={isDuplicate ? "duplicate" : "primary"}
                  >
                    {categories.map((category) => (
                      <a
                        href="#latest-insights"
                        key={`${isDuplicate ? "duplicate" : "primary"}-${category}`}
                        tabIndex={isDuplicate ? -1 : undefined}
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="latest-insights insights-page__section insights-page__reveal"
          id="latest-insights"
          aria-labelledby="latest-insights-title"
        >
          <div className="insights-page__container">
            <header className="insights-section-heading insights-page__stagger">
              <span className="insights-label">LATEST INSIGHTS</span>
              <h2 id="latest-insights-title">Ideas for Confident Progress.</h2>
              <p>
                Practical perspectives for navigating technology, design,
                governance, and growth.
              </p>
            </header>

            <div className="latest-insights__grid">
              {insights.map((insight) => (
                <InsightCard
                  article={insight}
                  className="insights-page__stagger"
                  layeredArtwork
                  key={insight.slug}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="trending-insights insights-page__section insights-page__reveal"
          aria-labelledby="trending-insights-title"
        >
          <div className="insights-page__container">
            <header className="insights-section-heading insights-page__stagger">
              <span className="insights-label">TRENDING</span>
              <h2 id="trending-insights-title">What Leaders Are Reading.</h2>
            </header>
          </div>
          <div className="trending-insights__viewport">
            <div className="trending-insights__track">
              {trendingInsights.map((insight, index) => (
                <InsightCard
                  key={insight.slug}
                  article={insight}
                  variant="trending"
                  number={String(index + 1).padStart(2, "0")}
                  className="insights-page__stagger"
              
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="insights-cases insights-page__section insights-page__reveal"
          aria-labelledby="case-studies-title"
        >
          <div className="insights-page__container">
            <header className="insights-section-heading insights-page__stagger">
              <span className="insights-label">CASE STUDIES</span>
              <h2 id="case-studies-title">Strategy Made Measurable.</h2>
            </header>
            <div className="insights-cases__grid">
              {caseStudies.map((study) => (
                <article className="case-card insights-page__stagger" key={study.client}>
                  <span>CLIENT</span>
                  <h3>{study.client}</h3>
                  <dl>
                    <div><dt>Challenge</dt><dd>{study.challenge}</dd></div>
                    <div><dt>Solution</dt><dd>{study.solution}</dd></div>
                    <div><dt>Result</dt><dd>{study.result}</dd></div>
                  </dl>
                  <strong>{study.metric}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="insights-resources-page insights-page__section insights-page__reveal"
          aria-labelledby="resources-title"
        >
          <div className="insights-page__container">
            <header className="insights-section-heading insights-page__stagger">
              <span className="insights-label">RESOURCES</span>
              <h2 id="resources-title">Knowledge You Can Put to Work.</h2>
            </header>
            <div className="insights-resources-page__grid">
              {resources.map(({ Icon, title, description }) => (
                <article className="resource-card insights-page__stagger" key={title}>
                  <Icon aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <a href="#resources-title" download>
                    Download <FaDownload aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="insights-newsletter insights-page__section insights-page__reveal">
          <div className="insights-page__container">
            <div className="insights-newsletter__card insights-page__stagger">
              <span className="insights-label">NEWSLETTER</span>
              <h2>Stay Ahead with RAPT &amp; Co.</h2>
              <p>
                Subscribe to receive insights, industry trends, and practical
                strategies delivered directly to your inbox.
              </p>
              <form onSubmit={preventSubmit}>
                <label className="insights-page__sr-only" htmlFor="insights-email">
                  Email address
                </label>
                <input
                  id="insights-email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
