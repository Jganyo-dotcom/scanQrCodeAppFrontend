import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Plus,
  Search,
  Copy,
  Download,
  Menu,
  TrendingUp,
  Activity,
  Layers,
  ArrowUpRight,
  Trash2,
  RefreshCw,
  Check,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import "../css/Dashboard.css";
import { baseUrl } from "../components/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dynamic state hooks for live backend payloads
  const [qrCodes, setQrCodes] = useState([]);
  const [metrics, setMetrics] = useState({
    totalQrCodes: 0,
    totalScans: 0,
    activeDynamicQRs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Fetch data array from Express Backend API pipeline
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");

      // 1. Grab the saved token string out of browser memory localStorage
      const token = localStorage.getItem("token");

      // 2. Pass the token directly inside the Authorization header request framework
      const response = await fetch(`${baseUrl}/v1/qrs/my-qrs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🚀 Transmits the header token strategy!
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        // Guard Rail: If server states unauthorized/invalid token (401), bounce straight to login path
        if (response.status === 401) {
          // Clear any old stale token data so it doesn't loop infinitely
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        throw new Error(
          resData.message || "Failed to synchronise dashboard data.",
        );
      }

      setQrCodes(resData.data || []);
      setMetrics(
        resData.metrics || {
          totalQrCodes: 0,
          totalScans: 0,
          activeDynamicQRs: 0,
        },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle document deletion row updates instantly
  const handleDeleteQr = async (id) => {
    if (
      !window.confirm(
        "Are you absolutely sure you want to delete this QR code? This will break any printed dynamic tracking links permanently.",
      )
    )
      return;

    try {
      const response = await fetch(`/api/qrs/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.message || "Could not delete the requested asset record.",
        );
      }

      fetchDashboardData();
    } catch (err) {
      alert(`Deletion failure: ${err.message}`);
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPNG = (id, title) => {
    const canvas = document.getElementById(`qr-canvas-${id}`);
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered dataset computed cleanly inline over live rows database hook array
  const filteredQrs = qrCodes.filter((qr) => {
    const matchesSearch =
      qr.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.contentData?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && qr.isDynamic) ||
      (statusFilter === "static" && !qr.isDynamic);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <div className="main-wrapper">
        <header className="mobile-header-bar">
          <div className="mobile-brand">
            <QrCode size={24} color="#2563eb" />
            <span>DevJay QR</span>
          </div>
          <button
            className="btn-hamburger"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>
        </header>

        <main className="dashboard-container">
          <section className="dashboard-header">
            <div className="dashboard-title-group">
              <h1>QR Management</h1>
              <p>Monitor real-time scan analytics and dynamic targets</p>
            </div>
            <Link to="/create" className="btn-primary-action">
              <Plus size={18} /> Create QR Code
            </Link>
          </section>

          {error && (
            <div
              className="status-error-banner"
              style={{
                padding: "1rem",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                borderRadius: "6px",
                marginBottom: "1.5rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Metric Overview Cards Bound Live to Server Metrics */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">
                  <QrCode size={20} />
                </div>
              </div>
              <div className="stat-value">
                {isLoading ? "..." : metrics.totalQrCodes}
              </div>
              <div className="stat-label">Total Saved QRs</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box green">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="stat-value">
                {isLoading ? "..." : metrics.totalScans.toLocaleString()}
              </div>
              <div className="stat-label">Total Scans Received</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box purple">
                  <Activity size={20} />
                </div>
              </div>
              <div className="stat-value">
                {isLoading ? "..." : metrics.activeDynamicQRs}
              </div>
              <div className="stat-label">Active Dynamic QRs</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box amber">
                  <Layers size={20} />
                </div>
              </div>
              <div className="stat-value">
                {metrics.totalQrCodes > 0
                  ? `${Math.round(
                      (metrics.activeDynamicQRs / metrics.totalQrCodes) * 100,
                    )}%`
                  : "0%"}
              </div>
              <div className="stat-label">Dynamic Target Share</div>
            </div>
          </section>

          <section className="toolbar-card">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search QR codes or URLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Routing Types</option>
              <option value="active">Dynamic Link Only</option>
              <option value="static">Static Only</option>
            </select>
          </section>

          {/* QR Data Table Management Block */}
          <section className="table-card">
            <div className="table-wrapper">
              <table className="qr-data-table">
                <thead>
                  <tr>
                    <th>QR Campaign</th>
                    <th>Type</th>
                    <th>Routing</th>
                    <th>Scans</th>
                    <th>Created Date</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "3rem" }}
                      >
                        <RefreshCw
                          size={24}
                          className="animate-spin"
                          color="#2563eb"
                          style={{ margin: "0 auto" }}
                        />
                        <span
                          style={{
                            display: "block",
                            marginTop: "0.5rem",
                            color: "#64748b",
                          }}
                        >
                          Loading assets database records...
                        </span>
                      </td>
                    </tr>
                  ) : filteredQrs.length > 0 ? (
                    filteredQrs.map((item) => {
                      const targetUrl = item.isDynamic
                        ? `${window.location.origin}/r/${item.shortId}`
                        : item.contentData;

                      return (
                        <tr key={item._id}>
                          <td>
                            <div className="qr-info-cell">
                              {/* Hidden canvas helper element used for PNG download export */}
                              <div style={{ display: "none" }}>
                                <QRCodeCanvas
                                  id={`qr-canvas-${item._id}`}
                                  value={targetUrl}
                                  size={256}
                                  fgColor={
                                    item.customization?.foregroundColor ||
                                    "#0f172a"
                                  }
                                  bgColor={
                                    item.customization?.backgroundColor ||
                                    "#ffffff"
                                  }
                                  level="H"
                                />
                              </div>

                              <div
                                className="qr-preview-thumb"
                                style={{
                                  backgroundColor:
                                    item.customization?.backgroundColor ||
                                    "#ffffff",
                                }}
                              >
                                <QrCode
                                  size={22}
                                  color={
                                    item.customization?.foregroundColor ||
                                    "#2563eb"
                                  }
                                />
                              </div>

                              <div>
                                <div className="qr-title-text">{item.name}</div>
                                <span
                                  className="qr-target-url"
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#64748b",
                                  }}
                                >
                                  {item.contentData}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                item.isDynamic ? "dynamic" : "static"
                              }`}
                            >
                              {item.isDynamic ? "Dynamic" : "Static"}
                            </span>
                          </td>
                          <td>
                            <a
                              href={targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="target-link"
                            >
                              {item.isDynamic
                                ? `/r/${item.shortId}`
                                : item.contentData}{" "}
                              <ArrowUpRight size={14} />
                            </a>
                          </td>
                          <td>{item.scansCount || item.scans || 0}</td>
                          <td>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="action-buttons-group">
                              <button
                                className="btn-icon"
                                onClick={() =>
                                  handleCopyText(targetUrl, item._id)
                                }
                                title="Copy Link"
                              >
                                {copiedId === item._id ? (
                                  <Check size={16} color="#16a34a" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </button>
                              <button
                                className="btn-icon"
                                onClick={() =>
                                  handleDownloadPNG(item._id, item.name)
                                }
                                title="Download PNG"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                className="btn-icon delete"
                                onClick={() => handleDeleteQr(item._id)}
                                title="Delete QR Code"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "3rem",
                          color: "#64748b",
                        }}
                      >
                        No QR codes found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
