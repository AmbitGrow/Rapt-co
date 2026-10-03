import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./Component/ScrollToTop";
import PageMeta from "./Component/PageMeta";
import Newheader from "./Component/Header/Newheader";
import "./App.css";

const NewHomepage = lazy(() => import("./Pages/Homepage/NewHomepage"));
const Aboutpage = lazy(() => import("./Pages/Aboutpage/Aboutpage"));
const Servicepage = lazy(() => import("./Pages/Servicepage/Servicepage"));
const Insightspage = lazy(() => import("./Pages/Insightspage/Insightspage"));
const InsightDetail = lazy(() => import("./Pages/Insightspage/InsightDetail"));
const Contactpage = lazy(() => import("./Pages/Contactpage/Contactpage"));

// Mounted once so the active pill can glide between routes instead of remounting.
const NEW_HEADER_PATHS = ["/", "/expertise", "/insights", "/about", "/contact"];

function PersistentHeader() {
  const { pathname } = useLocation();
  return NEW_HEADER_PATHS.includes(pathname) ? <Newheader /> : null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <PageMeta />
      <PersistentHeader />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<NewHomepage />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path="/expertise" element={<Servicepage />} />
          <Route path="/insights" element={<Insightspage />} />
          <Route path="/insights/:slug" element={<InsightDetail />} />
          <Route path="/contact" element={<Contactpage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
