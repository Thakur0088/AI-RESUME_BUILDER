import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data); // Update the state with the fetched users
      console.log("Fetched users:", res.data); // Debugging
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const toggleActivation = async (id) => {
    const confirm = window.confirm("Are you sure you want to change the user's status?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`http://localhost:5000/api/admin/users/${id}/toggle`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Toggle response:", res.data); // Debugging

      // Update the user in the state directly
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isActive: res.data.user.isActive } : user
        )
      );
    } catch (err) {
      console.error("Error toggling user activation:", err.response?.data || err.message);
      alert("Failed to toggle user status. Please try again.");
    }
  };

  const deleteUser = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/users/${editingUser._id}`,
        editingUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesStatus = filterStatus
      ? filterStatus === "active"
        ? user.isActive
        : !user.isActive
      : true;
    const matchesVerified = filterVerified
      ? filterVerified === "verified"
        ? user.isVerified
        : !user.isVerified
      : true;

    return matchesSearch && matchesRole && matchesStatus && matchesVerified;
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="admin-heading">Admin Dashboard</h1>

      <input
        type="text"
        className="admin-search"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="filters">
        <select
          className="filter-dropdown"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          className="filter-dropdown"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          className="filter-dropdown"
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
        >
          <option value="">All Verification Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      <table className="admin-table">
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button className="btn blue" onClick={() => toggleActivation(user._id)}>
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button className="btn red" onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                  <button className="btn green" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-users">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingUser && (
        <div className="edit-form">
          <h3>Edit User</h3>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) =>
              setEditingUser({ ...editingUser, name: e.target.value })
            }
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
          />
          <select
            value={editingUser.role}
            onChange={(e) =>
              setEditingUser({ ...editingUser, role: e.target.value })
            }
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button onClick={saveEdit}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
}
