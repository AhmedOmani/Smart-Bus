import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import UsersManager from '../components/UsersManager';
import StudentsManager from '../components/StudentsManager';
import BusesManager from '../components/BusesManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalBuses: 0,
    activeBuses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Manage body scroll when sidebar is open/closed
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      console.log('📊 Dashboard data:', response);
      
      if (response.data?.success) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    setLoading(false);
  };

  const toggleSidebar = () => {
    console.log('🍔 Hamburger clicked! Current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
    console.log('🍔 New state will be:', !sidebarOpen);
  };

  const closeSidebar = () => {
    console.log('❌ Closing sidebar');
    setSidebarOpen(false);
  };

  const handleTabChange = (tab) => {
    console.log('📱 Tab changed to:', tab);
    setActiveTab(tab);
    closeSidebar(); // Close sidebar when selecting a tab on mobile
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/';
  };

  const navigationItems = [
    { 
      key: 'dashboard', 
      label: 'لوحة التحكم', 
      icon: '📊',
      description: 'نظرة عامة على النظام'
    },
    { 
      key: 'users', 
      label: 'إدارة المستخدمين', 
      icon: '👥',
      description: 'إضافة وتعديل المستخدمين'
    },
    { 
      key: 'students', 
      label: 'إدارة الطلاب', 
      icon: '🎓',
      description: 'إدارة بيانات الطلاب'
    },
    { 
      key: 'buses', 
      label: 'إدارة الحافلات', 
      icon: '🚌',
      description: 'إدارة أسطول الحافلات'
    }
  ];

  // Elite Stat Card Component
  const StatCard = ({ icon, value, label, trend, trendValue }) => (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`stat-trend ${trend}`}>
          <span className="stat-trend-icon">
            {trend === 'positive' ? '📈' : '📉'}
          </span>
          {trendValue}
        </div>
      )}
    </div>
  );

  // Elite Quick Action Card Component
  const QuickActionCard = ({ icon, title, description, onClick }) => (
    <div className="quick-action-card" onClick={onClick}>
      <div className="quick-action-icon">{icon}</div>
      <h4 className="quick-action-title">{title}</h4>
      <p className="quick-action-description">{description}</p>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* Mobile Hamburger Button */}
      <button 
        className={`mobile-menu-button ${sidebarOpen ? 'sidebar-open' : ''}`}
        onClick={toggleSidebar}
        aria-label="فتح القائمة"
      >
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Elite Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <img src="/logo.png" alt="شعار المدرسة" />
            </div>
            <div className="sidebar-logo-text">
              <div className="sidebar-logo-title">حافلات العهد الحديث</div>
              <div className="sidebar-logo-subtitle">نظام النقل الذكي</div>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            className="sidebar-close-button"
            onClick={closeSidebar}
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          {navigationItems.map(item => (
            <div key={item.key} className="sidebar-nav-item">
              <a
                href="#"
                className={`sidebar-nav-link ${activeTab === item.key ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(item.key);
                }}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <div className="sidebar-nav-content">
                  <div className="sidebar-nav-label">{item.label}</div>
                  <div className="sidebar-nav-description">{item.description}</div>
                </div>
              </a>
            </div>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">
              م
            </div>
            <div className="admin-info">
              <h4>مشرف النظام</h4>
              <p>Super Admin</p>
            </div>
            <button 
              className="logout-button"
              onClick={handleLogout}
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            {/* Page Header */}
            <div className="page-header">
              <h1 className="page-title">لوحة التحكم الرئيسية</h1>
              <p className="page-subtitle">مرحباً بك في نظام إدارة النقل المدرسي الذكي</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard 
                icon="👥" 
                value={dashboardStats.totalUsers || 0}
                label="إجمالي المستخدمين"
                trend="positive"
                trendValue="12%+"
              />
              <StatCard 
                icon="👨‍🎓" 
                value={dashboardStats.totalStudents || 0}
                label="إجمالي الطلاب"
                trend="positive"
                trendValue="8%+"
              />
              <StatCard 
                icon="🚌" 
                value={dashboardStats.totalBuses || 0}
                label="إجمالي الحافلات"
                trend="neutral"
                trendValue="مستقر"
              />
              <StatCard 
                icon="✅" 
                value={dashboardStats.activeTrips || 0}
                label="الرحلات النشطة"
                trend="positive"
                trendValue="5%+"
              />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>⚡ الإجراءات السريعة</h3>
              <div className="quick-actions-grid">
                <QuickActionCard
                  icon="📊"
                  title="التقارير والإحصائيات"
                  description="عرض تقارير مفصلة"
                  onClick={() => handleTabChange('reports')}
                />
                <QuickActionCard
                  icon="🚌"
                  title="تسجيل طلب جديد"
                  description="إضافة طلب في النظام"
                  onClick={() => handleTabChange('buses')}
                />
                <QuickActionCard
                  icon="👨‍🎓"
                  title="إضافة مستخدم جديد"
                  description="إنشاء حساب جديد للنظام"
                  onClick={() => handleTabChange('users')}
                />
                <QuickActionCard
                  icon="👤"
                  title="إضافة مستخدم جديد"
                  description="إنشاء حساب جديد للنظام"
                  onClick={() => handleTabChange('users')}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  🕐 النشاط الأخير
                </h2>
              </div>
              <div className="card-body">
                <div className="activity-timeline">
                  <div className="activity-item">
                    <div className="activity-icon activity-icon-success">✅</div>
                    <div className="activity-content">
                      <div className="activity-title">تم إضافة طالب جديد</div>
                      <div className="activity-description">أحمد محمد تم تسجيله في الصف الثالث</div>
                      <div className="activity-time">منذ 5 دقائق</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon activity-icon-warning">🚌</div>
                    <div className="activity-content">
                      <div className="activity-title">تحديث حالة الحافلة</div>
                      <div className="activity-description">الحافلة رقم 7 تم تحديث مسارها</div>
                      <div className="activity-time">منذ 15 دقيقة</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon activity-icon-primary">👤</div>
                    <div className="activity-content">
                      <div className="activity-title">مستخدم جديد</div>
                      <div className="activity-description">سارة أحمد انضمت كولي أمر</div>
                      <div className="activity-time">منذ ساعة</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="management-content">
            <div className="page-header">
              <h1 className="page-title">إدارة المستخدمين</h1>
              <p className="page-subtitle">إضافة وتعديل وحذف المستخدمين</p>
            </div>
            <UsersManager />
          </div>
        )}

        {activeTab === 'students' && (
          <div className="management-content">
            <div className="page-header">
              <h1 className="page-title">إدارة الطلاب</h1>
              <p className="page-subtitle">إدارة بيانات الطلاب وتعيين الحافلات</p>
            </div>
            <StudentsManager />
          </div>
        )}

        {activeTab === 'buses' && (
          <div className="management-content">
            <div className="page-header">
              <h1 className="page-title">إدارة الحافلات</h1>
              <p className="page-subtitle">إدارة أسطول الحافلات والمشرفين</p>
            </div>
            <BusesManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 