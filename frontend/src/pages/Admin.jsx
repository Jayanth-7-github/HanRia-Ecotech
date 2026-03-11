import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../api.js";

const DEFAULT_ADMIN_API_BASE = apiUrl("/api/admin");

const ADMIN_API_BASE = String(
  import.meta.env.VITE_ADMIN_API_BASE || DEFAULT_ADMIN_API_BASE,
).replace(/\/$/, "");

function parseList(value) {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinList(arr) {
  return (Array.isArray(arr) ? arr : []).join(", ");
}

async function apiFetch(path, { token, method = "GET", body, isForm } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body != null) headers["Content-Type"] = "application/json";

  const url = `${ADMIN_API_BASE}${path}`;
  if (import.meta.env.DEV) {
    console.debug("Admin apiFetch", { method, url });
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body == null ? undefined : isForm ? body : JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

function AdminBranding({
  title,
  titleClassName,
  titleAs: TitleTag = "p",
  eyebrowMargin = 6,
  titleStyle,
}) {
  return (
    <>
      <p className="section-eyebrow" style={{ marginBottom: eyebrowMargin }}>
        Admin
      </p>
      <TitleTag className={titleClassName} style={titleStyle}>
        {title}
      </TitleTag>
    </>
  );
}

function AdminActionButtons({
  busy,
  onRefresh,
  onLogout,
  containerClassName,
  secondaryButtonClassName,
  darkButtonClassName,
}) {
  return (
    <div className={containerClassName}>
      <button
        type="button"
        onClick={onRefresh}
        disabled={busy}
        className={secondaryButtonClassName}
      >
        Refresh
      </button>
      <button type="button" onClick={onLogout} className={darkButtonClassName}>
        Logout
      </button>
    </div>
  );
}

function AdminTabNavigation({
  tabs,
  busy,
  onTabSelect,
  tabButtonClassName,
  className,
}) {
  return (
    <nav className={className}>
      <div className="admin-tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            disabled={busy}
            onClick={() => onTabSelect(tab.id)}
            className={tabButtonClassName(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState("");
  const [token, setToken] = useState(() =>
    window.localStorage.getItem("admin_token"),
  );
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [collab, setCollab] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [files, setFiles] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [siteContent, setSiteContent] = useState({
    vision: "",
    mission: "",
    technologies: [],
    contactEmail: "",
    contactLocation: "",
  });

  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const productEmpty = useMemo(
    () => ({
      name: "",
      category: "",
      description: "",
      image: "",
      document: "",
      applicationsText: "",
      materialsText: "",
    }),
    [],
  );
  const [productDraft, setProductDraft] = useState(productEmpty);
  const [editingProductId, setEditingProductId] = useState(null);

  const categoryEmpty = useMemo(
    () => ({ category_name: "", description: "" }),
    [],
  );
  const [categoryDraft, setCategoryDraft] = useState(categoryEmpty);

  const serviceEmpty = useMemo(() => ({ title: "", description: "" }), []);
  const [serviceDraft, setServiceDraft] = useState(serviceEmpty);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const programEmpty = useMemo(
    () => ({
      title: "",
      description: "",
      date: "",
      duration: "",
      location: "",
      mode: "online",
    }),
    [],
  );
  const [programDraft, setProgramDraft] = useState(programEmpty);
  const [editingProgramId, setEditingProgramId] = useState(null);

  const [newsletterDraft, setNewsletterDraft] = useState({
    subject: "",
    text: "",
  });

  const refreshAll = async (t) => {
    const auth = { token: t };
    const [p, c, s, pr, part, con, co, cr, f, sub, sc] = await Promise.all([
      apiFetch("/products", auth),
      apiFetch("/categories", auth),
      apiFetch("/services", auth),
      apiFetch("/training-programs", auth),
      apiFetch("/participants", auth),
      apiFetch("/contacts", auth),
      apiFetch("/collaboration", auth),
      apiFetch("/custom-requests", auth),
      apiFetch("/files", auth),
      apiFetch("/subscribers", auth),
      apiFetch("/site-content", auth),
    ]);

    setProducts(p.products ?? []);
    setCategories(c.categories ?? []);
    setServices(s.services ?? []);
    setPrograms(pr.programs ?? []);
    setParticipants(part.participants ?? []);
    setContacts(con.contacts ?? []);
    setCollab(co.requests ?? []);
    setCustomRequests(cr.requests ?? []);
    setFiles(f.files ?? []);
    setSubscribers(sub.subscribers ?? []);
    setSiteContent(
      sc.content ?? {
        vision: "",
        mission: "",
        technologies: [],
        contactEmail: "",
        contactLocation: "",
      },
    );
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        setStatus("");
        setBusy(true);
        await refreshAll(token);
      } catch (e) {
        if (!cancelled) setStatus(e?.message || "Failed to load admin data");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (editingProductId) return;
    if (categories.length === 0) return;

    const categoryNames = categories
      .map((c) => String(c?.category_name ?? "").trim())
      .filter(Boolean);
    const first = categoryNames[0];
    if (!first) return;

    const current = String(productDraft.category ?? "").trim();
    const isValid = current && categoryNames.includes(current);
    if (!isValid) {
      setProductDraft((p) => ({ ...p, category: first }));
    }
  }, [categories, editingProductId, productDraft.category]);

  const login = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setStatus("");
      const data = await apiFetch("/login", {
        method: "POST",
        body: { key: adminKey },
      });
      window.localStorage.setItem("admin_token", data.token);
      setToken(data.token);
      setAdminKey("");
    } catch (e2) {
      setStatus(e2?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("admin_token");
    setToken(null);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setStatus("");

      if (!editingProductId && categories.length === 0) {
        setStatus("Create a category first (Categories tab).");
        return;
      }

      const name = String(productDraft.name ?? "").trim();
      const category = String(productDraft.category ?? "").trim();
      if (!name || !category) {
        setStatus("Name and category are required.");
        return;
      }

      const payload = {
        name,
        category,
        description: productDraft.description,
        image: productDraft.image,
        document: productDraft.document,
        applications: parseList(productDraft.applicationsText),
        materials: parseList(productDraft.materialsText),
      };

      if (editingProductId) {
        await apiFetch(`/products/${editingProductId}`, {
          token,
          method: "PUT",
          body: payload,
        });
      } else {
        await apiFetch("/products", { token, method: "POST", body: payload });
      }

      setEditingProductId(null);
      setProductDraft(productEmpty);
      await refreshAll(token);
      setStatus("Saved.");
    } catch (e2) {
      setStatus(e2?.message || "Failed to save product");
    } finally {
      setBusy(false);
    }
  };

  const editProduct = (p) => {
    setEditingProductId(p._id);
    setProductDraft({
      name: p.name ?? "",
      category: p.category ?? "",
      description: p.description ?? "",
      image: p.image ?? "",
      document: p.document ?? "",
      applicationsText: joinList(p.applications),
      materialsText: joinList(p.materials),
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setBusy(true);
      setStatus("");
      await apiFetch(`/products/${id}`, { token, method: "DELETE" });
      await refreshAll(token);
    } catch (e) {
      setStatus(e?.message || "Failed to delete product");
    } finally {
      setBusy(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setStatus("");
      await apiFetch("/categories", {
        token,
        method: "POST",
        body: categoryDraft,
      });
      setCategoryDraft(categoryEmpty);
      await refreshAll(token);
    } catch (e2) {
      setStatus(e2?.message || "Failed to add category");
    } finally {
      setBusy(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      setBusy(true);
      setStatus("");
      await apiFetch(`/categories/${id}`, { token, method: "DELETE" });
      await refreshAll(token);
    } catch (e) {
      setStatus(e?.message || "Failed to delete category");
    } finally {
      setBusy(false);
    }
  };

  const saveService = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setStatus("");
      if (editingServiceId) {
        await apiFetch(`/services/${editingServiceId}`, {
          token,
          method: "PUT",
          body: serviceDraft,
        });
      } else {
        await apiFetch("/services", {
          token,
          method: "POST",
          body: serviceDraft,
        });
      }
      setEditingServiceId(null);
      setServiceDraft(serviceEmpty);
      await refreshAll(token);
    } catch (e2) {
      setStatus(e2?.message || "Failed to save service");
    } finally {
      setBusy(false);
    }
  };

  const editService = (s) => {
    setEditingServiceId(s._id);
    setServiceDraft({ title: s.title ?? "", description: s.description ?? "" });
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      setBusy(true);
      setStatus("");
      await apiFetch(`/services/${id}`, { token, method: "DELETE" });
      await refreshAll(token);
    } catch (e) {
      setStatus(e?.message || "Failed to delete service");
    } finally {
      setBusy(false);
    }
  };

  const saveProgram = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setStatus("");
      const payload = {
        ...programDraft,
        date: programDraft.date || undefined,
      };
      if (editingProgramId) {
        await apiFetch(`/training-programs/${editingProgramId}`, {
          token,
          method: "PUT",
          body: payload,
        });
      } else {
        await apiFetch("/training-programs", {
          token,
          method: "POST",
          body: payload,
        });
      }

      setEditingProgramId(null);
      setProgramDraft(programEmpty);
      await refreshAll(token);
    } catch (e2) {
      setStatus(e2?.message || "Failed to save training program");
    } finally {
      setBusy(false);
    }
  };

  const editProgram = (p) => {
    setEditingProgramId(p._id);
    setProgramDraft({
      title: p.title ?? "",
      description: p.description ?? "",
      date: p.date ? String(p.date).slice(0, 10) : "",
      duration: p.duration ?? "",
      location: p.location ?? "",
      mode: p.mode ?? "online",
    });
  };

  const deleteProgram = async (id) => {
    if (!window.confirm("Delete this training program?")) return;
    try {
      setBusy(true);
      setStatus("");
      await apiFetch(`/training-programs/${id}`, {
        token,
        method: "DELETE",
      });
      await refreshAll(token);
    } catch (e) {
      setStatus(e?.message || "Failed to delete training program");
    } finally {
      setBusy(false);
    }
  };

  const updateContactStatus = async (id, statusValue) => {
    try {
      setBusy(true);
      setStatus("");
      await apiFetch(`/contacts/${id}/status`, {
        token,
        method: "PUT",
        body: { status: statusValue },
      });
      await refreshAll(token);
    } catch (e) {
      setStatus(e?.message || "Failed to update contact status");
    } finally {
      setBusy(false);
    }
  };

  const updateCollabStatus = async (id, statusValue) => {
    try {
      setBusy(true);
      setStatus("");
      await apiFetch(`/collaboration/${id}/status`, {
        token,
        method: "PUT",
        body: { status: statusValue },
      });
      await refreshAll(token);
    } catch (e) {
      setStatus(e?.message || "Failed to update collaboration status");
    } finally {
      setBusy(false);
    }
  };

  const updateCustomStatus = async (id, statusValue) => {
    try {
      setBusy(true);
      setStatus("");
      await apiFetch(`/custom-requests/${id}/status`, {
        token,
        method: "PUT",
        body: { status: statusValue },
      });
      await refreshAll(token);
    } catch (e) {
      setStatus(e?.message || "Failed to update request status");
    } finally {
      setBusy(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    try {
      setBusy(true);
      setStatus("");
      const form = new FormData();
      form.append("file", file);
      await apiFetch("/files", {
        token,
        method: "POST",
        body: form,
        isForm: true,
      });
      await refreshAll(token);
      setStatus("Uploaded.");
    } catch (e) {
      setStatus(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const uploadProductAsset = async (file, field) => {
    if (!file) return;
    try {
      setBusy(true);
      setStatus("");
      const form = new FormData();
      form.append("file", file);
      const result = await apiFetch("/files", {
        token,
        method: "POST",
        body: form,
        isForm: true,
      });
      const url = String(result?.file?.url ?? "").trim();
      if (!url) throw new Error("Upload succeeded, but no URL was returned");
      setProductDraft((p) => ({ ...p, [field]: url }));
      setStatus("Uploaded.");
    } catch (e) {
      setStatus(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const saveSiteContent = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setStatus("");
      await apiFetch("/site-content", {
        token,
        method: "PUT",
        body: siteContent,
      });
      await refreshAll(token);
      setStatus("Saved.");
    } catch (e2) {
      setStatus(e2?.message || "Failed to save site content");
    } finally {
      setBusy(false);
    }
  };

  const sendNewsletter = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      setStatus("");
      const result = await apiFetch("/newsletter/send", {
        token,
        method: "POST",
        body: newsletterDraft,
      });
      setNewsletterDraft({ subject: "", text: "" });
      setStatus(`Sent to ${result.sent ?? 0} subscribers.`);
    } catch (e2) {
      setStatus(e2?.message || "Failed to send newsletter");
    } finally {
      setBusy(false);
    }
  };

  const tabs = [
    { id: "products", label: "Products" },
    { id: "categories", label: "Categories" },
    { id: "services", label: "Services" },
    { id: "training", label: "Training" },
    { id: "contacts", label: "Inquiries" },
    { id: "collab", label: "Collaboration" },
    { id: "custom", label: "Custom Requests" },
    { id: "files", label: "Files" },
    { id: "content", label: "Website Content" },
    { id: "newsletter", label: "Newsletter" },
  ];

  const fieldClassName = "admin-input";
  const textareaClassName = "admin-input admin-textarea";
  const selectClassName = "admin-input admin-select";
  const fileInputClassName = "admin-input admin-file-input";

  const tabButtonClassName = (tabId) =>
    `admin-tab-button${activeTab === tabId ? " is-active" : ""}`;

  const primaryButtonClassName = "admin-btn admin-btn-primary";
  const secondaryButtonClassName = "admin-btn admin-btn-secondary";
  const darkButtonClassName = "admin-btn admin-btn-dark";
  const inlineLinkClassName = "admin-inline-link";

  if (!token) {
    return (
      <main className="admin-page admin-login-page">
        <div className="admin-login-shell">
          <div className="admin-login-card">
            <div className="admin-login-card-head">
              <p className="section-eyebrow">Admin</p>
              <h1 className="section-title admin-login-title">
                Dashboard Login
              </h1>
              <p className="section-desc admin-login-desc">
                Enter the admin key to access the dashboard.
              </p>
            </div>

            <form className="admin-form admin-login-form" onSubmit={login}>
              <div className="admin-field">
                <label className="admin-label" htmlFor="key">
                  Admin Key
                </label>
                <input
                  id="key"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  autoComplete="current-password"
                  className={fieldClassName}
                  placeholder="Enter admin key"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className={`${primaryButtonClassName} admin-login-submit`}
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>

              {status ? (
                <p className="admin-status-copy" role="alert">
                  {status}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page admin-dashboard-page">
      <div className="admin-dashboard-shell">
        {sidebarOpen ? (
          <div className="admin-mobile-overlay" role="dialog" aria-modal="true">
            <button
              type="button"
              className="admin-mobile-overlay-backdrop"
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="admin-mobile-drawer">
              <div className="admin-mobile-drawer-head">
                <div className="admin-mobile-drawer-copy">
                  <AdminBranding
                    title="Dashboard"
                    titleClassName="admin-sidebar-title"
                    eyebrowMargin={4}
                  />
                </div>
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  onClick={() => setSidebarOpen(false)}
                >
                  Close
                </button>
              </div>
              <AdminTabNavigation
                tabs={tabs}
                busy={busy}
                onTabSelect={(tabId) => {
                  setActiveTab(tabId);
                  setSidebarOpen(false);
                }}
                tabButtonClassName={tabButtonClassName}
                className="admin-sidebar-nav admin-sidebar-nav-mobile"
              />
            </div>
          </div>
        ) : null}

        <aside className="admin-sidebar">
          <div className="admin-sidebar-card">
            <div className="admin-sidebar-head">
              <AdminBranding
                title="Dashboard"
                titleClassName="admin-sidebar-title"
              />
            </div>
            <AdminTabNavigation
              tabs={tabs}
              busy={busy}
              onTabSelect={setActiveTab}
              tabButtonClassName={tabButtonClassName}
              className="admin-sidebar-nav"
            />
          </div>
        </aside>

        <div className="admin-content">
          <div className="admin-mobile-topbar">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              disabled={busy}
              className="admin-menu-button"
              aria-label="Open navigation"
            >
              <span className="admin-menu-lines">
                <span />
                <span />
                <span />
              </span>
            </button>

            <div className="admin-mobile-topbar-copy">
              <AdminBranding
                title="Dashboard"
                titleClassName="admin-mobile-title"
                titleAs="h1"
                eyebrowMargin={4}
              />
            </div>

            <AdminActionButtons
              busy={busy}
              onRefresh={() => refreshAll(token)}
              onLogout={logout}
              containerClassName="admin-topbar-actions"
              secondaryButtonClassName={secondaryButtonClassName}
              darkButtonClassName={darkButtonClassName}
            />
          </div>

          <div className="admin-header">
            <div>
              <AdminBranding
                title="Dashboard"
                titleClassName="section-title"
                titleAs="h1"
                titleStyle={{ fontSize: "2.2rem", marginBottom: 0 }}
              />
            </div>
            <AdminActionButtons
              busy={busy}
              onRefresh={() => refreshAll(token)}
              onLogout={logout}
              containerClassName="admin-header-actions"
              secondaryButtonClassName={secondaryButtonClassName}
              darkButtonClassName={darkButtonClassName}
            />
          </div>

          {status ? (
            <div className="admin-status-banner" role="status">
              {status}
            </div>
          ) : null}

          <section className="admin-workspace">
            {activeTab === "products" ? (
              <div className="admin-grid-2">
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">
                    {editingProductId ? "Edit product" : "Add product"}
                  </h2>
                  <form className="admin-form" onSubmit={saveProduct}>
                    <fieldset disabled={busy} className="admin-fieldset">
                      <div className="admin-field">
                        <label className="admin-label" htmlFor="product_name">
                          Product name
                        </label>
                        <input
                          id="product_name"
                          required
                          className={fieldClassName}
                          placeholder="e.g., Bio Composite Panel"
                          value={productDraft.name}
                          onChange={(e) =>
                            setProductDraft((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="product_category"
                        >
                          Category
                        </label>
                        <select
                          id="product_category"
                          required
                          className={selectClassName}
                          value={productDraft.category}
                          onChange={(e) =>
                            setProductDraft((p) => ({
                              ...p,
                              category: e.target.value,
                            }))
                          }
                        >
                          <option value="" disabled={categories.length > 0}>
                            {categories.length > 0
                              ? "Select category"
                              : "No categories yet"}
                          </option>
                          {categories.map((c) => (
                            <option key={c._id} value={c.category_name}>
                              {c.category_name}
                            </option>
                          ))}
                        </select>
                        {!editingProductId && categories.length === 0 ? (
                          <p className="admin-field-help">
                            Add a category first in the Categories tab.
                          </p>
                        ) : null}
                      </div>

                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="product_description"
                        >
                          Description
                        </label>
                        <textarea
                          id="product_description"
                          className={textareaClassName}
                          rows={4}
                          placeholder="Short overview for the products page"
                          value={productDraft.description}
                          onChange={(e) =>
                            setProductDraft((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <p className="admin-label">Assets</p>
                        <p className="admin-field-help">
                          Upload an image / document or paste an existing URL.
                        </p>

                        <div className="admin-subgrid-2 admin-subgrid-padded">
                          <div className="admin-field">
                            <label
                              className="admin-label"
                              htmlFor="product_image_url"
                            >
                              Image URL
                            </label>
                            <input
                              id="product_image_url"
                              className={fieldClassName}
                              placeholder="https://..."
                              value={productDraft.image}
                              onChange={(e) =>
                                setProductDraft((p) => ({
                                  ...p,
                                  image: e.target.value,
                                }))
                              }
                            />
                            <input
                              className={fileInputClassName}
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                uploadProductAsset(e.target.files?.[0], "image")
                              }
                            />
                            {productDraft.image ? (
                              <div className="admin-preview-card">
                                <img
                                  src={productDraft.image}
                                  alt="Product preview"
                                  className="admin-preview-image"
                                  loading="lazy"
                                />
                              </div>
                            ) : null}
                          </div>

                          <div className="admin-field">
                            <label
                              className="admin-label"
                              htmlFor="product_document_url"
                            >
                              Document URL
                            </label>
                            <input
                              id="product_document_url"
                              className={fieldClassName}
                              placeholder="https://..."
                              value={productDraft.document}
                              onChange={(e) =>
                                setProductDraft((p) => ({
                                  ...p,
                                  document: e.target.value,
                                }))
                              }
                            />
                            <input
                              className={fileInputClassName}
                              type="file"
                              onChange={(e) =>
                                uploadProductAsset(
                                  e.target.files?.[0],
                                  "document",
                                )
                              }
                            />
                            {productDraft.document ? (
                              <a
                                className={inlineLinkClassName}
                                href={productDraft.document}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open document
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="admin-subgrid-2">
                        <div className="admin-field">
                          <label
                            className="admin-label"
                            htmlFor="product_applications"
                          >
                            Applications
                          </label>
                          <input
                            id="product_applications"
                            className={fieldClassName}
                            placeholder="comma-separated"
                            value={productDraft.applicationsText}
                            onChange={(e) =>
                              setProductDraft((p) => ({
                                ...p,
                                applicationsText: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="admin-field">
                          <label
                            className="admin-label"
                            htmlFor="product_materials"
                          >
                            Materials
                          </label>
                          <input
                            id="product_materials"
                            className={fieldClassName}
                            placeholder="comma-separated"
                            value={productDraft.materialsText}
                            onChange={(e) =>
                              setProductDraft((p) => ({
                                ...p,
                                materialsText: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </fieldset>

                    <div className="admin-action-row">
                      <button
                        type="submit"
                        disabled={
                          busy || (!editingProductId && categories.length === 0)
                        }
                        className={primaryButtonClassName}
                      >
                        {busy
                          ? editingProductId
                            ? "Updating…"
                            : "Creating…"
                          : editingProductId
                            ? "Update"
                            : "Create"}
                      </button>
                      {editingProductId ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setEditingProductId(null);
                            setProductDraft(productEmpty);
                          }}
                          className={secondaryButtonClassName}
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>

                <div className="admin-panel-card">
                  <h2 className="admin-section-title">Products</h2>
                  {products.length === 0 ? (
                    <p className="admin-empty">No products yet.</p>
                  ) : (
                    <div className="admin-list">
                      {products.map((p, idx) => (
                        <div
                          key={p._id}
                          className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                        >
                          <div className="admin-record-row">
                            <div className="admin-record-main admin-record-main-media">
                              {p.image ? (
                                <div className="admin-record-thumb">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="admin-record-thumb-image"
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <div className="admin-record-thumb admin-record-thumb-placeholder" />
                              )}
                              <div className="admin-record-copy">
                                <p className="admin-record-title">{p.name}</p>
                                <p className="admin-record-meta">
                                  {p.category}
                                </p>
                                {p.description ? (
                                  <p className="admin-record-text">
                                    {p.description}
                                  </p>
                                ) : null}
                                {p.image || p.document ? (
                                  <div className="admin-record-links">
                                    {p.image ? (
                                      <a
                                        className={inlineLinkClassName}
                                        href={p.image}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        View image
                                      </a>
                                    ) : null}
                                    {p.document ? (
                                      <a
                                        className={inlineLinkClassName}
                                        href={p.document}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Open document
                                      </a>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="admin-item-actions">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => editProduct(p)}
                                className={secondaryButtonClassName}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => deleteProduct(p._id)}
                                className={darkButtonClassName}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {activeTab === "categories" ? (
              <div className="admin-grid-2">
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">Add category</h2>
                  <form className="admin-form" onSubmit={addCategory}>
                    <fieldset disabled={busy} className="admin-fieldset">
                      <div className="admin-field">
                        <label className="admin-label" htmlFor="category_name">
                          Category name
                        </label>
                        <input
                          id="category_name"
                          className={fieldClassName}
                          placeholder="e.g., Packaging"
                          value={categoryDraft.category_name}
                          onChange={(e) =>
                            setCategoryDraft((c) => ({
                              ...c,
                              category_name: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="category_description"
                        >
                          Description
                        </label>
                        <textarea
                          id="category_description"
                          className={textareaClassName}
                          rows={4}
                          placeholder="Optional summary"
                          value={categoryDraft.description}
                          onChange={(e) =>
                            setCategoryDraft((c) => ({
                              ...c,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </fieldset>

                    <button
                      type="submit"
                      disabled={busy}
                      className={primaryButtonClassName}
                    >
                      {busy ? "Creating…" : "Create"}
                    </button>
                  </form>
                </div>
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">Categories</h2>
                  {categories.length === 0 ? (
                    <p className="admin-empty">No categories yet.</p>
                  ) : (
                    <div className="admin-list">
                      {categories.map((c, idx) => (
                        <div
                          key={c._id}
                          className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                        >
                          <div className="admin-record-row">
                            <div className="admin-record-copy">
                              <p className="admin-record-title">
                                {c.category_name}
                              </p>
                              {c.description ? (
                                <p className="admin-record-text">
                                  {c.description}
                                </p>
                              ) : (
                                <p className="admin-record-muted">
                                  No description.
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => deleteCategory(c._id)}
                              className={darkButtonClassName}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {activeTab === "services" ? (
              <div className="admin-grid-2">
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">
                    {editingServiceId ? "Edit service" : "Add service"}
                  </h2>
                  <form className="admin-form" onSubmit={saveService}>
                    <fieldset disabled={busy} className="admin-fieldset">
                      <div className="admin-field">
                        <label className="admin-label" htmlFor="service_title">
                          Title
                        </label>
                        <input
                          id="service_title"
                          className={fieldClassName}
                          placeholder="e.g., Product Development"
                          value={serviceDraft.title}
                          onChange={(e) =>
                            setServiceDraft((s) => ({
                              ...s,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="service_description"
                        >
                          Description
                        </label>
                        <textarea
                          id="service_description"
                          className={textareaClassName}
                          rows={4}
                          placeholder="What this service includes"
                          value={serviceDraft.description}
                          onChange={(e) =>
                            setServiceDraft((s) => ({
                              ...s,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </fieldset>

                    <div className="admin-action-row">
                      <button
                        type="submit"
                        disabled={busy}
                        className={primaryButtonClassName}
                      >
                        {busy
                          ? editingServiceId
                            ? "Updating…"
                            : "Creating…"
                          : editingServiceId
                            ? "Update"
                            : "Create"}
                      </button>
                      {editingServiceId ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setEditingServiceId(null);
                            setServiceDraft(serviceEmpty);
                          }}
                          className={secondaryButtonClassName}
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">Services</h2>
                  {services.length === 0 ? (
                    <p className="admin-empty">No services yet.</p>
                  ) : (
                    <div className="admin-list">
                      {services.map((s, idx) => (
                        <div
                          key={s._id}
                          className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                        >
                          <div className="admin-record-row">
                            <div className="admin-record-copy">
                              <p className="admin-record-title">{s.title}</p>
                              {s.description ? (
                                <p className="admin-record-text">
                                  {s.description}
                                </p>
                              ) : (
                                <p className="admin-record-muted">
                                  No description.
                                </p>
                              )}
                            </div>
                            <div className="admin-item-actions">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => editService(s)}
                                className={secondaryButtonClassName}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => deleteService(s._id)}
                                className={darkButtonClassName}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {activeTab === "training" ? (
              <div className="admin-grid-2">
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">
                    {editingProgramId
                      ? "Edit training program"
                      : "Add training program"}
                  </h2>
                  <form className="admin-form" onSubmit={saveProgram}>
                    <fieldset disabled={busy} className="admin-fieldset">
                      <div className="admin-field">
                        <label className="admin-label" htmlFor="program_title">
                          Title
                        </label>
                        <input
                          id="program_title"
                          className={fieldClassName}
                          placeholder="e.g., Sustainability in Materials"
                          value={programDraft.title}
                          onChange={(e) =>
                            setProgramDraft((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="program_description"
                        >
                          Description
                        </label>
                        <textarea
                          id="program_description"
                          className={textareaClassName}
                          rows={4}
                          placeholder="What attendees will learn"
                          value={programDraft.description}
                          onChange={(e) =>
                            setProgramDraft((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="admin-subgrid-2">
                        <div className="admin-field">
                          <label className="admin-label" htmlFor="program_date">
                            Date
                          </label>
                          <input
                            id="program_date"
                            type="date"
                            className={fieldClassName}
                            value={programDraft.date}
                            onChange={(e) =>
                              setProgramDraft((p) => ({
                                ...p,
                                date: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="admin-field">
                          <label className="admin-label" htmlFor="program_mode">
                            Mode
                          </label>
                          <select
                            id="program_mode"
                            className={selectClassName}
                            value={programDraft.mode}
                            onChange={(e) =>
                              setProgramDraft((p) => ({
                                ...p,
                                mode: e.target.value,
                              }))
                            }
                          >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                          </select>
                        </div>
                      </div>

                      <div className="admin-subgrid-2">
                        <div className="admin-field">
                          <label
                            className="admin-label"
                            htmlFor="program_duration"
                          >
                            Duration
                          </label>
                          <input
                            id="program_duration"
                            className={fieldClassName}
                            placeholder="e.g., 2 hours"
                            value={programDraft.duration}
                            onChange={(e) =>
                              setProgramDraft((p) => ({
                                ...p,
                                duration: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="admin-field">
                          <label
                            className="admin-label"
                            htmlFor="program_location"
                          >
                            Location
                          </label>
                          <input
                            id="program_location"
                            className={fieldClassName}
                            placeholder="e.g., Hyderabad"
                            value={programDraft.location}
                            onChange={(e) =>
                              setProgramDraft((p) => ({
                                ...p,
                                location: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </fieldset>

                    <div className="admin-action-row">
                      <button
                        type="submit"
                        disabled={busy}
                        className={primaryButtonClassName}
                      >
                        {busy
                          ? editingProgramId
                            ? "Updating…"
                            : "Creating…"
                          : editingProgramId
                            ? "Update"
                            : "Create"}
                      </button>
                      {editingProgramId ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setEditingProgramId(null);
                            setProgramDraft(programEmpty);
                          }}
                          className={secondaryButtonClassName}
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>
                <div className="admin-stack-lg">
                  <div className="admin-panel-card">
                    <h2 className="admin-section-title">Training programs</h2>
                    {programs.length === 0 ? (
                      <p className="admin-empty">No programs yet.</p>
                    ) : (
                      <div className="admin-list">
                        {programs.map((p, idx) => (
                          <div
                            key={p._id}
                            className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                          >
                            <div className="admin-record-row">
                              <div className="admin-record-copy">
                                <p className="admin-record-title">{p.title}</p>
                                <p className="admin-record-meta">
                                  {p.mode}
                                  {p.date
                                    ? ` • ${String(p.date).slice(0, 10)}`
                                    : ""}
                                  {p.duration ? ` • ${p.duration}` : ""}
                                  {p.location ? ` • ${p.location}` : ""}
                                </p>
                                {p.description ? (
                                  <p className="admin-record-text">
                                    {p.description}
                                  </p>
                                ) : (
                                  <p className="admin-record-muted">
                                    No description.
                                  </p>
                                )}
                              </div>
                              <div className="admin-item-actions">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => editProgram(p)}
                                  className={secondaryButtonClassName}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => deleteProgram(p._id)}
                                  className={darkButtonClassName}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admin-panel-card">
                    <h2 className="admin-section-title">Participants</h2>
                    {participants.length === 0 ? (
                      <p className="admin-empty">No participants yet.</p>
                    ) : (
                      <div className="admin-list">
                        {participants.map((p, idx) => (
                          <div
                            key={p._id}
                            className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                          >
                            <p className="admin-record-title">
                              {p.name} ({p.email})
                            </p>
                            <p className="admin-record-meta">
                              Program: {p.program_id?.title ?? "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "contacts" ? (
              <div className="admin-panel-card">
                <h2 className="admin-section-title">Inquiries</h2>
                {contacts.length === 0 ? (
                  <p className="admin-empty">No inquiries yet.</p>
                ) : (
                  <div className="admin-list">
                    {contacts.map((c, idx) => (
                      <div
                        key={c._id}
                        className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                      >
                        <div className="admin-record-row">
                          <div className="admin-record-copy">
                            <p className="admin-record-title">
                              {c.name} ({c.email})
                            </p>
                            {c.subject ? (
                              <p className="admin-record-meta">
                                Subject: {c.subject}
                              </p>
                            ) : (
                              <p className="admin-record-muted">No subject.</p>
                            )}
                            <p className="admin-record-text">{c.message}</p>
                          </div>
                          <div className="admin-item-actions">
                            <select
                              disabled={busy}
                              className={selectClassName}
                              value={c.status}
                              onChange={(e) =>
                                updateContactStatus(c._id, e.target.value)
                              }
                            >
                              <option value="new">New</option>
                              <option value="in_progress">In progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === "collab" ? (
              <div className="admin-panel-card">
                <h2 className="admin-section-title">Collaboration requests</h2>
                {collab.length === 0 ? (
                  <p className="admin-empty">No collaboration requests yet.</p>
                ) : (
                  <div className="admin-list">
                    {collab.map((r, idx) => (
                      <div
                        key={r._id}
                        className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                      >
                        <div className="admin-record-row">
                          <div className="admin-record-copy">
                            <p className="admin-record-title">
                              {r.name} ({r.email})
                            </p>
                            {r.organization ? (
                              <p className="admin-record-meta">
                                {r.organization}
                              </p>
                            ) : (
                              <p className="admin-record-muted">
                                No organization.
                              </p>
                            )}
                            {r.research_area ? (
                              <p className="admin-record-text">
                                Area: {r.research_area}
                              </p>
                            ) : null}
                            {r.proposal_file ? (
                              <a
                                className={inlineLinkClassName}
                                href={r.proposal_file}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open proposal file
                              </a>
                            ) : (
                              <p className="admin-record-muted">
                                No proposal file.
                              </p>
                            )}
                          </div>
                          <div className="admin-item-actions">
                            <select
                              disabled={busy}
                              className={selectClassName}
                              value={r.status}
                              onChange={(e) =>
                                updateCollabStatus(r._id, e.target.value)
                              }
                            >
                              <option value="submitted">Submitted</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === "custom" ? (
              <div className="admin-panel-card">
                <h2 className="admin-section-title">Custom product requests</h2>
                {customRequests.length === 0 ? (
                  <p className="admin-empty">No requests yet.</p>
                ) : (
                  <div className="admin-list">
                    {customRequests.map((r, idx) => (
                      <div
                        key={r._id}
                        className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                      >
                        <div className="admin-record-row">
                          <div className="admin-record-copy">
                            <p className="admin-record-title">
                              {r.company_name} ({r.email})
                            </p>
                            {r.industry ? (
                              <p className="admin-record-meta">{r.industry}</p>
                            ) : (
                              <p className="admin-record-muted">No industry.</p>
                            )}
                            <p className="admin-record-text">
                              {r.product_description}
                            </p>
                            {r.attachment ? (
                              <a
                                className={inlineLinkClassName}
                                href={r.attachment}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open attachment
                              </a>
                            ) : (
                              <p className="admin-record-muted">
                                No attachment.
                              </p>
                            )}
                          </div>
                          <div className="admin-item-actions">
                            <select
                              disabled={busy}
                              className={selectClassName}
                              value={r.status}
                              onChange={(e) =>
                                updateCustomStatus(r._id, e.target.value)
                              }
                            >
                              <option value="submitted">Submitted</option>
                              <option value="in_review">In review</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === "files" ? (
              <div className="admin-grid-2">
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">Upload file</h2>
                  <p className="admin-panel-desc">
                    Upload product images, brochures, PDFs, proposals.
                  </p>
                  <div className="admin-field admin-field-tight">
                    <label className="admin-label">Choose a file</label>
                    <input
                      disabled={busy}
                      className={fileInputClassName}
                      type="file"
                      onChange={(e) => uploadFile(e.target.files?.[0])}
                    />
                  </div>
                </div>
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">Files</h2>
                  {files.length === 0 ? (
                    <p className="admin-empty">No files yet.</p>
                  ) : (
                    <div className="admin-list">
                      {files.map((f, idx) => (
                        <div
                          key={f._id}
                          className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                        >
                          <p className="admin-record-title">{f.file_name}</p>
                          <p className="admin-record-meta">{f.file_type}</p>
                          <a
                            className={`${inlineLinkClassName} admin-inline-link-break`}
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open file
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {activeTab === "content" ? (
              <div className="admin-panel-card admin-panel-card-wide">
                <h2 className="admin-section-title">Website content</h2>
                <form className="admin-form" onSubmit={saveSiteContent}>
                  <fieldset disabled={busy} className="admin-fieldset">
                    <div className="admin-field">
                      <label className="admin-label" htmlFor="content_vision">
                        Vision
                      </label>
                      <textarea
                        id="content_vision"
                        className={textareaClassName}
                        rows={3}
                        placeholder="Short statement"
                        value={siteContent.vision}
                        onChange={(e) =>
                          setSiteContent((c) => ({
                            ...c,
                            vision: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label" htmlFor="content_mission">
                        Mission
                      </label>
                      <textarea
                        id="content_mission"
                        className={textareaClassName}
                        rows={3}
                        placeholder="Short statement"
                        value={siteContent.mission}
                        onChange={(e) =>
                          setSiteContent((c) => ({
                            ...c,
                            mission: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label
                        className="admin-label"
                        htmlFor="content_technologies"
                      >
                        Technologies
                      </label>
                      <input
                        id="content_technologies"
                        className={fieldClassName}
                        placeholder="Comma-separated (e.g., PLA, PHA, Recycled PET)"
                        value={joinList(siteContent.technologies)}
                        onChange={(e) =>
                          setSiteContent((c) => ({
                            ...c,
                            technologies: parseList(e.target.value),
                          }))
                        }
                      />
                    </div>

                    <div className="admin-subgrid-2">
                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="content_contact_email"
                        >
                          Contact email
                        </label>
                        <input
                          id="content_contact_email"
                          type="email"
                          className={fieldClassName}
                          placeholder="e.g., info@hanriaecotech.com"
                          value={siteContent.contactEmail}
                          onChange={(e) =>
                            setSiteContent((c) => ({
                              ...c,
                              contactEmail: e.target.value,
                            }))
                          }
                        />
                        <p className="admin-field-help">
                          Contact form emails will be sent here.
                        </p>
                      </div>
                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="content_contact_location"
                        >
                          Location
                        </label>
                        <input
                          id="content_contact_location"
                          className={fieldClassName}
                          placeholder="e.g., Hyderabad, India"
                          value={siteContent.contactLocation}
                          onChange={(e) =>
                            setSiteContent((c) => ({
                              ...c,
                              contactLocation: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </fieldset>
                  <button
                    type="submit"
                    disabled={busy}
                    className={primaryButtonClassName}
                  >
                    {busy ? "Saving…" : "Save"}
                  </button>
                </form>
              </div>
            ) : null}

            {activeTab === "newsletter" ? (
              <div className="admin-grid-2">
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">Subscribers</h2>
                  <p className="admin-panel-desc">
                    Total subscribers: {subscribers.length}
                  </p>
                  {subscribers.length === 0 ? (
                    <p className="admin-empty">No subscribers yet.</p>
                  ) : (
                    <div className="admin-list">
                      {subscribers.slice(0, 20).map((s, idx) => (
                        <div
                          key={s._id}
                          className={`admin-list-item${idx === 0 ? "" : " admin-list-item-bordered"}`}
                        >
                          <p className="admin-record-text admin-record-text-tight">
                            {s.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {subscribers.length > 20 ? (
                    <p className="admin-field-help">Showing first 20.</p>
                  ) : null}
                </div>
                <div className="admin-panel-card">
                  <h2 className="admin-section-title">Send email</h2>
                  <form className="admin-form" onSubmit={sendNewsletter}>
                    <fieldset disabled={busy} className="admin-fieldset">
                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="newsletter_subject"
                        >
                          Subject
                        </label>
                        <input
                          id="newsletter_subject"
                          className={fieldClassName}
                          placeholder="Email subject"
                          value={newsletterDraft.subject}
                          onChange={(e) =>
                            setNewsletterDraft((d) => ({
                              ...d,
                              subject: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="admin-field">
                        <label
                          className="admin-label"
                          htmlFor="newsletter_text"
                        >
                          Message
                        </label>
                        <textarea
                          id="newsletter_text"
                          className={textareaClassName}
                          rows={6}
                          placeholder="Email text"
                          value={newsletterDraft.text}
                          onChange={(e) =>
                            setNewsletterDraft((d) => ({
                              ...d,
                              text: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </fieldset>
                    <button
                      type="submit"
                      disabled={busy}
                      className={primaryButtonClassName}
                    >
                      {busy ? "Sending…" : "Send"}
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
