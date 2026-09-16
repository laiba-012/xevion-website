import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdMenuBook,
  MdViewModule,
  MdArticle,
  MdEvent,
  MdHandshake,
  MdSettings,
  MdLogout,
  MdAddCircle,
  MdEditNote,
  MdExpandMore,
  MdChevronRight,
  MdAutoStories,
} from "react-icons/md";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard/admin",
    icon: <MdDashboard />,
    end: true,
  },
  {
    title: "Users",
    path: "/dashboard/admin/users",
    icon: <MdPeople />,
  },
  {
    title: "Instructors",
    path: "/dashboard/admin/create-instructor",
    icon: <MdSchool />,
  },
  {
    title: "Courses",
    path: null,
    icon: <MdMenuBook />,
    children: [
      { title: "All Courses", path: "/dashboard/admin/courses", icon: <MdAutoStories /> },
      { title: "Create Course", path: "/dashboard/admin/create-course", icon: <MdAddCircle /> },
      { title: "Modules", path: "/dashboard/admin/modules", icon: <MdViewModule /> },
    ],
  },
  {
    title: "Blogs",
    path: "/dashboard/admin/blogs",
    icon: <MdArticle />,
  },
  {
    title: "Events",
    path: "/dashboard/admin/events",
    icon: <MdEvent />,
  },
  {
    title: "Sponsors",
    path: "/dashboard/admin/sponsors",
    icon: <MdHandshake />,
  },
  {
    title: "Settings",
    path: "/dashboard/admin/settings",
    icon: <MdSettings />,
  },
];

const AdminSidebar = () => {
  const { logout } = useAuth?.() || {};
  const navigate = useNavigate();
  const [coursesOpen, setCoursesOpen] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .xv-sidebar {
          width: 260px;
          background: rgba(8, 15, 30, 0.95);
          border-right: 1px solid rgba(0, 132, 255, 0.1);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(20px);
          box-shadow: 4px 0 30px rgba(0,0,0,0.4);
          overflow-y: auto;
          overflow-x: hidden;
        }
        .xv-sidebar::-webkit-scrollbar { width: 3px; }
        .xv-sidebar::-webkit-scrollbar-track { background: transparent; }
        .xv-sidebar::-webkit-scrollbar-thumb { background: rgba(0, 132, 255,0.2); border-radius: 3px; }

        .xv-logo-area {
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(0, 132, 255,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .xv-logo-area img {
          height: 46px;
          width: auto;
          border-radius: 6px;
          filter: drop-shadow(0 0 8px rgba(0, 132, 255,0.4));
        }
        .xv-logo-badge {
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
          white-space: nowrap;
        }

        .xv-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .xv-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          color: #8baac8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          transition: all 0.22s ease;
          cursor: pointer;
          border: 1px solid transparent;
          background: none;
          width: 100%;
          text-align: left;
        }
        .xv-nav-item svg {
          font-size: 18px;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .xv-nav-item:hover {
          background: rgba(0, 132, 255,0.06);
          color: #e8f0fe;
          border-color: rgba(0, 132, 255,0.1);
          transform: translateX(3px);
        }
        .xv-nav-item.active {
          background: rgba(0, 132, 255,0.12);
          color: #0084ff;
          border-color: rgba(0, 132, 255,0.2);
          box-shadow: 0 0 16px rgba(0, 132, 255,0.08), inset 0 0 10px rgba(0, 132, 255,0.03);
        }
        .xv-nav-item.active svg {
          color: #0084ff;
          filter: drop-shadow(0 0 5px rgba(0, 132, 255,0.5));
        }

        .xv-courses-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          color: #8baac8;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          transition: all 0.22s ease;
          cursor: pointer;
          border: 1px solid transparent;
          background: none;
          width: 100%;
          text-align: left;
        }
        .xv-courses-btn:hover {
          background: rgba(0, 132, 255,0.06);
          color: #e8f0fe;
          border-color: rgba(0, 132, 255,0.1);
        }
        .xv-courses-btn.open {
          background: rgba(0, 132, 255,0.08);
          color: #0084ff;
          border-color: rgba(0, 132, 255,0.15);
        }
        .xv-courses-btn svg.main-icon { font-size: 18px; flex-shrink: 0; }
        .xv-courses-btn .chevron {
          margin-left: auto;
          font-size: 18px;
          transition: transform 0.3s ease;
        }
        .xv-courses-btn.open .chevron {
          transform: rotate(180deg);
          color: #0084ff;
        }

        .xv-submenu {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .xv-submenu.open {
          max-height: 200px;
        }
        .xv-submenu-inner {
          padding: 4px 0 4px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-left: 2px solid rgba(0, 132, 255,0.15);
          margin-left: 26px;
          margin-top: 2px;
        }
        .xv-sub-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          color: #4a6a8a;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          opacity: 0;
          transform: translateX(-10px);
          animation: none;
        }
        .xv-sub-item.animate-in {
          animation: subSlideIn 0.3s ease forwards;
        }
        .xv-sub-item:nth-child(1) { animation-delay: 0ms; }
        .xv-sub-item:nth-child(2) { animation-delay: 70ms; }
        .xv-sub-item:nth-child(3) { animation-delay: 140ms; }
        @keyframes subSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .xv-sub-item:hover {
          background: rgba(0, 132, 255,0.07);
          color: #e8f0fe;
        }
        .xv-sub-item.active {
          color: #0084ff;
          background: rgba(0, 132, 255,0.1);
        }
        .xv-sub-item svg { font-size: 15px; flex-shrink: 0; }

        .xv-sidebar-footer {
          padding: 14px 12px;
          border-top: 1px solid rgba(0, 132, 255,0.08);
        }
        .xv-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          color: #4a6a8a;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          border: 1px solid transparent;
          background: none;
          width: 100%;
          text-align: left;
          transition: all 0.22s ease;
        }
        .xv-logout-btn:hover {
          background: rgba(255,68,68,0.08);
          color: #ff4444;
          border-color: rgba(255,68,68,0.15);
        }
        .xv-logout-btn svg { font-size: 18px; }

        .xv-glow-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 132, 255,0.3), transparent);
          margin: 12px 0;
        }
      `}</style>

      <aside className="xv-sidebar">
        {/* Logo */}
        <div className="xv-logo-area">
          <img src="/xevion-logo-cropped.png" alt="Xevion" />
          <span className="xv-logo-badge">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="xv-nav">
          {menuItems.map((item) =>
            item.children ? (
              <div key="courses">
                <button
                  className={`xv-courses-btn ${coursesOpen ? "open" : ""}`}
                  onClick={() => setCoursesOpen(!coursesOpen)}
                >
                  <span className="main-icon">{item.icon}</span>
                  <span>{item.title}</span>
                  <MdExpandMore className="chevron" />
                </button>
                <div className={`xv-submenu ${coursesOpen ? "open" : ""}`}>
                  <div className="xv-submenu-inner">
                    {item.children.map((child, i) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `xv-sub-item ${isActive ? "active" : ""} ${coursesOpen ? "animate-in" : ""}`
                        }
                        style={{ animationDelay: `${i * 70}ms` }}
                      >
                        {child.icon}
                        <span>{child.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `xv-nav-item ${isActive ? "active" : ""}`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            )
          )}
        </nav>

        <div className="xv-glow-line" />

        {/* Footer */}
        <div className="xv-sidebar-footer">
          <button className="xv-logout-btn" onClick={handleLogout}>
            <MdLogout />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;