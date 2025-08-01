import React, { useState } from 'react';
import { authAPI } from '../services/api';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login with:', { username: formData.username });
      
      const response = await authAPI.login(formData);
      console.log('🔐 Login response:', response);
      
      if (response.success === true) {
        // Call onLogin with user data and token
        onLogin(response.data.user, response.data.token);
      } else {
        setError(response.message || 'خطأ في تسجيل الدخول');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message || 'خطأ في الاتصال بالخادم');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testCredentials = [
    { username: 'abeer', password: 'admin123', role: 'مدير النظام' },
    { username: 'supervisor1', password: 'password123', role: 'مشرف حافلة' },
    { username: 'parent1', password: 'password123', role: 'ولي أمر' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src="/logo.png" alt="شعار المدرسة" />
          </div>
          <h1 className="login-title">حافلات العهد الحديث</h1>
          <p className="login-subtitle">نظام النقل المدرسي الذكي</p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="اسم المستخدم"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول 🚀'}
          </button>
        </form>

        <div className="login-divider">
          بيانات تجريبية للاختبار
        </div>

        <div className="test-credentials">
          <h4>🧪 حسابات الاختبار</h4>
          <div className="test-credential-item">
            <span className="test-credential-label">مدير النظام:</span>
            <span className="test-credential-value">abeer</span>
          </div>
          <div className="test-credential-item">
            <span className="test-credential-label">كلمة المرور:</span>
            <span className="test-credential-value">admin123</span>
          </div>
        </div>

        <div className="system-info">
          نظام إدارة النقل المدرسي الذكي v2.0
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 