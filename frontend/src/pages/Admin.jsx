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

  if (!token) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Enter the admin key to access the dashboard.
          </p>

          <form className="mt-6 space-y-4" onSubmit={login}>
            <div>
              <label
                className="text-sm font-medium text-stone-700"
                htmlFor="key"
              >
                Admin Key
              </label>
              <input
                id="key"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
                placeholder="Enter admin key"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>

            {status ? (
              <p className="text-sm text-stone-700" role="alert">
                {status}
              </p>
            ) : null}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="lg:flex lg:gap-6">
        {sidebarOpen ? (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="absolute inset-0 bg-stone-900/40"
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                    Admin
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    Dashboard
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50"
                  onClick={() => setSidebarOpen(false)}
                >
                  Close
                </button>
              </div>
              <nav className="p-3">
                <div className="space-y-1">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setActiveTab(t.id);
                        setSidebarOpen(false);
                      }}
                      className={
                        "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 " +
                        (activeTab === t.id
                          ? "bg-emerald-700 text-white"
                          : "text-stone-800 hover:bg-stone-50")
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        ) : null}

        <aside className="hidden lg:block lg:w-64">
          <div className="sticky top-10 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Admin
              </p>
              <p className="mt-2 text-base font-semibold text-stone-900">
                Dashboard
              </p>
            </div>
            <nav className="mt-4">
              <div className="space-y-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    disabled={busy}
                    onClick={() => setActiveTab(t.id)}
                    className={
                      "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 " +
                      (activeTab === t.id
                        ? "bg-emerald-700 text-white"
                        : "text-stone-800 hover:bg-stone-50")
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              disabled={busy}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Open navigation"
            >
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-5 bg-stone-900" />
                <span className="block h-0.5 w-5 bg-stone-900" />
                <span className="block h-0.5 w-5 bg-stone-900" />
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Admin
              </p>
              <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-stone-900">
                Dashboard
              </h1>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => refreshAll(token)}
                disabled={busy}
                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 disabled:opacity-60"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-4 hidden flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Admin
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                Dashboard
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => refreshAll(token)}
                disabled={busy}
                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50 disabled:opacity-60"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
              >
                Logout
              </button>
            </div>
          </div>

          {status ? (
            <div
              className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700"
              role="status"
            >
              {status}
            </div>
          ) : null}

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            {activeTab === "products" ? (
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    {editingProductId ? "Edit product" : "Add product"}
                  </h2>
                  <form className="mt-4 space-y-4" onSubmit={saveProduct}>
                    <fieldset
                      disabled={busy}
                      className="space-y-4 disabled:opacity-75"
                    >
                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="product_name"
                        >
                          Product name
                        </label>
                        <input
                          id="product_name"
                          required
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="product_category"
                        >
                          Category
                        </label>
                        <select
                          id="product_category"
                          required
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600"
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
                          <p className="mt-2 text-xs text-stone-600">
                            Add a category first in the Categories tab.
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="product_description"
                        >
                          Description
                        </label>
                        <textarea
                          id="product_description"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                      <div>
                        <p className="text-sm font-medium text-stone-700">
                          Assets
                        </p>
                        <p className="mt-1 text-xs text-stone-600">
                          Upload an image / document or paste an existing URL.
                        </p>

                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              className="text-sm font-medium text-stone-700"
                              htmlFor="product_image_url"
                            >
                              Image URL
                            </label>
                            <input
                              id="product_image_url"
                              className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                              className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                uploadProductAsset(e.target.files?.[0], "image")
                              }
                            />
                            {productDraft.image ? (
                              <div className="mt-2 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                                <img
                                  src={productDraft.image}
                                  alt="Product preview"
                                  className="h-32 w-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                            ) : null}
                          </div>

                          <div>
                            <label
                              className="text-sm font-medium text-stone-700"
                              htmlFor="product_document_url"
                            >
                              Document URL
                            </label>
                            <input
                              id="product_document_url"
                              className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                              className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm"
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
                                className="mt-2 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-900"
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

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            className="text-sm font-medium text-stone-700"
                            htmlFor="product_applications"
                          >
                            Applications
                          </label>
                          <input
                            id="product_applications"
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                        <div>
                          <label
                            className="text-sm font-medium text-stone-700"
                            htmlFor="product_materials"
                          >
                            Materials
                          </label>
                          <input
                            id="product_materials"
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={
                          busy || (!editingProductId && categories.length === 0)
                        }
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                          className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>

                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Products
                  </h2>
                  {products.length === 0 ? (
                    <p className="mt-4 text-sm text-stone-600">
                      No products yet.
                    </p>
                  ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                      {products.map((p, idx) => (
                        <div
                          key={p._id}
                          className={
                            "p-4 " +
                            (idx === 0 ? "" : "border-t border-stone-200")
                          }
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 gap-4">
                              {p.image ? (
                                <div className="h-14 w-14 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <div className="h-14 w-14 rounded-xl border border-stone-200 bg-stone-50" />
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-stone-900">
                                  {p.name}
                                </p>
                                <p className="mt-1 text-xs text-stone-600">
                                  {p.category}
                                </p>
                                {p.description ? (
                                  <p className="mt-2 text-sm text-stone-600">
                                    {p.description}
                                  </p>
                                ) : null}
                                {p.image || p.document ? (
                                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                                    {p.image ? (
                                      <a
                                        className="font-semibold text-emerald-800 hover:text-emerald-900"
                                        href={p.image}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        View image
                                      </a>
                                    ) : null}
                                    {p.document ? (
                                      <a
                                        className="font-semibold text-emerald-800 hover:text-emerald-900"
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

                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => editProduct(p)}
                                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => deleteProduct(p._id)}
                                className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
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
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Add category
                  </h2>
                  <form className="mt-4 space-y-4" onSubmit={addCategory}>
                    <fieldset
                      disabled={busy}
                      className="space-y-4 disabled:opacity-75"
                    >
                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="category_name"
                        >
                          Category name
                        </label>
                        <input
                          id="category_name"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="category_description"
                        >
                          Description
                        </label>
                        <textarea
                          id="category_description"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy ? "Creating…" : "Create"}
                    </button>
                  </form>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Categories
                  </h2>
                  {categories.length === 0 ? (
                    <p className="mt-4 text-sm text-stone-600">
                      No categories yet.
                    </p>
                  ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                      {categories.map((c, idx) => (
                        <div
                          key={c._id}
                          className={
                            "p-4 " +
                            (idx === 0 ? "" : "border-t border-stone-200")
                          }
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-stone-900">
                                {c.category_name}
                              </p>
                              {c.description ? (
                                <p className="mt-2 text-sm text-stone-600">
                                  {c.description}
                                </p>
                              ) : (
                                <p className="mt-2 text-sm text-stone-500">
                                  No description.
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => deleteCategory(c._id)}
                              className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
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
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    {editingServiceId ? "Edit service" : "Add service"}
                  </h2>
                  <form className="mt-4 space-y-4" onSubmit={saveService}>
                    <fieldset
                      disabled={busy}
                      className="space-y-4 disabled:opacity-75"
                    >
                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="service_title"
                        >
                          Title
                        </label>
                        <input
                          id="service_title"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="service_description"
                        >
                          Description
                        </label>
                        <textarea
                          id="service_description"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={busy}
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                          className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Services
                  </h2>
                  {services.length === 0 ? (
                    <p className="mt-4 text-sm text-stone-600">
                      No services yet.
                    </p>
                  ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                      {services.map((s, idx) => (
                        <div
                          key={s._id}
                          className={
                            "p-4 " +
                            (idx === 0 ? "" : "border-t border-stone-200")
                          }
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-stone-900">
                                {s.title}
                              </p>
                              {s.description ? (
                                <p className="mt-2 text-sm text-stone-600">
                                  {s.description}
                                </p>
                              ) : (
                                <p className="mt-2 text-sm text-stone-500">
                                  No description.
                                </p>
                              )}
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => editService(s)}
                                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => deleteService(s._id)}
                                className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
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
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    {editingProgramId
                      ? "Edit training program"
                      : "Add training program"}
                  </h2>
                  <form className="mt-4 space-y-4" onSubmit={saveProgram}>
                    <fieldset
                      disabled={busy}
                      className="space-y-4 disabled:opacity-75"
                    >
                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="program_title"
                        >
                          Title
                        </label>
                        <input
                          id="program_title"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="program_description"
                        >
                          Description
                        </label>
                        <textarea
                          id="program_description"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            className="text-sm font-medium text-stone-700"
                            htmlFor="program_date"
                          >
                            Date
                          </label>
                          <input
                            id="program_date"
                            type="date"
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600"
                            value={programDraft.date}
                            onChange={(e) =>
                              setProgramDraft((p) => ({
                                ...p,
                                date: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label
                            className="text-sm font-medium text-stone-700"
                            htmlFor="program_mode"
                          >
                            Mode
                          </label>
                          <select
                            id="program_mode"
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600"
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

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            className="text-sm font-medium text-stone-700"
                            htmlFor="program_duration"
                          >
                            Duration
                          </label>
                          <input
                            id="program_duration"
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                        <div>
                          <label
                            className="text-sm font-medium text-stone-700"
                            htmlFor="program_location"
                          >
                            Location
                          </label>
                          <input
                            id="program_location"
                            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={busy}
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                          className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-base font-semibold text-stone-900">
                      Training programs
                    </h2>
                    {programs.length === 0 ? (
                      <p className="mt-4 text-sm text-stone-600">
                        No programs yet.
                      </p>
                    ) : (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                        {programs.map((p, idx) => (
                          <div
                            key={p._id}
                            className={
                              "p-4 " +
                              (idx === 0 ? "" : "border-t border-stone-200")
                            }
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-stone-900">
                                  {p.title}
                                </p>
                                <p className="mt-1 text-xs text-stone-600">
                                  {p.mode}
                                  {p.date
                                    ? ` • ${String(p.date).slice(0, 10)}`
                                    : ""}
                                  {p.duration ? ` • ${p.duration}` : ""}
                                  {p.location ? ` • ${p.location}` : ""}
                                </p>
                                {p.description ? (
                                  <p className="mt-2 text-sm text-stone-600">
                                    {p.description}
                                  </p>
                                ) : (
                                  <p className="mt-2 text-sm text-stone-500">
                                    No description.
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 gap-2">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => editProgram(p)}
                                  className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => deleteProgram(p._id)}
                                  className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
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

                  <div>
                    <h2 className="text-base font-semibold text-stone-900">
                      Participants
                    </h2>
                    {participants.length === 0 ? (
                      <p className="mt-4 text-sm text-stone-600">
                        No participants yet.
                      </p>
                    ) : (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                        {participants.map((p, idx) => (
                          <div
                            key={p._id}
                            className={
                              "p-4 " +
                              (idx === 0 ? "" : "border-t border-stone-200")
                            }
                          >
                            <p className="text-sm font-semibold text-stone-900">
                              {p.name} ({p.email})
                            </p>
                            <p className="mt-1 text-xs text-stone-600">
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
              <div>
                <h2 className="text-base font-semibold text-stone-900">
                  Inquiries
                </h2>
                {contacts.length === 0 ? (
                  <p className="mt-4 text-sm text-stone-600">
                    No inquiries yet.
                  </p>
                ) : (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                    {contacts.map((c, idx) => (
                      <div
                        key={c._id}
                        className={
                          "p-4 " +
                          (idx === 0 ? "" : "border-t border-stone-200")
                        }
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-stone-900">
                              {c.name} ({c.email})
                            </p>
                            {c.subject ? (
                              <p className="mt-1 text-xs text-stone-600">
                                Subject: {c.subject}
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-stone-500">
                                No subject.
                              </p>
                            )}
                            <p className="mt-2 text-sm text-stone-600">
                              {c.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              disabled={busy}
                              className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
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
              <div>
                <h2 className="text-base font-semibold text-stone-900">
                  Collaboration requests
                </h2>
                {collab.length === 0 ? (
                  <p className="mt-4 text-sm text-stone-600">
                    No collaboration requests yet.
                  </p>
                ) : (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                    {collab.map((r, idx) => (
                      <div
                        key={r._id}
                        className={
                          "p-4 " +
                          (idx === 0 ? "" : "border-t border-stone-200")
                        }
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-stone-900">
                              {r.name} ({r.email})
                            </p>
                            {r.organization ? (
                              <p className="mt-1 text-xs text-stone-600">
                                {r.organization}
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-stone-500">
                                No organization.
                              </p>
                            )}
                            {r.research_area ? (
                              <p className="mt-2 text-sm text-stone-600">
                                Area: {r.research_area}
                              </p>
                            ) : null}
                            {r.proposal_file ? (
                              <a
                                className="mt-2 block text-sm font-medium text-emerald-800 hover:underline"
                                href={r.proposal_file}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open proposal file
                              </a>
                            ) : (
                              <p className="mt-2 text-sm text-stone-500">
                                No proposal file.
                              </p>
                            )}
                          </div>
                          <select
                            disabled={busy}
                            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
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
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === "custom" ? (
              <div>
                <h2 className="text-base font-semibold text-stone-900">
                  Custom product requests
                </h2>
                {customRequests.length === 0 ? (
                  <p className="mt-4 text-sm text-stone-600">
                    No requests yet.
                  </p>
                ) : (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                    {customRequests.map((r, idx) => (
                      <div
                        key={r._id}
                        className={
                          "p-4 " +
                          (idx === 0 ? "" : "border-t border-stone-200")
                        }
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-stone-900">
                              {r.company_name} ({r.email})
                            </p>
                            {r.industry ? (
                              <p className="mt-1 text-xs text-stone-600">
                                {r.industry}
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-stone-500">
                                No industry.
                              </p>
                            )}
                            <p className="mt-2 text-sm text-stone-600">
                              {r.product_description}
                            </p>
                            {r.attachment ? (
                              <a
                                className="mt-2 block text-sm font-medium text-emerald-800 hover:underline"
                                href={r.attachment}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open attachment
                              </a>
                            ) : (
                              <p className="mt-2 text-sm text-stone-500">
                                No attachment.
                              </p>
                            )}
                          </div>
                          <select
                            disabled={busy}
                            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
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
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === "files" ? (
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Upload file
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    Upload product images, brochures, PDFs, proposals.
                  </p>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-stone-700">
                      Choose a file
                    </label>
                    <input
                      disabled={busy}
                      className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                      type="file"
                      onChange={(e) => uploadFile(e.target.files?.[0])}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Files
                  </h2>
                  {files.length === 0 ? (
                    <p className="mt-4 text-sm text-stone-600">No files yet.</p>
                  ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                      {files.map((f, idx) => (
                        <div
                          key={f._id}
                          className={
                            "p-4 " +
                            (idx === 0 ? "" : "border-t border-stone-200")
                          }
                        >
                          <p className="text-sm font-semibold text-stone-900">
                            {f.file_name}
                          </p>
                          <p className="mt-1 text-xs text-stone-600">
                            {f.file_type}
                          </p>
                          <a
                            className="mt-2 block break-all text-sm font-medium text-emerald-800 hover:underline"
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
              <div className="max-w-3xl">
                <h2 className="text-base font-semibold text-stone-900">
                  Website content
                </h2>
                <form className="mt-4 space-y-4" onSubmit={saveSiteContent}>
                  <fieldset
                    disabled={busy}
                    className="space-y-4 disabled:opacity-75"
                  >
                    <div>
                      <label
                        className="text-sm font-medium text-stone-700"
                        htmlFor="content_vision"
                      >
                        Vision
                      </label>
                      <textarea
                        id="content_vision"
                        className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                    <div>
                      <label
                        className="text-sm font-medium text-stone-700"
                        htmlFor="content_mission"
                      >
                        Mission
                      </label>
                      <textarea
                        id="content_mission"
                        className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                    <div>
                      <label
                        className="text-sm font-medium text-stone-700"
                        htmlFor="content_technologies"
                      >
                        Technologies
                      </label>
                      <input
                        id="content_technologies"
                        className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="content_contact_email"
                        >
                          Contact email
                        </label>
                        <input
                          id="content_contact_email"
                          type="email"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
                          placeholder="e.g., info@hanriaecotech.com"
                          value={siteContent.contactEmail}
                          onChange={(e) =>
                            setSiteContent((c) => ({
                              ...c,
                              contactEmail: e.target.value,
                            }))
                          }
                        />
                        <p className="mt-2 text-xs text-stone-600">
                          Contact form emails will be sent here.
                        </p>
                      </div>
                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="content_contact_location"
                        >
                          Location
                        </label>
                        <input
                          id="content_contact_location"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? "Saving…" : "Save"}
                  </button>
                </form>
              </div>
            ) : null}

            {activeTab === "newsletter" ? (
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Subscribers
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    Total subscribers: {subscribers.length}
                  </p>
                  {subscribers.length === 0 ? (
                    <p className="mt-4 text-sm text-stone-600">
                      No subscribers yet.
                    </p>
                  ) : (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
                      {subscribers.slice(0, 20).map((s, idx) => (
                        <div
                          key={s._id}
                          className={
                            "px-4 py-3 text-sm text-stone-800 " +
                            (idx === 0 ? "" : "border-t border-stone-200")
                          }
                        >
                          {s.email}
                        </div>
                      ))}
                    </div>
                  )}
                  {subscribers.length > 20 ? (
                    <p className="mt-2 text-xs text-stone-500">
                      Showing first 20.
                    </p>
                  ) : null}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Send email
                  </h2>
                  <form className="mt-4 space-y-4" onSubmit={sendNewsletter}>
                    <fieldset
                      disabled={busy}
                      className="space-y-4 disabled:opacity-75"
                    >
                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="newsletter_subject"
                        >
                          Subject
                        </label>
                        <input
                          id="newsletter_subject"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                      <div>
                        <label
                          className="text-sm font-medium text-stone-700"
                          htmlFor="newsletter_text"
                        >
                          Message
                        </label>
                        <textarea
                          id="newsletter_text"
                          className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-600"
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
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
