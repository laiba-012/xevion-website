import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./AdminUsers.css";

import {
  FaUsers,
  FaTrash,
  FaUserSlash,
  FaUserCheck,
  FaSearch,
} from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const changeStatus = async (id) => {
    try {
      await api.put(`/admin/users/status/${id}`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">

      {/* Header */}

      <div className="page-header">

        <div>

          <h1>User Management</h1>

          <p>Manage all registered users</p>

        </div>

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* Cards */}

      <div className="user-cards">

        <div className="user-card">

          <FaUsers className="card-icon" />

          <div>

            <h2>{users.length}</h2>

            <span>Total Users</span>

          </div>

        </div>

        <div className="user-card">

          <FaUserCheck className="card-icon green" />

          <div>

            <h2>
              {users.filter((u) => u.isActive).length}
            </h2>

            <span>Active Users</span>

          </div>

        </div>

        <div className="user-card">

          <FaUserSlash className="card-icon red" />

          <div>

            <h2>
              {users.filter((u) => !u.isActive).length}
            </h2>

            <span>Blocked Users</span>

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>Role</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((user) => (

              <tr key={user._id}>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>

                  <span className="role">

                    {user.role}

                  </span>

                </td>

                <td>

                  {user.isActive ? (

                    <span className="active">

                      Active

                    </span>

                  ) : (

                    <span className="blocked">

                      Blocked

                    </span>

                  )}

                </td>

                <td>

                  <button
                    className="status-btn"
                    onClick={() => changeStatus(user._id)}
                  >
                    {user.isActive ? "Block" : "Unblock"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user._id)}
                  >
                    <FaTrash />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminUsers;