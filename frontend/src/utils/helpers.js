import { format, parseISO, differenceInYears, isToday, isPast, isFuture } from 'date-fns';

// Format currency (Tanzanian Shillings)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Format date
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format time
export const formatTime = (time) => {
  if (!time) return 'N/A';
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  } catch (error) {
    return time;
  }
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  try {
    const dob = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
    return differenceInYears(new Date(), dob);
  } catch (error) {
    return null;
  }
};

// Get status badge class
export const getStatusClass = (status) => {
  const statusClasses = {
    'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
    'confirmed': 'bg-green-100 text-green-800 border-green-200',
    'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'completed': 'bg-gray-100 text-gray-800 border-gray-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200',
    'no-show': 'bg-purple-100 text-purple-800 border-purple-200',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'paid': 'bg-green-100 text-green-800 border-green-200',
    'partial': 'bg-blue-100 text-blue-800 border-blue-200',
    'overdue': 'bg-red-100 text-red-800 border-red-200',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Get status icon
export const getStatusIcon = (status) => {
  const icons = {
    'scheduled': '📅',
    'confirmed': '✅',
    'in-progress': '🔄',
    'completed': '🏁',
    'cancelled': '❌',
    'no-show': '👻',
    'pending': '⏳',
    'paid': '💰',
    'partial': '💵',
    'overdue': '⚠️',
  };
  return icons[status] || '📝';
};

// Generate random ID
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number (Tanzanian format)
export const validatePhone = (phone) => {
  const re = /^(\+255|0)[67]\d{8}$/;
  return re.test(phone);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if appointment is upcoming
export const isAppointmentUpcoming = (appointmentDate, appointmentTime) => {
  const now = new Date();
  const appointmentDateTime = new Date(appointmentDate);
  const [hours, minutes] = appointmentTime.split(':');
  appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return isFuture(appointmentDateTime) || (isToday(appointmentDateTime) && appointmentDateTime > now);
};

// Generate time slots
export const generateTimeSlots = (startHour = 8, endHour = 18, interval = 30) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        value: time,
        label: formatTime(time),
      });
    }
  }
  return slots;
};

// Get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// Download file
export const downloadFile = (content, fileName, contentType = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};