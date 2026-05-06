import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const DoctorSchedule = ({ doctorId }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, [currentWeek, doctorId]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      
      // Get start and end of week
      const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
      const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
      
      // Fetch appointments for each day of the week
      const days = eachDayOfInterval({ start, end });
      const scheduleData = {};
      
      for (const day of days) {
        const dateStr = format(day, 'yyyy-MM-dd');
        const response = await axios.get(`/api/doctors/${doctorId}/schedule/${dateStr}`);
        scheduleData[dateStr] = response.data;
      }
      
      setSchedule(scheduleData);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  });

  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  const getAppointmentsForTime = (date, time) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayAppointments = schedule[dateStr] || [];
    return dayAppointments.filter(appt => appt.appointmentTime === time);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd')} - 
            {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
          </h2>
          
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        
        <button
          onClick={goToToday}
          className="btn-secondary flex items-center"
        >
          <CalendarIcon className="h-5 w-5 mr-2" />
          Today
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full border border-gray-200 rounded-lg">
          {/* Header - Days of Week */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 border-r border-gray-200">
              <div className="text-sm font-medium text-gray-500">Time</div>
            </div>
            {daysOfWeek.map((day, index) => (
              <div key={index} className="p-4 border-r border-gray-200 last:border-r-0">
                <div className="text-sm font-medium text-gray-900">
                  {format(day, 'EEE')}
                </div>
                <div className="text-sm text-gray-500">
                  {format(day, 'MMM dd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="divide-y divide-gray-200">
            {timeSlots.map((time, timeIndex) => (
              <div key={timeIndex} className="grid grid-cols-8 hover:bg-gray-50">
                {/* Time Column */}
                <div className="p-3 border-r border-gray-200 flex items-center">
                  <div className="text-sm font-medium text-gray-900">{time}</div>
                </div>
                
                {/* Day Columns */}
                {daysOfWeek.map((day, dayIndex) => {
                  const appointments = getAppointmentsForTime(day, time);
                  return (
                    <div key={dayIndex} className="p-3 border-r border-gray-200 last:border-r-0 min-h-[80px]">
                      {appointments.map((appointment, apptIndex) => (
                        <div
                          key={apptIndex}
                          className={`p-2 rounded-lg mb-2 ${getStatusColor(appointment.status)}`}
                        >
                          <div className="flex items-center">
                            <UserCircleIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium truncate">
                              {appointment.patientId?.fullName?.split(' ')[0]}
                            </span>
                          </div>
                          <div className="text-xs mt-1 truncate">
                            {appointment.reason}
                          </div>
                          <div className="text-xs mt-1 flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {appointment.duration || '30 min'}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-400 mr-2"></div>
          <span className="text-sm text-gray-600">Scheduled</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
          <span className="text-sm text-gray-600">Confirmed</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
          <span className="text-sm text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
          <span className="text-sm text-gray-600">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-400 mr-2"></div>
          <span className="text-sm text-gray-600">Cancelled</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.values(schedule).flat().length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Slots</p>
              <p className="text-2xl font-semibold text-gray-900">
                {timeSlots.length * 7 - Object.values(schedule).flat().length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCircleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Patients</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;