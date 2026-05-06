const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  symptoms: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  labTests: [{
    name: String,
    instructions: String
  }],
  advice: String,
  nextVisitDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);