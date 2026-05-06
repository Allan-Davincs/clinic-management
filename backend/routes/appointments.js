const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'fullName phone')
      .populate('doctorId', 'fullName specialization')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();

    // Populate the saved appointment
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'fullName phone')
      .populate('doctorId', 'fullName specialization');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    .populate('patientId', 'fullName phone')
    .populate('doctorId', 'fullName specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;