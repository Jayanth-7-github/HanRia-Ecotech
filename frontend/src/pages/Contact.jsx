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
      <section className="contact-page-section contact-hero-section">
        <div className="contact-page-wrap">
          <div className="contact-page-head">
            <p className="section-eyebrow">Contact</p>
            <h1 className="section-title">
              Partner With Us For Sustainable Innovation
            </h1>
            <p className="section-desc">
              Reach out to collaborate on eco-material development, sustainable
              product design, and technology translation from lab to market.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-page-section contact-content-section">
        <div className="contact-page-wrap">
          <div className="contact-grid">
            <div className="contact-card reveal">
              <h2 className="contact-card-title">Send us a message</h2>
              <p className="contact-card-copy">
                Share your needs and we’ll get back to you.
              </p>

              <div className="contact-note-card">
                <p className="contact-note-title">What to include</p>
                <ul className="contact-note-list">
                  {[
                    "Your product / use case",
                    "Desired material properties",
                    "Timeline and quantities (if known)",
                  ].map((item) => (
                    <li key={item} className="contact-note-item">
                      <span className="contact-note-dot" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form className="contact-form" onSubmit={onSubmit}>
                <div className="contact-field-group">
                  <label className="contact-label" htmlFor="name">
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
                    className="contact-field"
                  />
                </div>

                <div className="contact-field-group">
                  <label className="contact-label" htmlFor="email">
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
                    className="contact-field"
                  />
                </div>

                <div className="contact-field-group">
                  <label className="contact-label" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us about your project, product idea, or partnership proposal."
                    value={form.message}
                    onChange={onChange}
                    className="contact-field contact-textarea"
                  />
                </div>

                <div className="contact-actions">
                  <button
                    type="submit"
                    disabled={submitState === "sending"}
                    className="contact-submit"
                  >
                    {submitState === "sending" ? "Sending…" : "Send Message"}
                  </button>
                  <a
                    href={`mailto:${encodeURIComponent(contactEmail)}`}
                    className="contact-secondary-link"
                  >
                    Email Us Directly
                  </a>
                </div>

                {submitState !== "idle" && submitMessage ? (
                  <p
                    className={`contact-status ${
                      submitState === "success"
                        ? "is-success"
                        : submitState === "error"
                          ? "is-error"
                          : "is-pending"
                    }`}
                    role={submitState === "error" ? "alert" : undefined}
                  >
                    {submitMessage}
                  </p>
                ) : null}

                <p className="contact-meta-copy">
                  We’ll only use your message to respond. Typical response time:
                  1–2 business days.
                </p>
              </form>
            </div>

            <div className="contact-side-stack">
              <div className="contact-card reveal reveal-d1">
                <h2 className="contact-card-title">Company details</h2>
                <p className="contact-card-copy">
                  Prefer email? Here are quick ways to reach us.
                </p>

                <dl className="contact-detail-list">
                  <div className="contact-detail-row">
                    <dt className="contact-detail-title">Email</dt>
                    <dd className="contact-detail-value">
                      <a
                        className="contact-detail-link"
                        href={`mailto:${encodeURIComponent(contactEmail)}`}
                      >
                        {contactEmail}
                      </a>
                    </dd>
                  </div>
                  <div className="contact-detail-row">
                    <dt className="contact-detail-title">Location</dt>
                    <dd className="contact-detail-value">
                      {contactLocation || "Add your location"}
                    </dd>
                  </div>
                  <div className="contact-detail-row">
                    <dt className="contact-detail-title">Website</dt>
                    <dd className="contact-detail-value">hanriaecotech.com</dd>
                  </div>
                </dl>
              </div>

              <div className="contact-focus-card reveal reveal-d2">
                <h3 className="contact-focus-title">Partnership focus</h3>
                <p className="contact-focus-copy">
                  Co-development, prototyping support, material consulting, and
                  training workshops tailored to your team.
                </p>
                <div className="contact-focus-actions">
                  <a
                    href={`mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent("Partnership Inquiry — HanRia Eco Tech")}`}
                    className="contact-focus-link"
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
