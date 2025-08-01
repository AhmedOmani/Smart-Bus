import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('token');
    
    this.socket = io('http://localhost:3001', {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🔗 WebSocket Connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 WebSocket Connection Error:', error);
    });

    // Handle location updates
    this.socket.on('location-update', (data) => {
      console.log('📍 Location Update:', data);
      this.emit('location-update', data);
    });

    // Handle student attendance updates
    this.socket.on('student-attendance', (data) => {
      console.log('👥 Student Attendance:', data);
      this.emit('student-attendance', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscribe to events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Unsubscribe from events
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit events to listeners
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Send location update (for supervisors)
  sendLocationUpdate(locationData) {
    if (this.socket?.connected) {
      this.socket.emit('location-update', locationData);
      console.log('📤 Sending location:', locationData);
    }
  }

  // Send student attendance update (for supervisors)
  sendAttendanceUpdate(attendanceData) {
    if (this.socket?.connected) {
      this.socket.emit('student-attendance', attendanceData);
      console.log('📤 Sending attendance:', attendanceData);
    }
  }

  // Subscribe to bus location updates (for parents)
  subscribeToBusLocation(busId) {
    if (this.socket?.connected) {
      this.socket.emit('subscribe-bus-location', { busId });
      console.log('🔔 Subscribed to bus:', busId);
    }
  }

  // Unsubscribe from bus location updates
  unsubscribeFromBusLocation(busId) {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe-bus-location', { busId });
      console.log('🔕 Unsubscribed from bus:', busId);
    }
  }

  // Get connection status
  isConnected() {
    return this.socket?.connected || false;
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id || null;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 