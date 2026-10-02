import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Globe,
  Wifi,
  User,
  FileText,
  Download,
  Copy,
  Palette,
  Menu,
  Check,
  Sparkles,
  Save,
  RefreshCw,
  Zap,
  Image as ImageIcon,
  UploadCloud,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import "../css/CreateQR.css";
import { baseUrl } from "../components/api";

export default function CreateQR() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("url");
  const [title, setTitle] = useState("Summer Promo Campaign");

  // Dynamic Form Field States
  const [url, setUrl] = useState("https://devjay.io");
  const [textPayload, setTextPayload] = useState("Hello world!");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [vName, setVName] = useState("");
  const [vPhone, setVPhone] = useState("");

  // Image Upload States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Routing Strategy & Backend Integration States
  const [isDynamic, setIsDynamic] = useState(false);
  const [generatedQrValue, setGeneratedQrValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Visual Customization States
  const [fgColor, setFgColor] = useState("#0f172a");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [cornerDot, setCornerDot] = useState("square");
  const [copied, setCopied] = useState(false);

  const qrRef = useRef(null);
  const fileInputRef = useRef(null);

  // Format payload strings according to standard QR spec
  const getFormattedPayload = () => {
    switch (selectedType) {
      case "image":
        return uploadedImageUrl || imagePreviewUrl || "https://devjay.io";
      case "wifi":
        return `WIFI:S:${ssid};T:WPA;P:${password};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vName}\nTEL:${vPhone}\nEND:VCARD`;
      case "text":
        return textPayload;
      case "url":
      default:
        return url || "https://devjay.io";
    }
  };

  const localPayload = getFormattedPayload();
  const activeQrValue = generatedQrValue || localPayload;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeQrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (updaterFunction, value) => {
    updaterFunction(value);
    if (generatedQrValue) setGeneratedQrValue("");
  };

  // Upload Picture to Backend (`/scan_images` directory)
  const handleImageFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setStatusMessage({
        type: "error",
        text: "Please select a valid image file (PNG, JPG, WEBP, GIF).",
      });
      return;
    }

    setImageFile(file);
    const localObjectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(localObjectUrl);
    setGeneratedQrValue("");
    setIsUploadingImage(true);
    setStatusMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");

    try {
      // POST multipart request to backend upload route
      const response = await fetch(`${baseUrl}/v1/qrs/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image.");
      }

      // Expected return: public URL pointing to saved image inside /scan_images/
      const finalUrl =
        data.imageUrl || `${baseUrl}/scan_images/${data.filename}`;
      setUploadedImageUrl(finalUrl);

      setStatusMessage({
        type: "success",
        text: "Image uploaded successfully! Viewers can scan to view and download.",
      });
    } catch (err) {
      // Fallback to local blob preview URL if backend endpoint is offline
      setUploadedImageUrl(localObjectUrl);
      setStatusMessage({
        type: "error",
        text: `Image upload warning: ${err.message}. Local preview used for QR code.`,
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // POST Request to Express Server Backend
  const handleSaveToBackend = async () => {
    setIsSaving(true);
    setStatusMessage({ type: "", text: "" });
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${baseUrl}/v1/qrs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: title,
          qrType: selectedType,
          isDynamic: isDynamic,
          contentData: localPayload,
          customization: {
            foregroundColor: fgColor,
            backgroundColor: bgColor,
            dotStyle: cornerDot,
          },
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save QR code.");
      }

      if (data.qrValue) {
        setGeneratedQrValue(data.qrValue);
      }

      setStatusMessage({
        type: "success",
        text: isDynamic
          ? "Dynamic QR activated! Redirection tracking shortlink is active."
          : "Static QR code successfully saved to your account.",
      });
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
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

        <main className="create-qr-container">
          <section className="dashboard-header">
            <div className="dashboard-title-group">
              <h1>Create QR Code</h1>
              <p>
                Configure routing payload and visually design your custom code
              </p>
            </div>
          </section>

          {statusMessage.text && (
            <div
              className={`status-banner ${statusMessage.type}`}
              style={{
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                fontWeight: 500,
                backgroundColor:
                  statusMessage.type === "success" ? "#dcfce7" : "#fee2e2",
                color: statusMessage.type === "success" ? "#166534" : "#991b1b",
                border: `1px solid ${statusMessage.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              }}
            >
              {statusMessage.text}
            </div>
          )}

          <div className="create-grid">
            <div className="form-card">
              {/* Step 1: Content Type Selection */}
              <div>
                <span className="form-section-title">
                  <Sparkles size={18} color="#2563eb" />
                  1. Select Content Type
                </span>
                <div className="type-selector-grid">
                  <button
                    type="button"
                    className={`type-btn ${selectedType === "url" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedType("url");
                      setGeneratedQrValue("");
                    }}
                  >
                    <Globe size={20} />
                    Website URL
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${selectedType === "image" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedType("image");
                      setGeneratedQrValue("");
                    }}
                  >
                    <ImageIcon size={20} />
                    Picture / Image
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${selectedType === "wifi" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedType("wifi");
                      setGeneratedQrValue("");
                    }}
                  >
                    <Wifi size={20} />
                    Wi-Fi Access
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${selectedType === "vcard" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedType("vcard");
                      setGeneratedQrValue("");
                    }}
                  >
                    <User size={20} />
                    vCard Contact
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${selectedType === "text" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedType("text");
                      setGeneratedQrValue("");
                    }}
                  >
                    <FileText size={20} />
                    Plain Text
                  </button>
                </div>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--create-border, #e2e8f0)",
                  margin: "1.5rem 0",
                }}
              />

              {/* Step 2: Content Details Form */}
              <div>
                <span className="form-section-title">
                  2. Enter Payload Details
                </span>
                <div
                  className="field-container"
                  style={{ marginBottom: "1rem" }}
                >
                  <label className="field-label">Campaign Name</label>
                  <input
                    type="text"
                    className="field-input"
                    value={title}
                    onChange={(e) =>
                      handleInputChange(setTitle, e.target.value)
                    }
                    placeholder="e.g. Summer Promo 2026"
                  />
                </div>

                {selectedType === "url" && (
                  <div className="field-container">
                    <label className="field-label">Destination URL</label>
                    <input
                      type="url"
                      className="field-input"
                      value={url}
                      onChange={(e) =>
                        handleInputChange(setUrl, e.target.value)
                      }
                      placeholder="https://your-domain.com"
                    />
                  </div>
                )}

                {/* Picture / Image Upload Field */}
                {selectedType === "image" && (
                  <div className="field-container">
                    <label className="field-label">Upload Image / Photo</label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileSelect}
                      accept="image/*"
                      style={{ display: "none" }}
                    />

                    <div
                      onClick={() =>
                        !isUploadingImage && fileInputRef.current?.click()
                      }
                      style={{
                        border: "2px dashed var(--create-border, #cbd5e1)",
                        borderRadius: "10px",
                        padding: "1.5rem",
                        textAlign: "center",
                        backgroundColor: "var(--card-bg, #f8fafc)",
                        cursor: isUploadingImage ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {isUploadingImage ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <RefreshCw
                            size={28}
                            className="animate-spin"
                            color="#2563eb"
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                          <span
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "#2563eb",
                            }}
                          >
                            Uploading image to server...
                          </span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={32} color="#2563eb" />
                          <span
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "var(--text-primary, #0f172a)",
                            }}
                          >
                            Click to browse or drag image here
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted, #64748b)",
                            }}
                          >
                            Supports PNG, JPG, WEBP, GIF (Saved to /scan_images)
                          </span>
                        </>
                      )}
                    </div>

                    {/* Image Preview and Link */}
                    {imagePreviewUrl && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "0.75rem",
                          border: "1px solid var(--create-border, #e2e8f0)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <img
                          src={imagePreviewUrl}
                          alt="Uploaded preview"
                          style={{
                            width: "56px",
                            height: "56px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <strong
                            style={{
                              display: "block",
                              fontSize: "0.85rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {imageFile ? imageFile.name : "Uploaded Image"}
                          </strong>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted, #64748b)",
                              display: "block",
                              wordBreak: "break-all",
                            }}
                          >
                            {uploadedImageUrl || "Processing..."}
                          </span>
                        </div>

                        {uploadedImageUrl && (
                          <a
                            href={uploadedImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: "0.4rem 0.6rem",
                              borderRadius: "6px",
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              textDecoration: "none",
                            }}
                          >
                            View <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {selectedType === "wifi" && (
                  <div className="input-group-row">
                    <div className="field-container">
                      <label className="field-label">Network Name (SSID)</label>
                      <input
                        type="text"
                        className="field-input"
                        value={ssid}
                        onChange={(e) =>
                          handleInputChange(setSsid, e.target.value)
                        }
                        placeholder="e.g. Office_Guest"
                      />
                    </div>
                    <div className="field-container">
                      <label className="field-label">Password</label>
                      <input
                        type="password"
                        className="field-input"
                        value={password}
                        onChange={(e) =>
                          handleInputChange(setPassword, e.target.value)
                        }
                        placeholder="WPA/WPA2 Password"
                      />
                    </div>
                  </div>
                )}

                {selectedType === "vcard" && (
                  <div className="input-group-row">
                    <div className="field-container">
                      <label className="field-label">Full Name</label>
                      <input
                        type="text"
                        className="field-input"
                        value={vName}
                        onChange={(e) =>
                          handleInputChange(setVName, e.target.value)
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="field-container">
                      <label className="field-label">Phone Number</label>
                      <input
                        type="tel"
                        className="field-input"
                        value={vPhone}
                        onChange={(e) =>
                          handleInputChange(setVPhone, e.target.value)
                        }
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                )}

                {selectedType === "text" && (
                  <div className="field-container">
                    <label className="field-label">Text Content</label>
                    <textarea
                      className="field-input"
                      rows={3}
                      value={textPayload}
                      onChange={(e) =>
                        handleInputChange(setTextPayload, e.target.value)
                      }
                      placeholder="Enter raw text payload..."
                    />
                  </div>
                )}
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--create-border, #e2e8f0)",
                  margin: "1.5rem 0",
                }}
              />

              {/* Step 3: Routing Strategy Selection */}
              <div>
                <span className="form-section-title">
                  <Zap size={18} color="#2563eb" />
                  3. Select Routing Behavior
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginTop: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      border: `2px solid ${!isDynamic ? "#2563eb" : "var(--create-border, #e2e8f0)"}`,
                      backgroundColor: !isDynamic
                        ? "#eff6ff"
                        : "var(--card-bg, #ffffff)",
                      padding: "1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setIsDynamic(false);
                      setGeneratedQrValue("");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-primary, #0f172a)",
                        }}
                      >
                        Static QR
                      </strong>
                      {!isDynamic && <Check size={16} color="#2563eb" />}
                    </div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted, #64748b)",
                        margin: 0,
                      }}
                    >
                      Payload is directly embedded. Works offline forever
                      without server tracking.
                    </p>
                  </div>

                  <div
                    style={{
                      border: `2px solid ${isDynamic ? "#2563eb" : "var(--create-border, #e2e8f0)"}`,
                      backgroundColor: isDynamic
                        ? "#eff6ff"
                        : "var(--card-bg, #ffffff)",
                      padding: "1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setIsDynamic(true);
                      setGeneratedQrValue("");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-primary, #0f172a)",
                        }}
                      >
                        Dynamic QR (Trackable)
                      </strong>
                      {isDynamic && <Check size={16} color="#2563eb" />}
                    </div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted, #64748b)",
                        margin: 0,
                      }}
                    >
                      Routes through shortlink (`/r/code`). Live scan analytics
                      and editable destination.
                    </p>
                  </div>
                </div>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--create-border, #e2e8f0)",
                  margin: "1.5rem 0",
                }}
              />

              {/* Step 4: Styling Customization */}
              <div>
                <span className="form-section-title">
                  <Palette size={18} color="#2563eb" />
                  4. Color & Styling
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div className="field-container">
                    <label className="field-label">Foreground Color</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="color"
                        className="color-swatch-picker"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                      />
                      <span
                        style={{ fontSize: "0.85rem", fontFamily: "monospace" }}
                      >
                        {fgColor}
                      </span>
                    </div>
                  </div>

                  <div className="field-container">
                    <label className="field-label">Background Color</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="color"
                        className="color-swatch-picker"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                      />
                      <span
                        style={{ fontSize: "0.85rem", fontFamily: "monospace" }}
                      >
                        {bgColor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="field-container" style={{ marginTop: "1rem" }}>
                  <label className="field-label">Corner Style</label>
                  <select
                    className="field-input"
                    value={cornerDot}
                    onChange={(e) => setCornerDot(e.target.value)}
                  >
                    <option value="square">Standard Square</option>
                    <option value="rounded">Rounded Soft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div
              className="preview-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  Live Preview
                </span>
                <span
                  style={{
                    backgroundColor: generatedQrValue ? "#dcfce7" : "#f1f5f9",
                    color: generatedQrValue ? "#166534" : "#475569",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {generatedQrValue ? "Synced with Server" : "Local Preview"}
                </span>
              </div>

              <div
                className="qr-display-box"
                style={{
                  backgroundColor: bgColor,
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid var(--create-border, #e2e8f0)",
                  marginBottom: "1rem",
                }}
                ref={qrRef}
              >
                <QRCodeCanvas
                  value={activeQrValue}
                  size={180}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  marginSize={2}
                  style={{
                    borderRadius: cornerDot === "rounded" ? "8px" : "0px",
                  }}
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  width: "100%",
                  marginBottom: "1.25rem",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    color: "var(--text-primary, #0f172a)",
                  }}
                >
                  {title || "Untitled QR"}
                </strong>
                <span
                  style={{
                    display: "block",
                    marginTop: "0.25rem",
                    wordBreak: "break-all",
                    fontSize: "0.75rem",
                    color: "var(--text-muted, #64748b)",
                  }}
                >
                  {activeQrValue}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  width: "100%",
                }}
              >
                <button
                  type="button"
                  onClick={handleSaveToBackend}
                  disabled={isSaving || isUploadingImage}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor:
                      isSaving || isUploadingImage ? "not-allowed" : "pointer",
                    border: "none",
                    width: "100%",
                    opacity: isSaving || isUploadingImage ? 0.7 : 1,
                  }}
                >
                  {isSaving ? <RefreshCw size={18} /> : <Save size={18} />}
                  {isDynamic
                    ? "Generate & Save Dynamic QR"
                    : "Save Static QR to Account"}
                </button>

                <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                  <button
                    type="button"
                    onClick={handleDownloadPNG}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid var(--create-border, #cbd5e1)",
                      backgroundColor: "var(--card-bg, #ffffff)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    <Download size={16} /> Download PNG
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      padding: "0.6rem",
                      borderRadius: "6px",
                      border: "1px solid var(--create-border, #cbd5e1)",
                      backgroundColor: "var(--card-bg, #ffffff)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {copied ? (
                      <Check size={16} color="#16a34a" />
                    ) : (
                      <Copy size={16} />
                    )}
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
