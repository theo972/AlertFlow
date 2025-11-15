// src/layouts/MainLayout.tsx
import React from "react";
import { useUser } from "../contexts/user-context";
import { useNavigate, Outlet } from "react-router-dom";
import "../styles/main-layout.scss";

type ActiveKey = "dashboard" | "tickets" | "users" | "settings";

function getActiveFromLocation(pathname: string): ActiveKey {
    if (pathname.startsWith("/tickets")) return "tickets";
    if (pathname.startsWith("/users")) return "users";
    if (pathname.startsWith("/settings")) return "settings";
    return "dashboard";
}

export default function MainLayout() {
    const { logout } = useUser();
    const navigate = useNavigate();
    const pathname = window.location.pathname;
    const active = getActiveFromLocation(pathname);

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        await logout();
        navigate("/auth/login");
    };

    const navClass = (key: ActiveKey) =>
        "nav-item" + (active === key ? " nav-item-active" : "");

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo-dot" />
                    <span className="sidebar-logo-text">AlertFlow</span>
                </div>

                <nav className="sidebar-nav">
                    <p className="sidebar-nav-title">MENU</p>

                    <button
                        className={navClass("dashboard")}
                        onClick={() => navigate("/")}
                    >
                        <div className="nav-item-icon nav-item-icon-primary" />
                        <span>Dashboard</span>
                    </button>

                    <button
                        className={navClass("tickets")}
                        onClick={() => navigate("/tickets")}
                    >
                        <div className="nav-item-icon" />
                        <span>Tickets</span>
                    </button>

                    <button className={navClass("users")}>
                        <div className="nav-item-icon" />
                        <span>Users</span>
                    </button>

                    <button className={navClass("settings")}>
                        <div className="nav-item-icon" />
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main">
                <header className="topbar">
                    <div className="topbar-search">
                        <div className="topbar-search-inner">
                            <input
                                className="topbar-search-input"
                                placeholder="Search tickets, users..."
                            />
                            <span className="topbar-search-icon" />
                        </div>
                    </div>

                    <div className="topbar-user">
                        <span className="topbar-user-name">Admin User</span>
                        <div className="topbar-user-avatar" />
                    </div>
                </header>

                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
