import React from "react";
import { NavLink } from "react-router-dom";
const links = [["Home", "/"], ["Explore", "/explore"], ["Reels", "/reels"], ["Messages", "/messages"], ["Notifications", "/notifications"], ["Saved", "/saved"], ["Profile", "/profile"], ["Settings", "/settings"]];
export default function Sidebar() { return <aside className="sidebar"><strong>New India Connect</strong><nav>{links.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav></aside>; }
