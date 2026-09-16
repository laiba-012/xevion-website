import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./LessonManagement.css";

const LessonManagement = () => {

  const [lessons, setLessons] = useState([]);

  const [modules, setModules] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const lessonRes = await api.get("/lessons");

      const moduleRes = await api.get("/modules");

      setLessons(lessonRes.data.lessons || []);

      setModules(moduleRes.data.modules || []);

    } catch (err) {

      console.log(err);

    }

    setLoading(false);

  };

  const deleteLesson = async(id)=>{

    if(!window.confirm("Delete Lesson?")) return;

    try{

      await api.delete(`/lessons/${id}`);

      loadData();

    }

    catch(err){

      console.log(err);

    }

  };

  const filtered = lessons.filter(item=>

      item.title.toLowerCase().includes(search.toLowerCase())

  );

    return (

    <div className="lesson-page">

      {/* Header */}

      <div className="page-header">

        <div>

          <h1>Lesson Management</h1>

          <p>Manage all lessons of your LMS</p>

        </div>

        <div className="header-actions">

          <input

            type="text"

            className="search-input"

            placeholder="Search Lesson..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

          />

          <button className="addBtn">

            + Add Lesson

          </button>

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <h2>{lessons.length}</h2>

          <p>Total Lessons</p>

        </div>

        <div className="stat-card blue">

          <h2>{modules.length}</h2>

          <p>Total Modules</p>

        </div>

        <div className="stat-card green">

          <h2>

            {

              lessons.filter(

                lesson=>lesson.isPublished

              ).length

            }

          </h2>

          <p>Published</p>

        </div>

      </div>

      {/* Table */}

      <div className="table-wrapper">

        <table className="lesson-table">

          <thead>

            <tr>

              <th>Lesson</th>

              <th>Module</th>

              <th>Duration</th>

              <th>Video</th>

              <th>PDF</th>

              <th>Status</th>

              <th>Created</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {

              loading ?

              (

                <tr>

                  <td colSpan="8" className="loading">

                    Loading Lessons...

                  </td>

                </tr>

              )

              :

              filtered.length===0 ?

              (

                <tr>

                  <td colSpan="8" className="loading">

                    No Lessons Found

                  </td>

                </tr>

              )

              :

              filtered.map(lesson=>(

                <tr key={lesson._id}>

                  <td>

                    <strong>

                      {lesson.title}

                    </strong>

                  </td>

                  <td>

                    {

                      lesson.module?.title ||

                      "N/A"

                    }

                  </td>

                  <td>

                    {

                      lesson.duration ||

                      "0 Min"

                    }

                  </td>

                  <td>

                    {

                      lesson.videoUrl ?

                      <span className="videoBadge">

                        Uploaded

                      </span>

                      :

                      <span className="noBadge">

                        None

                      </span>

                    }

                  </td>

                  <td>

                    {

                      lesson.pdf ?

                      <span className="pdfBadge">

                        Uploaded

                      </span>

                      :

                      <span className="noBadge">

                        None

                      </span>

                    }

                  </td>

                  <td>

                    {

                      lesson.isPublished ?

                      <span className="publishedBadge">

                        Published

                      </span>

                      :

                      <span className="draftBadge">

                        Draft

                      </span>

                    }

                  </td>

                  <td>

                    {

                      new Date(

                        lesson.createdAt

                      ).toLocaleDateString()

                    }

                  </td>

                  <td>

                    <div className="actionBtns">

                      <button className="editBtn">

                        Edit

                      </button>

                      <button

                        className="deleteBtn"

                        onClick={()=>deleteLesson(lesson._id)}

                      >

                        Delete

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default LessonManagement;