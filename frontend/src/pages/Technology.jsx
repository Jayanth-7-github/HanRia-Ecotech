import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiUrl } from "../api.js";

function TechIcon({ name }) {
  const common = {
    className: "h-6 w-6 text-emerald-700",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (name) {
    case "fiber":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17c3-1 7-5 10-10" />
          <path d="M6 7c3 0 6 3 6 6 0 3-3 6-6 6" />
          <path d="M18 6c-3 0-6 3-6 6 0 3 3 6 6 6" />
        </svg>
      );
    case "agro":
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
          <path d="M6 20c3-2 9-2 12 0" />
        </svg>
      );
    case "engineering":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2h4" />
          <path d="M12 2v4" />
          <path d="M8 6h8" />
          <path d="M9 6l-2 4a6 6 0 0 0 5 9 6 6 0 0 0 5-9l-2-4" />
          <path d="M10 13h4" />
        </svg>
      );
    case "printing":
    default:
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 8V4h10v4" />
          <path d="M7 17h10" />
          <path d="M6 12h12" />
          <path d="M8 12v8h8v-8" />
        </svg>
      );
  }
}

function Illustration({ variant }) {
  const base = "rounded-2xl border border-stone-200 bg-white p-6 shadow-sm";

  if (variant === "fiber") {
    return (
      <div className={base} aria-hidden="true">
        <div className="rounded-xl bg-emerald-50 p-4">
          <svg
            viewBox="0 0 360 180"
            className="h-36 w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 120c60-60 120-60 180 0s120 60 160 20"
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              opacity="0.9"
            />
            <path
              d="M20 140c70-70 140-70 210 0s100 70 130 35"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              opacity="0.7"
            />
            <circle cx="82" cy="86" r="6" fill="#065f46" opacity="0.35" />
            <circle cx="168" cy="78" r="9" fill="#065f46" opacity="0.25" />
            <circle cx="258" cy="106" r="7" fill="#065f46" opacity="0.22" />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === "agro") {
    return (
      <div className={base} aria-hidden="true">
        <div className="rounded-xl bg-amber-50 p-4">
          <svg
            viewBox="0 0 360 180"
            className="h-36 w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M80 140c50-40 90-60 120-60s70 20 120 60"
              fill="none"
              stroke="#16a34a"
              strokeWidth="3"
              opacity="0.9"
            />
            <path
              d="M180 120V62"
              fill="none"
              stroke="#15803d"
              strokeWidth="3"
            />
            <path
              d="M180 62c-22 0-40 18-40 40 22 0 40-18 40-40Z"
              fill="#34d399"
              opacity="0.7"
            />
            <path
              d="M180 62c22 0 40 18 40 40-22 0-40-18-40-40Z"
              fill="#10b981"
              opacity="0.65"
            />
            <circle cx="96" cy="132" r="6" fill="#065f46" opacity="0.25" />
            <circle cx="264" cy="132" r="6" fill="#065f46" opacity="0.25" />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === "engineering") {
    return (
      <div className={base} aria-hidden="true">
        <div className="rounded-xl bg-stone-50 p-4">
          <svg
            viewBox="0 0 360 180"
            className="h-36 w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="60"
              y="40"
              width="240"
              height="110"
              rx="18"
              fill="#ecfdf5"
            />
            <path
              d="M110 130c20-35 40-55 70-55s55 20 70 55"
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              opacity="0.9"
            />
            <path
              d="M120 65h120"
              stroke="#10b981"
              strokeWidth="2"
              opacity="0.65"
            />
            <path
              d="M120 85h90"
              stroke="#10b981"
              strokeWidth="2"
              opacity="0.55"
            />
            <path
              d="M120 105h110"
              stroke="#10b981"
              strokeWidth="2"
              opacity="0.45"
            />
            <circle cx="255" cy="86" r="18" fill="#d1fae5" />
            <path
              d="M255 75v22"
              stroke="#047857"
              strokeWidth="3"
              opacity="0.75"
            />
            <path
              d="M244 86h22"
              stroke="#047857"
              strokeWidth="3"
              opacity="0.75"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={base} aria-hidden="true">
      <div className="rounded-xl bg-emerald-50 p-4">
        <svg
          viewBox="0 0 360 180"
          className="h-36 w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M70 130l60-70h100l60 70"
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            opacity="0.9"
          />
          <path
            d="M130 60v70"
            stroke="#10b981"
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M230 60v70"
            stroke="#10b981"
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M115 95h130"
            stroke="#10b981"
            strokeWidth="2"
            opacity="0.55"
          />
          <circle cx="180" cy="55" r="10" fill="#065f46" opacity="0.25" />
          <circle cx="150" cy="145" r="8" fill="#065f46" opacity="0.2" />
          <circle cx="210" cy="145" r="8" fill="#065f46" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
}

export default function Technology() {
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/site-content"));
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) return;
        const list = Array.isArray(data?.content?.technologies)
          ? data.content.technologies
          : [];
        if (!cancelled) setTechnologies(list);
      } catch {
        // Ignore; page still works with static content.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sections = [
    {
      key: "fiber",
      title: "Natural Fiber Composite Materials",
      icon: "fiber",
      description:
        "We combine plant-based fibers with engineered binders to create composites that balance strength, weight, and sustainability for modern applications.",
      illustration: "fiber",
    },
    {
      key: "agro",
      title: "Agro Waste Utilization",
      icon: "agro",
      description:
        "Agricultural residues become valuable raw inputs. Our processes help reduce waste while enabling circular supply chains that are cleaner and more resilient.",
      illustration: "agro",
    },
    {
      key: "engineering",
      title: "Sustainable Material Engineering",
      icon: "engineering",
      description:
        "We design formulations for performance and scale—optimizing material behavior, manufacturability, and footprint to replace conventional plastics and composites.",
      illustration: "engineering",
    },
    {
      key: "printing",
      title: "Advanced 3D Printed Natural Fiber Technologies",
      icon: "printing",
      description:
        "We develop printable natural fiber feedstocks and composite concepts for additive manufacturing—supporting rapid prototyping and next-generation sustainable production.",
      illustration: "printing",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-50 via-white to-stone-50" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Technology
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Sustainable Material Innovation
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
              HanRia Eco Tech builds eco-material solutions by turning
              agricultural waste and natural fibers into engineered materials
              for real products—designed for performance, scalability, and a
              lower environmental footprint.
            </p>

            {technologies.length > 0 ? (
              <div className="mt-8">
                <p className="text-sm font-semibold text-stone-900">
                  Technologies
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-900"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Technology sections */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="space-y-12">
          {sections.map((section, index) => {
            const reverse = index % 2 === 1;

            return (
              <div
                key={section.key}
                className="grid items-center gap-8 lg:grid-cols-2"
              >
                <div className={reverse ? "lg:order-2" : ""}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-900">
                    <TechIcon name={section.icon} />
                    Innovation Area
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-stone-600">
                    {section.description}
                  </p>
                </div>

                <div className={reverse ? "lg:order-1" : ""}>
                  <Illustration variant={section.illustration} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-emerald-900 to-stone-950" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Bring eco-material innovation into your product.
            </h2>
            <p className="mt-4 text-base leading-7 text-emerald-50/90">
              If you have performance targets or a specific application, we can
              help translate material concepts into a practical plan.
            </p>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
