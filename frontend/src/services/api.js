import axios from 'axios';

// API base configuration
const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Backend uses successResponse wrapper, so return the response as-is
    // The response.data will contain { success: true, data: {...}, message: "..." }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Users CRUD - updated to match backend endpoints
  getUsers: (params) => api.get('/admin/users', { params }),
  getUsersBySearch: (params) => api.get('/admin/users/search', { params }),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Students CRUD
  getStudents: (params) => api.get('/admin/students', { params }),
  createStudent: (studentData) => api.post('/admin/students', studentData),
  updateStudent: (id, studentData) => api.put(`/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  
  // Buses CRUD
  getBuses: () => api.get('/admin/buses'),
  createBus: (busData) => api.post('/admin/buses', busData),
  updateBus: (id, busData) => api.put(`/admin/buses/${id}`, busData),
  deleteBus: (id) => api.delete(`/admin/buses/${id}`),
  
  // Supervisors
  getSupervisors: () => api.get('/admin/supervisors'),
};

// Parent API
export const parentAPI = {
  getDashboard: () => api.get('/parent/dashboard'),
  getChildren: () => api.get('/parent/children'),
  getBusLocation: (busId) => api.get(`/parent/bus-location/${busId}`),
};

// Bus API (for supervisors)
export const busAPI = {
  saveLocation: (locationData) => api.post('/bus/save-location', locationData),
  getLocationHistory: (busId, params) => api.get(`/bus/location-history/${busId}`, { params }),
  getCurrentLocation: (busId) => api.get(`/bus/current-location/${busId}`),
};

export default api; 