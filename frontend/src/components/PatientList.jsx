import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  PhoneIcon,
  CalendarIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPatient, setShowNewPatient] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredPatients(filtered);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
          <p className="text-gray-600 mt-1">
            Total {patients.length} registered patients
          </p>
        </div>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowNewPatient(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Patient
          </button>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Link
            key={patient._id}
            to={`/patient/${patient._id}`}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {patient.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{patient.fullName}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <PhoneIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{patient.phone}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  {patient.dateOfBirth ? (
                    <span>{calculateAge(patient.dateOfBirth)} years • {patient.gender}</span>
                  ) : (
                    <span>{patient.gender}</span>
                  )}
                </div>
                {patient.email && (
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <EnvelopeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {patient.bloodGroup && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {patient.bloodGroup}
                  </span>
                )}
                {patient.allergies?.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Allergies: {patient.allergies.length}
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  ID: {patient._id.toString().substring(18, 24)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm mt-3">
                <div className="text-gray-600">Registered:</div>
                <div className="font-medium">
                  {patient.registeredAt ? format(new Date(patient.registeredAt), 'MMM dd, yyyy') : 'N/A'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle quick appointment
                }}
                className="flex-1 btn-primary py-2 text-sm"
              >
                Book Appointment
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle view details
                }}
                className="flex-1 btn-secondary py-2 text-sm"
              >
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No patients found</p>
          {searchTerm && (
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search terms
            </p>
          )}
        </div>
      )}

      {/* New Patient Modal (simplified version) */}
      {showNewPatient && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Register New Patient</h3>
                <button
                  onClick={() => setShowNewPatient(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="0712345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowNewPatient(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button className="btn-primary">
                    Register Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;