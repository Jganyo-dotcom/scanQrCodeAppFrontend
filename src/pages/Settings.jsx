import React, { useState } from "react";
import {
  QrCode,
  User,
  Globe,
  Key,
  Shield,
  Check,
  Copy,
  Plus,
  Trash2,
  Menu,
  Save,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import "../css/Settings.css";
import { baseUrl } from "../components/api";

export default function Settings() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("domains");

  // Profile Form State
  const [profile, setProfile] = useState({
    name: "DevJay",
    email: "jay@devjay.io",
    orgName: "DevJay Studio LLC",
  });
  const [isSaved, setIsSaved] = useState(false);

  // Custom Domains State
  const [domains, setDomains] = useState([
    {
      id: "dom-1",
      domain: "link.devjay.io",
      status: "verified",
      cname: "cname.devjay.io",
      created: "Sep 01, 2026",
    },
    {
      id: "dom-2",
      domain: "qr.brandshop.com",
      status: "pending",
      cname: "cname.devjay.io",
      created: "Sep 20, 2026",
    },
  ]);
  const [newDomainInput, setNewDomainInput] = useState("");

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key-1",
      name: "Production Node Service",
      prefix: "dj_live_99a8...",
      created: "Aug 10, 2026",
      lastUsed: "2 mins ago",
    },
  ]);
  const [showKeySecret, setShowKeySecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Action Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAddDomain = (e) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    const newEntry = {
      id: `dom-${Date.now()}`,
      domain: newDomainInput.trim().toLowerCase(),
      status: "pending",
      cname: "cname.devjay.io",
      created: "Just now",
    };
    setDomains([...domains, newEntry]);
    setNewDomainInput("");
  };

  const handleDeleteDomain = (id) => {
    setDomains(domains.filter((d) => d.id !== id));
  };

  const handleGenerateApiKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: `Backend Service API (${apiKeys.length + 1})`,
      prefix: `dj_live_${Math.random().toString(36).substring(2, 10)}...`,
      created: "Just now",
      lastUsed: "Never",
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleCopyKey = (keyText) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <div className="main-wrapper">
        {/* Mobile Navigation Header */}
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

        <main className="settings-container">
          {/* Dashboard Header */}
          <section className="settings-header">
            <div className="dashboard-title-group">
              <h1>Settings & Integrations</h1>
              <p>
                Manage branded domains, developer API keys, and account security
              </p>
            </div>
          </section>

          {/* Tab Navigation Controls */}
          <nav className="settings-tabs-nav">
            <button
              className={`tab-btn ${activeTab === "domains" ? "active" : ""}`}
              onClick={() => setActiveTab("domains")}
            >
              <Globe size={18} />
              Branded Domains
            </button>
            <button
              className={`tab-btn ${activeTab === "api" ? "active" : ""}`}
              onClick={() => setActiveTab("api")}
            >
              <Key size={18} />
              API Keys & Webhooks
            </button>
            <button
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              Profile Settings
            </button>
            <button
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Shield size={18} />
              Security
            </button>
          </nav>

          {/* TAB 1: Custom Branded Domains */}
          {activeTab === "domains" && (
            <div className="tab-content-grid">
              <section className="settings-card">
                <div className="card-header">
                  <div>
                    <h3>Connect Custom Short Domain</h3>
                    <span className="card-subtitle">
                      Replace standard `devjay.io/r/` links with your own
                      branded subdomain
                    </span>
                  </div>
                </div>

                <form onSubmit={handleAddDomain} className="domain-add-form">
                  <div className="field-container flex-1">
                    <label className="field-label">Subdomain Name</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. qr.yourdomain.com"
                      value={newDomainInput}
                      onChange={(e) => setNewDomainInput(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary-action">
                    <Plus size={16} />
                    Add Domain
                  </button>
                </form>

                <div className="dns-instruction-box">
                  <div className="dns-header">
                    <AlertCircle size={18} color="#2563eb" />
                    <strong>DNS Configuration Requirement</strong>
                  </div>
                  <p>
                    Point your subdomain's CNAME record to{" "}
                    <code>cname.devjay.io</code> with TTL 300 to verify
                    ownership and enable automatic SSL certificates.
                  </p>
                </div>

                <div className="table-responsive">
                  <table className="settings-table">
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>Status</th>
                        <th>Target CNAME</th>
                        <th>Added Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((dom) => (
                        <tr key={dom.id}>
                          <td className="font-semibold">{dom.domain}</td>
                          <td>
                            <span className={`status-pill ${dom.status}`}>
                              {dom.status === "verified"
                                ? "Active SSL"
                                : "Pending DNS"}
                            </span>
                          </td>
                          <td className="font-mono">{dom.cname}</td>
                          <td className="text-muted">{dom.created}</td>
                          <td>
                            <button
                              className="btn-icon-danger"
                              onClick={() => handleDeleteDomain(dom.id)}
                              title="Delete Domain"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: Developer API Keys */}
          {activeTab === "api" && (
            <div className="tab-content-grid">
              <section className="settings-card">
                <div className="card-header flex-between">
                  <div>
                    <h3>REST API Authentication Keys</h3>
                    <span className="card-subtitle">
                      Use these secrets in your Express or Node backend services
                    </span>
                  </div>
                  <button
                    className="btn-primary-action"
                    onClick={handleGenerateApiKey}
                  >
                    <Plus size={16} />
                    Create New Key
                  </button>
                </div>

                <div className="api-keys-list">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="api-key-item">
                      <div className="api-key-details">
                        <span className="api-key-name">{key.name}</span>
                        <div className="api-key-secret-row">
                          <code className="api-key-code">
                            {showKeySecret
                              ? "dj_live_8f3a920194821049281a"
                              : key.prefix}
                          </code>
                          <button
                            className="btn-text-action"
                            onClick={() => setShowKeySecret(!showKeySecret)}
                          >
                            {showKeySecret ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                          <button
                            className="btn-text-action"
                            onClick={() =>
                              handleCopyKey("dj_live_8f3a920194821049281a")
                            }
                          >
                            {copiedKey ? (
                              <Check size={14} color="#16a34a" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                        <span className="key-meta-text">
                          Created {key.created} • Last used: {key.lastUsed}
                        </span>
                      </div>
                      <button
                        className="btn-icon-danger"
                        onClick={() =>
                          setApiKeys(apiKeys.filter((k) => k.id !== key.id))
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Webhook Configuration */}
              <section className="settings-card">
                <div className="card-header">
                  <h3>Scan Event Webhooks</h3>
                  <span className="card-subtitle">
                    Receive HTTP POST payloads in real time when a QR code is
                    scanned
                  </span>
                </div>
                <div className="webhook-field-group">
                  <div className="field-container">
                    <label className="field-label">Endpoint URL</label>
                    <input
                      type="url"
                      className="field-input"
                      placeholder="https://api.yourdomain.com/webhooks/qr-scan"
                    />
                  </div>
                  <button className="btn-secondary-action">
                    <RefreshCw size={16} />
                    Test Webhook Event
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: Profile Settings */}
          {activeTab === "profile" && (
            <div className="tab-content-grid">
              <section className="settings-card">
                <div className="card-header">
                  <h3>Account Information</h3>
                  <span className="card-subtitle">
                    Update account identity and organization settings
                  </span>
                </div>

                <form
                  onSubmit={handleSaveProfile}
                  className="profile-form-grid"
                >
                  <div className="field-container">
                    <label className="field-label">Full Name</label>
                    <input
                      type="text"
                      className="field-input"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="field-container">
                    <label className="field-label">Email Address</label>
                    <input
                      type="email"
                      className="field-input"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="field-container full-span">
                    <label className="field-label">Organization / Studio</label>
                    <input
                      type="text"
                      className="field-input"
                      value={profile.orgName}
                      onChange={(e) =>
                        setProfile({ ...profile, orgName: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-submit-row full-span">
                    <button type="submit" className="btn-primary-action">
                      <Save size={16} />
                      {isSaved ? "Saved Changes!" : "Save Profile"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {/* TAB 4: Security Settings */}
          {activeTab === "security" && (
            <div className="tab-content-grid">
              <section className="settings-card">
                <div className="card-header">
                  <h3>Update Security Credentials</h3>
                  <span className="card-subtitle">
                    Ensure account protection and session safety
                  </span>
                </div>

                <div className="profile-form-grid">
                  <div className="field-container full-span">
                    <label className="field-label">Current Password</label>
                    <input
                      type="password"
                      className="field-input"
                      placeholder="••••••••••••"
                    />
                  </div>

                  <div className="field-container">
                    <label className="field-label">New Password</label>
                    <input
                      type="password"
                      className="field-input"
                      placeholder="Min 8 characters"
                    />
                  </div>

                  <div className="field-container">
                    <label className="field-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="field-input"
                      placeholder="Repeat password"
                    />
                  </div>

                  <div className="form-submit-row full-span">
                    <button type="button" className="btn-primary-action">
                      Update Password
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
