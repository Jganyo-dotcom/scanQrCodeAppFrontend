import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode, User, Mail, Lock, ArrowRight, RefreshCw } from "lucide-react";
import "../css/AuthPages.css";
import { baseUrl } from "../components/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "", // Wire up the confirmation property state tracking field
  });

  // State controllers for loading status and message boxes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    // Client-side guard rail check: matching fields validation
    if (formData.password !== formData.confirmPassword) {
      return setFeedback({
        type: "error",
        text: "Passwords do not match. Please verify.",
      });
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName, // Maps frontend 'fullName' parameter down to backend schema 'name' key
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration sequence failed.");
      }

      setFeedback({
        type: "success",
        text: "Account created successfully! Redirecting you to sign in...",
      });

      // Clear input fields safely
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Take the user to the login page after a 2-second delay so they can read the success message
      setTimeout(() => {
        navigate("/login");
      }, 2200);
    } catch (err) {
      setFeedback({ type: "error", text: err.message });
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
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">
            Start generating custom QR codes in seconds
          </p>
        </div>

        {/* Dynamic Context Notification Banner */}
        {feedback.text && (
          <div
            className={`auth-feedback-banner ${feedback.type}`}
            style={{
              padding: "0.75rem 1rem",
              backgroundColor:
                feedback.type === "success" ? "#dcfce7" : "#fee2e2",
              border: `1px solid ${feedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              color: feedback.type === "success" ? "#166534" : "#991b1b",
              borderRadius: "6px",
              marginBottom: "1rem",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {feedback.text}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-icon-group">
              <input
                id="fullName"
                type="text"
                required
                disabled={isSubmitting}
                className="auth-input"
                placeholder="Dev Jay"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <User className="input-icon" size={18} />
            </div>
          </div>

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
                placeholder="Create password (min 6 chars)"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Lock className="input-icon" size={18} />
            </div>
          </div>

          {/* New Interactive Confirmation Field Input Container Wireup */}
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-icon-group">
              <input
                id="confirmPassword"
                type="password"
                required
                disabled={isSubmitting}
                className="auth-input"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <Lock className="input-icon" size={18} />
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Creating Account...{" "}
                <RefreshCw size={18} className="animate-spin" />
              </>
            ) : (
              <>
                Get Started <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-switch-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
