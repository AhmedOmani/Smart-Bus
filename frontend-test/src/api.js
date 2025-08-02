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
const updateUser = (userId, userData) => apiInstance.put(`/admin/users/${userId}`, userData);
const deleteUser = (userId) => apiInstance.delete(`/admin/users/${userId}`);

// Admin - Students
const getStudents = () => apiInstance.get('/admin/students');
const createStudent = (studentData) => apiInstance.post('/admin/students', studentData);
const updateStudent = (studentId, studentData) => apiInstance.put(`/admin/students/${studentId}`, studentData);
const deleteStudent = (studentId) => apiInstance.delete(`/admin/students/${studentId}`);

// Admin - Buses
const getBuses = () => apiInstance.get('/admin/buses');
const createBus = (busData) => apiInstance.post('/admin/buses', busData);
const updateBus = (busId, busData) => apiInstance.put(`/admin/buses/${busId}`, busData);
const deleteBus = (busId) => apiInstance.delete(`/admin/buses/${busId}`);

// Supervisor
const getSupervisorBus = () => apiInstance.get('/supervisor/mybus');
const saveBusLocation = (locationData) => apiInstance.post('/bus/location', locationData);


// Helper function to extract data from our backend's response format
const extractData = (response) => {
    // Our backend always returns: { success: boolean, message: string, data: {...} }
    return response.data.data;
};

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
    getSupervisorBus,
    saveBusLocation,
    extractData, // Export the helper
};

export default api; 