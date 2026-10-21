import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser, login as loginRequest, signup as signupRequest, logout as logoutRequest } from "../services/authService.js";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; getCurrentUser().then(d => { if (active) setUser(d.user || null); }).catch(() => {}).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const login = useCallback(async data => { const result = await loginRequest(data); setUser(result.user || null); return result; }, []);
  const signup = useCallback(async data => { const result = await signupRequest(data); setUser(result.user || null); return result; }, []);
  const logout = useCallback(async () => { try { await logoutRequest(); } finally { setUser(null); } }, []);
  return <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>{children}</AuthContext.Provider>;
}
export function useAuthContext() { const value = useContext(AuthContext); if (!value) throw new Error("useAuthContext must be used inside AuthProvider"); return value; }
export default AuthContext;
