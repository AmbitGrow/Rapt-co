import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaDownload, FaRegFilePdf } from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewHeroSection from "../../Component/NewHeroSection/NewHeroSection";
import insightsBg from "../../assets/Herosection/3.webp";
import Footer from "../../Component/Footer/Footer";
import InsightCard from "../../Components/InsightCard";
import { insightCategories, insights } from "../../Data/insights";
import "./Insightspage.css";

gsap.registerPlugin(ScrollTrigger);

const ALL_CATEGORIES = "All";
const featuredInsight = insights[0];
const trendingInsights = insights.slice(0, 4);

export default function Insightspage() {
  const pageRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const visibleInsights = useMemo(
    () =>
      activeCategory === ALL_CATEGORIES
        ? insights
        : insights.filter((insight) => insight.category === activeCategory),
    [activeCategory],
  );

  const selectCategory = (category) => {
    setActiveCategory(category);
    document
      .getElementById("latest-insights")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  return (
    <div className="insights-page" ref={pageRef}>
      <main>
        <NewHeroSection
          id="insights-page-title"
          title="Insights & Perspectives"
          description="Regulatory updates, expert perspectives, and practical guidance on data protection, governance, privacy, and taxation from RAPT & Co."
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
                  {featuredInsight.publishDate ? <span>{featuredInsight.publishDate}</span> : null}
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
                    {[ALL_CATEGORIES, ...insightCategories].map((category) => (
                      <button
                        type="button"
                        className={category === activeCategory ? "is-active" : undefined}
                        aria-pressed={isDuplicate ? undefined : category === activeCategory}
                        onClick={() => selectCategory(category)}
                        key={`${isDuplicate ? "duplicate" : "primary"}-${category}`}
                        tabIndex={isDuplicate ? -1 : undefined}
                      >
                        {category}
                      </button>
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
                Practical perspectives on data protection, governance, privacy,
                and taxation.
              </p>
            </header>

            <div className="latest-insights__grid">
              {visibleInsights.map((insight) => (
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
          className="insights-resources-page insights-page__section insights-page__reveal"
          aria-labelledby="resources-title"
        >
          <div className="insights-page__container">
            <header className="insights-section-heading insights-page__stagger">
              <span className="insights-label">RESOURCES</span>
              <h2 id="resources-title">Knowledge You Can Put to Work.</h2>
            </header>
            <div className="insights-resources-page__grid">
              <article className="resource-card insights-page__stagger">
                <FaRegFilePdf aria-hidden="true" />
                <h3>RAPT &amp; Co. Company Profile</h3>
                <p>
                  Our services, engagement model, pricing models, trust and
                  safeguard framework, and leadership team (PDF).
                </p>
                <a href="/company-profile.pdf" download="RAPT-and-Co-Company-Profile.pdf">
                  Download <FaDownload aria-hidden="true" />
                </a>
              </article>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
