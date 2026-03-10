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
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-2">
          <ServiceIcon name={icon} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
          {Array.isArray(bullets) && bullets.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-stone-600">
              {bullets.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600"
                    aria-hidden="true"
                  />
                  <span className="leading-6">{item}</span>
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
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-50 via-white to-stone-50" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Services
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Sustainable Innovation Services
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
              We help partners turn sustainable material ideas into real-world
              products—from R&D and prototyping to training and consultancy.
            </p>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-5 md:grid-cols-2">
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
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Submit a request
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Send details for collaboration or custom product development. You
              can attach a PDF if available.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900">
                Research collaboration
              </h3>
              <form className="mt-4 space-y-3" onSubmit={submitCollaboration}>
                <input
                  required
                  value={collabForm.name}
                  onChange={(e) =>
                    setCollabForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Name"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
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
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
                />
                <input
                  required
                  type="email"
                  value={collabForm.email}
                  onChange={(e) =>
                    setCollabForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
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
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
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
                  className="w-full text-sm"
                />
                <button
                  type="submit"
                  disabled={collabState === "sending"}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-60"
                >
                  {collabState === "sending" ? "Submitting…" : "Submit request"}
                </button>
                {collabMessage ? (
                  <p
                    className={
                      "text-sm " +
                      (collabState === "success"
                        ? "text-emerald-800"
                        : "text-stone-700")
                    }
                    role={collabState === "error" ? "alert" : undefined}
                  >
                    {collabMessage}
                  </p>
                ) : null}
              </form>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900">
                Custom product development
              </h3>
              <form className="mt-4 space-y-3" onSubmit={submitCustomRequest}>
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
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
                />
                <input
                  required
                  type="email"
                  value={customForm.email}
                  onChange={(e) =>
                    setCustomForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={customForm.industry}
                    onChange={(e) =>
                      setCustomForm((p) => ({ ...p, industry: e.target.value }))
                    }
                    placeholder="Industry"
                    className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
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
                    className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
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
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm"
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
                  className="w-full text-sm"
                />
                <button
                  type="submit"
                  disabled={customState === "sending"}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 disabled:opacity-60"
                >
                  {customState === "sending" ? "Submitting…" : "Submit request"}
                </button>
                {customMessage ? (
                  <p
                    className={
                      "text-sm " +
                      (customState === "success"
                        ? "text-emerald-800"
                        : "text-stone-700")
                    }
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
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Hands-on training workshops
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Our training programs are designed to be practical and
              interactive—ideal for teams exploring sustainable material
              development.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Natural fiber composites",
              "Agro waste manufacturing",
              "Eco material design",
              "3D printing with natural fibers",
            ].map((topic) => (
              <div
                key={topic}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
              >
                <p className="text-sm font-semibold text-stone-900">{topic}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Structured sessions covering concepts, process basics, and
                  practical workflows.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-emerald-50 via-white to-stone-50 p-8 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  Let’s work together.
                </h2>
                <p className="mt-4 text-base leading-7 text-stone-600">
                  Tell us your product goal and constraints. We’ll suggest the
                  best service path—development, collaboration, training, or
                  consultancy.
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
                  href="mailto:info@hanriaecotech.com?subject=Services%20Inquiry%20%E2%80%94%20HanRia%20Eco%20Tech"
                  className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
