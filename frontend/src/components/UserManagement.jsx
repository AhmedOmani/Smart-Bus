import { useState, useEffect } from 'react';
import { api } from '../api';

function UserManagement({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'PARENT' });
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNewUserChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });
  const handleEditFormChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/admin/users', newUser);
      alert('User created successfully!');
      setNewUser({ name: '', email: '', phone: '', role: 'PARENT' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      setError('');
      try {
        await api.delete(`/admin/users/${userId}`);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({ name: user.name, email: user.email, phone: user.phone || '', status: user.status });
  };

  const handleUpdateUser = async (e, userId) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.put(`/admin/users/${userId}`, editFormData);
      alert('User updated successfully!');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin User Management</h1>
      <button onClick={onLogout}>Logout</button>
      <hr />
       <h2>Create New User</h2>
      <form onSubmit={handleCreateUser}>
        <input name="name" value={newUser.name} onChange={handleNewUserChange} placeholder="Name" required />
        <input name="email" type="email" value={newUser.email} onChange={handleNewUserChange} placeholder="Email" required />
        <input name="phone" value={newUser.phone} onChange={handleNewUserChange} placeholder="Phone" />
        <select name="role" value={newUser.role} onChange={handleNewUserChange}>
          <option value="PARENT">Parent</option>
          <option value="SUPERVISOR">Supervisor</option>
        </select>
        <button type="submit" disabled={isLoading}>Create User</button>
      </form>

      <hr />

      <h2>User List</h2>
      <button onClick={fetchUsers} disabled={isLoading}>Refresh List</button>
      
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <table border="1" style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {editingUser?.id === user.id ? (
                <td colSpan="7">
                  <form onSubmit={(e) => handleUpdateUser(e, user.id)}>
                    <input name="name" value={editFormData.name} onChange={handleEditFormChange} />
                    <input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} />
                    <input name="phone" value={editFormData.phone} onChange={handleEditFormChange} />
                    <select name="status" value={editFormData.status} onChange={handleEditFormChange}>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                  </form>
                </td>
              ) : (
                <>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)} disabled={isLoading}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement; 