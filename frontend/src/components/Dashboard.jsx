import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = ({ children, title, subtitle, actions }) => {
  const { user } = useAuth();

  const getDashboardLinks = () => {
    if (!user) return [];
    
    const baseLinks = [
      { name: 'Dashboard', href: `/${user.role}`, icon: ChartBarIcon },
    ];

    if (user.role === 'patient') {
      return [
        ...baseLinks,
        { name: 'Appointments', href: '/patient/appointments', icon: CalendarDaysIcon },
        { name: 'Prescriptions', href: '/patient/prescriptions', icon: DocumentTextIcon },
        { name: 'Billing', href: '/patient/billing', icon: CurrencyDollarIcon },
      ];
    }

    if (user.role === 'doctor') {
      return [
        ...baseLinks,
        { name: 'Schedule', href: '/doctor/schedule', icon: CalendarDaysIcon },
        { name: 'Patients', href: '/doctor/patients', icon: UserGroupIcon },
        { name: 'Prescriptions', href: '/doctor/prescriptions', icon: DocumentTextIcon },
      ];
    }

    if (user.role === 'admin') {
      return [
        ...baseLinks,
        { name: 'Appointments', href: '/admin/appointments', icon: CalendarDaysIcon },
        { name: 'Patients', href: '/admin/patients', icon: UserGroupIcon },
        { name: 'Doctors', href: '/admin/doctors', icon: UserGroupIcon },
        { name: 'Billing', href: '/admin/billing', icon: CurrencyDollarIcon },
        { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
      ];
    }

    return baseLinks;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to={`/${user?.role || ''}`} className="text-xl font-bold text-gray-900">
                  ClinicPro
                </Link>
              </div>
              
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                {getDashboardLinks().map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600"
                  >
                    <link.icon className="h-5 w-5 mr-2" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <QuestionMarkCircleIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <CogIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {children}
      </main>
    </div>
  );
};

export default Dashboard;