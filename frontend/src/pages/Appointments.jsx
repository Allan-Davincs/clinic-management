import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import AppointmentForm from '../components/AppointmentForm';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patientId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(appointment =>
        format(new Date(appointment.appointmentDate), 'yyyy-MM-dd') === dateFilter
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`/api/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error('Failed to delete appointment:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedAppointment(null);
    fetchAppointments();
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/appointments/${id}`, { status });
      fetchAppointments();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage all clinic appointments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Appointment
        </button>
      </div>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              <AppointmentForm
                initialData={selectedAppointment}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-10 input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              className="input-field"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('');
            }}
            className="btn-secondary flex items-center justify-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-semibold">
                          {appointment.patientId?.fullName?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {appointment.patientId?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patientId?.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      Dr. {appointment.doctorId?.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.doctorId?.specialization}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.appointmentTime}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {appointment.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.status}
                      onChange={(e) => updateStatus(appointment._id, e.target.value)}
                      className={`status-badge border-0 bg-transparent p-0 ${
                        appointment.status === 'completed' ? 'text-green-800' :
                        appointment.status === 'cancelled' ? 'text-red-800' :
                        appointment.status === 'scheduled' ? 'text-blue-800' :
                        'text-gray-800'
                      }`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found</p>
            {searchTerm || statusFilter !== 'all' || dateFilter ? (
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filter criteria
              </p>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary mt-4"
              >
                Create Your First Appointment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;