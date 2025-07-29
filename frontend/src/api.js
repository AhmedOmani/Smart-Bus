import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
});

// Function to set the auth token for all subsequent requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}; 