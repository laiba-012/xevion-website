import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const InstructorCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/my-courses");

      if (res.data.success) {
        setCourses(res.data.courses);
      }

    } catch (error) {
      console.log(error);
      alert("Failed to load courses.");
    }

    setLoading(false);
  };

  const deleteCourse = async (id) => {

    if (!window.confirm("Delete this course?")) return;

    try {

      const res = await api.delete(`/courses/${id}`);

      if (res.data.success) {

        alert("Course Deleted");

        fetchCourses();

      }

    } catch (error) {

      alert(error.response?.data?.message);

    }

  };

  if (loading) {

    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "120px",
        }}
      >
        Loading...
      </h2>
    );

  }

  return (

    <div
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <div>

          <h1>📚 My Courses</h1>

          <p>
            Total Courses : {courses.length}
          </p>

        </div>

      <button
  onClick={() => navigate("/instructor/create-course")}
  style={{
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  + Create Course
</button>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(330px,1fr))",
          gap: "25px",
        }}
      >

        {courses.length === 0 ? (

  <div
    style={{
      gridColumn: "1 / -1",
      background: "#fff",
      padding: "50px",
      borderRadius: "15px",
      textAlign: "center",
      boxShadow: "0 5px 15px rgba(0,0,0,.08)",
    }}
  >
    <h2>No Courses Found</h2>

    <p>Create your first course.</p>

  </div>

) : (

  courses.map((course) => (

    <div
      key={course._id}
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      }}
    >

      <img
        src={
          course.thumbnail ||
          "https://placehold.co/600x350?text=Course"
        }
        alt={course.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          padding: "20px",
        }}
      >

        <h3
          style={{
            marginBottom: "12px",
          }}
        >
          {course.title}
        </h3>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            minHeight: "45px",
          }}
        >
          {course.description.substring(0,80)}...
        </p>

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          <span>
            📂 {course.category}
          </span>

          <span>
            📚 {course.level}
          </span>

        </div>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          <span>
            ⏱ {course.duration}
          </span>

          <span
            style={{
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            ${course.price}
          </span>

        </div>

        <div
          style={{
            marginTop: "15px",
          }}
        >

          <strong>Status : </strong>

          <span
            style={{
              color:
                course.status === "Published"
                  ? "green"
                  : "orange",
              fontWeight: "bold",
            }}
          >
            {course.status}
          </span>

        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >

         <button
  onClick={() =>
    navigate(`/instructor/edit-course/${course._id}`)
  }
  style={{
    flex: 1,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Edit
</button>



<button
  onClick={() =>
    navigate(`/instructor/modules/${course._id}`)
  }
  style={{
    flex: 1,
    background: "#64748b",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Modules
</button>
          <button
            onClick={() => deleteCourse(course._id)}
            style={{
              flex: 1,
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  ))

)}      </div>

    </div>

  );

};

export default InstructorCourses;
    