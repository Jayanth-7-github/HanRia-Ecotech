import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiUrl } from "../api.js";

function ProgramIcon({ name }) {
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
    case "design":
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
    case "engineering":
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
          <path d="M6 12h12" />
          <path d="M8 12v8h8v-8" />
          <path d="M7 17h10" />
        </svg>
      );
  }
}

function ProgramCard({ icon, title, description, bullets }) {
  return (
    <div className="training-detail-card reveal">
      <div className="training-detail-row">
        <div className="training-detail-icon">
          <ProgramIcon name={icon} />
        </div>
        <div className="training-detail-copy">
          <h2>{title}</h2>
          <p>{description}</p>
          <ul className="training-detail-list">
            {bullets.map((item) => (
              <li key={item} className="training-detail-item">
                <span className="training-detail-dot" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function FormatIcon({ name }) {
  const common = {
    className: "h-6 w-6 text-emerald-700",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (name) {
    case "workshop":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h7a3 3 0 0 1 3 3v12H7a3 3 0 0 0-3 3V6Z" />
          <path d="M20 6h-7a3 3 0 0 0-3 3v12h7a3 3 0 0 1 3 3V6Z" />
          <path d="M8 10h4" />
          <path d="M12 14H8" />
        </svg>
      );
    case "bootcamp":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
          <path d="M12 13v9" />
        </svg>
      );
    case "team":
    default:
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 11a4 4 0 1 0-8 0" />
          <path d="M3 21a7 7 0 0 1 18 0" />
          <path d="M18.5 11a3 3 0 1 0-5.5-1" />
        </svg>
      );
  }
}

function FormatCard({ icon, title, description, bullets }) {
  return (
    <div className="training-detail-card reveal">
      <div className="training-detail-row">
        <div className="training-detail-icon">
          <FormatIcon name={icon} />
        </div>
        <div className="training-detail-copy">
          <h2>{title}</h2>
          <p>{description}</p>
          <ul className="training-detail-list">
            {bullets.map((item) => (
              <li key={item} className="training-detail-item">
                <span className="training-detail-dot" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Training() {
  const [apiPrograms, setApiPrograms] = useState([]);
  const [registerForm, setRegisterForm] = useState({
    program_id: "",
    name: "",
    email: "",
    phone: "",
    institution: "",
  });
  const [registerState, setRegisterState] = useState("idle");
  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/training-programs"));
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) return;
        if (!cancelled) setApiPrograms(data.programs ?? []);
      } catch {
        // Ignore; page still works without API.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((p) => ({ ...p, [name]: value }));
  };

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterState("sending");
    setRegisterMessage("");
    try {
      const res = await fetch(apiUrl("/api/training/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Registration failed");
      }
      setRegisterState("success");
      setRegisterMessage("Registration submitted. We’ll contact you soon.");
      setRegisterForm({
        program_id: "",
        name: "",
        email: "",
        phone: "",
        institution: "",
      });
    } catch (err) {
      setRegisterState("error");
      setRegisterMessage(err?.message || "Registration failed");
    }
  };

  const programs = [
    {
      icon: "fiber",
      title: "Natural Fiber Composite Technology",
      description:
        "Learn fundamentals of natural fibers, composite structures, and practical processing workflows.",
      bullets: [
        "Fiber selection & preparation",
        "Composite basics and performance factors",
        "Testing and quality fundamentals",
      ],
    },
    {
      icon: "agro",
      title: "Agro Waste Product Manufacturing",
      description:
        "Hands-on learning focused on converting agricultural residues into useful material inputs and products.",
      bullets: [
        "Agro waste sourcing and preprocessing",
        "Manufacturing process overview",
        "Safety and repeatability practices",
      ],
    },
    {
      icon: "design",
      title: "Eco Material Design",
      description:
        "Design with sustainability in mind—material choices, constraints, and responsible product decisions.",
      bullets: [
        "Material selection for impact",
        "Design for circularity concepts",
        "Basic documentation and evaluation",
      ],
    },
    {
      icon: "engineering",
      title: "Sustainable Product Engineering",
      description:
        "Translate material innovation into product-ready engineering with performance and manufacturing considerations.",
      bullets: [
        "Requirements and trade-off thinking",
        "Prototype planning and validation",
        "Scaling from concept to production",
      ],
    },
    {
      icon: "printing",
      title: "3D Printing With Natural Fibers",
      description:
        "Explore printable eco-material concepts and additive manufacturing workflows for rapid prototyping.",
      bullets: [
        "Printability fundamentals",
        "Feedstock and process basics",
        "Prototype iteration workflows",
      ],
    },
  ];

  const formats = [
    {
      icon: "workshop",
      title: "Hands-on workshops",
      description:
        "Short, focused sessions that teach core concepts with practical examples and structured exercises.",
      bullets: [
        "Great for student groups and labs",
        "Beginner-friendly + practical",
        "Clear takeaways and next steps",
      ],
    },
    {
      icon: "bootcamp",
      title: "Intensive bootcamps",
      description:
        "Multi-day learning tracks designed to build end-to-end understanding from materials to prototyping.",
      bullets: [
        "Deep dives across multiple modules",
        "Prototype-first learning approach",
        "Works well for cohorts",
      ],
    },
    {
      icon: "team",
      title: "Team training",
      description:
        "Custom training for startups and organizations adopting sustainable materials and circular design.",
      bullets: [
        "Tailored to your domain",
        "Best practices and process guidance",
        "Q&A and implementation support",
      ],
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="training">
        <div className="training-page-wrap">
          <div className="training-hero-copy">
            <p className="section-eyebrow">Training</p>
            <h1 className="section-title">
              Sustainable Product Development Training
            </h1>
            <p className="section-desc">
              Educational programs focused on sustainable materials—built for
              learners and teams who want practical skills and modern eco-tech
              workflows.
            </p>

            <div className="training-hero-actions">
              <a
                href="mailto:info@hanriaecotech.com?subject=Apply%20for%20Training"
                className="btn-forest"
              >
                Apply for Training
              </a>
              <Link to="/contact" className="btn-outline-forest">
                Talk to our team
              </Link>
            </div>

            <div className="training-tag-grid">
              {["Practical", "Eco-tech focused", "Partner-ready"].map((tag) => (
                <div key={tag} className="training-tag">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="training-page-section">
        <div className="training-page-wrap">
          <div className="training-section-head reveal">
            <p className="section-eyebrow">Formats</p>
            <h2 className="section-title">Training formats</h2>
            <p className="section-desc">
              Choose a format that matches your team and timeline—we can tailor
              the learning path based on your goals.
            </p>
          </div>
          <div className="training-format-grid">
            {formats.map((format) => (
              <FormatCard
                key={format.title}
                icon={format.icon}
                title={format.title}
                description={format.description}
                bullets={format.bullets}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="training-page-section training-programs-section">
        <div className="training-page-wrap">
          <div className="training-section-head reveal">
            <p className="section-eyebrow">Programs</p>
            <h2 className="section-title">Programs</h2>
            <p className="section-desc">
              Choose a track to build hands-on knowledge across natural fibers,
              agro-waste processing, sustainable engineering, and additive
              manufacturing.
            </p>
          </div>

          <div className="training-program-grid">
            {programs.map((program) => (
              <ProgramCard
                key={program.title}
                icon={program.icon}
                title={program.title}
                description={program.description}
                bullets={program.bullets}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="training-page-section training-register-shell">
        <div className="training-page-wrap">
          <div className="training-register-card reveal">
            <div className="training-register-grid">
              <div className="training-register-copy">
                <p className="section-eyebrow">Registration</p>
                <h2 className="section-title">Register for a program</h2>
                <p className="section-desc">
                  Submit your details and we’ll confirm schedule and next steps.
                </p>
                {apiPrograms.length === 0 ? (
                  <p className="training-register-note">
                    Admin hasn’t published training programs yet.
                  </p>
                ) : null}
              </div>

              <form
                className="training-register-form"
                onSubmit={onRegisterSubmit}
              >
                <select
                  name="program_id"
                  value={registerForm.program_id}
                  onChange={onRegisterChange}
                  className="training-field"
                >
                  <option value="">Select program</option>
                  {apiPrograms.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <input
                  name="name"
                  value={registerForm.name}
                  onChange={onRegisterChange}
                  placeholder="Name"
                  className="training-field"
                />
                <input
                  name="email"
                  type="email"
                  value={registerForm.email}
                  onChange={onRegisterChange}
                  placeholder="Email"
                  className="training-field"
                />
                <div className="training-register-inline">
                  <input
                    name="phone"
                    value={registerForm.phone}
                    onChange={onRegisterChange}
                    placeholder="Phone"
                    className="training-field"
                  />
                  <input
                    name="institution"
                    value={registerForm.institution}
                    onChange={onRegisterChange}
                    placeholder="Institution"
                    className="training-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    registerState === "sending" || apiPrograms.length === 0
                  }
                  className="training-submit"
                >
                  {registerState === "sending" ? "Submitting…" : "Register"}
                </button>

                {registerMessage ? (
                  <p
                    className="training-status"
                    role={registerState === "error" ? "alert" : undefined}
                  >
                    {registerMessage}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="training-page-section">
        <div className="training-page-wrap">
          <div className="training-section-head reveal">
            <p className="section-eyebrow">Outcomes</p>
            <h2 className="section-title">What you’ll gain</h2>
            <p className="section-desc">
              Clear fundamentals plus practical workflows you can reuse in your
              projects.
            </p>
          </div>

          <div className="training-info-grid training-info-grid-3">
            {[
              {
                title: "Material-first thinking",
                description:
                  "Understand fiber behavior, composite basics, and key performance trade-offs.",
              },
              {
                title: "Practical process workflows",
                description:
                  "Step-by-step guidance for sourcing, preprocessing, and repeatable manufacturing practices.",
              },
              {
                title: "Prototype & validation mindset",
                description:
                  "Learn how to plan experiments, validate outcomes, and iterate with confidence.",
              },
            ].map((item) => (
              <article key={item.title} className="training-info-card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who can attend */}
      <section className="training-page-section training-audience-section">
        <div className="training-page-wrap">
          <div className="training-section-head reveal">
            <p className="section-eyebrow">Audience</p>
            <h2 className="section-title">Who can attend</h2>
            <p className="section-desc">
              Our programs are designed for a range of learners—from beginners
              to teams building sustainable products.
            </p>
          </div>

          <div className="training-info-grid training-info-grid-4">
            {["Students", "Engineers", "Startups", "Researchers"].map(
              (audience) => (
                <article key={audience} className="training-info-card reveal">
                  <h3>{audience}</h3>
                  <p>
                    A clear learning path with practical examples and outcomes.
                  </p>
                </article>
              ),
            )}
          </div>

          <div className="training-audience-action">
            <a
              href="mailto:info@hanriaecotech.com?subject=Apply%20for%20Training"
              className="btn-outline-forest"
            >
              Apply for Training
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="training-dark-cta">
        <div className="training-page-wrap training-dark-cta-inner">
          <div className="training-dark-cta-copy">
            <p className="section-eyebrow training-dark-cta-eyebrow">
              Get Started
            </p>
            <h2 className="section-title training-dark-cta-title">
              Ready to build with sustainable materials?
            </h2>
            <p className="training-dark-cta-desc">
              Tell us what you want to learn. We’ll recommend the best program
              and format.
            </p>
            <div className="training-dark-cta-actions">
              <a
                href="mailto:info@hanriaecotech.com?subject=Apply%20for%20Training"
                className="btn-gold"
              >
                Apply for Training
              </a>
              <Link to="/contact" className="btn-ghost">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
