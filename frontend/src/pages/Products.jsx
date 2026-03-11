import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../api.js";

function CategoryIcon({ kind }) {
  const common = {
    className: "h-6 w-6 text-emerald-700",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (kind) {
    case "construction":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20V9l8-5 8 5v11" />
          <path d="M9 20v-7h6v7" />
        </svg>
      );
    case "furniture":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 12V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" />
          <path d="M6 12h12" />
          <path d="M7 12v6" />
          <path d="M17 12v6" />
        </svg>
      );
    case "safety":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l7 4v6c0 5-3.5 8-7 8s-7-3-7-8V7l7-4Z" />
          <path d="M9.5 12l1.8 1.8L14.8 10" />
        </svg>
      );
    case "packaging":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 8l-9 5-9-5" />
          <path d="M3 8v10l9 5 9-5V8" />
          <path d="M12 13v10" />
        </svg>
      );
    case "consumer":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 7h10l-1 13H8L7 7Z" />
          <path d="M9 7a3 3 0 0 1 6 0" />
        </svg>
      );
    case "agri":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21v-7" />
          <path d="M7 14c0-3 2.5-6 5-9 2.5 3 5 6 5 9" />
          <path d="M9 14h6" />
        </svg>
      );
    case "textile":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 4h10v16H7z" />
          <path d="M9 7h6" />
          <path d="M9 10h6" />
          <path d="M9 13h6" />
        </svg>
      );
    case "energy":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6Z" />
        </svg>
      );
    case "automotive":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 16l1-4a3 3 0 0 1 3-2h6a3 3 0 0 1 3 2l1 4" />
          <path d="M7 16h10" />
          <path d="M7 16v3" />
          <path d="M17 16v3" />
          <path d="M7.5 13h.01" />
          <path d="M16.5 13h.01" />
        </svg>
      );
    case "research":
    default:
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 3h4" />
          <path d="M12 3v6" />
          <path d="M8 9h8" />
          <path d="M9 9l-2 4a6 6 0 0 0 5 8 6 6 0 0 0 5-8l-2-4" />
        </svg>
      );
  }
}

function ProductCard({ name, description }) {
  return (
    <div className="products-result-card">
      <p className="products-result-title">{name}</p>
      {description ? (
        <p className="products-result-desc">{description}</p>
      ) : null}
    </div>
  );
}

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const kindFromName = useMemo(() => {
    return (name) => {
      const lower = String(name ?? "").toLowerCase();
      if (lower.includes("construction")) return "construction";
      if (lower.includes("furniture") || lower.includes("interior"))
        return "furniture";
      if (lower.includes("safety") || lower.includes("helmet")) return "safety";
      if (lower.includes("packaging")) return "packaging";
      if (lower.includes("consumer")) return "consumer";
      if (lower.includes("agri") || lower.includes("farm")) return "agri";
      if (lower.includes("textile")) return "textile";
      if (lower.includes("energy") || lower.includes("environment"))
        return "energy";
      if (lower.includes("automotive")) return "automotive";
      return "research";
    };
  }, []);

  const activeCategoryObj =
    categories.find((c) => c.category_name === activeCategory) ?? null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError("");
        const res = await fetch(apiUrl("/api/categories"));
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok)
          throw new Error(data?.error || "Failed to load categories");
        if (!cancelled) setCategories(data.categories ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load categories");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams();
        if (activeCategory) params.set("category", activeCategory);
        if (q) params.set("q", q);
        const res = await fetch(apiUrl(`/api/products?${params.toString()}`));
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok)
          throw new Error(data?.error || "Failed to load products");
        if (!cancelled) setProducts(data.products ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeCategory, q]);

  return (
    <main className="products-page">
      <div className="products-page-wrap">
        <div className="products-page-head">
          <p className="section-eyebrow">Products</p>
          <h1 className="section-title">
            Eco-Friendly Products Built From Agricultural Waste
          </h1>
          <p className="section-desc">
            Explore product categories built on natural fibers and circular
            innovation. Select a category to view the product list.
          </p>
        </div>

        <section className="products-search-section">
          <div className="products-search-head">
            <label className="products-search-label" htmlFor="search">
              Search products
            </label>
            <input
              id="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or description"
              className="products-search-input"
            />
          </div>

          <div className="products-category-grid">
            {categories.map((category) => {
              const isActive = category.category_name === activeCategory;
              return (
                <div
                  key={category._id}
                  className={`products-category-card${isActive ? " is-active" : ""}`}
                >
                  <div className="products-category-row">
                    <div className="products-category-icon">
                      <CategoryIcon
                        kind={kindFromName(category.category_name)}
                      />
                    </div>
                    <div className="products-category-copy">
                      <h2>{category.category_name}</h2>
                      <p>{category.description}</p>
                      <div className="products-category-action">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveCategory(category.category_name)
                          }
                          className="products-category-button"
                        >
                          View Products
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {error ? (
            <p className="products-page-error" role="alert">
              {error}
            </p>
          ) : null}
        </section>

        <section className="products-results-section">
          {!activeCategoryObj && !q ? (
            <div className="products-empty-state">
              Select a category to view products.
            </div>
          ) : (
            <>
              <div className="products-results-head">
                {activeCategoryObj ? (
                  <>
                    <h2>{activeCategoryObj.category_name}</h2>
                    <p>{activeCategoryObj.description}</p>
                  </>
                ) : (
                  <h2>Search results</h2>
                )}
              </div>

              <div className="products-result-grid">
                {loading ? (
                  <div className="products-empty-state">Loading products…</div>
                ) : products.length === 0 ? (
                  <div className="products-empty-state">No products found.</div>
                ) : (
                  products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="products-result-link"
                    >
                      <ProductCard
                        name={product.name}
                        description={product.description}
                      />
                    </Link>
                  ))
                )}
              </div>
            </>
          )}
        </section>

        <section className="products-cta-shell">
          <div className="products-cta-card">
            <div className="products-cta-copy">
              <h2>Want a product recommendation?</h2>
              <p>
                Share your use case and target requirements. We’ll suggest the
                best category and a clear next step for evaluation.
              </p>
            </div>
            <div className="products-cta-actions">
              <Link to="/contact" className="btn-forest">
                Contact Us
              </Link>
              <a
                href="mailto:info@hanriaecotech.com?subject=Products%20Inquiry%20%E2%80%94%20HanRia%20Eco%20Tech"
                className="btn-outline-forest"
              >
                Email Products Team
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
