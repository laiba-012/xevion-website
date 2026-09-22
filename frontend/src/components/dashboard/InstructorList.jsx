import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./InstructorList.css";

const InstructorList = () => {

  const navigate = useNavigate();

  const [instructors, setInstructors] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchInstructors();

  }, []);

  const fetchInstructors = async () => {

    try {

      const res = await api.get("/admin/instructors");

      setInstructors(res.data.instructors || []);

    } catch (err) {

      console.log(err);

    }

    setLoading(false);

  };

  const deleteInstructor = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this instructor?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/admin/instructors/${id}`);

      fetchInstructors();

    } catch (err) {

      console.log(err);

    }

  };

  const toggleStatus = async (id) => {

    try {

      await api.put(`/admin/instructors/status/${id}`);

      fetchInstructors();

    } catch (err) {

      console.log(err);

    }

  };

  const filtered = instructors.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );


    return (

    <div className="instructor-page">

      {/* Header */}

      <div className="page-header">

        <div>

          <h1>Instructor Management</h1>

          <p>Manage all platform instructors</p>

        </div>

        <div className="header-actions">

          <input

            type="text"

            className="search-input"

            placeholder="Search Instructor..."

            value={search}

            onChange={(e) => setSearch(e.target.value)}

          />

          <button

            className="addBtn"

            onClick={() =>
              navigate("/admin/create-instructor")
            }

          >

            + Add Instructor

          </button>

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <h2>{instructors.length}</h2>

          <p>Total Instructors</p>

        </div>

        <div className="stat-card active-card">

          <h2>

            {

              instructors.filter(

                (i) => i.isActive

              ).length

            }

          </h2>

          <p>Active</p>

        </div>

        <div className="stat-card blocked-card">

          <h2>

            {

              instructors.filter(

                (i) => !i.isActive

              ).length

            }

          </h2>

          <p>Blocked</p>

        </div>

      </div>

      {/* Table */}

      <div className="table-wrapper">

        <table className="instructor-table">

          <thead>

            <tr>

              <th>Photo</th>

              <th>Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Qualification</th>

              <th>Experience</th>

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

                    colSpan="8"

                    className="loading"

                  >

                    Loading Instructors...

                  </td>

                </tr>

              )

              :

              filtered.length === 0 ?

              (

                <tr>

                  <td

                    colSpan="8"

                    className="loading"

                  >

                    No Instructor Found

                  </td>

                </tr>

              )

              :

              filtered.map((item) => (

                <tr key={item._id}>

                  <td>

                    <img

                      className="profile"

                      src={

                        item.profileImage

                          ?

                          `https://xevion-website.vercel.app/${item.profileImage}`

                          :

                          "https://placehold.co/60x60"

                      }

                      alt={item.name}

                    />

                  </td>

                  <td>{item.name}</td>

                  <td>{item.email}</td>

                  <td>{item.phone}</td>

                  <td>{item.qualification}</td>

                  <td>{item.experience}</td>

                  <td>

                    {

                      item.isActive ?

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

                        className="editBtn"

                        onClick={() =>

                          navigate(

                            `/dashboard/admin/edit-instructor/${item._id}`

                          )

                        }

                      >

                        Edit

                      </button>

                      <button

                        className="statusBtn"

                        onClick={() =>

                          toggleStatus(item._id)

                        }

                      >

                        {

                          item.isActive

                            ?

                            "Block"

                            :

                            "Activate"

                        }

                      </button>

                      <button

                        className="deleteBtn"

                        onClick={() =>

                          deleteInstructor(item._id)

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

export default InstructorList;