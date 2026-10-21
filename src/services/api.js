const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
export async function apiRequest(path, options = {}) {
  const headers = { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(options.headers || {}) };
  const response = await fetch(`${API_BASE}${path}`, { credentials: "include", ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}
export default apiRequest;
