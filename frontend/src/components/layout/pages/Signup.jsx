import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdShield,
  MdArrowForward,
} from "react-icons/md";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = await signup({
      name,
      email,
      password,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message || "Signup failed.");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060a14",
        padding: "100px 20px 60px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      {/* Background Ambient Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 650,
          height: 650,
          background: "radial-gradient(circle, rgba(0, 132, 255, 0.18) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 75%)",
          borderRadius: "50%",
          filter: "blur(45px)",
          pointerEvents: "none",
        }}
      />

      {/* Cyber Auth Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "rgba(10, 15, 30, 0.88)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0, 132, 255, 0.3)",
          borderRadius: 22,
          padding: "38px 36px 40px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 132, 255, 0.15)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <Link to="/" style={{ display: "inline-block", textDecoration: "none" }}>
            <img
              src="/xevion-logo-cropped.png"
              alt="Xevion"
              style={{
                height: 52,
                borderRadius: 8,
                filter: "drop-shadow(0 0 16px rgba(0, 132, 255, 0.55))",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </Link>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#ffffff",
              margin: "14px 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            Create Your Account
          </h1>

          <p
            style={{
              fontSize: 13.5,
              color: "#94a3b8",
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Join the Xevion cybersecurity ecosystem
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#fca5a5",
              padding: "11px 16px",
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name Input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#cbd5e1",
                marginBottom: 6,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Full Name
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <MdPerson
                style={{
                  position: "absolute",
                  left: 14,
                  color: "#0084ff",
                  fontSize: 18,
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Vance"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 42px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(0, 132, 255, 0.22)",
                  borderRadius: 10,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0084ff";
                  e.target.style.boxShadow = "0 0 16px rgba(0, 132, 255, 0.3)";
                  e.target.style.background = "rgba(0, 132, 255, 0.06)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0, 132, 255, 0.22)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255, 255, 255, 0.04)";
                }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#cbd5e1",
                marginBottom: 6,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <MdEmail
                style={{
                  position: "absolute",
                  left: 14,
                  color: "#0084ff",
                  fontSize: 18,
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@xevion.com"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 42px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(0, 132, 255, 0.22)",
                  borderRadius: 10,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0084ff";
                  e.target.style.boxShadow = "0 0 16px rgba(0, 132, 255, 0.3)";
                  e.target.style.background = "rgba(0, 132, 255, 0.06)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0, 132, 255, 0.22)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255, 255, 255, 0.04)";
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#cbd5e1",
                marginBottom: 6,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Password (min 6 characters)
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <MdLock
                style={{
                  position: "absolute",
                  left: 14,
                  color: "#0084ff",
                  fontSize: 18,
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: "100%",
                  padding: "11px 42px 11px 42px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(0, 132, 255, 0.22)",
                  borderRadius: 10,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0084ff";
                  e.target.style.boxShadow = "0 0 16px rgba(0, 132, 255, 0.3)";
                  e.target.style.background = "rgba(0, 132, 255, 0.06)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0, 132, 255, 0.22)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255, 255, 255, 0.04)";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  padding: 4,
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#cbd5e1",
                marginBottom: 6,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <MdLock
                style={{
                  position: "absolute",
                  left: 14,
                  color: "#0084ff",
                  fontSize: 18,
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 42px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(0, 132, 255, 0.22)",
                  borderRadius: 10,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  transition: "all 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0084ff";
                  e.target.style.boxShadow = "0 0 16px rgba(0, 132, 255, 0.3)";
                  e.target.style.background = "rgba(0, 132, 255, 0.06)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0, 132, 255, 0.22)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255, 255, 255, 0.04)";
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px 20px",
              background: "linear-gradient(135deg, #0084ff, #0052cc)",
              color: "#ffffff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 24px rgba(0, 132, 255, 0.38)",
              transition: "all 0.25s ease",
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: loading ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 132, 255, 0.6)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(0, 132, 255, 0.38)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
            {!loading && <MdArrowForward style={{ fontSize: 18 }} />}
          </button>

          {/* Footer Link */}
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#94a3b8",
              fontFamily: "'Inter', sans-serif",
              marginTop: 4,
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#38bdf8",
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0084ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#38bdf8")}
            >
              Sign In
            </Link>
          </div>
        </form>

        {/* Security Badge Footnote */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 11,
            color: "#64748b",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <MdShield style={{ color: "#10b981", fontSize: 13 }} />
          <span>Verified Zero-Trust Defense Platform</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;