import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaLinkedinIn,
  FaLink,
} from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../../Component/Header/Header";
import Footer from "../../Component/Footer/Footer";
import RelatedInsights from "../../Components/RelatedInsights";
import { CallToAction } from "../Homepage/Homepage";
import { getInsightBySlug, insights } from "../../Data/insights";
import { absoluteUrl } from "../../Data/seo";
import "./Insightspage.css";
import "./InsightDetail.css";

gsap.registerPlugin(ScrollTrigger);

function setMetaTag(selector, attributes) {
  let element = document.head.querySelector(selector);
  const created = !element;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  const previous = {};
  Object.entries(attributes).forEach(([name, value]) => {
    previous[name] = element.getAttribute(name);
    element.setAttribute(name, value);
  });
  return () => {
    if (created) {
      element.remove();
      return;
    }
    Object.entries(previous).forEach(([name, value]) => {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    });
  };
}

function ArticleContent({ block }) {
  if (block.type === "heading") {
    return <h2 id={block.id}>{block.text}</h2>;
  }
  if (block.type === "paragraph") {
    return <p>{block.text}</p>;
  }
  if (block.type === "list") {
    return (
      <ul>
        {block.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    );
  }
  if (block.type === "highlight") {
    return (
      <aside className="insight-article__highlight">
        <strong>{block.title}</strong>
        <p>{block.text}</p>
      </aside>
    );
  }
  if (block.type === "image") {
    return (
      <figure className="insight-article__image">
        <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
        {block.caption ? <figcaption>{block.caption}</figcaption> : null}
      </figure>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="insight-article__quote">
        <p>{block.text}</p>
        <cite>{block.attribution}</cite>
      </blockquote>
    );
  }
  if (block.type === "source") {
    return (
      <p>
        <a href={block.href} target="_blank" rel="noopener noreferrer">
          {block.label}
        </a>
      </p>
    );
  }
  return null;
}

export default function InsightDetail() {
  const { slug } = useParams();
  const article = useMemo(() => getInsightBySlug(slug), [slug]);
  const pageRef = useRef(null);
  const progressRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const articleIndex = article
    ? insights.findIndex((item) => item.slug === article.slug)
    : -1;
  const previousArticle = articleIndex > 0 ? insights[articleIndex - 1] : null;
  const nextArticle =
    articleIndex >= 0 && articleIndex < insights.length - 1
      ? insights[articleIndex + 1]
      : null;

  useEffect(() => {
    if (!article) return undefined;
    const previousTitle = document.title;
    const canonicalUrl = absoluteUrl(`/insights/${article.slug}`);
    document.title = `${article.seo.title} | RAPT & Co.`;

    const cleanups = [
      setMetaTag('meta[name="description"]', {
        name: "description",
        content: article.seo.description,
      }),
      setMetaTag('meta[property="og:title"]', {
        property: "og:title",
        content: article.seo.title,
      }),
      setMetaTag('meta[property="og:description"]', {
        property: "og:description",
        content: article.seo.description,
      }),
      setMetaTag('meta[property="og:type"]', {
        property: "og:type",
        content: "article",
      }),
      setMetaTag('meta[name="twitter:title"]', {
        name: "twitter:title",
        content: article.seo.title,
      }),
      setMetaTag('meta[name="twitter:description"]', {
        name: "twitter:description",
        content: article.seo.description,
      }),
    ];
    if (canonicalUrl) {
      cleanups.push(
        setMetaTag('meta[property="og:url"]', {
          property: "og:url",
          content: canonicalUrl,
        }),
      );
    }

    const jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.seo.description,
      articleSection: article.category,
      publisher: { "@type": "Organization", name: "RAPT & Co." },
      ...(canonicalUrl ? { mainEntityOfPage: canonicalUrl } : {}),
    });
    document.head.appendChild(jsonLd);
    cleanups.push(() => jsonLd.remove());

    if (!canonicalUrl) {
      return () => {
        document.title = previousTitle;
        cleanups.forEach((cleanup) => cleanup());
      };
    }

    let canonical = document.head.querySelector('link[rel="canonical"]');
    const canonicalCreated = !canonical;
    const previousCanonical = canonical?.getAttribute("href");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    return () => {
      document.title = previousTitle;
      cleanups.forEach((cleanup) => cleanup());
      if (canonicalCreated) canonical.remove();
      else if (previousCanonical) canonical.setAttribute("href", previousCanonical);
      else canonical.removeAttribute("href");
    };
  }, [article]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [article]);

  useLayoutEffect(() => {
    if (!article) return undefined;
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        [
          ".insight-detail-hero__breadcrumb",
          ".insight-detail-hero__category",
          ".insight-detail-hero h1",
          ".insight-detail-hero__meta",
        ],
        { autoAlpha: 0, y: 35 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        },
      );

      gsap.utils.toArray(".insight-detail__reveal").forEach((section) => {
        const children = section.querySelectorAll(".insight-detail__stagger");
        gsap.fromTo(
          children.length ? children : section,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 84%",
              once: true,
            },
          },
        );
      });
    }, pageRef);
    return () => context.revert();
  }, [article]);

  useEffect(() => {
    if (article) return undefined;
    const previousTitle = document.title;
    document.title = "Insight Not Found | RAPT & Co.";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, [article]);

  if (!article) {
    return (
      <div className="insight-detail insight-detail--missing">
        <Header />
        <main>
          <span>INSIGHTS</span>
          <h1>Insight Not Found</h1>
          <p>The article you requested is unavailable or may have moved.</p>
          <Link to="/insights">Return to Insights</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const articleUrl =
    absoluteUrl(`/insights/${article.slug}`) ||
    `${window.location.origin}/insights/${article.slug}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): fall back to a prompt.
      window.prompt("Copy this link:", articleUrl);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="insight-detail" ref={pageRef}>
      <div className="insight-reading-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <Header />

      <main>
        <article>
          <header className="insight-detail-hero">
            <div className="insight-detail__container">
              <nav className="insight-detail-hero__breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span aria-hidden="true">/</span>
                <Link to="/insights">Insights</Link>
                <span aria-hidden="true">/</span>
                <span>{article.category}</span>
              </nav>
              <span className="insight-detail-hero__category">{article.category}</span>
              <h1>{article.title}</h1>
              <div className="insight-detail-hero__meta">
                {article.author ? <span>{article.author}</span> : null}
                {article.publishDate ? <time>{article.publishDate}</time> : null}
                {article.readingTime ? (
                  <span><LuClock3 aria-hidden="true" /> {article.readingTime}</span>
                ) : null}
              </div>
            </div>
          </header>

          {article.featuredImage ? (
            <div className="insight-detail-cover insight-detail__reveal">
              <div className="insight-detail__container">
                <img
                  className="insight-detail__stagger"
                  src={article.featuredImage}
                  alt={`Cover for ${article.title}`}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width="1200"
                />
              </div>
            </div>
          ) : null}

          <div className="insight-article insight-detail__reveal">
            <div className="insight-detail__container insight-article__layout">
              <aside className="insight-article__sidebar insight-detail__stagger">
                <nav aria-label="Table of contents">
                  <span>IN THIS ARTICLE</span>
                  {article.tableOfContents.map((item) => (
                    <a href={`#${item.id}`} key={item.id}>{item.label}</a>
                  ))}
                </nav>
                <div className="insight-share">
                  <span>SHARE</span>
                  <div>
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                    >
                      <FaLinkedinIn aria-hidden="true" />
                    </a>
                    <button type="button" onClick={copyLink} aria-label="Copy article link">
                      {copied ? <FaCheck aria-hidden="true" /> : <FaLink aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              </aside>

              <div className="insight-article__body insight-detail__stagger">
                <span className="insight-copy-status" role="status" aria-live="polite">
                  {copied ? "Link copied to clipboard." : ""}
                </span>
                {article.content
                  .filter((block) => block.type !== "quote")
                  .map((block, index) => (
                    <ArticleContent block={block} key={`${block.type}-${block.id ?? index}`} />
                  ))}

                <section className="insight-takeaways" aria-labelledby="key-takeaways-title">
                  <span>KEY TAKEAWAYS</span>
                  <h2 id="key-takeaways-title">What to Carry Forward</h2>
                  <ul>
                    {article.keyTakeaways.map((takeaway) => (
                      <li key={takeaway}><FaCheck aria-hidden="true" /> {takeaway}</li>
                    ))}
                  </ul>
                </section>

                {article.content
                  .filter((block) => block.type === "quote")
                  .map((block, index) => (
                    <ArticleContent block={block} key={`quote-${index}`} />
                  ))}
              </div>
            </div>
          </div>
        </article>

        <nav className="insight-article-nav insight-detail__reveal" aria-label="Article navigation">
          <div className="insight-detail__container">
            {previousArticle ? (
              <Link className="insight-detail__stagger" to={`/insights/${previousArticle.slug}`}>
                <FaArrowLeft aria-hidden="true" />
                <span><small>Previous Article</small>{previousArticle.title}</span>
              </Link>
            ) : <span />}
            {nextArticle ? (
              <Link className="insight-detail__stagger" to={`/insights/${nextArticle.slug}`}>
                <span><small>Next Article</small>{nextArticle.title}</span>
                <FaArrowRight aria-hidden="true" />
              </Link>
            ) : <span />}
          </div>
        </nav>

        <RelatedInsights article={article} />

        <CallToAction
          heading="Turn Insight Into Confident Action."
          description="Our advisors are ready to help you translate complex priorities into practical progress and sustainable value."
        />
      </main>
      <Footer />
    </div>
  );
}
