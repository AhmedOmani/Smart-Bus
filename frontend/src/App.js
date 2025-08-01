import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ParentDashboard from './pages/ParentDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">جاري تحميل النظام...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? 
                <Navigate to={`/${user.role.toLowerCase()}`} replace /> : 
                <LoginPage onLogin={login} />
            } 
          />
          
          <Route 
            path="/admin/*" 
            element={
              user && user.role === 'ADMIN' ? 
                <AdminDashboard user={user} onLogout={logout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/supervisor" 
            element={
              user && user.role === 'SUPERVISOR' ? 
                <SupervisorDashboard user={user} onLogout={logout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/parent" 
            element={
              user && user.role === 'PARENT' ? 
                <ParentDashboard user={user} onLogout={logout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/" 
            element={
              user ? 
                <Navigate to={`/${user.role.toLowerCase()}`} replace /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
