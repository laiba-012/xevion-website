import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
     const role =
JSON.parse(localStorage.getItem("user"))?.role;

const requests = [api.get(`/courses/${id}`)];

if(role==="admin"){
    requests.push(api.get("/instructors"));
}

const responses = await Promise.all(requests);

const courseRes = responses[0];
const instructorRes = responses[1];

      if (courseRes.data.success) {
        const course = courseRes.data.course;

        setFormData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "Beginner",
          price: course.price || "",
          duration: course.duration || "",
          thumbnail: course.thumbnail || "",
          instructor: course.instructor?._id || "",
          status: course.status || "Draft",
        });
      }

     if (
instructorRes &&
instructorRes.data.success
){
setInstructors(instructorRes.data.instructors);
}
    } catch (err) {
      console.log(err);
      alert("Failed to load course.");
    }

    setPageLoading(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.put(`/courses/${id}`, formData);

      if (res.data.success) {
        alert("Course Updated Successfully");
       const role =
JSON.parse(localStorage.getItem("user")).role;

if(role==="admin"){
navigate("/admin/courses");
}else{
navigate("/instructor/courses");
}
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update Failed");
    }

    setLoading(false);
  };

  if (pageLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 150,
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }

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
          margin: "auto",
          background: "#fff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            color: "#1e293b",
          }}
        >
          ✏️ Edit Course
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "25px",
            }}
          >

          </div>

          {/* Course Title */}
<div>
  <label style={styles.label}>Course Title</label>
  <input
    type="text"
    name="title"
    value={formData.title}
    onChange={handleChange}
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
    <option value="Beginner">Beginner</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
  </select>
</div>

{/* Price */}
<div>
  <label style={styles.label}>Price ($)</label>

  <input
    type="number"
    name="price"
    value={formData.price}
    onChange={handleChange}
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
    placeholder="e.g. 20 Hours"
    style={styles.input}
  />
</div>

{/* Instructor */}
{JSON.parse(localStorage.getItem("user"))?.role==="admin" && (

<div>

<label style={styles.label}>
Instructor
</label>

<select
name="instructor"
value={formData.instructor}
onChange={handleChange}
style={styles.input}
>

<option value="">
Select Instructor
</option>

{instructors.map((ins)=>(

<option
key={ins._id}
value={ins._id}
>

{ins.name}

</option>

))}

</select>

</div>

)}
{/* Status */}
{JSON.parse(localStorage.getItem("user"))?.role==="admin" && (

<div>

<label style={styles.label}>
Status
</label>

<select
name="status"
value={formData.status}
onChange={handleChange}
style={styles.input}
>

<option value="Pending">
Pending
</option>

<option value="Published">
Published
</option>

<option value="Rejected">
Rejected
</option>

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
    style={styles.input}
  />
</div>

{/* Thumbnail Preview */}
<div style={{ gridColumn: "1 / span 2" }}>
  <label style={styles.label}>Thumbnail Preview</label>

  {formData.thumbnail ? (
    <img
      src={formData.thumbnail}
      alt="Thumbnail"
      style={{
        width: "320px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "12px",
        border: "1px solid #ddd",
      }}
    />
  ) : (
    <div
      style={{
        width: "320px",
        height: "180px",
        border: "2px dashed #ccc",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
      }}
    >
      No Thumbnail Selected
    </div>

    
  )}
  {/* Description */}
<div style={{ gridColumn: "1 / span 2" }}>
  <label style={styles.label}>Course Description</label>

  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows={6}
    placeholder="Write complete course description..."
    style={{
      ...styles.input,
      resize: "vertical",
      minHeight: "160px",
      paddingTop: "12px",
    }}
    required
  />
</div>

</div>

{/* Bottom Buttons */}
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
    style={{
      padding: "12px 24px",
      border: "1px solid #cbd5e1",
      background: "#fff",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
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
      fontWeight: "600",
      fontSize: "15px",
      opacity: loading ? 0.7 : 1,
    }}
  >
    {loading ? "Updating..." : "Update Course"}
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
    color: "#334155",
    fontSize: "15px",
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

export default EditCourse;

