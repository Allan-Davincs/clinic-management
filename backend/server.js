const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Clinic Management API is running' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_db')
  .then(() => console.log('✅ MongoDB connected locally'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Import and use routes ONE BY ONE
try {
  console.log('Loading routes...');
  
  // Test auth route first
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded');
  app.use('/api/auth', authRoutes);
  
  // Test appointments route
  const appointmentRoutes = require('./routes/appointments');
  console.log('✅ Appointment routes loaded');
  app.use('/api/appointments', appointmentRoutes);
  
  // Test patients route
  const patientRoutes = require('./routes/patients');
  console.log('✅ Patient routes loaded');
  app.use('/api/patients', patientRoutes);
  
  // Test doctors route
  const doctorRoutes = require('./routes/doctors');
  console.log('✅ Doctor routes loaded');
  app.use('/api/doctors', doctorRoutes);
  
  // Test prescriptions route LAST (this might be causing the error)
  const prescriptionRoutes = require('./routes/prescriptions');
  console.log('✅ Prescription routes loaded');
  app.use('/api/prescriptions', prescriptionRoutes);
  
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Test at: http://localhost:${PORT}/api/test`);
});