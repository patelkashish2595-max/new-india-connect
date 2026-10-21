import React from "react";
import { Link, Outlet } from "react-router-dom";
export default function AdminLayout() { return <div className="admin-layout"><header><strong>New India Connect · Admin</strong><Link to="/">View site</Link></header><main><Outlet /></main></div>; }
