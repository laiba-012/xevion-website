import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdShield,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdSecurity,
  MdArrowBack
} from "react-icons/md";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get("error") === "unauthorized"
      ? "Access Denied: You must be logged in as an Administrator."
      : ""
  );

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || "Invalid Admin Credentials.");
        setLoading(false);
        return;
      }

      const user = result.user;
      const isAdmin =
        user?.role === "admin" ||
        user?.email === "laibafatima0116@gmail.com" ||
        user?.email === "admin@xevion.com";

      if (!isAdmin) {
        if (logout) logout();
        setError("⛔ Access Denied: This account does not have Administrator privileges.");
        setLoading(false);
        return;
      }

      // Success! Navigate directly to Admin Terminal
      navigate("/admin");
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#030712",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 650,
          height: 650,
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.14) 0%, rgba(185, 28, 28, 0.04) 50%, transparent 75%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Secondary Cyber Cyan Ambient */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(0, 132, 255, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Cyber Auth Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(10, 15, 28, 0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          borderRadius: 24,
          padding: "40px 36px",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(239, 68, 68, 0.12)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Top Security Badge */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: 30,
              color: "#fca5a5",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <MdSecurity style={{ fontSize: 16, color: "#ef4444" }} />
            <span>Restricted Access Terminal</span>
          </div>

          <div>
            <Link to="/" style={{ display: "inline-block", textDecoration: "none" }}>
              <img
                src="/xevion-logo-cropped.png"
                alt="Xevion"
                style={{
                  height: 48,
                  borderRadius: 8,
                  filter: "drop-shadow(0 0 16px rgba(239, 68, 68, 0.45))",
                }}
              />
            </Link>
          </div>

          <h2
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 800,
              marginTop: 14,
              marginBottom: 4,
              letterSpacing: "-0.02em",
            }}
          >
            Admin Authentication
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
            Zero-Trust Terminal • Authorized Admins Only
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.45)",
              color: "#fca5a5",
              padding: "11px 14px",
              borderRadius: 12,
              fontSize: 13,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
              lineHeight: 1.4,
            }}
          >
            <MdShield style={{ fontSize: 18, color: "#ef4444", flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin}>
          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                color: "#cbd5e1",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              Admin Email
            </label>
            <div style={{ position: "relative" }}>
              <MdEmail
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  fontSize: 18,
                }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@xevion.com"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ef4444";
                  e.target.style.boxShadow = "0 0 14px rgba(239, 68, 68, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(239, 68, 68, 0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                color: "#cbd5e1",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              Master Password
            </label>
            <div style={{ position: "relative" }}>
              <MdLock
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  fontSize: 18,
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: "100%",
                  padding: "12px 44px 12px 42px",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ef4444";
                  e.target.style.boxShadow = "0 0 14px rgba(239, 68, 68, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(239, 68, 68, 0.25)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 4,
                }}
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px 20px",
              background: loading
                ? "rgba(239, 68, 68, 0.4)"
                : "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              border: "none",
              borderRadius: 12,
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 25px rgba(239, 68, 68, 0.4)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(239, 68, 68, 0.6)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 25px rgba(239, 68, 68, 0.4)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? (
              <span>Authenticating Admin...</span>
            ) : (
              <>
                <span>Access Admin Terminal</span>
                <MdArrowForward style={{ fontSize: 18 }} />
              </>
            )}
          </button>
        </form>

        {/* Footer info & Back Link */}
        <div
          style={{
            marginTop: 26,
            paddingTop: 18,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#64748b",
              textDecoration: "none",
              fontSize: 13,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <MdArrowBack size={16} />
            <span>Return to Site</span>
          </Link>

          <span style={{ fontSize: 11, color: "#475569" }}>
            🔒 Zero-Trust Shield
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
