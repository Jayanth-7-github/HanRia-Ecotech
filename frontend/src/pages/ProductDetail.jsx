import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../api.js";

export default function ProductDetail() {
  const { id } = useParams();
  const [state, setState] = useState({
    status: "loading",
    product: null,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl(`/api/products/${id}`));
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Failed to load product");
        }
        if (!cancelled) {
          setState({ status: "ready", product: data.product, error: "" });
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            status: "error",
            product: null,
            error: e?.message || "Error",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <p className="text-sm text-stone-600">Loading…</p>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <p className="text-sm text-stone-700" role="alert">
          {state.error}
        </p>
        <div className="mt-4">
          <Link
            className="text-sm font-semibold text-emerald-800"
            to="/products"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const p = state.product;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
        Product
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        {p.name}
      </h1>
      <p className="mt-2 text-sm text-stone-600">{p.category}</p>

      {p.image ? (
        <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <img src={p.image} alt={p.name} className="h-auto w-full" />
        </div>
      ) : null}

      {p.description ? (
        <p className="mt-8 text-base leading-7 text-stone-600">
          {p.description}
        </p>
      ) : null}

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-stone-900">Applications</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            {(p.applications ?? []).length ? (
              (p.applications ?? []).map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span className="leading-6">{a}</span>
                </li>
              ))
            ) : (
              <li>No applications listed.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-stone-900">Materials</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            {(p.materials ?? []).length ? (
              (p.materials ?? []).map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span className="leading-6">{m}</span>
                </li>
              ))
            ) : (
              <li>No materials listed.</li>
            )}
          </ul>
        </div>
      </div>

      {p.document ? (
        <div className="mt-10">
          <a
            href={p.document}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
          >
            View document
          </a>
        </div>
      ) : null}

      <div className="mt-10">
        <Link className="text-sm font-semibold text-emerald-800" to="/products">
          Back to products
        </Link>
      </div>
    </main>
  );
}
