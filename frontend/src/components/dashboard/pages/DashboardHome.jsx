import { useEffect, useState } from "react";
import api from "../../../utils/api";
import "./DashboardHome.css";
import {
  FaUsers, FaUserTie, FaBook, FaBlog,
  FaArrowRight, FaServer, FaDatabase,
  FaCalendarAlt, FaCheckCircle, FaPlus,
} from "react-icons/fa";

/* Animated number counter */
function AnimCount({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 24;
    const step  = Math.ceil(value / steps);
    const timer = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

const DashboardHome = () => {
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.stats || {});
      setRecentUsers(res.data.recentUsers || []);
      setRecentCourses(res.data.recentCourses || []);
    } catch (err) { console.log(err); }
  };

  const cards = [
    { val: stats.totalUsers       || 0, label: "Total Users",   icon: <FaUsers />,   cls: "blue"   },
    { val: stats.totalInstructors || 0, label: "Instructors",   icon: <FaUserTie />, cls: "green"  },
    { val: stats.totalCourses     || 0, label: "Courses",       icon: <FaBook />,    cls: "orange" },
    { val: stats.totalBlogs       || 0, label: "Blogs",         icon: <FaBlog />,    cls: "purple" },
  ];

  return (
    <div className="dashboard-home">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back, Admin — Your Xevion platform at a glance</p>
        </div>
        <button className="create-btn"><FaPlus /> Create New</button>
      </div>

      {/* Cards */}
      <div className="dashboard-cards">
        {cards.map((c, i) => (
          <div key={i} className={`dashboard-card ${c.cls}`}>
            <div>
              <h2><AnimCount value={c.val} /></h2>
              <p>{c.label}</p>
            </div>
            <div className="icon">{c.icon}</div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="dashboard-grid">
        <div className="table-box">
          <div className="table-title">
            <h3>Recent Users</h3>
            <button>View All <FaArrowRight /></button>
          </div>
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th></tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge">{user.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <div className="table-title">
            <h3>Recent Courses</h3>
            <button>View All <FaArrowRight /></button>
          </div>
          <table>
            <thead>
              <tr><th>Course</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentCourses.map(course => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>
                    <span className={`status ${course.status?.toLowerCase()}`}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom */}
      <div className="bottom-grid">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          {["Add User","Add Instructor","Add Course","Add Blog","Add Event"].map(label => (
            <button key={label}>{label}</button>
          ))}
        </div>
        <div className="system-status">
          <h3>System Status</h3>
          {[
            { icon: <FaServer />,      label: "Server Running" },
            { icon: <FaDatabase />,    label: "Database Connected" },
            { icon: <FaCalendarAlt />, label: "API Healthy" },
          ].map(item => (
            <div key={item.label}>
              {item.icon}
              <span>{item.label}</span>
              <FaCheckCircle className="ok" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;