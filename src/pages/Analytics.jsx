import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  BarChart3,
  Globe,
  Smartphone,
  Clock,
  Download,
  Calendar,
  Filter,
  Menu,
  MapPin,
  TrendingUp,
  Users,
  RefreshCw,
  Monitor,
  Tablet,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { baseUrl } from "../components/api";
import "../css/Analytics.css";

export default function Analytics() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live state pipelines mapping real server database payloads
  const [campaignOptions, setCampaignOptions] = useState([
    { id: "all", name: "All Campaigns (Aggregated)" },
  ]);
  const [metrics, setMetrics] = useState({
    totalScans: 0,
    scansChange: "0%",
    uniqueScanners: 0,
    uniqueChange: "0%",
    topCountry: "N/A",
    topCountryPercent: "0%",
    peakTime: "N/A",
  });
  const [locations, setLocations] = useState([]);
  const [devices, setDevices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Async query processor hitting the Express framework
  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      // Hits dynamic backend filters strategy pathway
      const response = await fetch(
        `${baseUrl}/v1/qrs/analytics?campaign=${selectedCampaign}&range=${dateRange}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const resData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(
          resData.message || "Failed to retrieve analytics collection.",
        );
      }

      // Sync backend telemetry values inside hooks array
      if (resData.campaigns) setCampaignOptions(resData.campaigns);
      setMetrics(resData.metrics || metrics);
      setLocations(resData.locations || []);
      setDevices(resData.devices || []);
      setLogs(resData.logs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Re-fetch automatically whenever dropdown toggles occur
  useEffect(() => {
    fetchAnalytics();
  }, [selectedCampaign, dateRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAnalytics();
  };

  // Maps device text configurations back down to visual icons smoothly
  const getDeviceIcon = (deviceName = "") => {
    const lowName = deviceName.toLowerCase();
    if (
      lowName.includes("desktop") ||
      lowName.includes("chrome") ||
      lowName.includes("macbook") ||
      lowName.includes("windows")
    )
      return Monitor;
    if (lowName.includes("tablet") || lowName.includes("ipad")) return Tablet;
    return Smartphone;
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

        <main className="analytics-container">
          <section className="analytics-header">
            <div className="dashboard-title-group">
              <h1>Scan Analytics</h1>
              <p>
                Performance metrics, device diagnostics, and geographic traffic
              </p>
            </div>

            <div className="analytics-controls">
              <div className="select-wrapper">
                <Filter size={16} className="select-icon" />
                <select
                  className="control-dropdown"
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                >
                  {campaignOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="select-wrapper">
                <Calendar size={16} className="select-icon" />
                <select
                  className="control-dropdown"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>

              <button
                className={`btn-icon-action ${isRefreshing ? "spinning" : ""}`}
                onClick={handleRefresh}
                title="Refresh Analytics Data"
              >
                <RefreshCw size={18} />
              </button>

              <button
                className="btn-export-secondary"
                onClick={() => alert("CSV Export Triggered.")}
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </section>

          {error && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                borderRadius: "6px",
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Core Metric Cards */}
          <section className="analytics-metrics-grid">
            <div className="metric-card">
              <div className="metric-header-row">
                <span className="metric-title">Total Scans</span>
                <div className="metric-icon blue">
                  <BarChart3 size={18} />
                </div>
              </div>
              <div className="metric-body">
                <span className="metric-number">
                  {isLoading ? "..." : metrics.totalScans.toLocaleString()}
                </span>
                <span className="metric-badge positive">
                  <TrendingUp size={12} /> {metrics.scansChange}
                </span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header-row">
                <span className="metric-title">Unique Scanners</span>
                <div className="metric-icon green">
                  <Users size={18} />
                </div>
              </div>
              <div className="metric-body">
                <span className="metric-number">
                  {isLoading ? "..." : metrics.uniqueScanners.toLocaleString()}
                </span>
                <span className="metric-badge positive">
                  <TrendingUp size={12} /> {metrics.uniqueChange}
                </span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header-row">
                <span className="metric-title">Top Country</span>
                <div className="metric-icon purple">
                  <Globe size={18} />
                </div>
              </div>
              <div className="metric-body">
                <span className="metric-number">
                  {isLoading ? "..." : metrics.topCountry}
                </span>
                <span className="metric-subtext">
                  {metrics.topCountryPercent} of total scans
                </span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header-row">
                <span className="metric-title">Peak Activity Window</span>
                <div className="metric-icon orange">
                  <Clock size={18} />
                </div>
              </div>
              <div className="metric-body">
                <span className="metric-number text-medium">
                  {isLoading ? "..." : metrics.peakTime}
                </span>
                <span className="metric-subtext">Based on local timezones</span>
              </div>
            </div>
          </section>

          {/* Breakdown Grids */}
          <section className="analytics-details-grid">
            {/* Geographic Distribution Card */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>
                  <MapPin size={18} color="#2563eb" /> Geographic Traffic
                </h3>
                <span className="card-subtitle">By country of origin</span>
              </div>
              <div className="card-body">
                <div className="progress-list">
                  {isLoading ? (
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Loading geography...
                    </p>
                  ) : locations.length > 0 ? (
                    locations.map((loc) => (
                      <div
                        key={loc.code || loc.country}
                        className="progress-item"
                      >
                        <div className="progress-label-row">
                          <span className="progress-title">
                            <strong>{loc.code || "—"}</strong> — {loc.country}
                          </span>
                          <span className="progress-value">
                            {loc.scans} ({loc.percentage}%)
                          </span>
                        </div>
                        <div className="progress-bar-track">
                          <div
                            className="progress-bar-fill blue"
                            style={{ width: `${loc.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                      No country metrics logged yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Device & OS Card */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>
                  <Smartphone size={18} color="#2563eb" /> Devices & Operating
                  Systems
                </h3>
                <span className="card-subtitle">Scanner User Agents</span>
              </div>
              <div className="card-body">
                <div className="progress-list">
                  {isLoading ? (
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Loading diagnostics...
                    </p>
                  ) : devices.length > 0 ? (
                    devices.map((dev, i) => {
                      const IconComponent = getDeviceIcon(dev.device);
                      return (
                        <div key={i} className="progress-item">
                          <div className="progress-label-row">
                            <span
                              className="progress-title flex-align"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <IconComponent size={14} color="#64748b" />
                              {dev.device}
                            </span>
                            <span className="progress-value">
                              {dev.count} ({dev.percentage}%)
                            </span>
                          </div>
                          <div className="progress-bar-track">
                            <div
                              className="progress-bar-fill green"
                              style={{ width: `${dev.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                      No user agent telemetry caught yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Live Scan Audit Table */}
          <section
            className="analytics-card full-width"
            style={{ marginTop: "1.5rem" }}
          >
            <div
              className="card-header border-bottom"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Clock size={18} color="#2563eb" /> Recent Scan Events
                </h3>
                <span className="card-subtitle">
                  Real-time telemetry log feed
                </span>
              </div>
              <span
                className="live-indicator"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.75rem",
                  color: "#16a34a",
                  fontWeight: 600,
                }}
              >
                <span
                  className="pulse-dot"
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#16a34a",
                    borderRadius: "50%",
                  }}
                />{" "}
                Live Logging
              </span>
            </div>

            <div className="card-body">
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table
                  className="analytics-table"
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "0.75rem" }}>
                        Timestamp
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem" }}>
                        Campaign / QR
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem" }}>
                        Location
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem" }}>
                        Device / OS
                      </th>
                      <th style={{ textAlign: "left", padding: "0.75rem" }}>
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "1.5rem",
                            color: "#64748b",
                          }}
                        >
                          Loading event logs...
                        </td>
                      </tr>
                    ) : logs.length > 0 ? (
                      logs.map((log, index) => (
                        <tr
                          key={log.id || index}
                          style={{ borderBottom: "1px solid #f1f5f9" }}
                        >
                          <td
                            style={{ padding: "0.75rem", fontSize: "0.85rem" }}
                          >
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                            }}
                          >
                            {log.qrName || log.campaign || "N/A"}
                          </td>
                          <td
                            style={{ padding: "0.75rem", fontSize: "0.85rem" }}
                          >
                            {log.city
                              ? `${log.city}, ${log.country}`
                              : log.country || "Unknown"}
                          </td>
                          <td
                            style={{ padding: "0.75rem", fontSize: "0.85rem" }}
                          >
                            {log.device || "Unknown"}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              fontSize: "0.85rem",
                              color: "#64748b",
                            }}
                          >
                            {log.ipAddress || "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "1.5rem",
                            color: "#94a3b8",
                          }}
                        >
                          No recent scan logs recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
