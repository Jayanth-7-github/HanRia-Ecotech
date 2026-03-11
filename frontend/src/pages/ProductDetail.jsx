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
      <main className="product-detail-page">
        <div className="product-detail-wrap">
          <p className="product-detail-state">Loading…</p>
        </div>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="product-detail-page">
        <div className="product-detail-wrap">
          <p className="product-detail-state" role="alert">
            {state.error}
          </p>
          <div className="product-detail-actions">
            <Link className="product-detail-back" to="/products">
              Back to products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const p = state.product;

  return (
    <main className="product-detail-page">
      <div className="product-detail-wrap">
        <p className="section-eyebrow">Product</p>
        <h1 className="section-title">{p.name}</h1>
        <p className="product-detail-category">{p.category}</p>

        {p.image ? (
          <div className="product-detail-image-shell">
            <img src={p.image} alt={p.name} className="product-detail-image" />
          </div>
        ) : null}

        {p.description ? (
          <div className="product-detail-copy">
            <p>{p.description}</p>
          </div>
        ) : null}

        <div className="product-detail-panel-grid">
          <div className="product-detail-panel">
            <p className="product-detail-panel-title">Applications</p>
            <ul className="product-detail-list">
              {(p.applications ?? []).length ? (
                (p.applications ?? []).map((a) => (
                  <li key={a} className="product-detail-item">
                    <span className="product-detail-dot" />
                    <span>{a}</span>
                  </li>
                ))
              ) : (
                <li className="product-detail-empty">
                  No applications listed.
                </li>
              )}
            </ul>
          </div>

          <div className="product-detail-panel">
            <p className="product-detail-panel-title">Materials</p>
            <ul className="product-detail-list">
              {(p.materials ?? []).length ? (
                (p.materials ?? []).map((m) => (
                  <li key={m} className="product-detail-item">
                    <span className="product-detail-dot" />
                    <span>{m}</span>
                  </li>
                ))
              ) : (
                <li className="product-detail-empty">No materials listed.</li>
              )}
            </ul>
          </div>
        </div>

        {p.document ? (
          <div className="product-detail-actions">
            <a
              href={p.document}
              target="_blank"
              rel="noreferrer"
              className="product-detail-document"
            >
              View document
            </a>
          </div>
        ) : null}

        <div className="product-detail-actions">
          <Link className="product-detail-back" to="/products">
            Back to products
          </Link>
        </div>
      </div>
    </main>
  );
}
