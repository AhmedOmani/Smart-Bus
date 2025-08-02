import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import ParentDashboard from './components/ParentDashboard';
import Layout from './components/Layout'; // Import the new Layout
import api from './api';

const ProtectedRoute = ({ user, onLogout, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout user={user} onLogout={onLogout}>{children}</Layout>;
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.setAuthToken(storedToken);
    }
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    api.setAuthToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = async () => {
    try {
      await api.logout(); // Call the logout API endpoint
    } catch (error) {
      console.error('Logout failed', error);
      // Even if API fails, force logout on the client
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('user');
      api.setAuthToken(null);
      setToken(null);
      setUser(null);
    }
  };

  const getDashboardForRole = () => {
    if (!user) return <Navigate to="/login" />;
    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard user={user} />;
      case 'SUPERVISOR':
        return <SupervisorDashboard user={user} />;
      case 'PARENT':
        return <ParentDashboard user={user} />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/" element={
        <ProtectedRoute user={user} onLogout={handleLogout}>
          {getDashboardForRole()}
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
