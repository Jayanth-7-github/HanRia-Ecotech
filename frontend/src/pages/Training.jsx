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
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-2">
          <ProgramIcon name={icon} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
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
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-2">
          <FormatIcon name={icon} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
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
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-50 via-white to-stone-50" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Training
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Sustainable Product Development Training
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
              Educational programs focused on sustainable materials—built for
              learners and teams who want practical skills and modern eco-tech
              workflows.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="mailto:info@hanriaecotech.com?subject=Apply%20for%20Training"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Apply for Training
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50"
              >
                Talk to our team
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Practical", "Eco-tech focused", "Partner-ready"].map((tag) => (
                <div
                  key={tag}
                  className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-900"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Training formats
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-600">
            Choose a format that matches your team and timeline—we can tailor
            the learning path based on your goals.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
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
      </section>

      {/* Programs */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Programs
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-600">
            Choose a track to build hands-on knowledge across natural fibers,
            agro-waste processing, sustainable engineering, and additive
            manufacturing.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
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
      </section>

      {/* Registration */}
      <section className="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-emerald-50 via-white to-stone-50 p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  Register for a program
                </h2>
                <p className="mt-4 text-base leading-7 text-stone-600">
                  Submit your details and we’ll confirm schedule and next steps.
                </p>
                {apiPrograms.length === 0 ? (
                  <p className="mt-4 text-sm text-stone-600">
                    Admin hasn’t published training programs yet.
                  </p>
                ) : null}
              </div>

              <form className="space-y-3" onSubmit={onRegisterSubmit}>
                <select
                  name="program_id"
                  value={registerForm.program_id}
                  onChange={onRegisterChange}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm"
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
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm"
                />
                <input
                  name="email"
                  type="email"
                  value={registerForm.email}
                  onChange={onRegisterChange}
                  placeholder="Email"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    name="phone"
                    value={registerForm.phone}
                    onChange={onRegisterChange}
                    placeholder="Phone"
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm"
                  />
                  <input
                    name="institution"
                    value={registerForm.institution}
                    onChange={onRegisterChange}
                    placeholder="Institution"
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    registerState === "sending" || apiPrograms.length === 0
                  }
                  className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {registerState === "sending" ? "Submitting…" : "Register"}
                </button>

                {registerMessage ? (
                  <p
                    className={
                      "text-sm " +
                      (registerState === "success"
                        ? "text-emerald-800"
                        : "text-stone-700")
                    }
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
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              What you’ll gain
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Clear fundamentals plus practical workflows you can reuse in your
              projects.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <div
                key={item.title}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
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
        </div>
      </section>

      {/* Who can attend */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Who can attend
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Our programs are designed for a range of learners—from beginners
              to teams building sustainable products.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Students", "Engineers", "Startups", "Researchers"].map(
              (audience) => (
                <div
                  key={audience}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
                >
                  <p className="text-sm font-semibold text-stone-900">
                    {audience}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    A clear learning path with practical examples and outcomes.
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="mt-10">
            <a
              href="mailto:info@hanriaecotech.com?subject=Apply%20for%20Training"
              className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50"
            >
              Apply for Training
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-emerald-900 to-stone-950" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ready to build with sustainable materials?
            </h2>
            <p className="mt-4 text-base leading-7 text-emerald-50/90">
              Tell us what you want to learn. We’ll recommend the best program
              and format.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="mailto:info@hanriaecotech.com?subject=Apply%20for%20Training"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Apply for Training
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-white/15"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
