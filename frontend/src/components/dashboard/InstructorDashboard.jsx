import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import {
  MdDashboard,
  MdMenuBook,
  MdPerson,
  MdLogout,
  MdAdd,
  MdEdit,
  MdDelete,
  MdViewModule,
  MdPlayLesson,
  MdExpandMore,
  MdAddCircle,
  MdAutoStories,
  MdClose,
  MdSchool,
  MdPeople,
  MdCheckCircle,
  MdHourglassTop,
} from "react-icons/md";

/* ─── Animated number hook ─── */
function useCountAnim(value) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    const from = prevRef.current;
    const to   = value;
    const steps = 20;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplay(Math.round(from + ((to - from) * step) / steps));
      if (step >= steps) {
        clearInterval(timer);
        setDisplay(to);
      }
    }, 20);
    prevRef.current = value;
    return () => clearInterval(timer);
  }, [value]);

  return display;
}

/* ─── Stat Card ─── */
const StatCard = ({ icon, value, label, color, glow }) => {
  const animated = useCountAnim(value);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
        borderRadius: 16,
        padding: "24px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: hovered
          ? `0 12px 40px ${glow}55, 0 0 0 1px ${glow}44`
          : `0 6px 20px ${glow}30`,
        transform: hovered
          ? "translateY(-5px) perspective(500px) rotateX(3deg)"
          : "translateY(0) perspective(500px) rotateX(0deg)",
        transition: "all 0.32s cubic-bezier(0.4,0,0.2,1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* shimmer */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.06), transparent)",
        pointerEvents: "none",
      }} />
      <div>
        <div style={{
          fontSize: 38, fontWeight: 700, color: "#fff",
          lineHeight: 1, marginBottom: 6,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>{animated}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{label}</div>
      </div>
      <div style={{ fontSize: 38, opacity: 0.22, color: "#fff" }}>{icon}</div>
    </div>
  );
};

