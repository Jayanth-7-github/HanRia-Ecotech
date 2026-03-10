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
    <footer className="bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-white">HanRia Eco Tech</p>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Sustainable materials from agricultural waste—engineered for
              modern products and a cleaner future.
            </p>
            <p className="mt-4 text-sm">
              <a
                className="text-emerald-300 hover:text-emerald-200"
                href="mailto:info@hanriaecotech.com"
              >
                info@hanriaecotech.com
              </a>
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Quick Links</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link className="text-stone-300 hover:text-white" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="text-stone-300 hover:text-white" to="/about">
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-stone-300 hover:text-white"
                  to="/technology"
                >
                  Our Technology
                </Link>
              </li>
              <li>
                <Link
                  className="text-stone-300 hover:text-white"
                  to="/products"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  className="text-stone-300 hover:text-white"
                  to="/services"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  className="text-stone-300 hover:text-white"
                  to="/training"
                >
                  Training
                </Link>
              </li>
              <li>
                <Link className="text-stone-300 hover:text-white" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Newsletter</p>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Get updates on new materials, training, and collaborations.
            </p>
            <form className="mt-4 flex gap-2" onSubmit={subscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-stone-100 placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={state === "sending" || !email}
                className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === "sending" ? "…" : "Join"}
              </button>
            </form>
            {message ? (
              <p
                className={
                  "mt-3 text-xs " +
                  (state === "success" ? "text-emerald-200" : "text-stone-300")
                }
                role={state === "error" ? "alert" : undefined}
              >
                {message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} HanRia Eco Tech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
