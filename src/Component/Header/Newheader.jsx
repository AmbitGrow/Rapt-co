import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Newheader.css";

const navigation = [
  { label: "Home", to: "/", match: (p) => p === "/" },
  {
    label: "Expertise",
    to: "/expertise",
    match: (p) => p === "/expertise",
  },
  { label: "Insights", to: "/insights", match: (p) => p.startsWith("/insights") },
  { label: "About", to: "/about", match: (p) => p === "/about" },
  { label: "Contact", to: "/contact", match: (p) => p === "/contact" },
];

export default function Newheader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const navRef = useRef(null);
  const [pill, setPill] = useState({ x: 0, width: 0, visible: false });
  const [pillReady, setPillReady] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // One shared pill: measure the active link and slide to it.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    const measure = () => {
      const active = nav.querySelector("a.is-active");
      setPill(
        active
          ? { x: active.offsetLeft, width: active.offsetWidth, visible: true }
          : (current) => ({ ...current, visible: false }),
      );
    };

    measure();
    const observer =
      "ResizeObserver" in window ? new ResizeObserver(measure) : null;
    observer?.observe(nav);
    document.fonts?.ready.then(measure);
    return () => observer?.disconnect();
  }, [pathname]);

  // Enable the transition only after the first placement, so no initial jump.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setPillReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!hash) return;
    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pathname, hash]);

  return (
    <header className={`new-header${isMenuOpen ? " is-menu-open" : ""}`}>
      <NavLink className="new-header__logo" to="/" onClick={closeMenu} aria-label="RAPT & Co.">
        R A P T &amp; CO
      </NavLink>

      <div className="new-header__panel" id="new-header-panel">
        <nav
          className="new-header__nav"
          aria-label="Primary navigation"
          ref={navRef}
        >
          <span
            className={`new-header__active-pill${pillReady ? " is-ready" : ""}`}
            aria-hidden="true"
            style={{
              width: pill.width,
              opacity: pill.visible ? 1 : 0,
              transform: `translateX(${pill.x}px)`,
            }}
          />
          {navigation.map((item) => {
            const active = item.match(pathname);
            return (
              <NavLink
                className={active ? "is-active" : ""}
                to={item.to}
                aria-current={active ? "page" : undefined}
                onClick={closeMenu}
                key={item.label}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <NavLink
          className="new-header__demo"
          to="/contact#get-in-touch"
          onClick={closeMenu}
        >
          Book a Consultation
        </NavLink>
      </div>

      <button
        className="new-header__toggle"
        type="button"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        aria-controls="new-header-panel"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </header>
  );
}
