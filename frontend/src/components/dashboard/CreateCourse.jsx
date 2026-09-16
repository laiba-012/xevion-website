import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    price: "",
    duration: "",
    thumbnail: "",
    instructor: "",
    status: "Draft",
  });

useEffect(() => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  if (role === "admin") {
    fetchInstructors();
  }
}, []);

  const fetchInstructors = async () => {
    try {
      const res = await api.get("/instructors");

      if (res.data.success) {
        setInstructors(res.data.instructors);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/courses/create", formData);
if (res.data.success) {

alert(res.data.message);

const role =
JSON.parse(localStorage.getItem("user")).role;

if(role==="admin"){

navigate("/admin/courses");

}else{

navigate("/instructor/courses");

}

}
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "18px",
          padding: "35px",
          boxShadow: "0 10px 35px rgba(0,0,0,.08)",
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "5px",
          }}
        >
          Create New Course
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "35px",
          }}
        >
          Fill all course information below.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "25px",
            }}
          >

            {/* Course Title */}
<div>
  <label style={styles.label}>Course Title</label>
  <input
    type="text"
    name="title"
    value={formData.title}
    onChange={handleChange}
    placeholder="Enter Course Title"
    style={styles.input}
    required
  />
</div>

{/* Category */}
<div>
  <label style={styles.label}>Category</label>
  <input
    type="text"
    name="category"
    value={formData.category}
    onChange={handleChange}
    placeholder="Web Development"
    style={styles.input}
    required
  />
</div>

{/* Level */}
<div>
  <label style={styles.label}>Level</label>
  <select
    name="level"
    value={formData.level}
    onChange={handleChange}
    style={styles.input}
  >
    <option>Beginner</option>
    <option>Intermediate</option>
    <option>Advanced</option>
  </select>
</div>

{/* Instructor */}
{JSON.parse(localStorage.getItem("user"))?.role === "admin" && (

<div>

<label style={styles.label}>Instructor</label>

<select
name="instructor"
value={formData.instructor}
onChange={handleChange}
style={styles.input}
required
>

<option value="">Select Instructor</option>

{instructors.map((ins)=>(
<option key={ins._id} value={ins._id}>
{ins.name}
</option>
))}

</select>

</div>

)}

{/* Price */}
<div>
  <label style={styles.label}>Price ($)</label>

  <input
    type="number"
    name="price"
    value={formData.price}
    onChange={handleChange}
    placeholder="99"
    style={styles.input}
  />
</div>

{/* Duration */}
<div>
  <label style={styles.label}>Duration</label>

  <input
    type="text"
    name="duration"
    value={formData.duration}
    onChange={handleChange}
    placeholder="20 Hours"
    style={styles.input}
  />
</div>

{/* Status */}
{JSON.parse(localStorage.getItem("user"))?.role === "admin" && (

<div>

<label style={styles.label}>Status</label>

<select
name="status"
value={formData.status}
onChange={handleChange}
style={styles.input}
>

<option>Pending</option>
<option>Published</option>
<option>Rejected</option>

</select>

</div>

)}

{/* Thumbnail */}
<div>
  <label style={styles.label}>Thumbnail URL</label>

  <input
    type="text"
    name="thumbnail"
    value={formData.thumbnail}
    onChange={handleChange}
    placeholder="https://..."
    style={styles.input}
  />
</div>

{/* Thumbnail Preview */}
<div style={{ gridColumn: "1 / span 2" }}>
  <label style={styles.label}>Thumbnail Preview</label>

  <div
    style={{
      border: "2px dashed #cbd5e1",
      borderRadius: 12,
      padding: 15,
      textAlign: "center",
      background: "#f8fafc",
      minHeight: 220,
    }}
  >
    {formData.thumbnail ? (
      <img
        src={formData.thumbnail}
        alt="Preview"
        style={{
          width: "100%",
          maxHeight: 250,
          objectFit: "cover",
          borderRadius: 10,
        }}
      />
    ) : (
      <p
        style={{
          color: "#94a3b8",
          marginTop: 80,
        }}
      >
        Thumbnail Preview
      </p>
    )}
  </div>
</div>

{/* Description */}
<div style={{ gridColumn: "1 / span 2" }}>
  <label style={styles.label}>Course Description</label>

  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows={6}
    placeholder="Write course description..."
    style={{
      ...styles.input,
      resize: "vertical",
      minHeight: "150px",
      paddingTop: "12px",
    }}
    required
  />
</div>

</div>

{/* Buttons */}
<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "35px",
  }}
>
 <button
  type="button"
  onClick={() => {
    const role = JSON.parse(localStorage.getItem("user"))?.role;

    if (role === "admin") {
      navigate("/admin/courses");
    } else {
      navigate("/instructor/courses");
    }
  }}
>
  Cancel
</button>

  <button
    type="submit"
    disabled={loading}
    style={{
      padding: "12px 28px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "600",
      opacity: loading ? 0.7 : 1,
    }}
  >
    {loading ? "Creating..." : "Create Course"}
  </button>
</div>

</form>

</div>

</div>
);
};

const styles = {
label: {
display: "block",
marginBottom: "8px",
fontWeight: "600",
fontSize: "15px",
color: "#334155",
},

input: {
width: "100%",
padding: "12px 14px",
border: "1px solid #d1d5db",
borderRadius: "10px",
fontSize: "15px",
outline: "none",
background: "#fff",
boxSizing: "border-box",
transition: "0.3s",
},
};

export default CreateCourse;