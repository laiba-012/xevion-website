import React from "react";

const AdminHeader = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  return (

    <div
      style={{
        height:70,
        background:"#fff",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        padding:"0 30px",
        borderBottom:"1px solid #eee",
        position:"sticky",
        top:0,
        zIndex:10
      }}
    >

      <button

        onClick={()=>setSidebarOpen(!sidebarOpen)}

        style={{
          fontSize:24,
          border:"none",
          background:"none",
          cursor:"pointer"
        }}

      >

        ☰

      </button>

      <div>

        <h3>

          Xevion Admin

        </h3>

      </div>

      <div

        style={{
          display:"flex",
          alignItems:"center",
          gap:15
        }}

      >

        <img

          src="https://i.pravatar.cc/100"

          alt=""

          style={{
            width:40,
            height:40,
            borderRadius:"50%"
          }}

        />

      </div>

    </div>

  );

};

export default AdminHeader;