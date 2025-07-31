import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import ParentDashboard from './components/ParentDashboard';
import { setAuthToken } from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setAuthToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const renderDashboard = () => {
    if (!user) return <LoginPage onLoginSuccess={handleLoginSuccess} />;

    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      case 'SUPERVISOR':
        return <SupervisorDashboard user={user} onLogout={handleLogout} />;
      case 'PARENT':
        return <ParentDashboard user={user} onLogout={handleLogout} />;
      default:
        // Handle unknown role or show an error page
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
}

export default App;
