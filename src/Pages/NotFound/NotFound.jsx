import { Link } from "react-router-dom";
import Header from "../../Component/Header/Header";
import Footer from "../../Component/Footer/Footer";
import "../Insightspage/InsightDetail.css";

// Shown for unknown URLs (meta + noindex handled by PageMeta). Reuses the article "not found" styling.
export default function NotFound() {
  return (
    <div className="insight-detail insight-detail--missing">
      <Header />
      <main>
        <span>404</span>
        <h1>Page Not Found</h1>
        <p>The page you requested is unavailable or may have moved.</p>
        <Link to="/">Return to Home</Link>
      </main>
      <Footer />
    </div>
  );
}
