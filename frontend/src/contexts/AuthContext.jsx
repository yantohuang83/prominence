import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { api, setToken, formatApiError } from "../lib/api";

const AuthContext = createContext({ user: null, loading: true, login: async () => {}, logout: async () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = unknown/loading, false = anon
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (e) {
      setUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    try {
      const resp = await api.post("/auth/login", { email, password });
      const xat = resp.headers?.["x-access-token"];
      if (xat) setToken(xat);
      setUser(resp.data);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); } catch { /* ignore */ }
    setToken(null);
    setUser(false);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refresh: fetchMe }), [user, loading, login, logout, fetchMe]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
