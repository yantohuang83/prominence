import axios from "axios";

export const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Single axios instance used by admin/CMS calls.
// Cookies are sent on every request (httpOnly access_token + refresh_token).
// We also support a localStorage Bearer fallback for environments where
// 3rd-party cookies are blocked.
const TOKEN_KEY = "prominence_token";

export const setToken = (t) => {
  if (t) window.localStorage.setItem(TOKEN_KEY, t);
  else window.localStorage.removeItem(TOKEN_KEY);
};
export const getToken = () => window.localStorage.getItem(TOKEN_KEY);

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${t}`;
  }
  return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let pending = [];

api.interceptors.response.use(
  (resp) => {
    const xat = resp.headers?.["x-access-token"];
    if (xat) setToken(xat);
    return resp;
  },
  async (err) => {
    const original = err.config || {};
    if (err.response?.status === 401 && !original._retry && !original.url?.includes("/auth/")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pending.push({ resolve, reject, original });
        });
      }
      isRefreshing = true;
      try {
        const r = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        const xat = r.headers?.["x-access-token"];
        if (xat) setToken(xat);
        pending.forEach(({ resolve, original: o }) => {
          o._retry = true;
          resolve(api(o));
        });
        pending = [];
        original._retry = true;
        return api(original);
      } catch (e) {
        pending.forEach(({ reject }) => reject(e));
        pending = [];
        setToken(null);
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
    throw err;
  }
);

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  }
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
