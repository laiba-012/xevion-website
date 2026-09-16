import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0c052b",
        position: "relative",
        overflow: "hidden",
        padding: "100px 0",
      }}
    >
      {/* Background Glow */}

      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(20,130,105,.45) 0%, transparent 70%)",
          left: "50%",
          top: "45%",
          transform: "translate(-50%,-50%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Xevion Background Text */}

      <h1
        style={{
          position: "absolute",
          top: "90px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "150px",
          fontWeight: "900",
          letterSpacing: "8px",
          color: "rgba(255,255,255,.04)",
          userSelect: "none",
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        XEVION
      </h1>

      {/* Decorative Lines */}

      <div
        style={{
          position: "absolute",
          width: "240px",
          height: "1px",
          background: "rgba(255,255,255,.15)",
          top: "130px",
          left: "0",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "220px",
          height: "1px",
          background: "rgba(255,255,255,.15)",
          top: "220px",
          right: "0",
        }}
      />

      {/* Main Container */}

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 25px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Top Badge */}

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 22px",
            borderRadius: "40px",
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.12)",
            color: "#ddd",
            marginBottom: "45px",
            backdropFilter: "blur(15px)",
          }}
        >
          Contact
        </div>

        {/* Grid */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "420px 1fr",
            gap: "60px",
            alignItems: "start",
          }}
        >
          {/* LEFT SIDE START */}


                    {/* LEFT SIDE */}

          <div>
            <span
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: "30px",
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.12)",
                color: "#d8d8d8",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              Contact
            </span>

            <h2
              style={{
                color: "#fff",
                fontSize: "48px",
                margin: "0 0 15px",
                fontWeight: "700",
              }}
            >
              Get in touch
            </h2>

            <p
              style={{
                color: "#9ca3af",
                lineHeight: "28px",
                marginBottom: "40px",
                fontSize: "15px",
              }}
            >
              Have questions or ready to start your cybersecurity journey?
              We'd love to hear from you.
            </p>

            {/* Email Card */}

            <div style={cardStyle}>
              <div style={iconStyle}>
                <FaEnvelope />
              </div>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "#8b949e",
                    margin: 0,
                    fontSize: "13px",
                  }}
                >
                  Email us
                </p>

                <h4
                  style={{
                    color: "#fff",
                    margin: "6px 0 0",
                    fontWeight: "500",
                  }}
                >
                  contact@xevion.com
                </h4>
              </div>

              <div style={arrowStyle}>
                <FaArrowRight />
              </div>
            </div>

            {/* Phone */}

            <div style={cardStyle}>
              <div style={iconStyle}>
                <FaPhoneAlt />
              </div>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "#8b949e",
                    margin: 0,
                    fontSize: "13px",
                  }}
                >
                  Call us
                </p>

                <h4
                  style={{
                    color: "#fff",
                    margin: "6px 0 0",
                    fontWeight: "500",
                  }}
                >
                  +92 300 1234567
                </h4>
              </div>

              <div style={arrowStyle}>
                <FaArrowRight />
              </div>
            </div>

            {/* Address */}

            <div style={cardStyle}>
              <div style={iconStyle}>
                <FaMapMarkerAlt />
              </div>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "#8b949e",
                    margin: 0,
                    fontSize: "13px",
                  }}
                >
                  Our location
                </p>

                <h4
                  style={{
                    color: "#fff",
                    margin: "6px 0 0",
                    fontWeight: "500",
                  }}
                >
                  Islamabad, Pakistan
                </h4>
              </div>

              <div style={arrowStyle}>
                <FaArrowRight />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE START */}

                    {/* RIGHT SIDE */}

          <div
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.10)",
              borderRadius: "24px",
              padding: "25px",
              backdropFilter: "blur(25px)",
              boxShadow: "0 25px 60px rgba(0,0,0,.35)",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Name */}

              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                style={inputStyle}
              />

              {/* Email */}

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                style={{
                  ...inputStyle,
                  marginTop: "16px",
                }}
              />

              {/* Message */}

              <textarea
                placeholder="Message"
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                style={{
                  ...inputStyle,
                  marginTop: "16px",
                  minHeight: "220px",
                  resize: "none",
                  paddingTop: "18px",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  height: "55px",
                  marginTop: "22px",
                  borderRadius: "14px",
                  border: "none",
                  background: "#ffffff",
                  color: "#111",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "15px",
                  transition: ".3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#16a085";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#fff";
                  e.target.style.color = "#111";
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

};

const cardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  padding: "18px 20px",
  marginBottom: "18px",
  borderRadius: "18px",
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.10)",
  backdropFilter: "blur(20px)",
};

const iconStyle = {
  width: "55px",
  height: "55px",
  borderRadius: "14px",
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#1dd1a1",
  fontSize: "20px",
};

const arrowStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "rgba(255,255,255,.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  height: "58px",
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.10)",
  borderRadius: "14px",
  outline: "none",
  color: "#fff",
  padding: "0 18px",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default Contact;