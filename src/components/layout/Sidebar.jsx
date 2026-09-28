import React, { useState } from "react";
import {
  LayoutDashboard,
  QrCode,
  History,
  BarChart2,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  Crown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/Sidebar.css";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Create QR", icon: QrCode, href: "/create" },
  { name: "History", icon: History, href: "/history" },
  { name: "Analytics", icon: BarChart2, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Account status details
  const user = {
    name: "Dev Jay",
    email: "jay@devjay.io",
    plan: "Free Tier",
    usedQrs: 18,
    maxQrs: 50,
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`sidebar-container ${isCollapsed ? "collapsed" : ""} ${
          isOpen ? "mobile-open" : ""
        }`}
      >
        {/* Header / Brand */}
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-brand-title">
            <QrCode size={26} color="#2563eb" />
            <span className="sidebar-brand-text">DevJay QR</span>
          </Link>

          {/* Desktop Expand/Collapse Switcher */}
          <button
            className="btn-sidebar-toggle desktop-only"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            className="btn-sidebar-toggle mobile-only"
            onClick={() => setIsOpen(false)}
            style={{ display: isOpen ? "flex" : "none" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.name : ""}
              >
                <Icon size={20} />
                <span className="nav-text">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer with Plan Status & Profile Strip */}
        <div className="sidebar-footer">
          {/* Subscription / Usage Widget */}
          <div className="plan-card">
            {isCollapsed ? (
              <Crown
                size={22}
                color="#2563eb"
                title="Free Tier - 18/50 Scans Used"
              />
            ) : (
              <>
                <div className="plan-card-header">
                  <span className="plan-card-title">
                    <Zap size={14} /> {user.plan}
                  </span>
                  <span className="plan-card-badge">Starter</span>
                </div>

                <div className="plan-progress-bar">
                  <div
                    className="plan-progress-fill"
                    style={{ width: `${(user.usedQrs / user.maxQrs) * 100}%` }}
                  />
                </div>

                <div className="plan-meta-text">
                  <span>Usage</span>
                  <strong>
                    {user.usedQrs} / {user.maxQrs} QRs
                  </strong>
                </div>
              </>
            )}
          </div>

          {/* User Details & Logout Action */}
          <div className="user-account-bar">
            <div className="user-account-info">
              <div className="user-avatar-circle">DJ</div>
              <div className="user-text-details">
                <span className="user-display-name">{user.name}</span>
                <span className="user-display-email">{user.email}</span>
              </div>
            </div>

            <button
              className="btn-logout-icon"
              onClick={handleLogout}
              title="Logout Account"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
