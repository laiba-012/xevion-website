import React from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import "./AdminTopbar.css";

const AdminTopbar = () => {
  return (
    <header className="topbar">

      {/* Search */}

      <div className="topbar-search">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search users, instructors, courses..."
        />

      </div>

      {/* Right */}

      <div className="topbar-right">

        <button className="notification">

          <FaBell />

          <span className="badge">3</span>

        </button>

        <div className="profile">

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt=""
          />

          <div>

            <h4>Admin</h4>

            <span>Super Admin</span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminTopbar;