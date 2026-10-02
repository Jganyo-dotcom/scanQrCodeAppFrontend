import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  User,
  Globe,
  Key,
  Shield,
  Save,
  Menu,
  RefreshCw,
  Lock,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import "../css/Settings.css";
import { baseUrl } from "../components/api.jsx";

export default function Settings() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 SUBSCRIPTION TIER CONTROL (Change to "standard" to preview the locked SaaS Paywall state!)
  const [accountType, setAccountType] = useState("premium");

  // Async feedback & state control
  const [profileFeedback, setProfileFeedback] = useState({
    type: "",
    text: "",
  });
  const [passwordFeedback, setPasswordFeedback] = useState({
    type: "",
    text: "",
  });
  const [apiFeedback, setApiFeedback] = useState({ type: "", text: "" });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  // Form Field States
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    orgName: "DevJay Studio LLC",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Multi-Key Management State Layouts
  const [apiKeysList, setApiKeysList] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedRawKey, setNewlyCreatedRawKey] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // 1. Initial State Sync: Fetch profile data on mount
  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(`${baseUrl}/v1/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const resData = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            navigate("/login");
            return;
          }
          throw new Error(
            resData.message || "Failed to load account identity.",
          );
        }

        setProfile({
          name: resData.user?.name || "",
          email: resData.user?.email || "",
          orgName: "DevJay Studio LLC",
        });

        fetchApiKeysList();
      } catch (err) {
        setProfileFeedback({ type: "error", text: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfileData();
  }, [navigate]);

  // Fetch developer keys list from server database collections
  const fetchApiKeysList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/v1/auth/api-keys`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await response.json();
      if (response.ok) {
        setApiKeysList(resData.data || []);
      }
    } catch (err) {
      console.error(
        "Could not populate developer keys array rows:",
        err.message,
      );
    }
  };

  // Submit creation payload to instantiate a new token
  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsCreatingKey(true);
    setApiFeedback({ type: "", text: "" });
    setNewlyCreatedRawKey("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/v1/auth/api-keys/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ keyName: newKeyName.trim() }),
      });

      const resData = await response.json();
      if (!response.ok)
        throw new Error(
          resData.message || "Failed to generate developer credentials.",
        );

      setNewlyCreatedRawKey(resData.apiKey);
      setNewKeyName("");
      setApiFeedback({
        type: "success",
        text: "New API Key token generated successfully!",
      });
      fetchApiKeysList();
    } catch (err) {
      setApiFeedback({ type: "error", text: err.message });
    } finally {
      setIsCreatingKey(false);
    }
  };

  // Toggle Switch status mapping active/inactive flags
  const handleToggleKeyStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/v1/auth/api-keys/toggle/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        fetchApiKeysList();
      }
    } catch (err) {
      alert(`Status modification exception: ${err.message}`);
    }
  };

  // Permanently delete an active key from history collections
  const handleDeleteApiKey = async (id) => {
    if (
      !window.confirm(
        "Are you absolutely sure you want to revoke and delete this key? Any automated scripts using this key will immediately be blocked from backend access.",
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/v1/auth/api-keys/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        setApiFeedback({ type: "success", text: "Key permanently revoked." });
        fetchApiKeysList();
      }
    } catch (err) {
      alert(`Deletion processing exception: ${err.message}`);
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Profile Submission Network Pipeline
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileFeedback({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/v1/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Could not save profile metadata.");
      }

      localStorage.setItem("user", JSON.stringify(resData.user));
      setProfileFeedback({
        type: "success",
        text: "Identity changes saved successfully!",
      });
    } catch (err) {
      setProfileFeedback({ type: "error", text: err.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Password Modification Network Pipeline
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordFeedback({
        type: "error",
        text: "New passwords do not match confirmation fields.",
      });
    }

    setIsSavingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/v1/auth/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Password modification failed.");
      }

      setPasswordFeedback({
        type: "success",
        text: "Password credentials successfully updated.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordFeedback({ type: "error", text: err.message });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RefreshCw size={32} className="animate-spin" color="#2563eb" />
      </div>
    );
  }

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
          >
            <Menu size={22} />
          </button>
        </header>

        <main className="settings-container">
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
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              <span>Profile Settings</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Shield size={18} />
              <span>Security</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "domains" ? "active" : ""}`}
              onClick={() => setActiveTab("domains")}
            >
              <Globe size={18} />
              <span>Branded Domains</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "api" ? "active" : ""}`}
              onClick={() => setActiveTab("api")}
            >
              <Key size={18} />
              <span>API Keys & Webhooks</span>
            </button>
          </nav>

          {/* TAB 1: Profile Settings */}
          {activeTab === "profile" && (
            <div className="settings-card">
              <div className="card-header">
                <h2>Account Information</h2>
                <p>Update account identity and organization settings</p>
              </div>

              {profileFeedback.text && (
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                    backgroundColor:
                      profileFeedback.type === "success"
                        ? "#dcfce7"
                        : "#fee2e2",
                    color:
                      profileFeedback.type === "success"
                        ? "#166534"
                        : "#991b1b",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  }}
                >
                  {profileFeedback.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="field-input"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Organization Name</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.orgName}
                    onChange={(e) =>
                      setProfile({ ...profile, orgName: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save Profile</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Security Settings */}
          {activeTab === "security" && (
            <div className="settings-card">
              <div className="card-header">
                <h2>Update Security Credentials</h2>
                <p>Ensure account protection and session safety</p>
              </div>

              {passwordFeedback.text && (
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                    backgroundColor:
                      passwordFeedback.type === "success"
                        ? "#dcfce7"
                        : "#fee2e2",
                    color:
                      passwordFeedback.type === "success"
                        ? "#166534"
                        : "#991b1b",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  }}
                >
                  {passwordFeedback.text}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="settings-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    required
                    className="field-input"
                    placeholder="••••••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    required
                    className="field-input"
                    placeholder="Min 6 characters"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="field-input"
                    placeholder="Repeat password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Lock size={16} />
                  )}
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Custom Domains (Premium Static Lock) */}
          {activeTab === "domains" && (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Lock
                size={40}
                color="#2563eb"
                style={{ margin: "0 auto 1rem" }}
              />
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  marginBottom: "0.25rem",
                }}
              >
                Branded Custom Subdomains
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  maxWidth: "420px",
                  margin: "0 auto 1.5rem",
                }}
              >
                Unlock the ability to white-label shortcodes with your personal
                company brand name mapping instead of our default domains.
              </p>
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "50px",
                  fontWeight: 600,
                }}
              >
                Premium Tier Add-on
              </span>
            </div>
          )}

          {/* TAB 4: API Keys & Webhooks Layout Panel */}
          {activeTab === "api" && (
            <>
              {accountType !== "premium" ? (
                /* Dynamic Premium Account Paywall Block */
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    background: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Lock
                    size={40}
                    color="#2563eb"
                    style={{ margin: "0 auto 1rem" }}
                  />
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Developer API Tokens & Webhooks
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      maxWidth: "420px",
                      margin: "0 auto 1.5rem",
                    }}
                  >
                    Automate large-scale QR creation campaign batches
                    programmatically through custom server connectivity streams.
                    Upgrade to premium now to access this panel.
                  </p>
                  <button
                    onClick={() =>
                      alert("Payment gateway routing setup initiated.")
                    }
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Upgrade to Premium Tier
                  </button>
                </div>
              ) : (
                /* Interactive Professional Developer View Workspace Panels */
                <div
                  className="api-workspace-grid"
                  style={{ display: "grid", gap: "2rem" }}
                >
                  {/* Panel 1: API Keys Management */}
                  <div className="settings-card">
                    <div className="card-header">
                      <h2>Developer API Token Keys</h2>
                      <p>
                        Generate custom passwords to create or monitor code rows
                        programmatically via your scripts
                      </p>
                    </div>

                    {apiFeedback.text && (
                      <div
                        style={{
                          padding: "0.75rem",
                          borderRadius: "6px",
                          marginTop: "1rem",
                          backgroundColor:
                            apiFeedback.type === "success"
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            apiFeedback.type === "success"
                              ? "#166534"
                              : "#991b1b",
                          fontWeight: 500,
                          fontSize: "0.85rem",
                        }}
                      >
                        {apiFeedback.text}
                      </div>
                    )}

                    {/* Exposes secret plaintext key token string with clean mobile formatting */}
                    {newlyCreatedRawKey && (
                      <div className="dns-instruction-box">
                        <div className="dns-instruction-header">
                          <AlertCircle size={18} />
                          <span>WARNING: Copy your token key now!</span>
                        </div>
                        <p className="dns-instruction-desc">
                          For security, this secret clear text key cannot be
                          revealed or recovered ever again after you close or
                          refresh this browser window.
                        </p>
                        <div className="raw-key-container">
                          <span className="raw-key-text">
                            {newlyCreatedRawKey}
                          </span>
                          <button
                            className="btn-copy"
                            onClick={() =>
                              handleCopyText(newlyCreatedRawKey, "raw-token")
                            }
                          >
                            {copiedKeyId === "raw-token" ? (
                              <>
                                <Check size={16} color="#16a34a" />
                                <span style={{ color: "#16a34a" }}>
                                  Copied!
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                <span>Copy Key</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <form
                      onSubmit={handleCreateApiKey}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "1.5rem",
                        alignItems: "flex-end",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            marginBottom: "0.35rem",
                          }}
                        >
                          Key Description / Name
                        </label>
                        <input
                          type="text"
                          required
                          className="field-input"
                          placeholder="e.g. Mobile Production Server"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn-primary-action"
                        disabled={isCreatingKey}
                        style={{
                          height: "38px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0 1rem",
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {isCreatingKey ? (
                          <RefreshCw className="animate-spin" size={16} />
                        ) : (
                          <Plus size={16} />
                        )}
                        <span>Generate Key</span>
                      </button>
                    </form>

                    {/* API Token Keys Management Rows List Table Grid */}
                    <div style={{ marginTop: "2rem", overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "0.85rem",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              borderBottom: "1px solid #e2e8f0",
                              textAlign: "left",
                              color: "#64748b",
                            }}
                          >
                            <th style={{ padding: "0.75rem 0.5rem" }}>Name</th>
                            <th style={{ padding: "0.75rem 0.5rem" }}>
                              Key Hint
                            </th>
                            <th style={{ padding: "0.75rem 0.5rem" }}>
                              Status
                            </th>
                            <th
                              style={{
                                padding: "0.75rem 0.5rem",
                                textAlign: "right",
                              }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {apiKeysList.length === 0 ? (
                            <tr>
                              <td
                                colSpan="4"
                                style={{
                                  padding: "1.5rem 0.5rem",
                                  textAlign: "center",
                                  color: "#94a3b8",
                                }}
                              >
                                No API keys generated yet. Create one above to
                                get started.
                              </td>
                            </tr>
                          ) : (
                            apiKeysList.map((keyItem) => (
                              <tr
                                key={keyItem._id || keyItem.id}
                                style={{ borderBottom: "1px solid #f1f5f9" }}
                              >
                                <td
                                  style={{
                                    padding: "0.75rem 0.5rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {keyItem.name || keyItem.keyName}
                                </td>
                                <td
                                  style={{
                                    padding: "0.75rem 0.5rem",
                                    fontFamily: "monospace",
                                    color: "#64748b",
                                  }}
                                >
                                  {keyItem.keyHint ||
                                    keyItem.apiKeyHint ||
                                    "••••••••"}
                                </td>
                                <td style={{ padding: "0.75rem 0.5rem" }}>
                                  <span
                                    style={{
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "4px",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      backgroundColor: keyItem.isActive
                                        ? "#dcfce7"
                                        : "#f1f5f9",
                                      color: keyItem.isActive
                                        ? "#15803d"
                                        : "#64748b",
                                    }}
                                  >
                                    {keyItem.isActive ? "Active" : "Disabled"}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "0.75rem 0.5rem",
                                    textAlign: "right",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: "0.5rem",
                                      alignItems: "center",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="btn-toggle-switch"
                                      onClick={() =>
                                        handleToggleKeyStatus(
                                          keyItem._id || keyItem.id,
                                        )
                                      }
                                      title={
                                        keyItem.isActive
                                          ? "Disable Key"
                                          : "Enable Key"
                                      }
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "4px",
                                      }}
                                    >
                                      {keyItem.isActive ? (
                                        <ToggleRight
                                          size={22}
                                          color="#16a34a"
                                        />
                                      ) : (
                                        <ToggleLeft size={22} color="#94a3b8" />
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-delete"
                                      onClick={() =>
                                        handleDeleteApiKey(
                                          keyItem._id || keyItem.id,
                                        )
                                      }
                                      title="Delete Key"
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "4px",
                                      }}
                                    >
                                      <Trash2 size={18} color="#ef4444" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
