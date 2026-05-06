import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserCircleIcon,
  PhoneIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await axios.delete(`/api/doctors/${id}`);
        fetchDoctors();
      } catch (error) {
        console.error('Failed to delete doctor:', error);
      }
    }
  };

  const toggleDoctorStatus = async (id, currentStatus) => {
    try {
      await axios.put(`/api/doctors/${id}`, {
        isActive: !currentStatus
      });
      fetchDoctors();
    } catch (error) {
      console.error('Failed to update doctor status:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-2">
            Manage all doctors in your clinic
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    Dr. {doctor.fullName?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Dr. {doctor.fullName}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {doctor.specialization}
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {doctor.phone}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(doctor._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Fee</p>
                  <p className="font-medium">TZS {doctor.consultationFee?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="font-medium">{doctor.availableSlots?.length || 0} days/week</p>
                </div>
              </div>
            </div>

            {/* Schedule Preview */}
            {doctor.availableSlots && doctor.availableSlots.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Schedule</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableSlots.slice(0, 3).map((slot, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {slot.day.substring(0, 3)} {slot.startTime}
                    </span>
                  ))}
                  {doctor.availableSlots.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                      +{doctor.availableSlots.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Status and Actions */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${doctor.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-sm font-medium ${doctor.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {doctor.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleDoctorStatus(doctor._id, doctor.isActive)}
                  className={`text-sm px-3 py-1 rounded ${
                    doctor.isActive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {doctor.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  View Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedDoctor(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Dr. John Smith"
                      defaultValue={selectedDoctor?.fullName}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="General Physician"
                      defaultValue={selectedDoctor?.specialization}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="MD12345"
                      defaultValue={selectedDoctor?.licenseNumber}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee (TZS) *
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="20000"
                      defaultValue={selectedDoctor?.consultationFee}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="0712345678"
                      defaultValue={selectedDoctor?.phone}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="doctor@clinic.com"
                      defaultValue={selectedDoctor?.email}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Days and Times
                  </label>
                  <div className="space-y-4">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="grid grid-cols-3 gap-4">
                        <select className="input-field">
                          <option value="">Select Day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                        <input type="time" className="input-field" placeholder="Start Time" />
                        <input type="time" className="input-field" placeholder="End Time" />
                      </div>
                    ))}
                    <button type="button" className="text-sm text-primary-600 hover:text-primary-700">
                      + Add another time slot
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedDoctor(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {selectedDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {doctors.length === 0 && (
        <div className="text-center py-12">
          <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding your first doctor to the clinic
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add First Doctor
          </button>
        </div>
      )}
    </div>
  );
};

export default Doctors;