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
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-stone-900">{name}</p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
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
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
          Products
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Eco-Friendly Products Built From Agricultural Waste
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Explore product categories built on natural fibers and circular
          innovation. Select a category to view the product list.
        </p>
      </div>

      <section className="mt-10">
        <div className="max-w-3xl">
          <label
            className="text-sm font-medium text-stone-700"
            htmlFor="search"
          >
            Search products
          </label>
          <input
            id="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or description"
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const isActive = category.category_name === activeCategory;
            return (
              <div
                key={category._id}
                className={
                  "rounded-2xl border bg-white p-6 shadow-sm " +
                  (isActive
                    ? "border-emerald-300 ring-1 ring-emerald-200"
                    : "border-stone-200")
                }
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl bg-emerald-50 p-2">
                    <CategoryIcon kind={kindFromName(category.category_name)} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-stone-900">
                      {category.category_name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {category.description}
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveCategory(category.category_name)
                        }
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
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
          <p className="mt-4 text-sm text-stone-700" role="alert">
            {error}
          </p>
        ) : null}
      </section>

      <section className="mt-14">
        {!activeCategoryObj && !q ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
            Select a category to view products.
          </div>
        ) : (
          <>
            <div className="max-w-3xl">
              {activeCategoryObj ? (
                <>
                  <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
                    {activeCategoryObj.category_name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {activeCategoryObj.description}
                  </p>
                </>
              ) : (
                <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
                  Search results
                </h2>
              )}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
                  Loading products…
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
                  No products found.
                </div>
              ) : (
                products.map((product) => (
                  <Link key={product._id} to={`/products/${product._id}`}>
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

      <section className="mt-16 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="bg-linear-to-r from-emerald-50 via-white to-stone-50 p-8 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                Want a product recommendation?
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-600">
                Share your use case and target requirements. We’ll suggest the
                best category and a clear next step for evaluation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
              >
                Contact Us
              </Link>
              <a
                href="mailto:info@hanriaecotech.com?subject=Products%20Inquiry%20%E2%80%94%20HanRia%20Eco%20Tech"
                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50"
              >
                Email Products Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
