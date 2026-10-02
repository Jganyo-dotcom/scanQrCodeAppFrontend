import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Search,
  Filter,
  Plus,
  Download,
  Copy,
  ExternalLink,
  Check,
  Trash2,
  Menu,
  Globe,
  Wifi,
  User,
  FileText,
  TrendingUp,
  Eye,
  RefreshCw,
  Pencil,
  X,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { baseUrl } from "../components/api";
import "../css/MyQRs.css";

export default function MyQRs() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  // Live state variables mapping server responses
  const [qrList, setQrList] = useState([]);
  const [metrics, setMetrics] = useState({
    totalQrCodes: 0,
    totalScans: 0,
    activeDynamicQRs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Modal State Hooks
  const [editingQr, setEditingQr] = useState(null);
  const [editName, setEditName] = useState("");
  const [editContentData, setEditContentData] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch data profile from Express server pipeline endpoint
  const fetchMyQRs = async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/v1/qrs/my-qrs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(
          resData.message || "Failed to synchronise account assets data.",
        );
      }

      setQrList(resData.data || []);
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
    fetchMyQRs();
  }, []);

  // Open Edit Modal with selected QR asset data
  const handleOpenEditModal = (qr) => {
    setEditingQr(qr);
    setEditName(qr.name || "");
    setEditContentData(qr.contentData || "");
  };

  // Submit Destination URL & Campaign Name Updates
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingQr) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${baseUrl}/v1/qrs/update-destination/${editingQr._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName,
            newDestinationUrl: editContentData,
          }),
        },
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.message || "Failed to update QR code destination.",
        );
      }

      setEditingQr(null);
      fetchMyQRs();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle document deletion row updates instantly
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this QR code? Any active shortlink tracking references will break immediately.",
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/v1/qrs/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.message || "Could not delete the requested asset record.",
        );
      }

      fetchMyQRs();
    } catch (err) {
      alert(`Deletion failure: ${err.message}`);
    }
  };

  // Copy target action helper string configuration
  const handleCopyLink = (id, link) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Canvas downloader helper utility script block
  const handleDownloadPNG = (id, title) => {
    const canvas = document.getElementById(`qr-card-canvas-${id}`);
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Logic over live state array data hooks
  const filteredQRs = qrList.filter((qr) => {
    const matchesSearch =
      (qr.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (qr.contentData || "").toLowerCase().includes(searchQuery.toLowerCase());

    const qrStatus = qr.isDynamic ? "active" : "static";
    const matchesStatus = statusFilter === "all" || qrStatus === statusFilter;
    const matchesType =
      typeFilter === "all" || (qr.qrType || "url").toLowerCase() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper function for rendering type icons
  const renderTypeIcon = (type) => {
    switch (type) {
      case "wifi":
        return <Wifi size={16} />;
      case "vcard":
        return <User size={16} />;
      case "text":
        return <FileText size={16} />;
      case "url":
      default:
        return <Globe size={16} />;
    }
  };

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

        <main className="my-qrs-container">
          <section className="my-qrs-header">
            <div className="dashboard-title-group">
              <h1>My QR Codes</h1>
              <p>Manage, edit redirect targets, and track scan analytics</p>
            </div>
            <Link to="/create" className="btn-create-primary">
              <Plus size={18} /> Create New QR
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

          {/* Quick Metrics Bar Bound Live to Server payloads */}
          <section className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-box blue">
                <QrCode size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Codes</span>
                <span className="metric-value">
                  {isLoading ? "..." : metrics.totalQrCodes}
                </span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box green">
                <TrendingUp size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Scans</span>
                <span className="metric-value">
                  {isLoading
                    ? "..."
                    : (metrics.totalScans || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box purple">
                <Eye size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-label">Active Campaigns</span>
                <span className="metric-value">
                  {isLoading ? "..." : metrics.activeDynamicQRs}
                </span>
              </div>
            </div>
          </section>

          <section className="filter-toolbar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by campaign title or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-select-group">
              <div className="select-wrapper">
                <Filter size={16} className="select-icon" />
                <select
                  className="filter-dropdown"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Routing Types</option>
                  <option value="active">Dynamic Links Only</option>
                  <option value="static">Static Codes Only</option>
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  className="filter-dropdown"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Payload Types</option>
                  <option value="url">Website URL</option>
                  <option value="wifi">Wi-Fi</option>
                  <option value="vcard">vCard</option>
                  <option value="text">Plain Text</option>
                </select>
              </div>
            </div>
          </section>

          {/* QR Cards Grid Container */}
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "5rem" }}>
              <RefreshCw
                size={32}
                className="animate-spin"
                color="#2563eb"
                style={{ margin: "0 auto" }}
              />
              <p style={{ marginTop: "1rem", color: "#64748b" }}>
                Loading custom dashboard cards grid...
              </p>
            </div>
          ) : filteredQRs.length > 0 ? (
            <div className="qr-cards-grid">
              {filteredQRs.map((qr) => {
                const qrTypeString = (qr.qrType || "url").toLowerCase();
                const backendHost = baseUrl.replace("/api", "");
                const shortlinkValue = qr.isDynamic
                  ? `${backendHost}/v1/qrs/${qr.shortId}`
                  : "none";

                return (
                  <div key={qr._id} className="qr-item-card">
                    <div className="qr-card-top">
                      <div
                        className="qr-card-preview"
                        style={{
                          backgroundColor:
                            qr.customization?.backgroundColor || "#ffffff",
                        }}
                      >
                        <QRCodeCanvas
                          id={`qr-card-canvas-${qr._id}`}
                          value={shortlinkValue}
                          size={110}
                          fgColor={
                            qr.customization?.foregroundColor || "#0f172a"
                          }
                          bgColor={
                            qr.customization?.backgroundColor || "#ffffff"
                          }
                          level="M"
                        />
                      </div>

                      <div className="qr-card-header-info">
                        <div className="qr-type-badge">
                          {renderTypeIcon(qrTypeString)}
                          <span>{qrTypeString.toUpperCase()}</span>
                        </div>
                        <span
                          className={`status-pill ${
                            qr.isDynamic ? "active" : "paused"
                          }`}
                        >
                          {qr.isDynamic ? "Dynamic" : "Static"}
                        </span>
                      </div>
                    </div>

                    <div className="qr-card-body">
                      <h3 className="qr-card-title">{qr.name}</h3>
                      <p className="qr-card-target" title={qr.contentData}>
                        {qr.contentData}
                      </p>
                      <span className="qr-card-date">
                        Created: {new Date(qr.createdAt).toLocaleDateString()}
                      </span>

                      <div className="qr-card-meta">
                        <span className="scans-count">
                          {(qr.scanCount || 0).toLocaleString()} scans
                        </span>

                        {qr.isDynamic ? (
                          <button
                            onClick={() =>
                              window.open(
                                shortlinkValue,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                            className="shortlink-anchor"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#2563eb",
                              cursor: "pointer",
                              textDecoration: "underline",
                              fontSize: "0.85rem",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                            title="Test dynamic tracking link redirection"
                          >
                            /v1/qrs/{qr.shortId} <ExternalLink size={12} />
                          </button>
                        ) : (
                          <span
                            style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                          >
                            Static Link
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="qr-card-actions">
                      <button
                        className="action-btn"
                        disabled={!qr.isDynamic}
                        onClick={() => handleOpenEditModal(qr)}
                        title={
                          qr.isDynamic
                            ? "Edit Target Destination URL"
                            : "Static codes cannot be modified"
                        }
                        style={{
                          opacity: qr.isDynamic ? 1 : 0.5,
                          cursor: qr.isDynamic ? "pointer" : "not-allowed",
                        }}
                      >
                        <Pencil size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        className="action-btn"
                        onClick={() => handleCopyLink(qr._id, shortlinkValue)}
                        title="Copy Target String"
                      >
                        {copiedId === qr._id ? (
                          <Check size={14} color="#16a34a" />
                        ) : (
                          <Copy size={14} />
                        )}
                        <span>{copiedId === qr._id ? "Copied" : "Copy"}</span>
                      </button>

                      <button
                        className="action-btn download"
                        onClick={() => handleDownloadPNG(qr._id, qr.name)}
                        title="Download PNG Image"
                      >
                        <Download size={14} />
                        <span>PNG</span>
                      </button>

                      <button
                        className="action-btn danger"
                        onClick={() => handleDelete(qr._id)}
                        title="Delete Asset"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="empty-state-card"
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px dashed #cbd5e1",
              }}
            >
              <QrCode
                size={48}
                color="#94a3b8"
                style={{ margin: "0 auto 1rem auto" }}
              />
              <h3>No QR codes found</h3>
              <p style={{ color: "#64748b", margin: "0.5rem 0 1.5rem 0" }}>
                Try clearing your active dropdown filter configurations or
                design a fresh code template campaign asset.
              </p>
              <Link to="/create" className="btn-create-primary">
                <Plus size={18} /> Create QR Code
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Destination URL & Campaign Name Edit Modal */}
      {editingQr && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              padding: "1.75rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Edit QR Destination
              </h2>
              <button
                onClick={() => setEditingQr(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "0.35rem",
                  }}
                >
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "0.35rem",
                  }}
                >
                  Destination URL / Target Content
                </label>
                <input
                  type="text"
                  required
                  value={editContentData}
                  onChange={(e) => setEditContentData(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
                {editingQr.isDynamic ? (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#16a34a",
                      marginTop: "0.35rem",
                    }}
                  >
                    ✓ Dynamic link active: Changing this target updates where
                    existing printed QR scans redirect instantly.
                  </p>
                ) : (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#eab308",
                      marginTop: "0.35rem",
                    }}
                  >
                    ⚠️ Static code: Updating this text value re-encodes the raw
                    QR code pattern.
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingQr(null)}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#475569",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#2563eb",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#ffffff",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
