import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./ModuleManagement.css";

const ModuleManagement = () => {

  const [modules, setModules] = useState([]);

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const moduleRes = await api.get("/modules");

      const courseRes = await api.get("/courses");

      setModules(moduleRes.data.modules || []);

      setCourses(courseRes.data.courses || []);

    }

    catch(err){

      console.log(err);

    }

    setLoading(false);

  };

  const deleteModule = async(id)=>{

    if(!window.confirm("Delete Module?")) return;

    try{

      await api.delete(`/modules/${id}`);

      fetchData();

    }

    catch(err){

      console.log(err);

    }

  };

  const filtered = modules.filter(item=>

      item.title.toLowerCase().includes(search.toLowerCase())

  );

    return (

    <div className="module-page">

      {/* Header */}

      <div className="page-header">

        <div>

          <h1>Module Management</h1>

          <p>Manage all course modules</p>

        </div>

        <div className="header-actions">

          <input

            className="search-input"

            type="text"

            placeholder="Search Module..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

          />

          <button className="addBtn">

            + Add Module

          </button>

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <h2>{modules.length}</h2>

          <p>Total Modules</p>

        </div>

        <div className="stat-card blue">

          <h2>{courses.length}</h2>

          <p>Total Courses</p>

        </div>

        <div className="stat-card green">

          <h2>

            {

              modules.filter(

                item=>item.isPublished

              ).length

            }

          </h2>

          <p>Published Modules</p>

        </div>

      </div>

      {/* Table */}

      <div className="table-wrapper">

        <table className="module-table">

          <thead>

            <tr>

              <th>Module Title</th>

              <th>Course</th>

              <th>Lessons</th>

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

                  <td colSpan="6" className="loading">

                    Loading Modules...

                  </td>

                </tr>

              )

              :

              filtered.length===0 ?

              (

                <tr>

                  <td colSpan="6" className="loading">

                    No Modules Found

                  </td>

                </tr>

              )

              :

              filtered.map(module=>(

                <tr key={module._id}>

                  <td>

                    <strong>

                      {module.title}

                    </strong>

                  </td>

                  <td>

                    {

                      module.course?.title ||

                      "N/A"

                    }

                  </td>

                  <td>

                    {

                      module.lessons

                      ?

                      module.lessons.length

                      :

                      0

                    }

                  </td>

                  <td>

                    {

                      module.isPublished ?

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

                        module.createdAt

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

                        onClick={()=>

                          deleteModule(module._id)

                        }

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

export default ModuleManagement;