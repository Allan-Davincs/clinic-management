const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { auth, authorize } = require('../middleware/auth');

// Create prescription
router.post('/', auth, authorize('doctor'), async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    
    // Update appointment status to completed
    await Appointment.findByIdAndUpdate(
      req.body.appointmentId,
      { status: 'completed' }
    );
    
    res.status(201).json(prescription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get prescriptions by patient ID
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ 
      patientId: req.params.patientId 
    })
    .populate('doctorId', 'fullName specialization')
    .populate('appointmentId', 'appointmentDate')
    .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get prescription by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'fullName dateOfBirth gender bloodGroup')
      .populate('doctorId', 'fullName specialization licenseNumber')
      .populate('appointmentId');
    
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update prescription
router.put('/:id', auth, authorize('doctor'), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get prescriptions by doctor ID
router.get('/doctor/:doctorId', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ 
      doctorId: req.params.doctorId 
    })
    .populate('patientId', 'fullName')
    .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;