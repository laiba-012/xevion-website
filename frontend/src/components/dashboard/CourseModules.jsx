import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";


const CourseModules = () => {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState("");

const [editingId, setEditingId] = useState(null);
const [editTitle, setEditTitle] = useState("");

const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await api.get(`/modules/${courseId}`);

      if (res.data.success) {
        setModules(res.data.modules);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createModule = async () => {
    if (!title) return alert("Enter Module Title");

    try {
      const res = await api.post("/modules/create", {
        title,
        course: courseId,
      });

      if (res.data.success) {
        setTitle("");
        fetchModules();
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };
const updateModule = async (id) => {
  try {
    const res = await api.put(`/modules/${id}`, {
      title: editTitle,
    });

    if (res.data.success) {
      setEditingId(null);
      setEditTitle("");
      fetchModules();
    }
  } catch (err) {
    alert(err.response?.data?.message || "Update Failed");
  }
};

const deleteModule = async (id) => {
  if (!window.confirm("Delete this module?")) return;

  try {
    const res = await api.delete(`/modules/${id}`);

    if (res.data.success) {
      fetchModules();
    }
  } catch (err) {
    alert(err.response?.data?.message || "Delete Failed");
  }
};
  return (
    <div style={{ padding: 40 }}>

      <h1>Course Modules</h1>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
          marginBottom: 30,
        }}
      >
        <input
          type="text"
          placeholder="Module Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
          }}
        />

        <button
          onClick={createModule}
          style={{
            padding: "12px 25px",
          }}
        >
          Add Module
        </button>
      </div>

     {modules.map((module) => (

  <div
    key={module._id}
    style={{
      background: "#fff",
      padding: 20,
      marginBottom: 20,
      borderRadius: 12,
      boxShadow: "0 5px 15px rgba(0,0,0,.08)",
    }}
  >

    {editingId === module._id ? (

      <>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            marginBottom: 15,
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={() => updateModule(module._id)}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Save
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setEditTitle("");
            }}
            style={{
              background: "#64748b",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>

      </>

    ) : (

      <>

        <h3>{module.title}</h3>

        <p>Order : {module.order}</p>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 15,
          }}
        >

          <button
            onClick={() => {
              setEditingId(module._id);
              setEditTitle(module.title);
            }}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Edit
          </button>

          <button
            onClick={() => deleteModule(module._id)}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
<button
  onClick={() =>
    navigate(`/instructor/lessons/${module._id}`)
  }
  style={{
    background:"#64748b",
    color:"#fff",
    border:"none",
    padding:"10px 18px",
    borderRadius:8,
    cursor:"pointer",
  }}
>
  Lessons
</button>

        </div>

      </>

    )}

  </div>

))}

    </div>
  );
};

export default CourseModules;