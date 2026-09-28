import React, { useState } from "react";
import {
  LayoutDashboard,
  QrCode,
  History,
  BarChart2,
  Settings,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Create QR", icon: QrCode, href: "/dashboard" },
  { name: "History", icon: History, href: "/history" },
  { name: "Analytics", icon: BarChart2, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <span>DevJay QR</span>
          <button className="btn-icon-only" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Workspace */}
      <div className="main-wrapper">
        <header className="mobile-header">
          <button className="btn-icon-only" onClick={() => setIsOpen(true)}>
            <Menu size={22} />
          </button>
          <span style={{ fontWeight: 800 }}>DevJay QR</span>
          <button className="btn-icon-only">
            <UserCircle size={22} />
          </button>
        </header>

        <main className="content-area">
          <div className="content-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
