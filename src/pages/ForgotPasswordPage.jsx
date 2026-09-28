import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QrCode, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import "../css/AuthPages.css";
import { baseUrl } from "../components/api";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
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
          <h1 className="auth-title">Reset password</h1>
          <p className="auth-subtitle">
            Enter your email and we'll send you instructions to reset your
            password.
          </p>
        </div>

        {isSubmitted ? (
          <div className="success-banner">
            <CheckCircle2
              size={32}
              color="#2563eb"
              style={{ marginBottom: "0.5rem" }}
            />
            <div
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: "0.25rem",
              }}
            >
              Check your inbox
            </div>
            <div>
              We sent a password reset link to <strong>{email}</strong>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="reset-email">Email address</label>
              <div className="input-icon-group">
                <input
                  id="reset-email"
                  type="email"
                  required
                  className="auth-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="input-icon" size={18} />
              </div>
            </div>

            <button type="submit" className="btn-auth-submit">
              Send Reset Link
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link
            to="/login"
            className="auth-switch-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
