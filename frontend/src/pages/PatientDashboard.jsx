import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDaysIcon, ClockIcon, UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    upcoming: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments) => {
    const today = new Date();
    const stats = {
      total: appointments.length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      upcoming: appointments.filter(a => 
        new Date(a.appointmentDate) > today && a.status === 'scheduled'
      ).length
    };
    setStats(stats);
  };

  const upcomingAppointments = appointments
    .filter(a => new Date(a.appointmentDate) >= new Date())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.profile?.fullName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your appointments today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.upcoming}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.scheduled}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
          <button className="btn-primary">Book New Appointment</button>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming appointments</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.appointmentTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {appointment.doctorId?.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.doctorId?.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge status-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Medical History</h3>
          <p className="text-gray-600 text-sm mb-4">
            View your past consultations, prescriptions, and test results.
          </p>
          <button className="btn-secondary w-full">View History</button>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Book Appointment</h3>
          <p className="text-gray-600 text-sm mb-4">
            Schedule a new appointment with your preferred doctor.
          </p>
          <button className="btn-primary w-full">Book Now</button>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Prescriptions</h3>
          <p className="text-gray-600 text-sm mb-4">
            Access and download your current prescriptions.
          </p>
          <button className="btn-secondary w-full">View Prescriptions</button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;