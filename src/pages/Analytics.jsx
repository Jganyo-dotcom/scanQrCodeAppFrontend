import React, { useState } from "react";
import {
  QrCode,
  BarChart3,
  Globe,
  Smartphone,
  Clock,
  ArrowUpRight,
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
import "../css/Analytics.css";

// Mock Analytics Dataset
const CAMPAIGN_OPTIONS = [
  { id: "all", name: "All Campaigns (Aggregated)" },
  { id: "qr-101", name: "Summer Promo Campaign" },
  { id: "qr-102", name: "Guest Office Wi-Fi" },
  { id: "qr-103", name: "CEO Digital vCard" },
];

const METRICS_DATA = {
  totalScans: 1896,
  scansChange: "+18.4%",
  uniqueScanners: 1412,
  uniqueChange: "+12.1%",
  topCountry: "United States",
  topCountryPercent: "42%",
  peakTime: "2:00 PM - 4:00 PM",
};

const LOCATION_BREAKDOWN = [
  { country: "United States", code: "US", scans: 796, percentage: 42 },
  { country: "United Kingdom", code: "UK", scans: 341, percentage: 18 },
  { country: "Germany", code: "DE", scans: 246, percentage: 13 },
  { country: "Canada", code: "CA", scans: 189, percentage: 10 },
  { country: "Other Regions", code: "INT", scans: 324, percentage: 17 },
];

const DEVICE_BREAKDOWN = [
  { device: "iOS (iPhone/iPad)", percentage: 58, count: 1100, icon: Smartphone },
  { device: "Android Mobile", percentage: 34, count: 644, icon: Smartphone },
  { device: "Desktop Web", percentage: 6, count: 114, icon: Monitor },
  { device: "Tablet Devices", percentage: 2, count: 38, icon: Tablet },
];

const RECENT_SCAN_LOGS = [
  { id: "log-1", campaign: "Summer Promo Campaign", device: "iPhone 15 Pro (iOS 17.4)", location: "New York, US", time: "2 mins ago", ip: "192.168.1.xxx" },
  { id: "log-2", campaign: "Summer Promo Campaign", device: "Samsung Galaxy S24 (Android 14)", location: "London, UK", time: "14 mins ago", ip: "86.154.20.xxx" },
  { id: "log-3", campaign: "Guest Office Wi-Fi", device: "Google Pixel 8 (Android 14)", location: "San Francisco, US", time: "42 mins ago", ip: "172.56.42.xxx" },
  { id: "log-4", campaign: "CEO Digital vCard", device: "MacBook Pro (Chrome 122)", location: "Berlin, DE", time: "1 hour ago", ip: "91.198.174.xxx" },
  { id: "log-5", campaign: "Summer Promo Campaign", device: "iPhone 14 (iOS 17.2)", location: "Toronto, CA", time: "2 hours ago", ip: "142.250.190.xxx" },
];

export default function Analytics() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <div className="main-wrapper">
        {/* Mobile Header */}
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
          {/* Header & Controls */}
          <section className="analytics-header">
            <div className="dashboard-title-group">
              <h1>Scan Analytics</h1>
              <p>Performance metrics, device diagnostics, and geographic traffic</p>
            </div>

            <div className="analytics-controls">
              <div className="select-wrapper">
                <Filter size={16} className="select-icon" />
                <select
                  className="control-dropdown"
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                >
                  {CAMPAIGN_OPTIONS.map((c) => (
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

              <button className="btn-export-secondary">
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </section>

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
                  {METRICS_DATA.totalScans.toLocaleString()}
                </span>
                <span className="metric-badge positive">
                  <TrendingUp size={12} />
                  {METRICS_DATA.scansChange}
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
                  {METRICS_DATA.uniqueScanners.toLocaleString()}
                </span>
                <span className="metric-badge positive">
                  <TrendingUp size={12} />
                  {METRICS_DATA.uniqueChange}
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
                <span className="metric-number">{METRICS_DATA.topCountry}</span>
                <span className="metric-subtext">
                  {METRICS_DATA.topCountryPercent} of total scans
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
                  {METRICS_DATA.peakTime}
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
                  <MapPin size={18} color="#2563eb" />
                  Geographic Traffic
                </h3>
                <span className="card-subtitle">By country of origin</span>
              </div>
              <div className="card-body">
                <div className="progress-list">
                  {LOCATION_BREAKDOWN.map((loc) => (
                    <div key={loc.code} className="progress-item">
                      <div className="progress-label-row">
                        <span className="progress-title">
                          <strong>{loc.code}</strong> — {loc.country}
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
                  ))}
                </div>
              </div>
            </div>

            {/* Device & OS Card */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>
                  <Smartphone size={18} color="#2563eb" />
                  Devices & Operating Systems
                </h3>
                <span className="card-subtitle">Scanner User Agents</span>
              </div>
              <div className="card-body">
                <div className="progress-list">
                  {DEVICE_BREAKDOWN.map((dev, i) => {
                    const IconComponent = dev.icon;
                    return (
                      <div key={i} className="progress-item">
                        <div className="progress-label-row">
                          <span className="progress-title flex-align">
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
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Live Scan Audit Table */}
          <section className="analytics-card full-width">
            <div className="card-header border-bottom">
              <div>
                <h3>Recent Scan Events</h3>
                <span className="card-subtitle">
                  Real-time telemetry log feed
                </span>
              </div>
              <span className="live-indicator">
                <span className="pulse-dot" /> Live Logging
              </span>
            </div>

            <div className="table-responsive">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Device & Browser</th>
                    <th>Location</th>
                    <th>IP Hash</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_SCAN_LOGS.map((log) => (
                    <tr key={log.id}>
                      <td className="font-semibold">{log.campaign}</td>
                      <td>{log.device}</td>
                      <td>
                        <span className="location-pill">{log.location}</span>
                      </td>
                      <td className="font-mono">{log.ip}</td>
                      <td className="text-muted">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}