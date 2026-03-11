import { Link } from "react-router-dom";
import { useState } from "react";
import { apiUrl } from "../api.js";

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  const subscribe = async (e) => {
    e.preventDefault();
    setState("sending");
    setMessage("");
    try {
      const res = await fetch(apiUrl("/api/newsletter/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Subscription failed");
      }
      setState("success");
      setMessage("Subscribed. Thank you!");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err?.message || "Subscription failed");
    }
  };

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <h3>
            HanRia <span>Eco Tech</span>
          </h3>
          <p>
            Sustainable materials from agricultural waste, engineered for modern
            products, circular manufacturing, and a cleaner future.
          </p>
          <a className="footer-email" href="mailto:info@hanriaecotech.com">
            info@hanriaecotech.com
          </a>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/technology">Technology</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Offerings</h4>
          <ul className="footer-links">
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/training">Training</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Newsletter</h4>
          <p className="newsletter-label">
            Get updates on new materials, training programs, and collaboration
            opportunities.
          </p>
          <form className="newsletter-form" onSubmit={subscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="newsletter-input"
            />
            <button
              type="submit"
              disabled={state === "sending" || !email}
              className="newsletter-btn"
            >
              {state === "sending" ? "..." : "Join"}
            </button>
          </form>
          {message ? (
            <p
              className="newsletter-label"
              style={{
                marginTop: 12,
                marginBottom: 0,
                color:
                  state === "success"
                    ? "rgba(212, 168, 90, 0.95)"
                    : "rgba(255, 255, 255, 0.7)",
              }}
              role={state === "error" ? "alert" : undefined}
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} HanRia Eco Tech. All rights reserved.
        </p>
        <ul className="footer-bottom-links">
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
