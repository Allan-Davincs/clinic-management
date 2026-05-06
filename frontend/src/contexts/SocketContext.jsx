import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../utils/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token && user) {
      // Connect to socket
      const socketInstance = socketService.connect(token);
      setSocket(socketInstance);

      // Listen for notifications
      socketInstance.on('new-appointment', (data) => {
        addNotification({
          id: Date.now(),
          type: 'appointment',
          title: 'New Appointment',
          message: `New appointment booked with ${data.patientName}`,
          time: new Date().toISOString(),
          read: false
        });
      });

      socketInstance.on('appointment-updated', (data) => {
        addNotification({
          id: Date.now(),
          type: 'appointment',
          title: 'Appointment Updated',
          message: `Appointment status changed to ${data.status}`,
          time: new Date().toISOString(),
          read: false
        });
      });

      // Cleanup on unmount
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token, user]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep only last 50
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const sendNotification = (userId, notification) => {
    if (socket) {
      socket.emit('send-notification', { userId, notification });
    }
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    sendNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};