import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const BusesManager = () => {
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('🚌 Loading buses data...');
      const [busesRes, usersRes] = await Promise.all([
        adminAPI.getBuses({ search: searchQuery }),
        adminAPI.getUsersBySearch({ role: 'SUPERVISOR' })
      ]);
      
      console.log('🚌 Buses API Response:', busesRes);
      console.log('👥 Users API Response:', usersRes);
      
      // Backend returns { success: true, data: { buses: [...] }, message: "..." }
      setBuses(busesRes.data?.buses || []);
      setUsers(usersRes.data?.users || []);
      
      console.log('🚌 Final buses state:', busesRes.data?.buses);
    } catch (error) {
      console.error('❌ Error loading data:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (busId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الحافلة؟')) {
      try {
        await adminAPI.deleteBus(busId);
        loadData();
        alert('تم حذف الحافلة بنجاح');
      } catch (error) {
        alert('فشل في حذف الحافلة: ' + (error.message || error));
      }
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBus(null);
    loadData();
  };

  const filteredBuses = buses.filter(bus => 
    bus.busNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSupervisorName = (supervisorId) => {
    const supervisor = users.find(u => u.id === supervisorId);
    return supervisor ? supervisor.name : 'غير محدد';
  };

  return (
    <div>
      <div className="header">
        <h1>إدارة الحافلات</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          ➕ إضافة حافلة جديدة
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="البحث في الحافلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buses Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">قائمة الحافلات ({filteredBuses.length})</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">جاري تحميل الحافلات...</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>رقم الحافلة</th>
                    <th>رقم اللوحة</th>
                    <th>اسم السائق</th>
                    <th>هاتف السائق</th>
                    <th>المشرف</th>
                    <th>السعة</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuses.map(bus => (
                    <tr key={bus.id}>
                      <td>{bus.busNumber}</td>
                      <td>{bus.licensePlate}</td>
                      <td>{bus.driverName}</td>
                      <td>{bus.driverPhone}</td>
                      <td>{getSupervisorName(bus.supervisorId)}</td>
                      <td>{bus.capacity}</td>
                      <td>
                        <span className={`badge ${bus.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                          {bus.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            onClick={() => handleEdit(bus)}
                            className="btn btn-success"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            ✏️ تعديل
                          </button>
                          <button 
                            onClick={() => handleDelete(bus.id)}
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
              
              {filteredBuses.length === 0 && (
                <div className="text-center" style={{ padding: '20px', color: '#666' }}>
                  لا توجد حافلات
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bus Form Modal */}
      {showForm && (
        <BusForm 
          bus={editingBus}
          supervisors={users}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

// Bus Form Component
const BusForm = ({ bus, supervisors, onClose }) => {
  const [formData, setFormData] = useState({
    busNumber: bus?.busNumber || '',
    licensePlate: bus?.licensePlate || '',
    driverName: bus?.driverName || '',
    driverPhone: bus?.driverPhone || '',
    supervisorId: bus?.supervisorId || '',
    capacity: bus?.capacity || '',
    model: bus?.model || '',
    year: bus?.year || '',
    status: bus?.status || 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert string values to numbers for validation
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        year: formData.year ? parseInt(formData.year) : undefined
      };
      
      if (bus) {
        await adminAPI.updateBus(bus.id, submitData);
        alert('تم تحديث الحافلة بنجاح');
      } else {
        await adminAPI.createBus(submitData);
        alert('تم إضافة الحافلة بنجاح');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting bus form:', error);
      alert('خطأ: ' + (error.message || error));
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {bus ? 'تعديل الحافلة' : 'إضافة حافلة جديدة'}
          </h3>
        </div>

        <div className="modal-body">
          <form id="bus-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">رقم الحافلة</label>
              <input
                type="text"
                name="busNumber"
                value={formData.busNumber}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">رقم اللوحة</label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">اسم السائق</label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">هاتف السائق</label>
              <input
                type="tel"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">المشرف</label>
              <select
                name="supervisorId"
                value={formData.supervisorId}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">اختر المشرف</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">السعة</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="form-input"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">الموديل</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">سنة الصنع</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-input"
                min="1990"
                max="2030"
                required
              />
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
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="submit"
            form="bus-form"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'جاري الحفظ...' : (bus ? 'تحديث' : 'إضافة')}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusesManager; 