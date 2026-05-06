import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔗 Socket connected:', this.socket.id);
      this.isConnected = true;
      this.emit('socket-connected', { timestamp: new Date().toISOString() });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      this.isConnected = false;
    });

    this.socket.on('new-appointment', (data) => {
      console.log('📅 New appointment notification:', data);
      this.triggerEvent('new-appointment', data);
    });

    this.socket.on('appointment-updated', (data) => {
      console.log('📅 Appointment updated:', data);
      this.triggerEvent('appointment-updated', data);
    });

    this.socket.on('prescription-created', (data) => {
      console.log('💊 New prescription created:', data);
      this.triggerEvent('prescription-created', data);
    });
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Also listen via socket if connected
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  triggerEvent(event, data) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  getSocketId() {
    return this.socket?.id;
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;