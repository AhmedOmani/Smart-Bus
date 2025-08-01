import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
});

const setAuthToken = (token) => {
  if (token) {
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiInstance.defaults.headers.common['Authorization'];
  }
};

// Auth
const login = (username, password) => apiInstance.post('/auth/login', { username, password });
const logout = () => apiInstance.post('/auth/logout');

// Parent
const getMyBus = () => apiInstance.get('/parent/my-bus');

// Admin - Users
const getUsers = (role) => apiInstance.get(`/admin/users${role ? `?role=${role}` : ''}`);
const searchUsers = (role, query) => apiInstance.get(`/admin/users/search?role=${role}&q=${query}`);
const createUser = (userData) => apiInstance.post('/admin/users', userData);
const updateUser = (userId, userData) => apiInstance.patch(`/admin/users/${userId}`, userData);
const deleteUser = (userId) => apiInstance.delete(`/admin/users/${userId}`);

// Admin - Students
const getStudents = () => apiInstance.get('/admin/students');
const createStudent = (studentData) => apiInstance.post('/admin/students', studentData);
const updateStudent = (studentId, studentData) => apiInstance.patch(`/admin/students/${studentId}`, studentData);
const deleteStudent = (studentId) => apiInstance.delete(`/admin/students/${studentId}`);

// Admin - Buses
const getBuses = () => apiInstance.get('/admin/buses');
const createBus = (busData) => apiInstance.post('/admin/buses', busData);
const updateBus = (busId, busData) => apiInstance.patch(`/admin/buses/${busId}`, busData);
const deleteBus = (busId) => apiInstance.delete(`/admin/buses/${busId}`);


const api = {
    setAuthToken,
    login,
    logout,
    getMyBus,
    getUsers,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getBuses,
    createBus,
    updateBus,
    deleteBus,
};

export default api; 