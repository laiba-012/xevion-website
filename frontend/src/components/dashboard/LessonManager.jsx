import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

const LessonManager = () => {

  const { moduleId } = useParams();

  const [lessons, setLessons] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");

  const [editingId, setEditingId] = useState(null);

  

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {

    try {

      const res = await api.get(`/lessons/${moduleId}`);

      if (res.data.success) {
        setLessons(res.data.lessons);
      }

    } catch (err) {
      console.log(err);
    }

  };

  const createLesson = async () => {

    try {

      const res = await api.post("/lessons/create", {
        title,
        description,
        duration,
        videoUrl,
        module: moduleId,
      });

      if (res.data.success) {

        setTitle("");
        setDescription("");
        setDuration("");
        setVideoUrl("");

        fetchLessons();

      }

    } catch (err) {

      alert(err.response?.data?.message);

    }

  };
  const updateLesson = async (id) => {
  try {

    const res = await api.put(`/lessons/${id}`, {
      title,
      description,
      duration,
      videoUrl,
    });

    if (res.data.success) {

      setEditingId(null);

      setTitle("");
      setDescription("");
      setDuration("");
      setVideoUrl("");

      fetchLessons();

    }

  } catch (err) {

    alert(err.response?.data?.message);

  }
};

const deleteLesson = async (id) => {

  if (!window.confirm("Delete Lesson?")) return;

  try {

    const res = await api.delete(`/lessons/${id}`);

    if (res.data.success) {

      fetchLessons();

    }

  } catch (err) {

    alert(err.response?.data?.message);

  }

};

  return (

    <div style={{ padding: 40 }}>

      <h1>Lesson Manager</h1>

      <input
        placeholder="Lesson Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <br/><br/>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e)=>setVideoUrl(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Duration"
        value={duration}
        onChange={(e)=>setDuration(e.target.value)}
      />

      <br/><br/>

      <button
onClick={() =>
editingId
? updateLesson(editingId)
: createLesson()
}
>

{editingId ? "Update Lesson" : "Add Lesson"}

</button>

      <hr/>

      {lessons.map((lesson)=>(

        <div
          key={lesson._id}
          style={{
            border:"1px solid #ddd",
            padding:20,
            marginTop:15,
            borderRadius:10,
          }}
        >

         <h3>{lesson.title}</h3>

<p>{lesson.description}</p>

<p>⏱ {lesson.duration}</p>

<a
  href={lesson.videoUrl}
  target="_blank"
  rel="noreferrer"
>
  🎥 Watch Video
</a>

<div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 15,
  }}
>

<button
onClick={()=>{
setEditingId(lesson._id);

setTitle(lesson.title);

setDescription(lesson.description);

setDuration(lesson.duration);

setVideoUrl(lesson.videoUrl);
}}
>

Edit

</button>

<button
onClick={()=>deleteLesson(lesson._id)}
>

Delete

</button>

</div>

        </div>

      ))}

    </div>

  );

};

export default LessonManager;