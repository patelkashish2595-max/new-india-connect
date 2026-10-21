import React from "react";
import { NavLink } from "react-router-dom";
export default function MobileNav() { return <nav className="mobile-nav" aria-label="Main navigation">{[["Home","/"],["Explore","/explore"],["Reels","/reels"],["Messages","/messages"],["Profile","/profile"]].map(([label,to])=><NavLink key={to} to={to}>{label}</NavLink>)}</nav>; }
