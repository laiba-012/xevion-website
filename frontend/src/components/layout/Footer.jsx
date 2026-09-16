import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#06031f",
        color: "#fff",
        padding: "55px 35px 30px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        {/* Top Content */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "70px",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Left Links */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <div
              style={{
                display: "flex",
                gap: "90px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h4 style={heading}>Explore</h4>
                <p style={link}><Link to="/courses" style={linkStyle}>Our Courses</Link></p>
                <p style={link}><Link to="/events" style={linkStyle}>Cyber Events</Link></p>
                <p style={link}><Link to="/blog" style={linkStyle}>Cyber News</Link></p>
                <p style={link}><Link to="/about" style={linkStyle}>About Us</Link></p>
              </div>

              <div>
                <h4 style={heading}>Community</h4>
                <p style={link}><Link to="/contact" style={linkStyle}>Support</Link></p>
                <p style={link}><Link to="/team" style={linkStyle}>Our Team</Link></p>
                <p style={link}><Link to="/sponsors" style={linkStyle}>Partners</Link></p>
                <p style={link}><Link to="/contact" style={linkStyle}>Contact</Link></p>
              </div>
            </div>
          </div>

          {/* Right Newsletter */}
          <div
            style={{
              width: "420px",
              maxWidth: "100%",
            }}
          >
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "600",
                marginBottom: "20px",
                color: "#ffffff",
              }}
            >
              Get the freshest Xevion news
            </h3>

            <div
              style={{
                display: "flex",
                border: "1px solid rgba(0, 132, 255, 0.35)",
                borderRadius: "8px",
                overflow: "hidden",
                height: "50px",
                background: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <input
                type="email"
                placeholder="Your email here"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  padding: "0 18px",
                  fontSize: "14px",
                }}
              />

              <button
                type="button"
                style={{
                  padding: "0 24px",
                  border: "none",
                  background: "linear-gradient(135deg, #0084ff, #0052cc)",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Subscribe
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                marginTop: "16px",
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: "20px",
              }}
            >
              <input
                type="checkbox"
                id="ageVerification"
                style={{
                  width: "16px",
                  height: "16px",
                  marginTop: "2px",
                  accentColor: "#0084ff",
                  cursor: "pointer",
                }}
              />

              <label htmlFor="ageVerification" style={{ cursor: "pointer" }}>
                By checking the box, you agree that you are at least 16 years of age.
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Section - Only 2026 Copyright */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            marginTop: "50px",
            paddingTop: "24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#94a3b8",
              letterSpacing: "0.3px",
            }}
          >
            ©2026 Xevion, LLC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const heading = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#38bdf8",
  marginBottom: "16px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const link = {
  margin: "0 0 12px",
  fontSize: "15px",
};

const linkStyle = {
  color: "#cbd5e1",
  textDecoration: "none",
  transition: "color 0.2s ease",
};

export default Footer;