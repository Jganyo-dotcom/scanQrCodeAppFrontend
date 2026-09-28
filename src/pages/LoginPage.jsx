import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode, Mail, Lock, ArrowRight, RefreshCw } from "lucide-react";
import "../css/AuthPages.css";
import { baseUrl } from "../components/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // New states for async loading and error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMessage(""); // Clear old errors on a fresh click

  try {
    // 1. Hit the backend route path
    const response = await fetch(`${baseUrl}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Invalid email or password profile setup."
      );
    }

    // 2. 🚀 CRUCIAL STEP: Save the token and user metadata directly to localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Optional: saves user info for header profiles
    }

    // 3. Move the authenticated user directly onto their command center dashboard
    navigate("/dashboard");
  } catch (err) {
    setErrorMessage(err.message);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        <Link to="/" className="auth-brand">
          <QrCode size={28} color="#2563eb" />
          <span>DevJay QR</span>
        </Link>

        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to manage your dynamic QR codes and analytics
          </p>
        </div>

        {/* Dynamic Error Status Banner */}
        {errorMessage && (
          <div
            className="auth-error-banner"
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              borderRadius: "6px",
              marginBottom: "1rem",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <div className="input-icon-group">
              <input
                id="email"
                type="email"
                required
                disabled={isSubmitting}
                className="auth-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Mail className="input-icon" size={18} />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="input-icon-group">
              <input
                id="password"
                type="password"
                required
                disabled={isSubmitting}
                className="auth-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Lock className="input-icon" size={18} />
            </div>
          </div>

          <div className="auth-meta-row">
            <label className="remember-checkbox">
              <input
                type="checkbox"
                disabled={isSubmitting}
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
              />
              <span>Remember me</span>
            </label>
            <Link to="/ForgotPasswordPage" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {/* Action button changes state dynamically based on network latency status */}
          <button
            type="submit"
            className="btn-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Signing In... <RefreshCw size={18} className="animate-spin" />
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register" className="auth-switch-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
