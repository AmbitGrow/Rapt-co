import { memo } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import fallbackArtwork from "../assets/ArticlesCard.webp";

const CARD_SIZES = "(max-width: 768px) 92vw, (max-width: 1100px) 46vw, 30vw";
const cardSrcSet = (article) =>
  article.cardImage
    ? `${article.cardImage} 720w, ${article.featuredImage} ${article.featuredImageWidth}w`
    : undefined;

const InsightCard = memo(function InsightCard({
  article,
  variant = "standard",
  number,
  className = "",
  layeredArtwork = false,
}) {
  if (variant === "trending") {
    return (
      <Link
        className={`trending-card ${className}`.trim()}
        to={`/insights/${article.slug}`}
      >
        <span className="trending-card__number">{number}</span>
        <span className="insights-card-category">{article.category}</span>
        <h3>{article.title}</h3>
        <div>
          <span>{article.readingTime}</span>
          <FaArrowRight aria-hidden="true" />
        </div>
      </Link>
    );
  }

  return (
    <article className={`insight-card ${className}`.trim()}>
      <Link
        className="insight-card__media"
        to={`/insights/${article.slug}`}
        aria-label={`Read ${article.title}`}
      >
        {layeredArtwork ? (
          <>
            {article.cardBackground ? (
              <img
                className="insight-card__background-image"
                src={article.cardBackground}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            {!article.featuredImage && !article.cardBackground ? (
              <img
                className="insight-card__background-image"
                src={fallbackArtwork}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            {article.featuredImage ? (
              <img
                className="insight-card__illustration"
                src={article.featuredImage}
                srcSet={cardSrcSet(article)}
                sizes={article.cardImage ? CARD_SIZES : undefined}
                alt={`Illustration for ${article.title}`}
                loading="lazy"
                decoding="async"
                width="1200"
                height="900"
              />
            ) : null}
          </>
        ) : (
          <img
            src={article.featuredImage || fallbackArtwork}
            srcSet={cardSrcSet(article)}
            sizes={article.cardImage ? CARD_SIZES : undefined}
            alt={article.featuredImage ? `Cover for ${article.title}` : ""}
            loading="lazy"
            decoding="async"
            width="1200"
            height="900"
          />
        )}
      </Link>
      <div className="insight-card__content">
        <span className="insights-card-category">{article.category}</span>
        <h3>
          <Link to={`/insights/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <div className="insight-card__footer">
          <div className="insights-card-meta">
            {article.readingTime ? <span>{article.readingTime}</span> : null}
            {article.publishDate ? <span>{article.publishDate}</span> : null}
          </div>
          <Link
            to={`/insights/${article.slug}`}
            aria-label={`Read ${article.title}`}
          >
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
});

export default InsightCard;
