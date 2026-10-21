export const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
export const isValidUsername = value => /^[a-zA-Z0-9._]{3,30}$/.test(String(value || ""));
export const isValidPassword = value => String(value || "").length >= 8;
export const cleanText = value => String(value || "").trim();
