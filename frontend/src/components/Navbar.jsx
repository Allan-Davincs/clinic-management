import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  UserIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return `/${user.role}`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">+</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ClinicPro</span>
            </Link>
            
            {user && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                
                {user.role === 'patient' && (
                  <Link
                    to="/patient"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <CalendarIcon className="h-5 w-5" />
                    <span>My Appointments</span>
                  </Link>
                )}
                
                {user.role === 'doctor' && (
                  <Link
                    to="/doctor/appointments"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <UserGroupIcon className="h-5 w-5" />
                    <span>My Schedule</span>
                  </Link>
                )}
                
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/patients"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                    >
                      <UserGroupIcon className="h-5 w-5" />
                      <span>Patients</span>
                    </Link>
                    <Link
                      to="/admin/doctors"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Doctors</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center">
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {user.profile?.fullName?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:inline text-gray-700 font-medium">
                    {user.profile?.fullName || user.email}
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-semibold">{user.profile?.fullName || user.email}</div>
                        <div className="text-gray-500 capitalize">{user.role}</div>
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;