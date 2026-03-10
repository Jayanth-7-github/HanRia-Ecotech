import Card from "../components/Card.jsx";
import { innovationAreas } from "../data/siteData.js";
import { useEffect, useState } from "react";
import { apiUrl } from "../api.js";

function StatementIcon({ name }) {
  const common = {
    className: "h-6 w-6 text-emerald-700",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (name === "mission") {
    return (
      <svg
        {...common}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
      </svg>
    );
  }

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
}

function StatementCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-2">
          <StatementIcon name={icon} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const [siteContent, setSiteContent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/site-content"));
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) return;
        if (!cancelled) setSiteContent(data.content ?? null);
      } catch {
        // Ignore; keep default copy.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const missionText =
    String(siteContent?.mission ?? "").trim() ||
    "Build practical eco-material alternatives by transforming agricultural waste into sustainable, high-performance materials for real-world products.";
  const visionText =
    String(siteContent?.vision ?? "").trim() ||
    "A future where nature’s waste becomes a mainstream input for manufacturing—powering circular supply chains and cleaner industries.";

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-50 via-white to-stone-50" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              About
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              About HanRia Eco Tech
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
              HanRia Eco Tech converts agricultural waste into eco-friendly
              materials engineered for modern products. We focus on natural
              fiber composites and sustainable material engineering to help
              industries reduce plastic use and lower environmental impact.
            </p>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <StatementCard
            icon="mission"
            title="Company mission"
            description={missionText}
          />
          <StatementCard
            icon="vision"
            title="Company vision"
            description={visionText}
          />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              title: "Practical innovation",
              description:
                "We focus on solutions that can move from research to real products without unnecessary complexity.",
            },
            {
              title: "Nature-first materials",
              description:
                "We prioritize renewable inputs and circular thinking—turning residues into reliable material streams.",
            },
            {
              title: "Partner-ready",
              description:
                "We collaborate with teams to validate performance, improve manufacturability, and support adoption.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-stone-900">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Our story
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Every harvest creates a new wave of agricultural residues. When
              treated as waste, these materials often end up burned or
              discarded—adding environmental pressure.
            </p>
            <p className="mt-4 text-base leading-7 text-stone-600">
              At HanRia Eco Tech, we view these residues as future-ready raw
              inputs. With the right engineering, natural fibers can be
              transformed into materials that fit modern
              manufacturing—supporting a more circular economy.
            </p>
          </div>
        </div>
      </section>

      {/* Core focus areas */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Core focus areas
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-600">
            Our work spans research and engineering—from material formulation to
            application-focused development.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {innovationAreas.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      {/* Sustainability impact */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950 via-emerald-900 to-stone-950" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Sustainability impact
            </h2>
            <p className="mt-4 text-base leading-7 text-emerald-50/90">
              Our impact is driven by replacing fossil-based materials and
              capturing value from residues—supporting cleaner products and
              responsible supply chains.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-emerald-50/90">
              <li className="flex gap-2">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300"
                  aria-hidden="true"
                />
                <span className="leading-6">
                  Reduces agricultural residue waste through upcycling and reuse
                </span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300"
                  aria-hidden="true"
                />
                <span className="leading-6">
                  Enables lower-impact alternatives to conventional plastics and
                  composites
                </span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300"
                  aria-hidden="true"
                />
                <span className="leading-6">
                  Supports circular manufacturing with renewable inputs
                </span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300"
                  aria-hidden="true"
                />
                <span className="leading-6">
                  Encourages sustainable design and engineering practices
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
