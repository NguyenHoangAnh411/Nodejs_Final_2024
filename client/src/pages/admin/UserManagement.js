import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, banUser, updateUser } from '../../hooks/userApi';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminPage.css';
import '../../css/UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedInfo, setUpdatedInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const userList = await getUsers(search);
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [search]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBan = async (userId, isBanned) => {
    const confirmationMessage = isBanned
      ? 'Are you sure you want to ban this user?'
      : 'Are you sure you want to unban this user?';
  
    if (window.confirm(confirmationMessage)) {
      setIsLoading(true);
      try {
        const result = await banUser(userId, isBanned);
        alert(result.message);
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, banned: isBanned } : user
          )
        );
      } catch (error) {
        console.error('Error banning/unbanning user:', error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const openEditModal = (user) => {
    setEditingUser(user);
    setUpdatedInfo({ name: user.name, email: user.email });
  };

  const handleUpdate = async () => {
    if (!updatedInfo.name || !updatedInfo.email) {
      alert('Please fill out all fields');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(editingUser._id, updatedInfo);
      alert('User updated successfully!');
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? { ...user, ...updatedUser.user } : user
        )
      );
      setEditingUser(null); // Close modal
    } catch (error) {
      console.error('Error updating user:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <h1>User Management</h1>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading && <p>Loading...</p>}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.banned ? 'Banned' : 'Active'}</td>
                <td>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                  <button
                    onClick={() => handleBan(user._id, !user.banned)}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: user.banned ? 'red' : 'green',
                    }}
                  >
                    {user.banned ? 'Unban' : 'Ban'}
                  </button>
                  <button
                    onClick={() => openEditModal(user)}
                    style={{ marginLeft: '10px' }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <div className="modal">
            <div className="modal-content">
              <h2>Update User Information</h2>
              <input
                type="text"
                placeholder="Name"
                value={updatedInfo.name}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={updatedInfo.email}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, email: e.target.value })
                }
              />
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
