import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >

      <AdminSidebar
        sidebarOpen={sidebarOpen}
      />

      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? 260 : 70,
          transition: ".3s",
        }}
      >

        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div
          style={{
            padding: 25,
          }}
        >
          <Outlet />
        </div>

      </div>

    </div>

  );

};

export default AdminLayout;