import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./layout/AdminSidebar";
import AdminTopbar from "./layout/AdminTopbar";
import "./styles/dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard">
      <AdminSidebar />

      <div className="dashboard-main">
        <AdminTopbar />

        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;