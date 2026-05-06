const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  consultationFee: {
    type: Number,
    default: 0
  },
  labTestFee: {
    type: Number,
    default: 0
  },
  medicationFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile-money', 'card', 'insurance'],
    default: 'cash'
  },
  paymentDate: Date,
  dueDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate balance before saving
billSchema.pre('save', function(next) {
  this.balance = this.totalAmount - this.amountPaid;
  
  if (this.balance <= 0) {
    this.paymentStatus = 'paid';
  } else if (this.amountPaid > 0) {
    this.paymentStatus = 'partial';
  }
  
  next();
});

module.exports = mongoose.model('Bill', billSchema);