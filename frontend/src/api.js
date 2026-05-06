import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  getMe: () => api.get('/api/auth/me'),
};

// Appointment APIs
export const appointmentAPI = {
  getAll: (params) => api.get('/api/appointments', { params }),
  getById: (id) => api.get(`/api/appointments/${id}`),
  create: (data) => api.post('/api/appointments', data),
  update: (id, data) => api.put(`/api/appointments/${id}`, data),
  delete: (id) => api.delete(`/api/appointments/${id}`),
  getToday: () => api.get('/api/appointments/today/schedule'),
};

// Patient APIs
export const patientAPI = {
  getAll: () => api.get('/api/patients'),
  getById: (id) => api.get(`/api/patients/${id}`),
  create: (data) => api.post('/api/patients', data),
  update: (id, data) => api.put(`/api/patients/${id}`, data),
  search: (query) => api.get(`/api/patients/search/${query}`),
};

// Doctor APIs
export const doctorAPI = {
  getAll: (params) => api.get('/api/doctors', { params }),
  getById: (id) => api.get(`/api/doctors/${id}`),
  create: (data) => api.post('/api/doctors', data),
  update: (id, data) => api.put(`/api/doctors/${id}`, data),
  delete: (id) => api.delete(`/api/doctors/${id}`),
  getSchedule: (id, date) => api.get(`/api/doctors/${id}/schedule/${date}`),
  getStats: (id) => api.get(`/api/doctors/${id}/stats`),
};

// Prescription APIs
export const prescriptionAPI = {
  getAllByPatient: (patientId) => api.get(`/api/prescriptions/patient/${patientId}`),
  getAllByDoctor: (doctorId) => api.get(`/api/prescriptions/doctor/${doctorId}`),
  getById: (id) => api.get(`/api/prescriptions/${id}`),
  create: (data) => api.post('/api/prescriptions', data),
  update: (id, data) => api.put(`/api/prescriptions/${id}`, data),
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getAppointmentsByMonth: () => api.get('/api/dashboard/appointments/monthly'),
  getRevenueStats: () => api.get('/api/dashboard/revenue'),
};

// File Upload API
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/api/notifications'),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
  delete: (id) => api.delete(`/api/notifications/${id}`),
};

export default api;