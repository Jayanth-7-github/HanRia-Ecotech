import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiUrl } from "../api.js";

export default function Services() {
  const [apiServices, setApiServices] = useState([]);

  const [collabForm, setCollabForm] = useState({
    name: "",
    organization: "",
    email: "",
    research_area: "",
    proposal: null,
  });
  const [collabState, setCollabState] = useState("idle");
  const [collabMessage, setCollabMessage] = useState("");

  const [customForm, setCustomForm] = useState({
    company_name: "",
    email: "",
    industry: "",
    product_description: "",
    material_preference: "",
    attachment: null,
  });
  const [customState, setCustomState] = useState("idle");
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/services"));
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) return;
        if (!cancelled) setApiServices(data.services ?? []);
      } catch {
        // Ignore; fallback to static cards.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ServiceIcon = ({ name }) => {
    const common = {
      className: "h-6 w-6 text-emerald-700",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    };

    switch (name) {
      case "product":
        return (
          <svg
            {...common}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l8 4-8 4-8-4 8-4Z" />
            <path d="M20 10l-8 4-8-4" />
            <path d="M4 14l8 4 8-4" />
          </svg>
        );
      case "research":
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
      case "training":
        return (
          <svg
            {...common}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7l8-4 8 4-8 4-8-4Z" />
            <path d="M20 10v6" />
            <path d="M6 11v6c0 2 4 4 6 4s6-2 6-4v-6" />
          </svg>
        );
      case "consulting":
      default:
        return (
          <svg
            {...common}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.5 8.5 0 1 1-3.2-6.6" />
            <path d="M21 4v7h-7" />
          </svg>
        );
    }
  };

  const ServiceCard = ({ icon, title, description, bullets }) => (
    <div className="services-detail-card reveal">
      <div className="services-detail-row">
        <div className="services-detail-icon">
          <ServiceIcon name={icon} />
        </div>
        <div className="services-detail-copy">
          <h2>{title}</h2>
          <p>{description}</p>
          {Array.isArray(bullets) && bullets.length > 0 ? (
            <ul className="services-detail-list">
              {bullets.map((item) => (
                <li key={item} className="services-detail-item">
                  <span className="services-detail-dot" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );

  const iconCycle = ["product", "research", "training", "consulting"];

  const submitCollaboration = async (e) => {
    e.preventDefault();
    setCollabState("sending");
    setCollabMessage("");
    try {
      const fd = new FormData();
      fd.append("name", collabForm.name);
      fd.append("organization", collabForm.organization);
      fd.append("email", collabForm.email);
      fd.append("research_area", collabForm.research_area);
      if (collabForm.proposal) fd.append("proposal", collabForm.proposal);

      const res = await fetch(apiUrl("/api/collaboration/request"), {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Request submission failed");
      }
      setCollabState("success");
      setCollabMessage("Request submitted. We’ll get back to you soon.");
      setCollabForm({
        name: "",
        organization: "",
        email: "",
        research_area: "",
        proposal: null,
      });
    } catch (err) {
      setCollabState("error");
      setCollabMessage(err?.message || "Request submission failed");
    }
  };

  const submitCustomRequest = async (e) => {
    e.preventDefault();
    setCustomState("sending");
    setCustomMessage("");
    try {
      const fd = new FormData();
      fd.append("company_name", customForm.company_name);
      fd.append("email", customForm.email);
      fd.append("industry", customForm.industry);
      fd.append("product_description", customForm.product_description);
      fd.append("material_preference", customForm.material_preference);
      if (customForm.attachment) fd.append("attachment", customForm.attachment);

      const res = await fetch(apiUrl("/api/custom-request"), {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Request submission failed");
      }
      setCustomState("success");
      setCustomMessage("Request submitted. We’ll contact you soon.");
      setCustomForm({
        company_name: "",
        email: "",
        industry: "",
        product_description: "",
        material_preference: "",
        attachment: null,
      });
    } catch (err) {
      setCustomState("error");
      setCustomMessage(err?.message || "Request submission failed");
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="services-page-section">
        <div className="services-page-wrap">
          <div className="services-page-head">
            <p className="section-eyebrow">Services</p>
            <h1 className="section-title">Sustainable Innovation Services</h1>
            <p className="section-desc">
              We help partners turn sustainable material ideas into real-world
              products—from R&amp;D and prototyping to training and consultancy.
            </p>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="services-page-section services-card-section">
        <div className="services-page-wrap services-card-grid">
          {apiServices.length > 0
            ? apiServices.map((s, idx) => (
                <ServiceCard
                  key={s._id}
                  icon={iconCycle[idx % iconCycle.length]}
                  title={s.title}
                  description={s.description || ""}
                />
              ))
            : [
                {
                  icon: "product",
                  title: "Customized Product Development",
                  description:
                    "End-to-end support to design, prototype, and validate sustainable material products.",
                  bullets: [
                    "Material selection & formulation",
                    "Prototype development & testing",
                    "Manufacturing readiness support",
                  ],
                },
                {
                  icon: "research",
                  title: "Research & Innovation Collaboration",
                  description:
                    "Partner with us on applied research to accelerate eco-material innovation and performance.",
                  bullets: [
                    "Joint R&D projects and pilots",
                    "Performance benchmarking & validation",
                    "Application-specific material concepts",
                  ],
                },
                {
                  icon: "training",
                  title: "Training Programs",
                  description:
                    "Hands-on learning for teams building with natural fibers and agro-waste based materials.",
                  bullets: [
                    "Workshops for engineers & students",
                    "Practical demos and lab-style sessions",
                    "Guidance on safe processing & testing",
                  ],
                },
                {
                  icon: "consulting",
                  title: "Consultancy Services",
                  description:
                    "Clear, actionable guidance to help organizations adopt sustainable materials and circular practices.",
                  bullets: [
                    "Material strategy & roadmap",
                    "Process and sourcing recommendations",
                    "Documentation support and best practices",
                  ],
                },
              ].map((item) => (
                <ServiceCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  bullets={item.bullets}
                />
              ))}
        </div>
      </section>

      {/* Requests */}
      <section className="services-page-section services-requests-section">
        <div className="services-page-wrap">
          <div className="services-page-head reveal">
            <p className="section-eyebrow">Requests</p>
            <h2 className="section-title">Submit a request</h2>
            <p className="section-desc">
              Send details for collaboration or custom product development. You
              can attach a PDF if available.
            </p>
          </div>

          <div className="services-request-grid">
            <div className="services-request-card reveal">
              <h3>Research collaboration</h3>
              <form
                className="services-request-form"
                onSubmit={submitCollaboration}
              >
                <input
                  required
                  value={collabForm.name}
                  onChange={(e) =>
                    setCollabForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Name"
                  className="services-field"
                />
                <input
                  value={collabForm.organization}
                  onChange={(e) =>
                    setCollabForm((p) => ({
                      ...p,
                      organization: e.target.value,
                    }))
                  }
                  placeholder="Organization"
                  className="services-field"
                />
                <input
                  required
                  type="email"
                  value={collabForm.email}
                  onChange={(e) =>
                    setCollabForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  className="services-field"
                />
                <textarea
                  rows={4}
                  value={collabForm.research_area}
                  onChange={(e) =>
                    setCollabForm((p) => ({
                      ...p,
                      research_area: e.target.value,
                    }))
                  }
                  placeholder="Research area / proposal summary"
                  className="services-field services-textarea"
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setCollabForm((p) => ({
                      ...p,
                      proposal: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="services-file"
                />
                <button
                  type="submit"
                  disabled={collabState === "sending"}
                  className="services-submit"
                >
                  {collabState === "sending" ? "Submitting…" : "Submit request"}
                </button>
                {collabMessage ? (
                  <p
                    className="services-status"
                    role={collabState === "error" ? "alert" : undefined}
                  >
                    {collabMessage}
                  </p>
                ) : null}
              </form>
            </div>

            <div className="services-request-card reveal reveal-d1">
              <h3>Custom product development</h3>
              <form
                className="services-request-form"
                onSubmit={submitCustomRequest}
              >
                <input
                  required
                  value={customForm.company_name}
                  onChange={(e) =>
                    setCustomForm((p) => ({
                      ...p,
                      company_name: e.target.value,
                    }))
                  }
                  placeholder="Company name"
                  className="services-field"
                />
                <input
                  required
                  type="email"
                  value={customForm.email}
                  onChange={(e) =>
                    setCustomForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  className="services-field"
                />
                <div className="services-inline-grid">
                  <input
                    value={customForm.industry}
                    onChange={(e) =>
                      setCustomForm((p) => ({ ...p, industry: e.target.value }))
                    }
                    placeholder="Industry"
                    className="services-field"
                  />
                  <input
                    value={customForm.material_preference}
                    onChange={(e) =>
                      setCustomForm((p) => ({
                        ...p,
                        material_preference: e.target.value,
                      }))
                    }
                    placeholder="Material preference"
                    className="services-field"
                  />
                </div>
                <textarea
                  required
                  rows={4}
                  value={customForm.product_description}
                  onChange={(e) =>
                    setCustomForm((p) => ({
                      ...p,
                      product_description: e.target.value,
                    }))
                  }
                  placeholder="Product description / requirements"
                  className="services-field services-textarea"
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setCustomForm((p) => ({
                      ...p,
                      attachment: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="services-file"
                />
                <button
                  type="submit"
                  disabled={customState === "sending"}
                  className="services-submit services-submit-alt"
                >
                  {customState === "sending" ? "Submitting…" : "Submit request"}
                </button>
                {customMessage ? (
                  <p
                    className="services-status"
                    role={customState === "error" ? "alert" : undefined}
                  >
                    {customMessage}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Training highlight */}
      <section className="services-page-section services-highlight-section">
        <div className="services-page-wrap">
          <div className="services-page-head reveal">
            <p className="section-eyebrow">Training</p>
            <h2 className="section-title">Hands-on training workshops</h2>
            <p className="section-desc">
              Our training programs are designed to be practical and
              interactive—ideal for teams exploring sustainable material
              development.
            </p>
          </div>

          <div className="services-topic-grid">
            {[
              "Natural fiber composites",
              "Agro waste manufacturing",
              "Eco material design",
              "3D printing with natural fibers",
            ].map((topic) => (
              <div key={topic} className="services-topic-card reveal">
                <p>{topic}</p>
                <span>
                  Structured sessions covering concepts, process basics, and
                  practical workflows.
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-page-section services-cta-shell">
        <div className="services-page-wrap">
          <div className="services-cta-card reveal">
            <div className="services-cta-copy">
              <h2>Let’s work together.</h2>
              <p>
                Tell us your product goal and constraints. We’ll suggest the
                best service path—development, collaboration, training, or
                consultancy.
              </p>
            </div>
            <div className="services-cta-actions">
              <Link to="/contact" className="btn-forest">
                Contact Us
              </Link>
              <a
                href="mailto:info@hanriaecotech.com?subject=Services%20Inquiry%20%E2%80%94%20HanRia%20Eco%20Tech"
                className="btn-outline-forest"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
