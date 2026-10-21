import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
export default function ProtectedRoute() { const { user, loading } = useAuthContext(); if (loading) return <main className="page-state">Loading…</main>; return user ? <Outlet /> : <Navigate to="/login" replace />; }
