import React from "react";
import { Link } from "react-router-dom";
export default function Header({ title = "New India Connect", user, onLogout }) { return <header className="app-header"><Link to="/">{title}</Link><div>{user ? <><span>@{user.username}</span><button type="button" onClick={onLogout}>Log out</button></> : <Link to="/login">Log in</Link>}</div></header>; }
