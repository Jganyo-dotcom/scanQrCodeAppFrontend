import React, { useState, useEffect } from "react";
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
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/Sidebar.css";
import { baseUrl } from "../api.jsx";

// =========================================================================
// ✏️ CHANGE FREE TIER QR LIMIT HERE ANYTIME (Currently set to 20)
// =========================================================================
const FREE_TIER_MAX_QRS = 20;

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Create QR", icon: QrCode, href: "/create" },
  { name: "History", icon: History, href: "/history" },
  { name: "Analytics", icon: BarChart2, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic user account state
  const [user, setUser] = useState({
    name: "User Account",
    email: "",
    plan: "Free Tier",
    usedQrs: 0,
    maxQrs: FREE_TIER_MAX_QRS,
  });

  // Fetch real profile and QR scan/creation counts on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${baseUrl}/v1/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const resData = await response.json();
          const userData = resData.user || {};
          const isPremium =
            userData.plan === "premium" || userData.plan === "Premium";

          setUser({
            name: userData.name || "Dev Jay",
            email: userData.email || "jay@devjay.io",
            plan: isPremium ? "Premium" : "Free Tier",
            usedQrs: resData.totalQrsCreated || userData.totalQrsCreated || 0,
            maxQrs: isPremium ? "Unlimited" : FREE_TIER_MAX_QRS,
          });
        }
      } catch (err) {
        console.error("Failed to load user profile in Sidebar:", err);
      }
    };

    fetchUserData();
  }, []);

  // Dispatch upgrade email to author
  const handleUpgradeRequest = async () => {
    try {
      setIsUpgrading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/v1/auth/request-upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (response.ok) {
        alert(
          "🚀 Upgrade request sent! The author will reach out to your registered email shortly.",
        );
      } else {
        alert(resData.message || "Could not process upgrade request.");
      }
    } catch (err) {
      alert("Error sending upgrade request: " + err.message);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isFreeTier = user.plan !== "Premium";
  const usagePercentage =
    user.maxQrs === "Unlimited"
      ? 100
      : Math.min(100, (user.usedQrs / FREE_TIER_MAX_QRS) * 100);

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
                title={`${user.plan}\n${user.usedQrs}/${user.maxQrs} Created`}
              />
            ) : (
              <>
                <div className="plan-card-header">
                  <span className="plan-card-title">
                    <Zap size={14} /> {user.plan}
                  </span>
                  <span className="plan-card-badge">
                    {isFreeTier ? "Starter" : "Pro"}
                  </span>
                </div>

                <div className="plan-progress-bar">
                  <div
                    className="plan-progress-fill"
                    style={{
                      width: `${usagePercentage}%`,
                      backgroundColor:
                        usagePercentage >= 100 ? "#ef4444" : "#2563eb",
                    }}
                  />
                </div>

                <div className="plan-meta-text">
                  <span>Usage</span>
                  <strong>
                    {user.usedQrs} / {user.maxQrs} QRs
                  </strong>
                </div>

                {/* Upgrade Button when on Free Tier */}
                {isFreeTier && (
                  <button
                    className="btn-upgrade-action"
                    onClick={handleUpgradeRequest}
                    disabled={isUpgrading}
                    style={{
                      marginTop: "0.75rem",
                      width: "100%",
                      padding: "0.45rem",
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      cursor: "pointer",
                    }}
                  >
                    {isUpgrading ? (
                      <RefreshCw className="animate-spin" size={14} />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    <span>Upgrade to Premium</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* User Details & Logout Action */}
          <div className="user-account-bar">
            <div className="user-account-info">
              <div className="user-avatar-circle">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "DJ"}
              </div>
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
