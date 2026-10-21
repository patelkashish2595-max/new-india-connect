import React from "react";
import { Link, Outlet } from "react-router-dom";
export default function AuthLayout() { return <main className="auth-layout"><Link to="/">New India Connect</Link><Outlet /></main>; }
