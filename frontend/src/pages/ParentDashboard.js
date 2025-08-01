import React, { useState, useEffect } from 'react';
import websocketService from '../services/websocket';
import { parentAPI } from '../services/api';

const ParentDashboard = ({ user, onLogout }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [children, setChildren] = useState([
    {
      id: '1',
      name: 'أحمد محمد',
      grade: 'الصف الخامس',
      busId: 'BUS-001',
      busNumber: 'حافلة 001',
      driverName: 'خالد العتيبي',
      pickupLocation: 'حي النخيل - الشارع الرئيسي',
      status: 'absent'
    }
  ]);
  const [busLocation, setBusLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [attendanceUpdates, setAttendanceUpdates] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();
    
    // Listen for connection status
    const checkConnection = () => {
      setIsConnected(websocketService.isConnected());
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    // Subscribe to bus location updates
    if (children.length > 0) {
      websocketService.subscribeToBusLocation(children[0].busId);
    }

    // Listen for location updates
    const handleLocationUpdate = (data) => {
      console.log('📍 Parent received location:', data);
      setBusLocation(data);
      setLastUpdate(new Date());
      
      // Add to history
      setLocationHistory(prev => [
        ...prev.slice(-9), // Keep last 10 items
        {
          ...data,
          receivedAt: new Date()
        }
      ]);
    };

    // Listen for attendance updates
    const handleAttendanceUpdate = (data) => {
      console.log('👥 Parent received attendance:', data);
      
      // Update child status
      setChildren(prev => prev.map(child => 
        child.id === data.studentId ? { ...child, status: data.status } : child
      ));
      
      // Add to attendance history
      setAttendanceUpdates(prev => [
        ...prev.slice(-9), // Keep last 10 items
        {
          ...data,
          receivedAt: new Date()
        }
      ]);
    };

    websocketService.on('location-update', handleLocationUpdate);
    websocketService.on('student-attendance', handleAttendanceUpdate);

    return () => {
      clearInterval(interval);
      websocketService.off('location-update', handleLocationUpdate);
      websocketService.off('student-attendance', handleAttendanceUpdate);
      
      if (children.length > 0) {
        websocketService.unsubscribeFromBusLocation(children[0].busId);
      }
      
      websocketService.disconnect();
    };
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 'boarded': return 'في الحافلة';
      case 'alighted': return 'وصل بأمان';
      case 'absent': return 'لم يصعد بعد';
      default: return 'غير محدد';
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

  const refreshBusLocation = () => {
    if (children.length > 0) {
      // Simulate requesting current location
      console.log('🔄 Requesting bus location for:', children[0].busId);
      alert('تم طلب الموقع الحالي للحافلة');
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 style={{ color: 'white', marginBottom: '20px' }}>لوحة تحكم ولي الأمر</h2>
        
        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
          <div style={{ fontSize: '14px', marginBottom: '5px' }}>مرحباً</div>
          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
          <div style={{ fontSize: '12px', opacity: '0.8' }}>ولي أمر</div>
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

        {/* Subscription Status */}
        <div style={{ marginBottom: '20px', padding: '10px', background: 'rgba(52, 152, 219, 0.2)', borderRadius: '4px' }}>
          <div style={{ color: '#2980b9', fontSize: '12px', textAlign: 'center' }}>
            🔔 مشترك في حافلة: {children[0]?.busId}
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
          <h1>لوحة تحكم ولي الأمر</h1>
          <div>
            <span className={`ws-status ${isConnected ? 'ws-connected' : 'ws-disconnected'}`}>
              {isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2">
          {/* Children Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">معلومات الأطفال</h3>
            </div>
            <div className="card-body">
              {children.map(child => (
                <div key={child.id} style={{ 
                  padding: '15px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4>{child.name}</h4>
                    <span className={`badge ${getStatusBadgeClass(child.status)}`}>
                      {getStatusText(child.status)}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <div><strong>الصف:</strong> {child.grade}</div>
                    <div><strong>الحافلة:</strong> {child.busNumber}</div>
                    <div><strong>السائق:</strong> {child.driverName}</div>
                    <div><strong>نقطة الانتظار:</strong> {child.pickupLocation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bus Location */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">موقع الحافلة</h3>
              <button 
                onClick={refreshBusLocation}
                className="btn btn-primary"
                style={{ padding: '5px 10px', fontSize: '12px' }}
                disabled={!isConnected}
              >
                🔄 تحديث
              </button>
            </div>
            <div className="card-body">
              {busLocation ? (
                <div style={{ background: '#d4edda', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                  <h4 style={{ color: '#155724', marginBottom: '10px' }}>📍 آخر موقع مستلم</h4>
                  <div style={{ fontSize: '14px', color: '#155724' }}>
                    <div><strong>خط العرض:</strong> {busLocation.latitude}</div>
                    <div><strong>خط الطول:</strong> {busLocation.longitude}</div>
                    <div><strong>وقت الإرسال:</strong> {new Date(busLocation.timestamp).toLocaleString('ar-EG')}</div>
                    <div><strong>وقت الاستلام:</strong> {lastUpdate?.toLocaleString('ar-EG')}</div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '4px', color: '#721c24', textAlign: 'center' }}>
                  لم يتم استلام موقع الحافلة بعد
                </div>
              )}

              {/* Location History */}
              <h4 style={{ marginBottom: '10px' }}>📊 سجل المواقع</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {locationHistory.length > 0 ? locationHistory.map((loc, index) => (
                  <div key={index} style={{ 
                    padding: '8px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '5px',
                    fontSize: '12px'
                  }}>
                    <div>{loc.latitude}, {loc.longitude}</div>
                    <div style={{ color: '#666' }}>{new Date(loc.timestamp).toLocaleTimeString('ar-EG')}</div>
                  </div>
                )) : (
                  <div style={{ color: '#666', textAlign: 'center', padding: '10px' }}>
                    لا توجد مواقع مسجلة
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Updates */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">تحديثات الحضور</h3>
          </div>
          <div className="card-body">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {attendanceUpdates.length > 0 ? attendanceUpdates.map((update, index) => (
                <div key={index} style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  background: '#f8f9fa',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      الطالب #{update.studentId}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(update.timestamp).toLocaleString('ar-EG')}
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(update.status)}`}>
                    {getStatusText(update.status)}
                  </span>
                </div>
              )) : (
                <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                  لا توجد تحديثات حضور
                </div>
              )}
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
              <p><strong>استقبال المواقع:</strong> سيتم عرض مواقع الحافلة هنا عند إرسالها من المشرف</p>
              <p><strong>تحديثات الحضور:</strong> سيتم عرض تحديثات حضور الأطفال في الوقت الفعلي</p>
              <p><strong>WebSocket:</strong> يجب أن يكون الاتصال نشطاً لاستقبال التحديثات</p>
              <p><strong>اختبار:</strong> استخدم لوحة تحكم المشرف لإرسال مواقع وتحديثات الحضور</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard; 