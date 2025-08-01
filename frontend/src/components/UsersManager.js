import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers({ search: searchQuery });
      // Backend returns { success: true, data: { users: [...] }, message: "..." }
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await adminAPI.deleteUser(userId);
        loadUsers();
        alert('تم حذف المستخدم بنجاح');
      } catch (error) {
        alert('فشل في حذف المستخدم: ' + (error.message || error));
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
    loadUsers();
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <h1>إدارة المستخدمين</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          ➕ إضافة مستخدم جديد
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="البحث في المستخدمين..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">قائمة المستخدمين ({filteredUsers.length})</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">جاري تحميل المستخدمين...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>اسم المستخدم</th>
                    <th>البريد الإلكتروني</th>
                    <th>الدور</th>
                    <th>الحالة</th>
                    <th>الهاتف</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === 'ADMIN' ? 'badge-danger' : 
                          user.role === 'SUPERVISOR' ? 'badge-warning' : 'badge-success'
                        }`}>
                          {user.role === 'ADMIN' ? 'مدير' : 
                           user.role === 'SUPERVISOR' ? 'مشرف' : 'ولي أمر'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                          {user.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td>{user.phone}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            onClick={() => handleEdit(user)}
                            className="btn btn-success"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            ✏️ تعديل
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            🗑️ حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center" style={{ padding: '20px', color: '#666' }}>
                  لا توجد مستخدمين
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <UserForm 
          user={editingUser}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

// User Form Component
const UserForm = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'PARENT',
    status: user?.status || 'ACTIVE',
    nationalId: user?.nationalId || ''
    // Removed username and password - auto-generated by backend
  });
  const [loading, setLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Update existing user
        const response = await adminAPI.updateUser(user.id, formData);
        alert('تم تحديث المستخدم بنجاح');
        onClose();
      } else {
        // Create new user - backend generates credentials
        const response = await adminAPI.createUser(formData);
        
        // Show generated credentials to admin
        if (response.data?.credentials) {
          setGeneratedCredentials(response.data.credentials);
        } else {
          alert('تم إضافة المستخدم بنجاح');
          onClose();
        }
      }
    } catch (error) {
      alert('خطأ: ' + (error.message || error));
    }
    setLoading(false);
  };

  // If credentials were generated, show them
  if (generatedCredentials) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#27ae60' }}>
            ✅ تم إنشاء المستخدم بنجاح!
          </h3>
          
          <div style={{ 
            background: '#e7f3ff', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '2px solid #3498db'
          }}>
            <h4 style={{ color: '#2980b9', marginBottom: '15px' }}>بيانات الدخول المُولدة:</h4>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>
              <strong>اسم المستخدم:</strong> 
              <span style={{ 
                background: '#fff', 
                padding: '5px 10px', 
                borderRadius: '4px', 
                margin: '0 10px',
                fontFamily: 'monospace',
                color: '#2980b9'
              }}>
                {generatedCredentials.username}
              </span>
            </div>
            <div style={{ fontSize: '18px' }}>
              <strong>كلمة المرور:</strong> 
              <span style={{ 
                background: '#fff', 
                padding: '5px 10px', 
                borderRadius: '4px', 
                margin: '0 10px',
                fontFamily: 'monospace',
                color: '#e74c3c'
              }}>
                {generatedCredentials.password}
              </span>
            </div>
          </div>
          
          <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
            <p style={{ color: '#856404', margin: 0 }}>
              ⚠️ <strong>مهم:</strong> احفظ هذه البيانات الآن! لن يتم عرضها مرة أخرى.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            فهمت، إغلاق
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginBottom: '20px' }}>
          {user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">الاسم الكامل</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">رقم الهوية الوطنية</label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">الدور</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="PARENT">ولي أمر</option>
              <option value="SUPERVISOR">مشرف</option>
              <option value="ADMIN">مدير</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">الحالة</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="ACTIVE">نشط</option>
              <option value="INACTIVE">غير نشط</option>
            </select>
          </div>

          {!user && (
            <div style={{ background: '#e7f3ff', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
              <p style={{ color: '#2980b9', margin: 0, fontSize: '14px' }}>
                ℹ️ <strong>ملاحظة:</strong> سيتم إنشاء اسم المستخدم وكلمة المرور تلقائياً وعرضهما بعد الحفظ
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              إلغاء
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'جاري الحفظ...' : (user ? 'تحديث' : 'إضافة')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersManager; 