// Patient form validation
export const validatePatientForm = (data) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^(\+255|0)[67]\d{8}$/.test(data.phone)) {
    errors.phone = 'Please enter a valid Tanzanian phone number';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    if (dob > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }
  }

  if (!data.gender) {
    errors.gender = 'Gender is required';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return errors;
};

// Appointment form validation
export const validateAppointmentForm = (data) => {
  const errors = {};

  if (!data.doctorId) {
    errors.doctorId = 'Please select a doctor';
  }

  if (!data.patientId) {
    errors.patientId = 'Please select a patient';
  }

  if (!data.appointmentDate) {
    errors.appointmentDate = 'Please select a date';
  } else {
    const selectedDate = new Date(data.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.appointmentDate = 'Cannot schedule appointments in the past';
    }
  }

  if (!data.appointmentTime) {
    errors.appointmentTime = 'Please select a time';
  }

  if (!data.reason?.trim()) {
    errors.reason = 'Reason for visit is required';
  } else if (data.reason.length < 3) {
    errors.reason = 'Please provide a valid reason';
  }

  return errors;
};

// Doctor form validation
export const validateDoctorForm = (data) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.specialization?.trim()) {
    errors.specialization = 'Specialization is required';
  }

  if (!data.licenseNumber?.trim()) {
    errors.licenseNumber = 'License number is required';
  }

  if (!data.consultationFee) {
    errors.consultationFee = 'Consultation fee is required';
  } else if (data.consultationFee < 0) {
    errors.consultationFee = 'Fee cannot be negative';
  }

  return errors;
};

// Prescription form validation
export const validatePrescriptionForm = (data) => {
  const errors = {};

  if (!data.diagnosis?.trim()) {
    errors.diagnosis = 'Diagnosis is required';
  }

  if (!data.patientId) {
    errors.patientId = 'Patient is required';
  }

  if (!data.doctorId) {
    errors.doctorId = 'Doctor is required';
  }

  if (!data.appointmentId) {
    errors.appointmentId = 'Appointment is required';
  }

  return errors;
};

// User registration validation
export const validateRegistrationForm = (data) => {
  const errors = {};

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.role) {
    errors.role = 'Please select a role';
  }

  return errors;
};

// Login form validation
export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

// Generic field validation
export const validateField = (name, value, type = 'text') => {
  const errors = {};

  switch (type) {
    case 'email':
      if (!value) {
        errors[name] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[name] = 'Invalid email format';
      }
      break;

    case 'phone':
      if (!value) {
        errors[name] = 'Phone number is required';
      } else if (!/^(\+255|0)[67]\d{8}$/.test(value)) {
        errors[name] = 'Invalid Tanzanian phone number';
      }
      break;

    case 'number':
      if (value === '' || value === null || value === undefined) {
        errors[name] = 'This field is required';
      } else if (isNaN(value)) {
        errors[name] = 'Must be a number';
      } else if (value < 0) {
        errors[name] = 'Cannot be negative';
      }
      break;

    case 'date':
      if (!value) {
        errors[name] = 'Date is required';
      } else if (new Date(value) > new Date()) {
        errors[name] = 'Date cannot be in the future';
      }
      break;

    case 'time':
      if (!value) {
        errors[name] = 'Time is required';
      }
      break;

    default:
      if (!value?.trim()) {
        errors[name] = 'This field is required';
      } else if (value.length < 2) {
        errors[name] = 'Must be at least 2 characters';
      }
  }

  return errors;
};