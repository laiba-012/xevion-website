import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  FaBell,
  FaSearch,
  FaCheckDouble,
  FaTrashAlt,
  FaUserGraduate,
  FaShieldAlt,
  FaBookOpen,
  FaCheckCircle,
  FaSignOutAlt,
  FaCog,
  FaUserShield,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import "./AdminTopbar.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Administrator Active",
    desc: "Laiba Fatima has been granted Super Admin root access.",
    time: "5 mins ago",
    type: "security",
    unread: true,
  },
  {
    id: 2,
    title: "Course Enrollment",
    desc: "New student enrolled in 'Reverse Engineering & Malware Analysis'.",
    time: "25 mins ago",
    type: "course",
    unread: true,
  },
  {
    id: 3,
    title: "System Integrity Check",
    desc: "Zero-Trust Shield verified 1,488 active security nodes. All normal.",
    time: "1 hour ago",
    type: "system",
    unread: true,
  },
  {
    id: 4,
    title: "Database Backup Completed",
    desc: "MongoDB Atlas automated snapshot synchronized successfully.",
    time: "Yesterday",
    type: "system",
    unread: false,
  },
];

const AdminTopbar = () => {
  const { user, logout } = useAuth?.() || {};
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (q.includes("user") || q.includes("student")) {
        navigate("/admin/users");
      } else if (q.includes("course")) {
        navigate("/admin/courses");
      } else if (q.includes("blog")) {
        navigate("/admin/blogs");
      } else if (q.includes("event")) {
        navigate("/admin/events");
      } else if (q.includes("setting")) {
        navigate("/admin/settings");
      } else if (q.includes("instructor")) {
        navigate("/admin/create-instructor");
      }
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate("/admin/login");
  };

  const getIcon = (type) => {
    switch (type) {
      case "security":
        return <FaShieldAlt style={{ color: "#ef4444" }} />;
      case "course":
        return <FaBookOpen style={{ color: "#38bdf8" }} />;
      case "user":
        return <FaUserGraduate style={{ color: "#10b981" }} />;
      default:
        return <FaCheckCircle style={{ color: "#818cf8" }} />;
    }
  };

  return (
    <header className="topbar" style={{ position: "relative", zIndex: 110 }}>
      {/* Search Bar */}
      <div className="topbar-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search users, courses, blogs (Press Enter)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Right Controls */}
      <div className="topbar-right">
        {/* ===== NOTIFICATION BUTTON & DROPDOWN ===== */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            className="notification"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            title="Notifications"
            style={{
              outline: "none",
              background: notifOpen
                ? "rgba(0, 132, 255, 0.18)"
                : "rgba(0, 132, 255, 0.06)",
              borderColor: notifOpen
                ? "#0084ff"
                : "rgba(0, 132, 255, 0.15)",
              color: notifOpen ? "#38bdf8" : "#8baac8",
            }}
          >
            <FaBell style={{ transform: notifOpen ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s" }} />
            {unreadCount > 0 && (
              <span className="badge" style={{ animation: "pulse 2s infinite" }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {notifOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 14px)",
                right: 0,
                width: 360,
                maxWidth: "90vw",
                background: "rgba(10, 16, 32, 0.96)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0, 132, 255, 0.25)",
                borderRadius: 16,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 132, 255, 0.1)",
                overflow: "hidden",
                zIndex: 1000,
                animation: "xvNotifFade 0.2s ease-out",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "16px 18px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(15, 23, 42, 0.6)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: "#f8fafc" }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        padding: "2px 8px",
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        borderRadius: 12,
                        fontSize: 11,
                        color: "#fca5a5",
                        fontWeight: 700,
                      }}
                    >
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#38bdf8",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 8px",
                      borderRadius: 6,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    <FaCheckDouble size={12} />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                    <FaCheckCircle style={{ fontSize: 28, color: "#10b981", marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: 13 }}>All caught up! No notifications.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      style={{
                        padding: "14px 18px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        background: n.unread
                          ? "rgba(0, 132, 255, 0.05)"
                          : "transparent",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        cursor: "pointer",
                        transition: "background 0.15s",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 132, 255, 0.1)")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = n.unread
                          ? "rgba(0, 132, 255, 0.05)"
                          : "transparent")
                      }
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "rgba(15, 23, 42, 0.8)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {getIcon(n.type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <h5
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: 700,
                              color: n.unread ? "#ffffff" : "#cbd5e1",
                            }}
                          >
                            {n.title}
                          </h5>
                          {n.unread && (
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#0084ff",
                                display: "inline-block",
                              }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            color: "#94a3b8",
                            lineHeight: 1.4,
                            marginBottom: 4,
                          }}
                        >
                          {n.desc}
                        </p>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{n.time}</span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          cursor: "pointer",
                          padding: 4,
                          borderRadius: 4,
                          opacity: 0.6,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ef4444";
                          e.currentTarget.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#64748b";
                          e.currentTarget.style.opacity = "0.6";
                        }}
                        title="Dismiss"
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div
                  style={{
                    padding: "10px 18px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    justifyContent: "center",
                    background: "rgba(10, 15, 30, 0.9)",
                  }}
                >
                  <button
                    onClick={clearAllNotifications}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      fontSize: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    <FaTrashAlt size={11} />
                    <span>Clear all alerts</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== ADMIN PROFILE DROPDOWN ===== */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <div
            className="profile"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            style={{
              padding: "4px 8px",
              borderRadius: 12,
              background: profileOpen ? "rgba(0, 132, 255, 0.12)" : "transparent",
              transition: "background 0.2s",
            }}
          >
            {user?.image ? (
              <img
                src={user.image}
                alt="Admin"
                style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "1.5px solid #0084ff" }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0084ff, #0052cc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 14,
                  border: "1.5px solid #0084ff",
                  boxShadow: "0 0 12px rgba(0, 132, 255, 0.35)",
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            )}

            <div>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>
                {user?.name || "Admin"}
              </h4>
              <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>
                ● Super Admin
              </span>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 14px)",
                right: 0,
                width: 210,
                background: "rgba(10, 16, 32, 0.96)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(0, 132, 255, 0.25)",
                borderRadius: 14,
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
                padding: "8px",
                zIndex: 1000,
                animation: "xvNotifFade 0.2s ease-out",
              }}
            >
              <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc" }}>
                  {user?.name || "Administrator"}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.email || "admin@xevion.com"}
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/admin/settings");
                }}
                style={menuBtnStyle}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 132, 255, 0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <FaCog style={{ color: "#38bdf8" }} />
                <span>Admin Settings</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  ...menuBtnStyle,
                  color: "#f87171",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <FaSignOutAlt style={{ color: "#ef4444" }} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes xvNotifFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

const menuBtnStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 12px",
  background: "transparent",
  border: "none",
  borderRadius: 8,
  color: "#cbd5e1",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.15s",
  textAlign: "left",
};

export default AdminTopbar;
