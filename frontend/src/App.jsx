import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Patient Routes */}
            <Route path="/patient" element={
              <PrivateRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </PrivateRoute>
            } />
            
            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <PrivateRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </PrivateRoute>
            } />
            <Route path="/doctor/appointments" element={
              <PrivateRoute allowedRoles={['doctor']}>
                <Appointments />
              </PrivateRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/patients" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Patients />
              </PrivateRoute>
            } />
            <Route path="/admin/doctors" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Doctors />
              </PrivateRoute>
            } />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;