/* ─── Main Component ─── */
const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal,   setShowEditModal]   = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourse,  setSelectedCourse]  = useState(null);

  const [courseForm, setCourseForm] = useState({
    title: "", description: "", category: "Programming",
    level: "Beginner", price: 0, duration: "0 Hours", thumbnail: "",
  });
  const [moduleForm, setModuleForm] = useState({ title: "" });
  const [lessonForm, setLessonForm] = useState({ title: "", description: "", duration: 10 });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "instructor" && user.role !== "admin") { navigate("/dashboard"); return; }
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/my-courses");
      if (res.data.success) setCourses(res.data.courses);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/courses/create", courseForm);
      if (res.data.success) {
        setShowCreateModal(false);
        const createdCourse = res.data.course || {
          _id: res.data._id || Date.now().toString(),
          ...courseForm,
          status: "Published",
          students: [],
        };
        // Instantly increment state so count dynamically moves from 0 to 1 with animation
        setCourses(prev => [createdCourse, ...prev]);
        setCourseForm({ title:"", description:"", category:"Programming", level:"Beginner", price:0, duration:"0 Hours", thumbnail:"" });
        fetchCourses();
      }
    } catch (err) { alert(err.response?.data?.message || "Failed to create course"); }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setCourseForm({ title: course.title, description: course.description, category: course.category, level: course.level, price: course.price, duration: course.duration, thumbnail: course.thumbnail || "" });
    setShowEditModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/courses/${selectedCourse._id}`, courseForm);
      if (res.data.success) { setShowEditModal(false); fetchCourses(); }
    } catch (err) { alert(err.response?.data?.message || "Update Failed"); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.data.success) fetchCourses();
    } catch (err) { alert(err.response?.data?.message || "Delete Failed"); }
  };

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:"#050b14" }}>
      <div style={{ width:44, height:44, border:"3px solid rgba(0, 132, 255,0.15)", borderTop:"3px solid #0084ff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <p style={{ marginTop:16, color:"#4a6a8a", fontSize:15, fontFamily:"Inter,sans-serif" }}>Loading Dashboard…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const totalStudents = courses.reduce((a, c) => a + (c.students?.length || 0), 0);
  const published     = courses.filter(c => c.status === "Published").length;
  const pending       = courses.filter(c => c.status === "Pending").length;

  return (
    <div style={{ display:"flex", background:"#050b14", minHeight:"100vh" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Sidebar ── */
        .xv-instr-sidebar {
          width: 260px; flex-shrink: 0;
          background: rgba(8,15,30,0.97);
          border-right: 1px solid rgba(0, 132, 255,0.1);
          display: flex; flex-direction: column;
          height: 100vh; position: fixed; left:0; top:0; z-index:100;
          backdrop-filter: blur(20px);
          box-shadow: 4px 0 30px rgba(0,0,0,0.5);
          overflow-y: auto; overflow-x: hidden;
        }
        .xv-instr-sidebar::-webkit-scrollbar { width:3px; }
        .xv-instr-sidebar::-webkit-scrollbar-thumb { background:rgba(0, 132, 255,0.2); border-radius:3px; }

        .xv-instr-logo {
          padding: 22px 20px 18px;
          border-bottom: 1px solid rgba(0, 132, 255,0.08);
          display: flex; align-items: center; gap: 10px;
        }
        .xv-instr-logo img {
          height:46px; width:auto; border-radius:6px;
          filter: drop-shadow(0 0 8px rgba(0, 132, 255,0.4));
        }
        .xv-instr-badge {
          font-size:10px; font-weight:700; color:#0084ff;
          background:rgba(0, 132, 255,0.1); border:1px solid rgba(0, 132, 255,0.25);
          border-radius:4px; padding:2px 7px;
          letter-spacing:0.1em; text-transform:uppercase;
          font-family:'JetBrains Mono',monospace; white-space:nowrap;
        }

        .xv-instr-nav {
          flex:1; padding:14px 12px;
          display:flex; flex-direction:column; gap:3px;
        }

        .xv-instr-item {
          display:flex; align-items:center; gap:12px;
          padding:11px 14px; border-radius:10px;
          color:#8baac8; text-decoration:none;
          font-size:14px; font-weight:500;
          font-family:'Inter',sans-serif;
          transition:all 0.22s ease;
          cursor:pointer; border:1px solid transparent;
          background:none; width:100%; text-align:left;
        }
        .xv-instr-item svg { font-size:18px; flex-shrink:0; }
        .xv-instr-item:hover {
          background:rgba(0, 132, 255,0.06); color:#e8f0fe;
          border-color:rgba(0, 132, 255,0.1); transform:translateX(3px);
        }
        .xv-instr-item.active-item {
          background:rgba(0, 132, 255,0.12); color:#0084ff;
          border-color:rgba(0, 132, 255,0.2);
          box-shadow:0 0 16px rgba(0, 132, 255,0.08);
        }
        .xv-instr-item.active-item svg {
          color:#0084ff; filter:drop-shadow(0 0 5px rgba(0, 132, 255,0.5));
        }

        /* Courses accordion */
        .xv-courses-toggle {
          display:flex; align-items:center; gap:12px;
          padding:11px 14px; border-radius:10px;
          color:#8baac8; font-size:14px; font-weight:500;
          font-family:'Inter',sans-serif;
          transition:all 0.22s ease;
          cursor:pointer; border:1px solid transparent;
          background:none; width:100%; text-align:left;
        }
        .xv-courses-toggle:hover {
          background:rgba(0, 132, 255,0.06); color:#e8f0fe;
          border-color:rgba(0, 132, 255,0.1);
        }
        .xv-courses-toggle.open {
          background:rgba(0, 132, 255,0.08); color:#0084ff;
          border-color:rgba(0, 132, 255,0.15);
        }
        .xv-courses-toggle .caret {
          margin-left:auto; font-size:20px;
          transition:transform 0.32s ease;
        }
        .xv-courses-toggle.open .caret { transform:rotate(180deg); color:#0084ff; }

        .xv-submenu {
          overflow:hidden; max-height:0;
          transition:max-height 0.42s cubic-bezier(0.4,0,0.2,1);
        }
        .xv-submenu.open { max-height:220px; }
        .xv-submenu-inner {
          padding:4px 0 4px 14px; margin-left:26px; margin-top:2px;
          border-left:2px solid rgba(0, 132, 255,0.15);
          display:flex; flex-direction:column; gap:2px;
        }
        .xv-sub-link {
          display:flex; align-items:center; gap:10px;
          padding:9px 12px; border-radius:8px;
          color:#4a6a8a; text-decoration:none;
          font-size:13px; font-weight:500;
          font-family:'Inter',sans-serif;
          transition:all 0.2s ease;
          opacity:0; transform:translateX(-12px);
        }
        .xv-sub-link.reveal { animation:subIn 0.3s ease forwards; }
        .xv-sub-link:nth-child(1) { animation-delay:0ms; }
        .xv-sub-link:nth-child(2) { animation-delay:70ms; }
        .xv-sub-link:nth-child(3) { animation-delay:140ms; }
        @keyframes subIn {
          from { opacity:0; transform:translateX(-12px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .xv-sub-link:hover { background:rgba(0, 132, 255,0.07); color:#e8f0fe; }
        .xv-sub-link svg { font-size:15px; flex-shrink:0; }

        .xv-sidebar-footer {
          padding:12px; border-top:1px solid rgba(0, 132, 255,0.08);
        }
        .xv-user-card {
          display:flex; align-items:center; gap:10px;
          padding:10px 12px; border-radius:10px;
          background:rgba(0, 132, 255,0.04);
          border:1px solid rgba(0, 132, 255,0.08);
          margin-bottom:8px;
        }
        .xv-avatar {
          width:36px; height:36px; border-radius:50%;
          background:linear-gradient(135deg,#0084ff,#64748b);
          display:flex; align-items:center; justify-content:center;
          color:#050b14; font-weight:700; font-size:16px;
          flex-shrink:0;
          box-shadow:0 0 12px rgba(0, 132, 255,0.3);
        }
        .xv-user-name { font-size:13px; font-weight:600; color:#e8f0fe; }
        .xv-user-role { font-size:11px; color:#4a6a8a; }
        .xv-logout-btn {
          display:flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:10px;
          color:#4a6a8a; font-size:13px; font-weight:500;
          cursor:pointer; border:1px solid transparent;
          background:none; width:100%; text-align:left;
          transition:all 0.2s; font-family:'Inter',sans-serif;
        }
        .xv-logout-btn:hover {
          background:rgba(255,68,68,0.08); color:#ff4444;
          border-color:rgba(255,68,68,0.15);
        }
        .xv-logout-btn svg { font-size:17px; }

        /* ── Main ── */
        .xv-main { flex:1; margin-left:260px; padding:28px 34px; }

        .xv-topbar {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:28px; flex-wrap:wrap; gap:16px;
        }
        .xv-greeting { font-size:26px; font-weight:700; color:#e8f0fe; margin:0; font-family:'Space Grotesk',sans-serif; }
        .xv-sub-greeting { font-size:13px; color:#4a6a8a; margin:5px 0 0; }

        .xv-create-btn {
          display:flex; align-items:center; gap:8px;
          padding:10px 20px; border-radius:10px;
          background:linear-gradient(135deg,#0084ff,#0052cc);
          border:none; color:#050b14; font-size:14px; font-weight:700;
          cursor:pointer; font-family:'Inter',sans-serif;
          box-shadow:0 0 20px rgba(0, 132, 255,0.25); transition:all 0.25s;
        }
        .xv-create-btn:hover { transform:translateY(-2px); box-shadow:0 0 32px rgba(0, 132, 255,0.45); }
        .xv-create-btn svg { font-size:18px; }

        .xv-stats-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-bottom:28px;
        }

        /* Courses section */
        .xv-courses-section h3 {
          font-size:18px; font-weight:600; color:#e8f0fe;
          margin:0; font-family:'Space Grotesk',sans-serif;
        }
        .xv-count-badge {
          font-size:12px; color:#4a6a8a;
          background:rgba(0, 132, 255,0.06);
          border:1px solid rgba(0, 132, 255,0.1);
          border-radius:20px; padding:3px 12px;
          font-family:'JetBrains Mono',monospace;
        }
        .xv-section-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }

        .xv-course-grid {
          display:grid; grid-template-columns:repeat(auto-fill, minmax(360px,1fr)); gap:20px;
        }

        .xv-course-card {
          background:rgba(13,23,38,0.9); border:1px solid rgba(0, 132, 255,0.08);
          border-radius:16px; overflow:hidden;
          transition:all 0.32s ease; cursor:default;
        }
        .xv-course-card:hover {
          border-color:rgba(0, 132, 255,0.22);
          transform:translateY(-5px);
          box-shadow:0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0, 132, 255,0.05);
        }
        .xv-course-thumb { width:100%; height:190px; object-fit:cover; display:block; }
        .xv-course-body { padding:18px 20px; }
        .xv-course-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:10px; }
        .xv-course-title { font-size:16px; font-weight:600; color:#e8f0fe; margin:0; flex:1; font-family:'Space Grotesk',sans-serif; }
        .xv-status-badge { padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; white-space:nowrap; font-family:'JetBrains Mono',monospace; text-transform:uppercase; }
        .xv-status-published { background:rgba(0, 132, 255,0.1); color:#0084ff; border:1px solid rgba(0, 132, 255,0.2); }
        .xv-status-pending   { background:rgba(255,140,0,0.12); color:#ff8c00; border:1px solid rgba(255,140,0,0.25); }

        .xv-course-desc { font-size:13px; color:#4a6a8a; line-height:1.6; margin-bottom:14px; }

        .xv-course-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
        .xv-tag {
          padding:3px 10px; border-radius:100px; font-size:11px; color:#8baac8;
          background:rgba(0, 132, 255,0.05); border:1px solid rgba(0, 132, 255,0.1);
        }

        .xv-course-actions { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; }
        .xv-act-btn {
          display:flex; align-items:center; justify-content:center; gap:5px;
          padding:8px 4px; border-radius:8px; border:none;
          cursor:pointer; font-size:12px; font-weight:600;
          font-family:'Inter',sans-serif; transition:all 0.2s;
        }
        .xv-act-btn svg { font-size:15px; }
        .xv-act-edit   { background:rgba(79,70,229,0.15); color:#818cf8; border:1px solid rgba(79,70,229,0.2); }
        .xv-act-edit:hover   { background:rgba(79,70,229,0.3); color:#a5b4fc; }
        .xv-act-delete { background:rgba(255,68,68,0.1); color:#f87171; border:1px solid rgba(255,68,68,0.2); }
        .xv-act-delete:hover { background:rgba(255,68,68,0.22); }
        .xv-act-module { background:rgba(100, 116, 139,0.12); color:#c4b5fd; border:1px solid rgba(100, 116, 139,0.2); }
        .xv-act-module:hover { background:rgba(100, 116, 139,0.26); }
        .xv-act-lesson { background:rgba(0, 132, 255,0.08); color:#6ee7b7; border:1px solid rgba(0, 132, 255,0.15); }
        .xv-act-lesson:hover { background:rgba(0, 132, 255,0.18); }

        /* Empty */
        .xv-empty {
          text-align:center; padding:60px 20px;
          background:rgba(13,23,38,0.8); border-radius:16px;
          border:1px solid rgba(0, 132, 255,0.08);
        }
        .xv-empty-icon { font-size:52px; margin-bottom:14px; opacity:0.4; }
        .xv-empty h3 { font-size:22px; font-weight:600; color:#e8f0fe; margin:0 0 8px; }
        .xv-empty p  { font-size:14px; color:#4a6a8a; margin:0 0 20px; }

        /* Modal */
        .xv-modal-overlay {
          position:fixed; inset:0; z-index:1000;
          background:rgba(0,0,0,0.7);
          backdrop-filter:blur(8px);
          display:flex; align-items:center; justify-content:center;
          animation:fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .xv-modal {
          background:rgba(13,23,38,0.98); border:1px solid rgba(0, 132, 255,0.15);
          border-radius:20px; width:90%; max-width:580px; max-height:90vh;
          overflow:auto; box-shadow:0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(0, 132, 255,0.06);
          animation:slideUp 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .xv-modal-head {
          padding:20px 26px; border-bottom:1px solid rgba(0, 132, 255,0.08);
          display:flex; align-items:center; justify-content:space-between;
        }
        .xv-modal-head h2 { font-size:20px; font-weight:700; color:#e8f0fe; margin:0; font-family:'Space Grotesk',sans-serif; }
        .xv-modal-close {
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
          color:#8baac8; border-radius:8px; width:32px; height:32px;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; font-size:18px; transition:all 0.2s;
        }
        .xv-modal-close:hover { background:rgba(255,68,68,0.1); color:#ff4444; border-color:rgba(255,68,68,0.2); }
        .xv-modal-body { padding:26px; }
        .xv-modal-body input,
        .xv-modal-body textarea,
        .xv-modal-body select {
          width:100%; padding:11px 14px; margin-bottom:14px;
          background:rgba(0, 132, 255,0.04); border:1px solid rgba(0, 132, 255,0.12);
          border-radius:10px; color:#e8f0fe; font-size:14px;
          font-family:'Inter',sans-serif; outline:none;
          transition:border-color 0.2s; box-sizing:border-box;
        }
        .xv-modal-body input:focus,
        .xv-modal-body textarea:focus,
        .xv-modal-body select:focus {
          border-color:rgba(0, 132, 255,0.4);
          box-shadow:0 0 0 3px rgba(0, 132, 255,0.08);
        }
        .xv-modal-body select option { background:#0d1726; color:#e8f0fe; }
        .xv-modal-body textarea { min-height:110px; resize:vertical; }
        .xv-modal-body input::placeholder,
        .xv-modal-body textarea::placeholder { color:#4a6a8a; }
        .xv-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:6px; }
        .xv-btn-cancel {
          padding:10px 20px; border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.04); color:#8baac8;
          border-radius:10px; cursor:pointer; font-size:14px;
          font-family:'Inter',sans-serif; transition:all 0.2s;
        }
        .xv-btn-cancel:hover { background:rgba(255,255,255,0.08); }
        .xv-btn-submit {
          padding:10px 24px; border:none;
          background:linear-gradient(135deg,#0084ff,#0052cc);
          color:#050b14; border-radius:10px; cursor:pointer;
          font-size:14px; font-weight:700; font-family:'Inter',sans-serif;
          box-shadow:0 0 16px rgba(0, 132, 255,0.25); transition:all 0.2s;
        }
        .xv-btn-submit:hover { transform:translateY(-1px); box-shadow:0 0 26px rgba(0, 132, 255,0.45); }
        .xv-btn-purple {
          background:linear-gradient(135deg,#64748b,#6d28d9);
          box-shadow:0 0 16px rgba(100, 116, 139,0.25);
        }
        .xv-btn-green {
          background:linear-gradient(135deg,#0052cc,#047857);
          box-shadow:0 0 16px rgba(5,150,105,0.25);
        }
      `}</style>

      {/* ──────────── SIDEBAR ──────────── */}
      <aside className="xv-instr-sidebar">
        {/* Logo */}
        <div className="xv-instr-logo">
          <img src="/xevion-logo-cropped.png" alt="Xevion" />
          <span className="xv-instr-badge">Instructor</span>
        </div>

        {/* Nav */}
        <nav className="xv-instr-nav">
          {/* Dashboard */}
          <Link to="/dashboard/instructor" className="xv-instr-item active-item">
            <MdDashboard /> Dashboard
          </Link>

          {/* Courses accordion */}
          <button
            className={`xv-courses-toggle ${coursesMenuOpen ? "open" : ""}`}
            onClick={() => setCoursesMenuOpen(v => !v)}
          >
            <MdMenuBook />
            <span>Courses</span>
            <MdExpandMore className="caret" />
          </button>

          <div className={`xv-submenu ${coursesMenuOpen ? "open" : ""}`}>
            <div className="xv-submenu-inner">
              {[
                { label: "My Courses", to: "/instructor/courses", icon: <MdAutoStories /> },
                { label: "Create Course", to: "/instructor/create-course", icon: <MdAddCircle /> },
                { label: "Modules", to: `/instructor/modules/${selectedCourse?._id || ""}`, icon: <MdViewModule /> },
              ].map((sub, i) => (
                <Link
                  key={sub.to}
                  to={sub.to}
                  className={`xv-sub-link ${coursesMenuOpen ? "reveal" : ""}`}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {sub.icon} {sub.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile */}
          <Link to="/profile" className="xv-instr-item">
            <MdPerson /> Profile
          </Link>
        </nav>

        {/* Footer */}
        <div className="xv-sidebar-footer">
          <div className="xv-user-card">
            <div className="xv-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="xv-user-name">{user?.name}</div>
              <div className="xv-user-role">Instructor</div>
            </div>
          </div>
          <button className="xv-logout-btn" onClick={logout}>
            <MdLogout /> Logout
          </button>
        </div>
      </aside>

      {/* ──────────── MAIN ──────────── */}
      <main className="xv-main">
        {/* Top bar */}
        <div className="xv-topbar">
          <div>
            <h1 className="xv-greeting">Hi, {user?.name} 👋</h1>
            <p className="xv-sub-greeting">Create and manage your courses</p>
          </div>
          <button className="xv-create-btn" onClick={() => setShowCreateModal(true)}>
            <MdAdd /> Create Course
          </button>
        </div>

        {/* Stats */}
        <div className="xv-stats-grid">
          <StatCard icon={<MdMenuBook />}    value={courses.length} label="Total Courses"  color={["#1d4ed8","#2563eb"]} glow="rgba(37,99,235,0.6)" />
          <StatCard icon={<MdCheckCircle />} value={published}      label="Published"      color={["#15803d","#16a34a"]} glow="rgba(22,163,74,0.6)" />
          <StatCard icon={<MdHourglassTop />} value={pending}       label="Pending"        color={["#c2410c","#ea580c"]} glow="rgba(234,88,12,0.6)" />
          <StatCard icon={<MdPeople />}      value={totalStudents}  label="Total Students" color={["#6d28d9","#64748b"]} glow="rgba(100, 116, 139,0.6)" />
        </div>

        {/* Courses */}
        <div className="xv-courses-section">
          <div className="xv-section-head">
            <h3>My Courses</h3>
            <span className="xv-count-badge">{courses.length} courses</span>
          </div>

          {courses.length === 0 ? (
            <div className="xv-empty">
              <div className="xv-empty-icon"><MdSchool /></div>
              <h3>No Courses Yet</h3>
              <p>Start creating your first course today!</p>
              <button className="xv-create-btn" onClick={() => setShowCreateModal(true)}>
                <MdAdd /> Create Course
              </button>
            </div>
          ) : (
            <div className="xv-course-grid">
              {courses.map(course => (
                <div key={course._id} className="xv-course-card">
                  <img
                    src={course.thumbnail || "https://placehold.co/600x300/050b14/00d4ff?text=Course"}
                    alt={course.title}
                    className="xv-course-thumb"
                  />
                  <div className="xv-course-body">
                    <div className="xv-course-head">
                      <h4 className="xv-course-title">{course.title}</h4>
                      <span className={`xv-status-badge ${course.status === "Published" ? "xv-status-published" : "xv-status-pending"}`}>
                        {course.status}
                      </span>
                    </div>
                    <p className="xv-course-desc">{course.description?.substring(0, 85)}…</p>
                    <div className="xv-course-tags">
                      <span className="xv-tag">{course.category}</span>
                      <span className="xv-tag">{course.level}</span>
                      <span className="xv-tag">Rs {course.price}</span>
                      <span className="xv-tag">{course.duration}</span>
                    </div>
                    <div className="xv-course-actions">
                      <button className="xv-act-btn xv-act-edit"   onClick={() => openEditModal(course)}>
                        <MdEdit /> Edit
                      </button>
                      <button className="xv-act-btn xv-act-delete" onClick={() => handleDeleteCourse(course._id)}>
                        <MdDelete /> Del
                      </button>
                      <button className="xv-act-btn xv-act-module" onClick={() => { setSelectedCourse(course); setShowModuleModal(true); }}>
                        <MdViewModule /> Mod
                      </button>
                      <button className="xv-act-btn xv-act-lesson" onClick={() => { setSelectedCourse(course); setShowLessonModal(true); }}>
                        <MdPlayLesson /> Les
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ──────────── MODALS ──────────── */}

      {/* Create */}
      {showCreateModal && (
        <div className="xv-modal-overlay" onClick={e => e.target === e.currentTarget && setShowCreateModal(false)}>
          <div className="xv-modal">
            <div className="xv-modal-head">
              <h2>Create New Course</h2>
              <button className="xv-modal-close" onClick={() => setShowCreateModal(false)}><MdClose /></button>
            </div>
            <div className="xv-modal-body">
              <form onSubmit={handleCreateCourse}>
                <input placeholder="Course Title" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required />
                <textarea placeholder="Course Description" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} required />
                <select value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})}>
                  {["Programming","Cyber Security","Networking","Web Development","AI","Data Science","Cloud Computing"].map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value})}>
                  {["Beginner","Intermediate","Advanced"].map(l => <option key={l}>{l}</option>)}
                </select>
                <input type="number" placeholder="Price" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} />
                <input placeholder="Duration (e.g. 12 Hours)" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} />
                <input placeholder="Thumbnail URL" value={courseForm.thumbnail} onChange={e => setCourseForm({...courseForm, thumbnail: e.target.value})} />
                <div className="xv-modal-actions">
                  <button type="button" className="xv-btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="xv-btn-submit">Create Course</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit */}
      {showEditModal && (
        <div className="xv-modal-overlay" onClick={e => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="xv-modal">
            <div className="xv-modal-head">
              <h2>Edit Course</h2>
              <button className="xv-modal-close" onClick={() => setShowEditModal(false)}><MdClose /></button>
            </div>
            <div className="xv-modal-body">
              <form onSubmit={handleUpdateCourse}>
                <input placeholder="Course Title" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required />
                <textarea placeholder="Description" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} required />
                <select value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})}>
                  {["Programming","Cyber Security","Networking","Web Development","AI","Data Science","Cloud Computing"].map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value})}>
                  {["Beginner","Intermediate","Advanced"].map(l => <option key={l}>{l}</option>)}
                </select>
                <input type="number" placeholder="Price" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} />
                <input placeholder="Duration" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} />
                <input placeholder="Thumbnail URL" value={courseForm.thumbnail} onChange={e => setCourseForm({...courseForm, thumbnail: e.target.value})} />
                <div className="xv-modal-actions">
                  <button type="button" className="xv-btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="xv-btn-submit">Update Course</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Module */}
      {showModuleModal && (
        <div className="xv-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModuleModal(false)}>
          <div className="xv-modal" style={{ maxWidth: 480 }}>
            <div className="xv-modal-head">
              <h2>Add Module</h2>
              <button className="xv-modal-close" onClick={() => setShowModuleModal(false)}><MdClose /></button>
            </div>
            <div className="xv-modal-body">
              <form onSubmit={e => { e.preventDefault(); setModuleForm({title:""}); setShowModuleModal(false); }}>
                <input placeholder="Module Title" value={moduleForm.title} onChange={e => setModuleForm({title: e.target.value})} required />
                <div className="xv-modal-actions">
                  <button type="button" className="xv-btn-cancel" onClick={() => setShowModuleModal(false)}>Cancel</button>
                  <button type="submit" className="xv-btn-submit xv-btn-purple">Save Module</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lesson */}
      {showLessonModal && (
        <div className="xv-modal-overlay" onClick={e => e.target === e.currentTarget && setShowLessonModal(false)}>
          <div className="xv-modal" style={{ maxWidth: 540 }}>
            <div className="xv-modal-head">
              <h2>Add Lesson</h2>
              <button className="xv-modal-close" onClick={() => setShowLessonModal(false)}><MdClose /></button>
            </div>
            <div className="xv-modal-body">
              <form onSubmit={e => { e.preventDefault(); setLessonForm({title:"",description:"",duration:10}); setShowLessonModal(false); }}>
                <input placeholder="Lesson Title" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} required />
                <textarea placeholder="Lesson Description" value={lessonForm.description} onChange={e => setLessonForm({...lessonForm, description: e.target.value})} required />
                <input type="number" placeholder="Duration (Minutes)" value={lessonForm.duration} onChange={e => setLessonForm({...lessonForm, duration: e.target.value})} />
                <div className="xv-modal-actions">
                  <button type="button" className="xv-btn-cancel" onClick={() => setShowLessonModal(false)}>Cancel</button>
                  <button type="submit" className="xv-btn-submit xv-btn-green">Save Lesson</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;