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
    <div className="about-statement-card reveal">
      <div className="about-statement-row">
        <div className="about-statement-icon">
          <StatementIcon name={icon} />
        </div>
        <div className="about-statement-copy">
          <h2>{title}</h2>
          <p>{description}</p>
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
      <section className="about">
        <p className="section-eyebrow">About</p>
        <h1 className="section-title">About HanRia Eco Tech</h1>
        <p className="section-desc">
          HanRia Eco Tech converts agricultural waste into eco-friendly
          materials engineered for modern products. We focus on natural fiber
          composites and sustainable material engineering to help industries
          reduce plastic use and lower environmental impact.
        </p>
      </section>

      {/* Mission + Vision */}
      <section className="about-page-section">
        <div className="about-page-wrap">
          <div className="about-statement-grid">
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

          <div className="about-pillars-grid">
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
              <article key={item.title} className="about-pillar-card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="about-story-section">
        <div className="about-page-wrap">
          <div className="about-story-copy reveal">
            <p className="section-eyebrow">Our Story</p>
            <h2 className="section-title">
              Turning agricultural residues into material value
            </h2>
            <p>
              Every harvest creates a new wave of agricultural residues. When
              treated as waste, these materials often end up burned or
              discarded, adding environmental pressure and missing the chance to
              become useful industrial inputs.
            </p>
            <p>
              At HanRia Eco Tech, we view these residues as future-ready raw
              inputs. With the right engineering, natural fibers can be
              transformed into materials that fit modern manufacturing,
              supporting a more circular economy with less waste and more local
              material value.
            </p>
          </div>
        </div>
      </section>

      {/* Core focus areas */}
      <section className="about-page-section about-focus-section">
        <div className="about-page-wrap">
          <div className="about-focus-head reveal">
            <p className="section-eyebrow">Focus Areas</p>
            <h2 className="section-title">Core focus areas</h2>
            <p className="section-desc">
              Our work spans research and engineering—from material formulation
              to application-focused development.
            </p>
          </div>
          <div className="about-focus-grid">
            {innovationAreas.map((item, index) => (
              <article
                key={item.title}
                className={`about-focus-card reveal${index % 3 === 1 ? " reveal-d1" : index % 3 === 2 ? " reveal-d2" : ""}`}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability impact */}
      <section className="about-impact">
        <div className="about-impact-inner">
          <div className="about-impact-copy reveal">
            <p className="section-eyebrow about-impact-eyebrow">
              Sustainability
            </p>
            <h2 className="section-title about-impact-title">
              Sustainability impact
            </h2>
            <p className="about-impact-desc">
              Our impact is driven by replacing fossil-based materials and
              capturing value from residues—supporting cleaner products and
              responsible supply chains.
            </p>
            <ul className="about-impact-list">
              <li className="about-impact-item">
                <span className="about-impact-dot" aria-hidden="true" />
                <span>
                  Reduces agricultural residue waste through upcycling and reuse
                </span>
              </li>
              <li className="about-impact-item">
                <span className="about-impact-dot" aria-hidden="true" />
                <span>
                  Enables lower-impact alternatives to conventional plastics and
                  composites
                </span>
              </li>
              <li className="about-impact-item">
                <span className="about-impact-dot" aria-hidden="true" />
                <span>
                  Supports circular manufacturing with renewable inputs
                </span>
              </li>
              <li className="about-impact-item">
                <span className="about-impact-dot" aria-hidden="true" />
                <span>
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
