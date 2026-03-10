const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;

export const BACKEND_URL =
  typeof rawBackendUrl === "string"
    ? rawBackendUrl.trim().replace(/\/$/, "")
    : "";

export function apiUrl(path) {
  const p = String(path ?? "");
  if (!p) return BACKEND_URL;
  if (/^https?:\/\//i.test(p)) return p;
  if (!BACKEND_URL) return p;
  return p.startsWith("/") ? `${BACKEND_URL}${p}` : `${BACKEND_URL}/${p}`;
}
