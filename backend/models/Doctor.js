const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { auth, authorize } = require('../middleware/auth');

// Get all doctors
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .populate('userId', 'email')
      .select('-__v');
    
    res.json(doctors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get doctor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'email');
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create doctor (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update doctor
router.put('/:id', auth, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete doctor (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json({ message: 'Doctor deactivated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get available slots for a doctor on a specific date
router.get('/:id/available-slots/:date', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // For simplicity, we assume each appointment is 30 minutes and doctor works in availableSlots
    // We need to check existing appointments for that date to exclude booked slots
    // This is a simplified version - you might need to adjust based on your scheduling logic

    const date = new Date(req.params.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    const doctorSlot = doctor.availableSlots.find(slot => slot.day === dayName);
    
    if (!doctorSlot) {
      return res.json([]); // No available slots for that day
    }

    // Generate 30-minute slots between startTime and endTime
    const slots = [];
    let start = new Date(date);
    let [startHour, startMinute] = doctorSlot.startTime.split(':').map(Number);
    let [endHour, endMinute] = doctorSlot.endTime.split(':').map(Number);
    
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);
    
    while (start < end) {
      const timeString = start.toTimeString().substring(0, 5);
      slots.push(timeString);
      start.setMinutes(start.getMinutes() + 30);
    }

    // TODO: Exclude already booked appointments for this doctor on this date

    res.json(slots);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;