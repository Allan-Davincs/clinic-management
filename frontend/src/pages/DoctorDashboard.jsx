import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  PhoneIcon,
  CalendarIcon,
  EnvelopeIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    try {
      // Fetch doctor's appointments to get patients
      const appointmentsRes = await axios.get('/api/appointments');
      
      // Extract unique patients from appointments
      const patientMap = new Map();
      appointmentsRes.data.forEach(apt => {
        if (apt.patientId && !patientMap.has(apt.patientId._id)) {
          patientMap.set(apt.patientId._id, {
            ...apt.patientId,
            lastVisit: apt.appointmentDate,
            appointmentCount: 1
          });
        } else if (apt.patientId) {
          const patient = patientMap.get(apt.patientId._id);
          patient.appointmentCount += 1;
          if (new Date(apt.appointmentDate) > new Date(patient.lastVisit)) {
            patient.lastVisit = apt.appointmentDate;
          }
        }
      });
      
      const uniquePatients = Array.from(patientMap.values());
      setPatients(uniquePatients);
      setFilteredPatients(uniquePatients);
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
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredPatients(filtered);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Directory</h1>
            <p className="text-gray-600 mt-2">
              {patients.length} patients in your care
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/doctor/appointments/new"
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, phone, or email..."
              className="pl-10 input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select className="input-field">
              <option value="">All Patients</option>
              <option value="recent">Recently Visited</option>
              <option value="frequent">Frequent Patients</option>
              <option value="new">New Patients</option>
            </select>
          </div>

          <button className="btn-secondary flex items-center justify-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-lg">
                  {patient.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{patient.fullName}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <PhoneIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{patient.phone}</span>
                </div>
                {patient.dateOfBirth && (
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{calculateAge(patient.dateOfBirth)} years • {patient.gender}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <EnvelopeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Patient Stats */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-600">Visits</p>
                  <p className="font-semibold text-gray-900">{patient.appointmentCount || 1}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Visit</p>
                  <p className="font-semibold text-gray-900">
                    {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-semibold text-gray-900">
                    {calculateAge(patient.dateOfBirth) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex space-x-2">
              <Link
                to={`/doctor/patients/${patient._id}`}
                className="flex-1 btn-primary text-sm py-2 flex items-center justify-center"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                View Profile
              </Link>
              <Link
                to={`/doctor/appointments/new?patientId=${patient._id}`}
                className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Appointment
              </Link>
            </div>
          </div>
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
    </div>
  );
};

export default DoctorPatients;