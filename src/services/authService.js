import apiRequest from "./api.js";
export const getCurrentUser = () => apiRequest("/auth/me");
export const login = (credentials) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
export const signup = (details) => apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(details) });
export const logout = () => apiRequest("/auth/logout", { method: "POST", body: JSON.stringify({}) });
