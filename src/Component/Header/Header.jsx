import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LuGlobe } from "react-icons/lu";
import "./Header.css";

const navigation = [
  { label: "Expertise", to: "/expertise" },
  { label: "Insights", to: "/insights" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location]);

  return (
    <header className={`site-header${isMenuOpen ? " is-menu-open" : ""}`}>
      <NavLink className="site-header__logo" to="/" onClick={closeMenu}>
        RAPT &amp; Co
      </NavLink>

      <div
        className="site-header__expandable"
        id="site-header-mobile-content"
      >
        <div className="site-header__expandable-inner">
          <nav className="site-header__nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink
                className={() => (
                  `${location.pathname}${location.hash}` === item.to
                    ? "is-active"
                    : ""
                )}
                to={item.to}
                onClick={closeMenu}
                key={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <span className="site-header__language">
              <LuGlobe aria-hidden="true" />
              <span>English</span>
            </span>
            <NavLink
              className="site-header__demo"
              to="/contact#get-in-touch"
              onClick={closeMenu}
            >
              Book demo
            </NavLink>
          </div>
        </div>
      </div>

      <button
        className="site-header__menu-toggle"
        type="button"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        aria-controls="site-header-mobile-content"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </header>
  );
}
