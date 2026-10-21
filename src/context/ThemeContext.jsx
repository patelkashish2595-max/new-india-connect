import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(null);
export function ThemeProvider({ children }) { const [theme, setTheme] = useState(() => { try { return localStorage.getItem("nic-theme") || "light"; } catch { return "light"; } }); useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem("nic-theme", theme); } catch {} }, [theme]); return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme: () => setTheme(t => t === "light" ? "dark" : "light") }}>{children}</ThemeContext.Provider>; }
export function useTheme() { const value = useContext(ThemeContext); if (!value) throw new Error("useTheme must be used inside ThemeProvider"); return value; }
