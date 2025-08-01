import React, { useState, useEffect } from 'react';
import websocketService from '../services/websocket';
import { busAPI } from '../services/api';

const SupervisorDashboard = ({ user, onLogout }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [students, setStudents] = useState([
    { id: '1', name: 'أحمد محمد', status: 'absent' },
    { id: '2', name: 'فاطمة علي', status: 'absent' },
    { id: '3', name: 'سارة خالد', status: 'absent' },
    { id: '4', name: 'محمد أحمد', status: 'absent' }
  ]);
  const [manualLocation, setManualLocation] = useState({
    latitude: '24.7136',
    longitude: '46.6753'
  });
  const [busInfo, setBusInfo] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();
    
    // Listen for connection status
    const checkConnection = () => {
      setIsConnected(websocketService.isConnected());
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    // Load bus info (mock data for testing)
    setBusInfo({
      busNumber: 'BUS-001',
      driverName: 'خالد العتيبي',
      route: 'الرياض - حي النخيل',
      capacity: 30
    });

    return () => {
      clearInterval(interval);
      websocketService.disconnect();
    };
  }, []);

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('الموقع الجغرافي غير مدعوم في هذا المتصفح');
      return;
    }

    setIsTracking(true);
    
    navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
          busId: busInfo?.busNumber || 'BUS-001'
        };
        
        setCurrentLocation(location);
        
        // Send location via WebSocket
        if (websocketService.isConnected()) {
          websocketService.sendLocationUpdate(location);
        }
        
        console.log('📍 Location updated:', location);
      },
      (error) => {
        console.error('Location error:', error);
        alert('فشل في الحصول على الموقع: ' + error.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );
  };

  const stopLocationTracking = () => {
    setIsTracking(false);
    setCurrentLocation(null);
  };

  const sendManualLocation = () => {
    const location = {
      latitude: parseFloat(manualLocation.latitude),
      longitude: parseFloat(manualLocation.longitude),
      timestamp: new Date().toISOString(),
      busId: busInfo?.busNumber || 'BUS-001'
    };
    
    if (websocketService.isConnected()) {
      websocketService.sendLocationUpdate(location);
      setCurrentLocation(location);
      alert('تم إرسال الموقع بنجاح!');
    } else {
      alert('غير متصل بالخادم');
    }
  };

  const updateStudentAttendance = (studentId, status) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));

    // Send attendance update via WebSocket
    const attendanceData = {
      studentId,
      status,
      timestamp: new Date().toISOString(),
      busId: busInfo?.busNumber || 'BUS-001'
    };

    if (websocketService.isConnected()) {
      websocketService.sendAttendanceUpdate(attendanceData);
      console.log('👥 Attendance updated:', attendanceData);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'boarded': return 'badge-success';
      case 'alighted': return 'badge-warning';
      case 'absent': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'boarded': return 'في الحافلة';
      case 'alighted': return 'نزل من الحافلة';
      case 'absent': return 'غائب';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 style={{ color: 'white', marginBottom: '20px' }}>لوحة تحكم المشرف</h2>
        
        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
          <div style={{ fontSize: '14px', marginBottom: '5px' }}>مرحباً</div>
          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
          <div style={{ fontSize: '12px', opacity: '0.8' }}>مشرف الحافلة</div>
        </div>

        {/* WebSocket Status */}
        <div style={{ marginBottom: '20px', padding: '10px', background: isConnected ? '#27ae60' : '#e74c3c', borderRadius: '4px' }}>
          <div style={{ color: 'white', fontSize: '14px', textAlign: 'center' }}>
            {isConnected ? '🔗 متصل' : '❌ غير متصل'}
          </div>
          <div style={{ color: 'white', fontSize: '11px', textAlign: 'center', opacity: '0.8' }}>
            {isConnected ? `Socket: ${websocketService.getSocketId()}` : 'لا يوجد اتصال'}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', width: 'calc(100% - 40px)' }}>
          <button 
            onClick={onLogout}
            className="btn btn-danger"
            style={{ width: '100%' }}
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>لوحة تحكم المشرف</h1>
          <div>
            <span className={`ws-status ${isConnected ? 'ws-connected' : 'ws-disconnected'}`}>
              {isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>

        {/* Bus Info */}
        {busInfo && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">معلومات الحافلة</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2">
                <div><strong>رقم الحافلة:</strong> {busInfo.busNumber}</div>
                <div><strong>السائق:</strong> {busInfo.driverName}</div>
                <div><strong>المسار:</strong> {busInfo.route}</div>
                <div><strong>السعة:</strong> {busInfo.capacity} طالب</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2">
          {/* Location Tracking */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">تتبع الموقع</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button 
                    onClick={startLocationTracking}
                    className="btn btn-success"
                    disabled={isTracking || !isConnected}
                  >
                    🟢 بدء التتبع
                  </button>
                  <button 
                    onClick={stopLocationTracking}
                    className="btn btn-danger"
                    disabled={!isTracking}
                  >
                    🔴 إيقاف التتبع
                  </button>
                </div>
              </div>

              {currentLocation && (
                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                  <div><strong>آخر موقع:</strong></div>
                  <div>خط العرض: {currentLocation.latitude}</div>
                  <div>خط الطول: {currentLocation.longitude}</div>
                  <div>الوقت: {new Date(currentLocation.timestamp).toLocaleString('ar-EG')}</div>
                </div>
              )}

              {/* Manual Location */}
              <h4 style={{ marginBottom: '10px' }}>🧪 إرسال موقع تجريبي</h4>
              <div className="form-group">
                <label className="form-label">خط العرض</label>
                <input
                  type="number"
                  step="any"
                  value={manualLocation.latitude}
                  onChange={(e) => setManualLocation({...manualLocation, latitude: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">خط الطول</label>
                <input
                  type="number"
                  step="any"
                  value={manualLocation.longitude}
                  onChange={(e) => setManualLocation({...manualLocation, longitude: e.target.value})}
                  className="form-input"
                />
              </div>
              <button 
                onClick={sendManualLocation}
                className="btn btn-primary"
                disabled={!isConnected}
              >
                📤 إرسال الموقع
              </button>
            </div>
          </div>

          {/* Student Attendance */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">حضور الطلاب</h3>
            </div>
            <div className="card-body">
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {students.map(student => (
                  <div key={student.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{student.name}</div>
                      <span className={`badge ${getStatusBadgeClass(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => updateStudentAttendance(student.id, 'boarded')}
                        className="btn btn-success"
                        style={{ padding: '5px 8px', fontSize: '11px' }}
                        disabled={!isConnected}
                      >
                        🚌 صعود
                      </button>
                      <button 
                        onClick={() => updateStudentAttendance(student.id, 'alighted')}
                        className="btn btn-warning"
                        style={{ padding: '5px 8px', fontSize: '11px' }}
                        disabled={!isConnected}
                      >
                        🚪 نزول
                      </button>
                      <button 
                        onClick={() => updateStudentAttendance(student.id, 'absent')}
                        className="btn btn-danger"
                        style={{ padding: '5px 8px', fontSize: '11px' }}
                        disabled={!isConnected}
                      >
                        ❌ غائب
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testing Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🧪 معلومات الاختبار</h3>
          </div>
          <div className="card-body">
            <div style={{ background: '#e7f3ff', padding: '15px', borderRadius: '4px' }}>
              <p><strong>اختبار الموقع:</strong> استخدم "بدء التتبع" لتفعيل GPS أو أدخل إحداثيات يدوية للاختبار</p>
              <p><strong>اختبار الحضور:</strong> اضغط على أزرار الحضور لإرسال تحديثات عبر WebSocket</p>
              <p><strong>WebSocket:</strong> تحقق من حالة الاتصال في الشريط الجانبي</p>
              <p><strong>الكونسول:</strong> افتح أدوات المطور لرؤية رسائل WebSocket</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard; 