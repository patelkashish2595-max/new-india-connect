import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx"; import MobileNav from "../components/layout/MobileNav.jsx";
export default function MainLayout() { return <div className="main-layout"><Sidebar /><main><Outlet /></main><MobileNav /></div>; }
