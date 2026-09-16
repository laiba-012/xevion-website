import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./StudentList.css";

const StudentList = () => {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const res = await api.get("/admin/users");

      setStudents(res.data.users || []);

    } catch (err) {

      console.log(err);

    }

    setLoading(false);

  };

  const deleteStudent = async (id) => {

    if (!window.confirm("Delete Student?")) return;

    try {

      await api.delete(`/admin/users/${id}`);

      fetchStudents();

    } catch (err) {

      console.log(err);

    }

  };

  const toggleStatus = async (id) => {

    try {

      await api.put(`/admin/users/status/${id}`);

      fetchStudents();

    } catch (err) {

      console.log(err);

    }

  };

  const filtered = students.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

    return (

    <div className="student-page">

      {/* Header */}

      <div className="page-header">

        <div>

          <h1>Student Management</h1>

          <p>Manage all registered students</p>

        </div>

        <div className="header-actions">

          <input

            className="search-input"

            type="text"

            placeholder="Search Student..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

          />

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <h2>{students.length}</h2>

          <p>Total Students</p>

        </div>

        <div className="stat-card active-card">

          <h2>

            {

              students.filter(

                s=>s.isActive

              ).length

            }

          </h2>

          <p>Active Students</p>

        </div>

        <div className="stat-card blocked-card">

          <h2>

            {

              students.filter(

                s=>!s.isActive

              ).length

            }

          </h2>

          <p>Blocked Students</p>

        </div>

      </div>

      {/* Table */}

      <div className="table-wrapper">

        <table className="student-table">

          <thead>

            <tr>

              <th>Photo</th>

              <th>Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Purchased Courses</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {

              loading ?

              (

                <tr>

                  <td

                    colSpan="7"

                    className="loading"

                  >

                    Loading Students...

                  </td>

                </tr>

              )

              :

              filtered.length===0 ?

              (

                <tr>

                  <td

                    colSpan="7"

                    className="loading"

                  >

                    No Student Found

                  </td>

                </tr>

              )

              :

              filtered.map(student=>(

                <tr key={student._id}>

                  <td>

                    <img

                      className="profile"

                      src={

                        student.profileImage

                        ?

                        `http://localhost:5000/uploads/${student.profileImage}`

                        :

                        "https://placehold.co/60x60"

                      }

                      alt={student.name}

                    />

                  </td>

                  <td>{student.name}</td>

                  <td>{student.email}</td>

                  <td>{student.phone || "N/A"}</td>

                  <td>

                    {

                      student.courses

                      ?

                      student.courses.length

                      :

                      0

                    }

                  </td>

                  <td>

                    {

                      student.isActive ?

                      <span className="activeBadge">

                        Active

                      </span>

                      :

                      <span className="blockedBadge">

                        Blocked

                      </span>

                    }

                  </td>

                  <td>

                    <div className="actionBtns">

                      <button

                        className="viewBtn"

                        onClick={()=>

                          navigate(

                            `/dashboard/admin/student/${student._id}`

                          )

                        }

                      >

                        View

                      </button>

                      <button

                        className="statusBtn"

                        onClick={()=>

                          toggleStatus(student._id)

                        }

                      >

                        {

                          student.isActive

                          ?

                          "Block"

                          :

                          "Activate"

                        }

                      </button>

                      <button

                        className="deleteBtn"

                        onClick={()=>

                          deleteStudent(student._id)

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

export default StudentList;