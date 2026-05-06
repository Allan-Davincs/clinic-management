import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AppointmentForm = ({ onSuccess, initialData, onCancel }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
    status: 'scheduled',
    ...initialData
  });

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      
      if (initialData?._id) {
        // Update existing appointment
        response = await axios.put(`/api/appointments/${initialData._id}`, formData);
      } else {
        // Create new appointment
        response = await axios.post('/api/appointments', formData);
      }
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      // Reset form if not editing
      if (!initialData?._id) {
        setFormData({
          doctorId: '',
          patientId: '',
          appointmentDate: '',
          appointmentTime: '',
          reason: '',
          notes: '',
          status: 'scheduled'
        });
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 8; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Doctor *
          </label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.fullName} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {/* Patient Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Patient *
          </label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Choose a patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.fullName} - {patient.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Date *
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="input-field"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Time *
          </label>
          <select
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Status (for edit mode) */}
        {initialData?._id && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        )}

        {/* Reason */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Visit *
          </label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            placeholder="e.g., Fever, Headache, Routine Checkup"
            className="input-field"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Any additional information..."
            className="input-field"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : initialData?._id ? 'Update Appointment' : 'Book Appointment'}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;