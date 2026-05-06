// Application constants
export const APP_NAME = 'ClinicPro';
export const APP_VERSION = '1.0.0';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// User roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

// Appointment statuses
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  MOBILE_MONEY: 'mobile-money',
  CARD: 'card',
  INSURANCE: 'insurance',
};

// Days of week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Blood groups
export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

// Genders
export const GENDERS = [
  'Male',
  'Female',
  'Other',
];

// Specializations
export const SPECIALIZATIONS = [
  'General Physician',
  'Pediatrician',
  'Dentist',
  'Dermatologist',
  'Cardiologist',
  'Neurologist',
  'Orthopedist',
  'Gynecologist',
  'Psychiatrist',
  'Surgeon',
  'Ophthalmologist',
  'ENT Specialist',
  'Urologist',
  'Endocrinologist',
  'Radiologist',
  'Anesthesiologist',
  'Pathologist',
];

// Common medications
export const COMMON_MEDICATIONS = [
  'Paracetamol 500mg',
  'Ibuprofen 400mg',
  'Amoxicillin 500mg',
  'Azithromycin 500mg',
  'Metformin 500mg',
  'Amlodipine 5mg',
  'Losartan 50mg',
  'Atorvastatin 20mg',
  'Omeprazole 20mg',
  'Cetirizine 10mg',
  'Salbutamol Inhaler',
  'Insulin Glargine',
  'Levothyroxine 50mcg',
  'Warfarin 5mg',
  'Aspirin 75mg',
];

// Common lab tests
export const COMMON_LAB_TESTS = [
  'Complete Blood Count (CBC)',
  'Blood Sugar Fasting',
  'Lipid Profile',
  'Liver Function Test',
  'Kidney Function Test',
  'Thyroid Function Test',
  'Urine Analysis',
  'Stool Analysis',
  'Malaria Test',
  'Typhoid Test',
  'HIV Test',
  'Hepatitis B Test',
  'Hepatitis C Test',
  'X-Ray Chest',
  'Ultrasound Abdomen',
  'ECG',
  'Echocardiogram',
];

// Time slots for appointments
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00',
];

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PATIENT_DASHBOARD: '/patient',
  DOCTOR_DASHBOARD: '/doctor',
  ADMIN_DASHBOARD: '/admin',
  APPOINTMENTS: '/appointments',
  PATIENTS: '/patients',
  DOCTORS: '/doctors',
  PRESCRIPTIONS: '/prescriptions',
  BILLING: '/billing',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#10b981',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE: 1,
};

// Export constants object
export default {
  APP_NAME,
  APP_VERSION,
  API_URL,
  USER_ROLES,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  DAYS_OF_WEEK,
  BLOOD_GROUPS,
  GENDERS,
  SPECIALIZATIONS,
  COMMON_MEDICATIONS,
  COMMON_LAB_TESTS,
  TIME_SLOTS,
  ROUTES,
  STORAGE_KEYS,
  CHART_COLORS,
  PAGINATION_DEFAULTS,
};