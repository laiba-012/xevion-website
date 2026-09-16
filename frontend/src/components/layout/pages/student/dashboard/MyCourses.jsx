import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../utils/api";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  console.log("🔥 MyCourses Rendered");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
     console.log("🔥 Fetch Courses Called");
  try {


   
    console.log("TOKEN:", localStorage.getItem("token"));

    const res = await api.get("/enrollments/my");

    console.log(res.data);

    if (res.data.success) {
      setCourses(res.data.enrollments);
    }

  } catch (err) {
    console.log(err.response?.data);
  }

  setLoading(false);
};
  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => navigate("/my-courses")}>
   My Courses
</button>

      {courses.length === 0 ? (
        <h3>No enrolled courses.</h3>
      ) : (
        courses.map((item) => (
          <div
            key={item._id}
            style={{
              padding: 20,
              marginTop: 20,
              border: "1px solid #ddd",
              borderRadius: 10,
            }}
          >
            <h2>{item.course.title}</h2>

            <p>{item.course.description}</p>

            <p>
              Progress : {item.progress}%
            </p>

           <button
  onClick={() => navigate(`/learn/${item.course._id}`)}
>
  Continue Learning
</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyCourses;