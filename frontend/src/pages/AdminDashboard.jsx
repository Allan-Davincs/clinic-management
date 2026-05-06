import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  UserGroupIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  AcademicCapIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    monthlyGrowth: 0,
    availableDoctors: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, you would have dedicated admin endpoints
      // For now, we'll simulate data
      setStats({
        totalPatients: 1248,
        totalDoctors: 24,
        totalAppointments: 3567,
        totalRevenue: 45890000,
        todayAppointments: 42,
        pendingAppointments: 15,
        monthlyGrowth: 12.5,
        availableDoctors: 18
      });

      // Mock recent appointments
      setRecentAppointments([
        { id: 1, patientName: 'John Doe', doctorName: 'Dr. Sarah Smith', time: '10:30 AM', status: 'completed' },
        { id: 2, patientName: 'Mary Johnson', doctorName: 'Dr. Michael Brown', time: '11:00 AM', status: 'in-progress' },
        { id: 3, patientName: 'Robert Williams', doctorName: 'Dr. Emily Davis', time: '11:30 AM', status: 'scheduled' },
        { id: 4, patientName: 'Jennifer Miller', doctorName: 'Dr. David Wilson', time: '02:00 PM', status: 'confirmed' },
        { id: 5, patientName: 'William Taylor', doctorName: 'Dr. Lisa Anderson', time: '03:30 PM', status: 'scheduled' },
      ]);

      // Mock recent patients
      setRecentPatients([
        { id: 1, name: 'John Doe', registrationDate: '2024-01-15', age: 35, gender: 'Male' },
        { id: 2, name: 'Mary Johnson', registrationDate: '2024-01-14', age: 28, gender: 'Female' },
        { id: 3, name: 'Robert Williams', registrationDate: '2024-01-13', age: 42, gender: 'Male' },
        { id: 4, name: 'Jennifer Miller', registrationDate: '2024-01-12', age: 31, gender: 'Female' },
        { id: 5, name: 'William Taylor', registrationDate: '2024-01-11', age: 55, gender: 'Male' },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart Data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (TZS)',
        data: [3500000, 4200000, 3800000, 5100000, 4800000, 5500000, 5200000, 6000000, 5800000, 6500000, 6200000, 7000000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const appointmentsChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Appointments',
        data: [45, 52, 48, 65, 58, 32],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      }
    ]
  };

  const doctorDistributionData = {
    labels: ['General', 'Pediatrics', 'Dentistry', 'Cardiology', 'Dermatology', 'Others'],
    datasets: [
      {
        data: [6, 4, 3, 2, 2, 7],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ]
      }
    ]
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
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.profile?.fullName || 'Admin'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your clinic today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{stats.monthlyGrowth}% this month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalDoctors}</p>
              <div className="flex items-center mt-2">
                <UsersIcon className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">{stats.availableDoctors} available</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todayAppointments}</p>
              <div className="flex items-center mt-2">
                <ClockIcon className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">{stats.pendingAppointments} pending</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                TZS {stats.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.2% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <Line 
            data={revenueChartData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return 'TZS ' + value.toLocaleString();
                    }
                  }
                }
              }
            }} 
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Distribution</h3>
          <div className="h-64">
            <Pie 
              data={doctorDistributionData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="font-semibold text-gray-600">
                      {appointment.patientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">with {appointment.doctorName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recently Registered Patients</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="font-semibold text-gray-600">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      {patient.age} years • {patient.gender}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Registered</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(patient.registrationDate), 'MMM dd')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="card hover:shadow-lg transition-shadow text-left group">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <DocumentChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">Generate Reports</p>
              <p className="text-sm text-gray-500">Monthly financial reports</p>
            </div>
          </div>
        </button>

        <button className="card hover:shadow-lg transition-shadow text-left group">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">Manage Staff</p>
              <p className="text-sm text-gray-500">Doctors and receptionists</p>
            </div>
          </div>
        </button>

        <button className="card hover:shadow-lg transition-shadow text-left group">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">Billing</p>
              <p className="text-sm text-gray-500">View and manage invoices</p>
            </div>
          </div>
        </button>

        <button className="card hover:shadow-lg transition-shadow text-left group">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">Schedule</p>
              <p className="text-sm text-gray-500">Manage clinic schedule</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;