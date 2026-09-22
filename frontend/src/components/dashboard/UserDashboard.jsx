import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import UserProfile from "../layout/pages/UserProfile";
import {
  MdDashboard,
  MdMenuBook,
  MdPerson,
  MdLogout,
  MdCheckCircle,
  MdEmojiEvents,
  MdLocalFireDepartment,
  MdStar,
  MdPlayArrow,
  MdClose,
  MdSearch,
  MdArrowForward,
  MdCampaign,
  MdNotifications,
  MdVerifiedUser,
  MdShield,
} from "react-icons/md";

const UserDashboard = ({ initialTab = "overview" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.pathname === "/profile" ? "profile" : initialTab
  );

  useEffect(() => {
    if (location.pathname === "/profile") {
      setActiveTab("profile");
    } else if (location.pathname === "/dashboard") {
      setActiveTab("overview");
    }
  }, [location.pathname]);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    xp: 0,
    level: 1,
    nextLevelXp: 100,
    streak: { current: 0 },
    badges: [],
  });

  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [searchDrawer, setSearchDrawer] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const isAdmin = user.role === "admin" || user.email === "laibafatima0116@gmail.com" || user.email === "admin@xevion.com";
    if (isAdmin) {
      navigate("/admin");
      return;
    }
    if (user.role === "instructor") {
      navigate("/dashboard/instructor");
      return;
    }
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      try {
        const statsRes = await api.get("/users/stats");
        setStats(statsRes.data.data || {
          totalCourses: 0,
          completedCourses: 0,
          xp: 0,
          level: 1,
          nextLevelXp: 100,
          streak: { current: 0 },
          badges: [],
        });
      } catch (e) {
        console.log("Stats Error", e);
      }

      try {
        const enrollRes = await api.get("/enrollments/my");
        setMyCourses(enrollRes.data.enrollments || []);
      } catch (e) {
        console.log("Enrollment Error", e);
      }

      try {
        const courseRes = await api.get("/courses");
        setAllCourses(courseRes.data.courses || []);
      } catch (e) {
        console.log("Course Error", e);
      }

      try {
        const announceRes = await api.get("/users/announcements");
        setAnnouncements(announceRes.data.announcements || []);
      } catch (e) {
        setAnnouncements([]);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await Promise.allSettled([
        api.post(`/enrollments/${courseId}`),
        api.post('/users/courses/enroll', { courseId })
      ]);
      loadDashboard();
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment Failed");
    }
  };

  const continueLearning = (courseId) => {
    navigate(`/courses/${courseId}/learn`);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#050b14",
      }}>
        <div style={{
          width: 44,
          height: 56,
          border: "3px solid rgba(0, 132, 255,0.15)",
          borderTop: "3px solid #0084ff",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ marginTop: 16, color: "#4a6a8a", fontSize: 15, fontFamily: "Inter, sans-serif" }}>
          Loading Your Dashboard...
        </p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const filteredDrawerCourses = allCourses.filter(c =>
    c.title?.toLowerCase().includes(searchDrawer.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchDrawer.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050b14", color: "#e8f0fe", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .xv-user-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: rgba(8, 15, 30, 0.97);
          border-right: 1px solid rgba(0, 132, 255, 0.1);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(20px);
          box-shadow: 4px 0 30px rgba(0,0,0,0.5);
          overflow-y: auto;
        }
        .xv-user-sidebar-logo {
          padding: 22px 20px 18px;
          border-bottom: 1px solid rgba(0, 132, 255,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .xv-user-sidebar-logo img {
          height: 46px;
          border-radius: 6px;
          filter: drop-shadow(0 0 8px rgba(0, 132, 255,0.4));
        }
        .xv-user-sidebar-badge {
          font-size: 10px;
          font-weight: 700;
          color: #0084ff;
          background: rgba(0, 132, 255,0.1);
          border: 1px solid rgba(0, 132, 255,0.25);
          border-radius: 4px;
          padding: 2px 7px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }

        .xv-user-nav {
          flex: 1;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .xv-user-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          color: #8baac8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.22s ease;
          cursor: pointer;
          border: 1px solid transparent;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'Inter', sans-serif;
        }
        .xv-user-item svg { font-size: 18px; flex-shrink: 0; }
        .xv-user-item:hover {
          background: rgba(0, 132, 255,0.06);
          color: #e8f0fe;
          border-color: rgba(0, 132, 255,0.1);
          transform: translateX(3px);
        }
        .xv-user-item.active {
          background: rgba(0, 132, 255,0.12);
          color: #0084ff;
          border-color: rgba(0, 132, 255,0.2);
          box-shadow: 0 0 16px rgba(0, 132, 255,0.08);
        }

        .xv-user-main {
          flex: 1;
          margin-left: 260px;
          padding: 28px 36px;
        }

        .xv-user-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .xv-user-greeting {
          font-size: 26px;
          font-weight: 700;
          color: #e8f0fe;
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
        }
        .xv-user-subgreeting {
          font-size: 13px;
          color: #4a6a8a;
          margin: 4px 0 0;
        }

        /* 3D Stat Cards */
        .xv-user-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }
        .xv-user-statcard {
          padding: 22px 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }
        .xv-user-statcard:hover {
          transform: translateY(-4px) perspective(500px) rotateX(2deg);
          box-shadow: 0 12px 35px rgba(0,0,0,0.5);
        }
        .xv-user-statcard h2 {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
          font-family: 'Space Grotesk', sans-serif;
        }
        .xv-user-statcard p {
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          margin: 0;
          font-weight: 500;
        }
        .xv-user-statcard svg {
          font-size: 38px;
          color: #fff;
          opacity: 0.25;
          flex-shrink: 0;
        }

        /* Course List */
        .xv-user-coursegrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .xv-user-coursecard {
          background: rgba(13, 23, 38, 0.85);
          border: 1px solid rgba(0, 132, 255, 0.08);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .xv-user-coursecard:hover {
          border-color: rgba(0, 132, 255, 0.25);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0, 132, 255,0.06);
        }
        .xv-user-coursethumb {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
        }
        .xv-user-coursebody {
          padding: 18px 20px;
        }
        .xv-user-coursetitle {
          font-size: 16px;
          font-weight: 600;
          color: #e8f0fe;
          margin: 0 0 8px;
          font-family: 'Space Grotesk', sans-serif;
        }
        .xv-user-coursedesc {
          font-size: 13px;
          color: #4a6a8a;
          margin: 0 0 14px;
          line-height: 1.5;
        }

        /* Progress Bar */
        .xv-user-progressbar {
          height: 6px;
          background: rgba(0, 132, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .xv-user-progressfill {
          height: 100%;
          background: linear-gradient(90deg, #0084ff, #0084ff);
          border-radius: 10px;
          transition: width 0.4s ease;
        }

        .xv-user-continuebtn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 16px;
          background: linear-gradient(135deg, #0084ff, #0052cc);
          color: #050b14;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .xv-user-continuebtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(0, 132, 255, 0.4);
        }

        /* Level Card */
        .xv-user-levelcard {
          background: rgba(13, 23, 38, 0.85);
          border: 1px solid rgba(0, 132, 255, 0.1);
          border-radius: 16px;
          padding: 22px;
          margin-top: 24px;
        }

        @keyframes xvItemSlideIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes xvFadeOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes xvSlideFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }

        @media (max-width: 1100px) {
          .xv-user-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .xv-user-sidebar { display: none; }
          .xv-user-main { margin-left: 0; padding: 20px 16px; }
        }
      `}</style>

      {/* ── Sidebar ── */}
      <aside className="xv-user-sidebar">
        <div className="xv-user-sidebar-logo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "18px 16px" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/xevion-logo-cropped.png"
              alt="Xevion"
              style={{
                height: 40,
                borderRadius: 6,
                filter: "drop-shadow(0 0 10px rgba(0, 132, 255, 0.45))",
              }}
            />
          </Link>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 9px",
              background: "rgba(0, 132, 255, 0.12)",
              border: "1px solid rgba(0, 132, 255, 0.3)",
              borderRadius: 20,
              color: "#38bdf8",
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.08em",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
            <span>STUDENT</span>
          </div>
        </div>

        <nav className="xv-user-nav">
          <button
            type="button"
            onClick={() => {
              setActiveTab("overview");
              if (location.pathname === "/profile") navigate("/dashboard");
            }}
            className={`xv-user-item ${activeTab === "overview" ? "active" : ""}`}
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", font: "inherit", cursor: "pointer" }}
          >
            <MdDashboard />
            <span>Dashboard</span>
          </button>

          {/* Browse Courses Link -> Direct to /courses */}
          <Link
            to="/courses"
            className="xv-user-item"
          >
            <MdMenuBook />
            <span>Browse Courses</span>
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`xv-user-item ${activeTab === "profile" ? "active" : ""}`}
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", font: "inherit", cursor: "pointer" }}
          >
            <MdPerson />
            <span>My Profile</span>
          </button>
        </nav>

        <div style={{ padding: "14px 12px", borderTop: "1px solid rgba(0, 132, 255, 0.12)" }}>
          <div
            onClick={() => setActiveTab("profile")}
            title="Click to view and edit profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              background: activeTab === "profile" ? "rgba(0, 132, 255, 0.15)" : "rgba(10, 15, 32, 0.8)",
              border: activeTab === "profile" ? "1px solid #0084ff" : "1px solid rgba(0, 132, 255, 0.2)",
              boxShadow: activeTab === "profile" ? "0 0 16px rgba(0, 132, 255, 0.3)" : "none",
              borderRadius: 12,
              marginBottom: 10,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0084ff, #0052cc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 16,
              boxShadow: "0 0 12px rgba(0, 132, 255, 0.4)",
              flexShrink: 0,
              overflow: "hidden",
              border: "1.5px solid rgba(0, 132, 255, 0.5)"
            }}>
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: "#38bdf8", display: "flex", alignItems: "center", gap: 4, fontFamily: "JetBrains Mono, monospace" }}>
                <MdVerifiedUser style={{ fontSize: 12, color: "#10b981" }} />
                <span>Verified Student</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              color: "#4a6a8a",
              fontSize: 13,
              cursor: "pointer",
              border: "1px solid transparent",
              background: "none",
              width: "100%",
              textAlign: "left",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,68,68,0.08)";
              e.currentTarget.style.color = "#ff4444";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#4a6a8a";
            }}
          >
            <MdLogout style={{ fontSize: 16 }} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="xv-user-main">
        {activeTab === "profile" ? (
          <UserProfile
            embedded={true}
            onBackToDashboard={() => {
              setActiveTab("overview");
              if (location.pathname === "/profile") navigate("/dashboard");
            }}
          />
        ) : (
          <>
            {/* Topbar */}
            <div className="xv-user-topbar">
              <div>
                <h1 className="xv-user-greeting">Welcome Back, {user?.name}</h1>
                <p className="xv-user-subgreeting">Continue your learning path and build cyber expertise</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 16px",
                    background: "rgba(0, 132, 255, 0.1)",
                    border: "1px solid rgba(0, 132, 255, 0.3)",
                    color: "#38bdf8",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 132, 255, 0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0, 132, 255, 0.1)"}
                >
                  <MdPerson style={{ fontSize: 16 }} />
                  <span>My Profile</span>
                </button>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              color: "#f59e0b",
              padding: "7px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "JetBrains Mono, monospace",
            }}>
              <MdLocalFireDepartment style={{ fontSize: 18, color: "#f59e0b" }} />
              <span>{stats?.streak?.current || 0} Day Streak</span>
            </div>

            <Link
              to="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 18px",
                background: "linear-gradient(135deg, #0084ff, #0052cc)",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                boxShadow: "0 4px 18px rgba(0, 132, 255, 0.35)",
                transition: "all 0.2s",
              }}
            >
              <MdMenuBook style={{ fontSize: 16 }} />
              <span>Browse Courses</span>
            </Link>
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            background: "rgba(0, 132, 255, 0.05)",
            border: "1px solid rgba(0, 132, 255, 0.15)",
            borderRadius: 12,
            marginBottom: 24,
          }}>
            <MdCampaign style={{ fontSize: 24, color: "#0084ff", flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: "0 0 2px", fontSize: 14, color: "#e8f0fe" }}>{announcements[0]?.title}</h4>
              <p style={{ margin: 0, fontSize: 12, color: "#8baac8" }}>{announcements[0]?.content}</p>
            </div>
          </div>
        )}

        {/* Sleek Enterprise Cyber Stat Cards */}
        <div className="xv-user-stats">
          {/* Card 1: Enrolled Courses */}
          <div
            className="xv-user-statcard"
            style={{
              background: "linear-gradient(180deg, rgba(0, 132, 255, 0.12) 0%, rgba(10, 16, 36, 0.95) 100%)",
              border: "1px solid rgba(0, 132, 255, 0.32)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 132, 255, 0.12)",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>
                Active Training
              </div>
              <h2>{stats?.totalCourses || myCourses.length || 0}</h2>
              <p style={{ color: "#94a3b8" }}>Enrolled Courses</p>
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(0, 132, 255, 0.15)",
              border: "1px solid rgba(0, 132, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#38bdf8",
              fontSize: 24,
              boxShadow: "0 0 15px rgba(0, 132, 255, 0.3)",
            }}>
              <MdMenuBook />
            </div>
          </div>

          {/* Card 2: Completed */}
          <div
            className="xv-user-statcard"
            style={{
              background: "linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(10, 24, 20, 0.95) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.32)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.12)",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>
                Curriculum Mastery
              </div>
              <h2>{stats?.completedCourses || 0}</h2>
              <p style={{ color: "#94a3b8" }}>Completed Courses</p>
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10b981",
              fontSize: 24,
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
            }}>
              <MdCheckCircle />
            </div>
          </div>

          {/* Card 3: Badges */}
          <div
            className="xv-user-statcard"
            style={{
              background: "linear-gradient(180deg, rgba(245, 158, 11, 0.12) 0%, rgba(26, 18, 10, 0.95) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.32)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.12)",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>
                Achievements
              </div>
              <h2>{stats?.badges?.length || 0}</h2>
              <p style={{ color: "#94a3b8" }}>Badges Earned</p>
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f59e0b",
              fontSize: 24,
              boxShadow: "0 0 15px rgba(245, 158, 11, 0.3)",
            }}>
              <MdEmojiEvents />
            </div>
          </div>

          {/* Card 4: XP */}
          <div
            className="xv-user-statcard"
            style={{
              background: "linear-gradient(180deg, rgba(168, 85, 247, 0.12) 0%, rgba(22, 12, 38, 0.95) 100%)",
              border: "1px solid rgba(168, 85, 247, 0.32)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(168, 85, 247, 0.12)",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#a855f7", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>
                Combat Rating
              </div>
              <h2>{stats?.xp || 0}</h2>
              <p style={{ color: "#94a3b8" }}>Total XP Earned</p>
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(168, 85, 247, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a855f7",
              fontSize: 24,
              boxShadow: "0 0 15px rgba(168, 85, 247, 0.3)",
            }}>
              <MdStar />
            </div>
          </div>
        </div>

        {/* My Learning Courses */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "#e8f0fe", fontFamily: "Space Grotesk, sans-serif" }}>
              My Learning
            </h3>
            <Link
              to="/courses"
              style={{
                background: "none",
                border: "none",
                color: "#38bdf8",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>Explore More Courses</span>
              <MdArrowForward />
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "rgba(10, 15, 34, 0.85)",
              borderRadius: 18,
              border: "1px solid rgba(0, 132, 255, 0.18)",
              backdropFilter: "blur(16px)",
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(0, 132, 255, 0.1)",
                border: "1px solid rgba(0, 132, 255, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                color: "#0084ff",
                fontSize: 26,
              }}>
                <MdMenuBook />
              </div>
              <h3 style={{ margin: "0 0 6px", color: "#ffffff", fontSize: 18, fontFamily: "Space Grotesk, sans-serif" }}>
                No Enrolled Courses Yet
              </h3>
              <p style={{ margin: "0 0 18px", color: "#94a3b8", fontSize: 13 }}>
                Explore the Xevion courses catalogue to start building your cybersecurity skills.
              </p>
              <Link
                to="/courses"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  background: "linear-gradient(135deg, #0084ff, #0052cc)",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: "0 4px 18px rgba(0, 132, 255, 0.35)",
                }}
              >
                <span>Browse Courses</span>
                <MdArrowForward />
              </Link>
            </div>
          ) : (
            <div className="xv-user-coursegrid">
              {myCourses.map((item) => {
                const course = item?.course;
                if (!course) return null;
                return (
                  <div key={item._id} className="xv-user-coursecard">
                    <img
                      src={course?.thumbnail || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80"}
                      alt={course?.title || "Course"}
                      className="xv-user-coursethumb"
                    />
                    <div className="xv-user-coursebody">
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: 100,
                          background: "rgba(0, 132, 255, 0.12)",
                          color: "#0084ff",
                          fontFamily: "JetBrains Mono, monospace",
                          textTransform: "uppercase",
                        }}>
                          {course.category}
                        </span>
                        <span style={{ fontSize: 11, color: "#0084ff", fontWeight: 600 }}>
                          {item.progress || 0}% Done
                        </span>
                      </div>

                      <h4 className="xv-user-coursetitle">{course.title}</h4>
                      <p className="xv-user-coursedesc">{course.description?.slice(0, 80)}...</p>

                      <div className="xv-user-progressbar">
                        <div className="xv-user-progressfill" style={{ width: `${item.progress || 0}%` }} />
                      </div>

                      <button
                        className="xv-user-continuebtn"
                        onClick={() => continueLearning(course._id)}
                      >
                        <MdPlayArrow style={{ fontSize: 16 }} />
                        <span>Continue Learning</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Level and XP progress */}
        <div className="xv-user-levelcard">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0084ff", fontFamily: "JetBrains Mono, monospace" }}>
              LEVEL {stats?.level || 1}
            </span>
            <span style={{ fontSize: 13, color: "#8baac8" }}>
              {stats?.xp || 0} / {stats?.nextLevelXp || 100} XP
            </span>
          </div>

          <div style={{ height: 8, background: "rgba(0, 132, 255, 0.1)", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #0084ff, #64748b)",
              width: `${Math.min(((stats?.xp || 0) / (stats?.nextLevelXp || 100)) * 100, 100)}%`,
              borderRadius: 10,
              transition: "width 0.4s ease",
            }} />
          </div>

          <div style={{ fontSize: 12, color: "#4a6a8a" }}>
            {stats?.nextLevelXp ? `${Math.max(stats.nextLevelXp - (stats?.xp || 0), 0)} XP needed for Level ${(stats?.level || 1) + 1}` : "Maximum Level Reached"}
          </div>
        </div>
        </>
        )}
      </main>

      {/* ==========================================================
          LEFT SIDE COURSES DRAWER IN USER DASHBOARD
          Courses open one by one smoothly on the left!
          ========================================================== */}
      {showAllCourses && (
        <div
          onClick={() => setShowAllCourses(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(8px)",
            animation: "xvFadeOverlay 0.3s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "min(420px, 92vw)",
              height: "100vh",
              background: "rgba(6, 12, 22, 0.98)",
              borderRight: "1px solid rgba(0, 132, 255, 0.22)",
              boxShadow: "8px 0 45px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 132, 255, 0.12)",
              display: "flex",
              flexDirection: "column",
              zIndex: 2001,
              animation: "xvSlideFromLeft 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: "22px 20px 16px",
              borderBottom: "1px solid rgba(0, 132, 255, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(0, 132, 255, 0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src="/xevion-logo-cropped.png" alt="Xevion" style={{ height: 34, borderRadius: 6 }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e8f0fe", fontFamily: "Space Grotesk, sans-serif" }}>
                    Browse Courses
                  </h3>
                  <span style={{ fontSize: 11, color: "#0084ff", fontFamily: "JetBrains Mono, monospace" }}>
                    {filteredDrawerCourses.length} AVAILABLE
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowAllCourses(false)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#8baac8",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                <MdClose />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: "14px 20px 10px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(0, 132, 255, 0.04)",
                border: "1px solid rgba(0, 132, 255, 0.15)",
                borderRadius: 10,
                padding: "9px 12px",
              }}>
                <MdSearch style={{ color: "#0084ff", fontSize: 18 }} />
                <input
                  type="text"
                  placeholder="Filter courses smoothly..."
                  value={searchDrawer}
                  onChange={e => setSearchDrawer(e.target.value)}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "#e8f0fe",
                    fontSize: 13,
                    width: "100%",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Courses: Animated ONE BY ONE smoothly */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "8px 20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              {filteredDrawerCourses.map((course, idx) => {
                const enrolled = myCourses.some(item => item.course?._id === course._id);
                return (
                  <div
                    key={course._id || idx}
                    style={{
                      background: "rgba(13, 23, 38, 0.85)",
                      border: "1px solid rgba(0, 132, 255, 0.1)",
                      borderRadius: 12,
                      padding: 12,
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      animation: `xvItemSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                      animationDelay: `${idx * 80}ms`,
                      opacity: 0,
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "perspective(600px) rotateY(-3deg) translateX(6px)";
                      e.currentTarget.style.borderColor = "rgba(0, 132, 255, 0.4)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 132, 255, 0.15)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "perspective(600px) rotateY(0) translateX(0)";
                      e.currentTarget.style.borderColor = "rgba(0, 132, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <img
                      src={course.thumbnail || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80"}
                      alt={course.title}
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid rgba(0, 132, 255, 0.2)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: 100,
                          background: "rgba(0, 132, 255, 0.12)",
                          color: "#0084ff",
                          fontFamily: "JetBrains Mono, monospace",
                        }}>
                          {course.category}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: course.price === 0 ? "#0084ff" : "#ffc107",
                          fontFamily: "JetBrains Mono, monospace",
                        }}>
                          {course.price === 0 ? "FREE" : `$${course.price}`}
                        </span>
                      </div>

                      <h4 style={{
                        margin: "0 0 6px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#e8f0fe",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {course.title}
                      </h4>

                      {enrolled ? (
                        <button
                          onClick={() => {
                            setShowAllCourses(false);
                            continueLearning(course._id);
                          }}
                          style={{
                            padding: "4px 10px",
                            background: "rgba(0, 132, 255, 0.12)",
                            color: "#0084ff",
                            border: "1px solid rgba(0, 132, 255, 0.25)",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Continue Learning →
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          style={{
                            padding: "4px 10px",
                            background: "linear-gradient(135deg, #0084ff, #0052cc)",
                            color: "#050b14",
                            border: "none",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;