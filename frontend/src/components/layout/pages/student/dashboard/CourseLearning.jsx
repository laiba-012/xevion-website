import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../../utils/api";

const CourseLearning = () => {
const { courseId } = useParams();

const [modules, setModules] = useState([]);
const [lessons, setLessons] = useState({});
const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

 const fetchModules = async () => {
  try {
    const res = await api.get(`/modules/${courseId}`);

    if (res.data.success) {
      const modulesData = res.data.modules;

      setModules(modulesData);

      const lessonData = {};

      for (const module of modulesData) {
        const res = await api.get(`/lessons/${module._id}`);

console.log("Lessons:", res.data);

        lessonData[module._id] = lessonRes.data.lessons;
      }

      setLessons(lessonData);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Course Learning</h1>

      {modules.length === 0 ? (
        <h3>No Modules Found</h3>
      ) : (
        modules.map((module) => (
          <div
            key={module._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <h2>{module.title}</h2>

        <h3>Lessons</h3>

{lessons[module._id]?.length > 0 ? (
  lessons[module._id].map((lesson) => (
    <div
      key={lesson._id}
      style={{
        background: "#f8fafc",
        padding: "12px",
        marginTop: "10px",
        borderRadius: "8px",
      }}
    >
      <h4>{lesson.title}</h4>

      <p>{lesson.description}</p>

      <p>⏱ {lesson.duration}</p>

      {lesson.videoUrl && (
        <a
          href={lesson.videoUrl}
          target="_blank"
          rel="noreferrer"
        >
          ▶ Watch Video
        </a>
      )}
    </div>
  ))
) : (
  <p>No Lessons</p>
)}
          </div>
        ))
      )}
    </div>
  );
};

export default CourseLearning;