import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const StudentsManager = () => {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsRes, usersRes, busesRes] = await Promise.all([
        adminAPI.getStudents({ search: searchQuery }),
        adminAPI.getUsersBySearch({ role: 'PARENT' }),
        adminAPI.getBuses()
      ]);

      console.log('🚌 Buses API Response:', busesRes);
      console.log('👥 Users API Response:', usersRes);
      console.log('👥 Students API Response:', studentsRes);
      
      setStudents(studentsRes.data?.students || []);
      setUsers(usersRes.data?.users || []);
      setBuses(busesRes.data?.buses || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      try {
        await adminAPI.deleteStudent(studentId);
        loadData();
        alert('تم حذف الطالب بنجاح');
      } catch (error) {
        alert('فشل في حذف الطالب: ' + (error.message || error));
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
    loadData();
  };

  const handleAssignToBus = async (studentId, busId) => {
    try {
      await adminAPI.assignStudentToBus(studentId, busId);
      loadData();
      alert('تم تعيين الطالب للحافلة بنجاح');
    } catch (error) {
      alert('فشل في تعيين الطالب: ' + (error.message || error));
    }
  };

  const handleUnassignFromBus = async (studentId) => {
    if (window.confirm('هل أنت متأكد من إلغاء تعيين الطالب؟')) {
      try {
        await adminAPI.unassignStudentFromBus(studentId);
        loadData();
        alert('تم إلغاء تعيين الطالب بنجاح');
      } catch (error) {
        alert('فشل في إلغاء التعيين: ' + (error.message || error));
      }
    }
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nationalId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getParentName = (parentId) => {
    const parent = users.find(u => u.id === parentId);
    return parent ? parent.name : 'غير محدد';
  };

  const getBusName = (busId) => {
    const bus = buses.find(b => b.id === busId);
    return bus ? `${bus.busNumber} - ${bus.driverName}` : 'غير محدد';
  };

  return (
    <div>
      <div className="header">
        <h1>إدارة الطلاب</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          ➕ إضافة طالب جديد
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="البحث بالاسم، رقم الهوية، أو الصف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">قائمة الطلاب ({filteredStudents.length})</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">جاري تحميل الطلاب...</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>اسم الطالب</th>
                    <th>رقم الهوية</th>
                    <th>الصف</th>
                    <th>ولي الأمر</th>
                    <th>الحافلة</th>
                    <th>عنوان المنزل</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.nationalId}</td>
                      <td>{student.grade}</td>
                      <td>{getParentName(student.parentId)}</td>
                      <td>
                        {student.busId ? (
                          <div>
                            <div>{getBusName(student.busId)}</div>
                            <button 
                              onClick={() => handleUnassignFromBus(student.id)}
                              className="btn btn-danger"
                              style={{ padding: '2px 8px', fontSize: '11px', marginTop: '5px' }}
                            >
                              إلغاء التعيين
                            </button>
                          </div>
                        ) : (
                          <select 
                            onChange={(e) => e.target.value && handleAssignToBus(student.id, e.target.value)}
                            className="form-input"
                            style={{ padding: '5px', fontSize: '12px' }}
                          >
                            <option value="">اختر حافلة</option>
                            {buses.map(bus => (
                              <option key={bus.id} value={bus.id}>
                                {bus.busNumber} - {bus.driverName}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td>
                        {student.homeAddress || 'غير محدد'}
                        {student.homeLatitude && student.homeLongitude && (
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                            📍 {parseFloat(student.homeLatitude).toFixed(4)}, {parseFloat(student.homeLongitude).toFixed(4)}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${student.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                          {student.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            onClick={() => handleEdit(student)}
                            className="btn btn-success"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            ✏️ تعديل
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
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
              
              {filteredStudents.length === 0 && (
                <div className="text-center" style={{ padding: '20px', color: '#666' }}>
                  لا توجد طلاب
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm 
          student={editingStudent}
          parents={users}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

// Student Form Component
const StudentForm = ({ student, parents, onClose }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    nationalId: student?.nationalId || '',
    grade: student?.grade || '',
    parentId: student?.parentId || '',
    homeAddress: student?.homeAddress || '',
    homeLatitude: student?.homeLatitude || '',
    homeLongitude: student?.homeLongitude || '',
    status: student?.status || 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert GPS coordinates to numbers if provided
      const submitData = {
        ...formData,
        homeLatitude: formData.homeLatitude ? parseFloat(formData.homeLatitude) : null,
        homeLongitude: formData.homeLongitude ? parseFloat(formData.homeLongitude) : null,
        homeAddress: formData.homeAddress || null
      };

      // Remove empty strings for optional fields
      if (!submitData.homeAddress) submitData.homeAddress = null;
      if (!submitData.homeLatitude) submitData.homeLatitude = null;
      if (!submitData.homeLongitude) submitData.homeLongitude = null;

      console.log('🎓 Submitting student data:', submitData);

      if (student) {
        await adminAPI.updateStudent(student.id, submitData);
        alert('تم تحديث الطالب بنجاح');
      } else {
        await adminAPI.createStudent(submitData);
        alert('تم إضافة الطالب بنجاح');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting student form:', error);
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
            {student ? 'تعديل الطالب' : 'إضافة طالب جديد'}
          </h3>
        </div>

        <div className="modal-body">
          <form id="student-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">اسم الطالب *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="أدخل اسم الطالب (عربي أو إنجليزي)"
                minLength="3"
                maxLength="100"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">رقم الهوية الوطنية *</label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                className="form-input"
                placeholder="أدخل رقم الهوية الوطنية"
                minLength="8"
                maxLength="12"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">الصف الدراسي *</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">اختر الصف</option>
                <option value="الأول الابتدائي">الأول الابتدائي</option>
                <option value="الثاني الابتدائي">الثاني الابتدائي</option>
                <option value="الثالث الابتدائي">الثالث الابتدائي</option>
                <option value="الرابع الابتدائي">الرابع الابتدائي</option>
                <option value="الخامس الابتدائي">الخامس الابتدائي</option>
                <option value="السادس الابتدائي">السادس الابتدائي</option>
                <option value="الأول المتوسط">الأول المتوسط</option>
                <option value="الثاني المتوسط">الثاني المتوسط</option>
                <option value="الثالث المتوسط">الثالث المتوسط</option>
                <option value="الأول الثانوي">الأول الثانوي</option>
                <option value="الثاني الثانوي">الثاني الثانوي</option>
                <option value="الثالث الثانوي">الثالث الثانوي</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ولي الأمر *</label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">اختر ولي الأمر</option>
                {parents.map(parent => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name} - {parent.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">عنوان المنزل</label>
              <input
                type="text"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleChange}
                className="form-input"
                placeholder="أدخل عنوان المنزل (اختياري)"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">خط العرض (GPS)</label>
                <input
                  type="number"
                  name="homeLatitude"
                  value={formData.homeLatitude}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="24.7136"
                  step="any"
                  min="-90"
                  max="90"
                />
              </div>

              <div className="form-group">
                <label className="form-label">خط الطول (GPS)</label>
                <input
                  type="number"
                  name="homeLongitude"
                  value={formData.homeLongitude}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="46.6753"
                  step="any"
                  min="-180"
                  max="180"
                />
              </div>
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
            form="student-form"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'جاري الحفظ...' : (student ? 'تحديث' : 'إضافة')}
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

export default StudentsManager; 