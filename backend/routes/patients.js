const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

// Get all patients (admin/doctor only)
router.get('/', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'email')
      .sort({ fullName: 1 });
    
    res.json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get patient by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'email');
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Get patient's appointments
    const appointments = await Appointment.find({ patientId: patient._id })
      .populate('doctorId', 'fullName specialization')
      .sort({ appointmentDate: -1 });
    
    res.json({ patient, appointments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update patient
router.put('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search patients
router.get('/search/:query', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const query = req.params.query;
    
    const patients = await Patient.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    
    res.json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;