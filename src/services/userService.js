import apiRequest from "./api.js";
export const getUser = (username) => apiRequest(`/users/${encodeURIComponent(username)}`);
export const updateProfile = (profile) => apiRequest("/profile", { method: "PATCH", body: JSON.stringify(profile) });
export const followUser = (userId) => apiRequest(`/users/${encodeURIComponent(userId)}/follow`, { method: "POST", body: JSON.stringify({}) });
