import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteFooter from "./SiteFooter.jsx";

export default function SiteLayout({ children }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/technology", label: "Technology" },
    { to: "/products", label: "Products" },
    { to: "/services", label: "Services" },
    { to: "/training", label: "Training" },
    { to: "/contact", label: "Get in Touch", cta: true },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // Simple reveal-on-scroll animation for elements with .reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    const observeReveal = (element) => {
      if (!(element instanceof Element)) return;
      if (!element.classList.contains("reveal")) return;
      if (element.classList.contains("visible")) return;
      observer.observe(element);
    };

    const elements = document.querySelectorAll(".reveal");
    elements.forEach(observeReveal);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          observeReveal(node);
          node.querySelectorAll?.(".reveal").forEach(observeReveal);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <nav className={`site-nav${isMenuOpen ? " is-open" : ""}`}>
        <div className="nav-bar">
          <Link
            to="/"
            className="nav-logo"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="nav-logo-emblem">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2C6 2 2 8 2 12s4 10 10 10 10-4 10-10S18 2 12 2" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            HanRia <span>Eco Tech</span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-controls="mobile-site-nav-links"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="nav-panel">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={item.cta ? "nav-cta" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <button
        type="button"
        className={`mobile-nav-overlay${isMenuOpen ? " is-open" : ""}`}
        aria-label="Close navigation menu"
        onClick={() => setIsMenuOpen(false)}
      />

      <aside
        className={`mobile-nav-panel${isMenuOpen ? " is-open" : ""}`}
        aria-hidden={!isMenuOpen}
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav-header">
          <h2 className="mobile-nav-title">Menu</h2>
          <button
            type="button"
            className="mobile-nav-close"
            aria-label="Close navigation menu"
            onClick={() => setIsMenuOpen(false)}
          >
            X
          </button>
        </div>

        <ul className="mobile-nav-links" id="mobile-site-nav-links">
          {navItems.map((item) => (
            <li key={item.to} className="mobile-nav-item">
              <Link
                to={item.to}
                className={`mobile-nav-link${item.cta ? " is-cta" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main>{children}</main>

      <SiteFooter />
    </>
  );
}
