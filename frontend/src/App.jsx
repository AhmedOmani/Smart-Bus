import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import UserManagement from './components/UserManagement';
import { api, setAuthToken } from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  // Set the token from localStorage on initial load
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('admin_token', newToken);
    setAuthToken(newToken);
    setToken(newToken);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      console.log("Server logout successful");
    } catch (error) {
      console.error("Server logout failed, but proceeding with local logout", error);
    } finally {
      // ALWAYS perform the local logout
      localStorage.removeItem('admin_token');
      setAuthToken(null);
      setToken(null);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Smart Bus - Admin Testing</h1>
      <hr />
      {token ? (
        <UserManagement onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App; 