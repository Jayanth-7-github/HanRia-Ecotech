import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../api.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitState, setSubmitState] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [companyInfo, setCompanyInfo] = useState({
    contactEmail: "",
    contactLocation: "",
  });

  const fallbackEmail = "info@hanriaecotech.com";
  const contactEmail = useMemo(() => {
    const candidate = String(companyInfo.contactEmail ?? "").trim();
    return candidate || fallbackEmail;
  }, [companyInfo.contactEmail]);
  const contactLocation = useMemo(() => {
    return String(companyInfo.contactLocation ?? "").trim();
  }, [companyInfo.contactLocation]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(apiUrl("/api/site-content"));
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) return;
        if (cancelled) return;
        setCompanyInfo({
          contactEmail: data?.content?.contactEmail ?? "",
          contactLocation: data?.content?.contactLocation ?? "",
        });
      } catch {
        // Best-effort only; fall back to defaults.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitState("sending");
    setSubmitMessage("");

    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to send message");
      }

      setSubmitState("success");
      setSubmitMessage("Thanks — your message has been sent.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error?.message || "Failed to send message");
    }
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-50 via-white to-stone-50" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Contact
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Partner With Us For Sustainable Innovation
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
              Reach out to collaborate on eco-material development, sustainable
              product design, and technology translation from lab to market.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-stone-900">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Share your needs and we’ll get back to you.
              </p>

              <div className="mt-5 rounded-2xl bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-900">
                  What to include
                </p>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  {[
                    "Your product / use case",
                    "Desired material properties",
                    "Timeline and quantities (if known)",
                  ].map((item) => (
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

              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <div>
                  <label
                    className="text-sm font-medium text-stone-700"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none ring-0 placeholder:text-stone-400 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label
                    className="text-sm font-medium text-stone-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none ring-0 placeholder:text-stone-400 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label
                    className="text-sm font-medium text-stone-700"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us about your project, product idea, or partnership proposal."
                    value={form.message}
                    onChange={onChange}
                    className="mt-2 w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none ring-0 placeholder:text-stone-400 focus:border-emerald-600"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={submitState === "sending"}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitState === "sending" ? "Sending…" : "Send Message"}
                  </button>
                  <a
                    href={`mailto:${encodeURIComponent(contactEmail)}`}
                    className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
                  >
                    Email Us Directly
                  </a>
                </div>

                {submitState !== "idle" && submitMessage ? (
                  <p
                    className={`text-sm leading-6 ${
                      submitState === "success"
                        ? "text-emerald-800"
                        : submitState === "error"
                          ? "text-stone-700"
                          : "text-stone-600"
                    }`}
                    role={submitState === "error" ? "alert" : undefined}
                  >
                    {submitMessage}
                  </p>
                ) : null}

                <p className="text-xs leading-5 text-stone-500">
                  We’ll only use your message to respond. Typical response time:
                  1–2 business days.
                </p>
              </form>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-stone-900">
                Company details
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Prefer email? Here are quick ways to reach us.
              </p>

              <dl className="mt-6 divide-y divide-stone-200 text-sm">
                <div className="flex items-start justify-between gap-4 py-4">
                  <dt className="font-medium text-stone-700">Email</dt>
                  <dd className="text-right text-stone-600">
                    <a
                      className="text-emerald-800 hover:text-emerald-900"
                      href={`mailto:${encodeURIComponent(contactEmail)}`}
                    >
                      {contactEmail}
                    </a>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-4">
                  <dt className="font-medium text-stone-700">Location</dt>
                  <dd className="text-right text-stone-600">
                    {contactLocation || "Add your location"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-4">
                  <dt className="font-medium text-stone-700">Website</dt>
                  <dd className="text-right text-stone-600">
                    hanriaecotech.com
                  </dd>
                </div>
              </dl>

              <div className="mt-8 rounded-2xl bg-emerald-50 p-5">
                <h3 className="text-sm font-semibold text-stone-900">
                  Partnership focus
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Co-development, prototyping support, material consulting, and
                  training workshops tailored to your team.
                </p>
                <div className="mt-4">
                  <a
                    href={`mailto:${encodeURIComponent(
                      contactEmail,
                    )}?subject=${encodeURIComponent(
                      "Partnership Inquiry — HanRia Eco Tech",
                    )}`}
                    className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
                  >
                    Start a Partnership Inquiry
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
