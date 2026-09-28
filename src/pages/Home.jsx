import React from "react";
import { Link } from "react-router-dom";
import {
  QrCode,
  Zap,
  ShieldCheck,
  BarChart3,
  Globe,
  ArrowRight,
  Mail,
  User,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

import "../css/HomePage.css";

export default function HomePage() {
  return (
    <div className="landing-container">
      {/* ------------------------------------------------------------------ */}
      {/* Navigation Header                                                  */}
      {/* ------------------------------------------------------------------ */}
      <header className="landing-nav">
        <div className="nav-wrapper">
          <div className="brand-logo">
            <QrCode size={26} color="#3b82f6" />
            <span>DevJay QR</span>
            <span className="brand-badge">v2.0</span>
          </div>

          <ul className="nav-menu">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#about-creator">About DevJay</a>
            </li>
            <li>
              <a href="#footer">Contact</a>
            </li>
          </ul>

          <Link to="/login" className="btn btn-primary">
            Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="hero-section">
        <div>
          <div className="hero-tag">
            <Sparkles size={14} /> Next-Generation QR Suite
          </div>
          <h1 className="hero-title">
            Generate, Track & Manage <span>Custom QR Codes</span> Instantly.
          </h1>
          <p className="hero-description">
            Empower your applications and business cards with dynamic,
            high-resolution QR codes backed by real-time scan analytics and
            customizable styling.
          </p>
          <div className="hero-actions">
            <Link
              to="/dashboard"
              className="btn btn-primary"
              style={{ padding: "0.95rem 1.8rem" }}
            >
              Create Your QR Code
            </Link>
            <a
              href="#features"
              className="btn"
              style={{
                border: "1px solid #1e293b",
                background: "#111827",
                color: "#f8fafc",
              }}
            >
              Explore Platform
            </a>
          </div>
        </div>

        <div className="hero-preview-card">
          <div className="preview-graphic">
            <QrCode
              size={120}
              color="#3b82f6"
              style={{ marginBottom: "1rem" }}
            />
            <span
              style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f8fafc" }}
            >
              DevJay QR Generator Engine
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                marginTop: "0.25rem",
              }}
            >
              Ready for Instant Export & Print
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Platform Features Section                                          */}
      {/* ------------------------------------------------------------------ */}
      <section id="features" className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">Built for Performance & Scale</h2>
          <p className="section-subtitle">
            Everything you need to connect physical products to digital
            experiences.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box">
              <Zap size={24} />
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Lightning Fast
            </h3>
            <p
              style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}
            >
              Instant vector rendering ensures high-precision scannability on
              all devices.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <BarChart3 size={24} />
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Scan Analytics
            </h3>
            <p
              style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}
            >
              Monitor engagement trends, scan dates, and active locations in
              real time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={24} />
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Secure & Reliable
            </h3>
            <p
              style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}
            >
              Built with robust input guards and modern backend REST API
              standards.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <Globe size={24} />
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Multi-Data Types
            </h3>
            <p
              style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}
            >
              Support for URLs, Wi-Fi credentials, phone contact cards, and
              geo-locations.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* About the Creator Section (DevJay)                                 */}
      {/* ------------------------------------------------------------------ */}
      <section id="about-creator" className="section-wrapper">
        <div className="about-creator-card">
          <div className="avatar-container">
            {/* Replace src with your image path (e.g. /devjay.jpg) when ready */}
            <div className="avatar-placeholder">
              <User size={48} color="#3b82f6" />
              <span style={{ marginTop: "0.5rem" }}>DevJay Photo</span>
            </div>
          </div>

          <div className="creator-bio">
            <h3>Meet DevJay</h3>
            <span className="creator-role">
              Full-Stack Software Developer & Systems Architect
            </span>
            <p className="creator-text">
              Passionate engineer focused on crafting clean, high-performance
              web applications, robust REST APIs, and modern dashboard
              experiences. DevJay QR was built from the ground up to provide
              seamless utility with tailored CSS precision.
            </p>

            <div className="tech-chips" style={{ marginBottom: "1.5rem" }}>
              <span className="chip">React</span>
              <span className="chip">Node.js</span>
              <span className="chip">Express</span>
              <span className="chip">TypeScript</span>
              <span className="chip">PostgreSQL</span>
              <span className="chip">Prisma</span>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{
                  background: "#1e293b",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  fontSize: "0.85rem",
                  display: "inline-flex" /* Keeps icon and text centered */,
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaGithub size={16} /> GitHub <ExternalLink size={12} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{
                  background: "#1e293b",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  fontSize: "0.85rem",
                  display: "inline-flex" /* Keeps icon and text centered */,
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaLinkedin size={16} /> LinkedIn <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                             */}
      {/* ------------------------------------------------------------------ */}
      <footer id="footer" className="landing-footer">
        <div className="footer-grid">
          <div className="footer-col" style={{ gridColumn: "span 2" }}>
            <div className="brand-logo" style={{ marginBottom: "1rem" }}>
              <QrCode size={22} color="#3b82f6" />
              <span>DevJay QR</span>
            </div>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                maxWidth: "320px",
                lineHeight: 1.6,
              }}
            >
              A professional suite for generating dynamic QR codes and managing
              digital workflows. Built with custom CSS and modern JavaScript.
            </p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li>
                <Link to="/dashboard">QR Builder</Link>
              </li>
              <li>
                <Link to="/history">Scan History</Link>
              </li>
              <li>
                <Link to="/analytics">Analytics</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Developer</h4>
            <ul className="footer-links">
              <li>
                <a href="#about-creator">About DevJay</a>
              </li>
              <li>
                <a href="mailto:devjay@example.com">
                  <Mail size={12} /> Contact Email
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  Source Repositories
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} DevJay QR. All rights reserved. Crafted
            by DevJay.
          </div>

          <div className="social-links">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="social-btn"
            >
              <FaLinkedin size={18} />
            </a>
            <a href="mailto:devjay@example.com" className="social-btn">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
