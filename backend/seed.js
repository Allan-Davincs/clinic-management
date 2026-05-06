const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');
const Bill = require('./models/Bill');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const specialties = [
  'General Physician',
  'Pediatrician',
  'Dentist',
  'Dermatologist',
  'Cardiologist',
  'Neurologist',
  'Orthopedist',
  'Gynecologist',
];

const symptoms = [
  'Fever',
  'Headache',
  'Cough',
  'Sore throat',
  'Fatigue',
  'Body aches',
  'Shortness of breath',
  'Chest pain',
  'Abdominal pain',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Rash',
  'Joint pain',
  'Dizziness',
];

const medications = [
  { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: '3 times daily', duration: '5 days' },
  { name: 'Ibuprofen 400mg', dosage: '1 tablet', frequency: '2 times daily', duration: '3 days' },
  { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: '3 times daily', duration: '7 days' },
  { name: 'Azithromycin 500mg', dosage: '1 tablet', frequency: 'once daily', duration: '3 days' },
  { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'once daily', duration: '7 days' },
  { name: 'Salbutamol Inhaler', dosage: '2 puffs', frequency: 'as needed', duration: '30 days' },
];

const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Bill.deleteMany({});

    console.log('✅ Existing data cleared');

    // Create Admin User
    const adminUser = new User({
      email: 'admin@clinic.com',
      password: 'admin123',
      role: 'admin',
    });
    await adminUser.save();
    console.log('✅ Admin user created');

    // Create Doctors
    const doctors = [];
    for (let i = 1; i <= 6; i++) {
      const doctorUser = new User({
        email: `doctor${i}@clinic.com`,
        password: 'doctor123',
        role: 'doctor',
      });
      await doctorUser.save();

      const doctor = new Doctor({
        userId: doctorUser._id,
        fullName: `Dr. ${['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa'][i - 1]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][i - 1]}`,
        specialization: specialties[i - 1] || specialties[0],
        phone: `07${i}23456${i}${i}`,
        licenseNumber: `MD${1000 + i}`,
        consultationFee: 15000 + (i * 5000),
        availableSlots: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Friday', startTime: '09:00', endTime: '13:00' },
        ],
      });
      await doctor.save();
      doctors.push(doctor);
      console.log(`✅ Doctor ${i} created: ${doctor.fullName}`);
    }

    // Create Patients
    const patients = [];
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

    for (let i = 1; i <= 20; i++) {
      const patientUser = new User({
        email: `patient${i}@email.com`,
        password: 'patient123',
        role: 'patient',
      });
      await patientUser.save();

      const birthYear = 1970 + Math.floor(Math.random() * 30);
      const birthMonth = Math.floor(Math.random() * 12) + 1;
      const birthDay = Math.floor(Math.random() * 28) + 1;

      const patient = new Patient({
        userId: patientUser._id,
        fullName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        phone: `07${Math.floor(Math.random() * 90000000) + 10000000}`,
        dateOfBirth: new Date(birthYear, birthMonth - 1, birthDay),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        address: `Street ${i}, City ${Math.ceil(i / 5)}, Tanzania`,
        bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
        allergies: i % 4 === 0 ? ['Penicillin', 'Sulfa'] : [],
        emergencyContact: {
          name: `Emergency Contact ${i}`,
          phone: `07${Math.floor(Math.random() * 90000000) + 10000000}`,
          relationship: i % 3 === 0 ? 'Spouse' : i % 3 === 1 ? 'Parent' : 'Sibling',
        },
      });
      await patient.save();
      patients.push(patient);
      console.log(`✅ Patient ${i} created: ${patient.fullName}`);
    }

    // Create Appointments
    const appointmentReasons = [
      'Routine checkup',
      'Fever and cough',
      'Headache',
      'Stomach pain',
      'Skin rash',
      'Follow-up visit',
      'Vaccination',
      'Blood test',
      'Dental cleaning',
      'Eye examination',
    ];

    for (let i = 1; i <= 50; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30) - 15); // +/- 15 days
      
      const hours = 9 + Math.floor(Math.random() * 8); // 9am to 5pm
      const minutes = Math.random() > 0.5 ? 0 : 30;
      const appointmentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'];
      const weights = [0.3, 0.3, 0.2, 0.1, 0.1]; // Probability weights
      let status = 'scheduled';
      const rand = Math.random();
      let cumulative = 0;
      for (let j = 0; j < statuses.length; j++) {
        cumulative += weights[j];
        if (rand < cumulative) {
          status = statuses[j];
          break;
        }
      }

      const appointment = new Appointment({
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentDate,
        appointmentTime,
        status,
        reason: appointmentReasons[Math.floor(Math.random() * appointmentReasons.length)],
        notes: status === 'completed' ? 'Patient responded well to treatment' : '',
      });
      await appointment.save();

      // Create prescriptions for completed appointments
      if (status === 'completed') {
        const prescription = new Prescription({
          appointmentId: appointment._id,
          patientId: patient._id,
          doctorId: doctor._id,
          diagnosis: `${symptoms[Math.floor(Math.random() * symptoms.length)]} and ${symptoms[Math.floor(Math.random() * symptoms.length)]}`,
          symptoms: [symptoms[Math.floor(Math.random() * symptoms.length)], symptoms[Math.floor(Math.random() * symptoms.length)]],
          medications: [medications[Math.floor(Math.random() * medications.length)]],
          labTests: Math.random() > 0.7 ? ['Blood Test', 'X-Ray'] : [],
          advice: 'Get plenty of rest and drink fluids. Follow up if symptoms worsen.',
          nextVisitDate: new Date(appointmentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week later
        });
        await prescription.save();

        // Create bill for completed appointment
        const consultationFee = doctor.consultationFee;
        const labTestFee = prescription.labTests.length > 0 ? 15000 : 0;
        const medicationFee = 5000;
        const totalAmount = consultationFee + labTestFee + medicationFee;

        const bill = new Bill({
          patientId: patient._id,
          appointmentId: appointment._id,
          prescriptionId: prescription._id,
          items: [
            { description: 'Consultation Fee', quantity: 1, unitPrice: consultationFee, total: consultationFee },
            { description: 'Lab Tests', quantity: prescription.labTests.length, unitPrice: labTestFee, total: labTestFee },
            { description: 'Medications', quantity: 1, unitPrice: medicationFee, total: medicationFee },
          ],
          consultationFee,
          labTestFee,
          medicationFee,
          totalAmount,
          amountPaid: Math.random() > 0.3 ? totalAmount : totalAmount * 0.5,
          paymentStatus: Math.random() > 0.3 ? 'paid' : 'partial',
          paymentMethod: ['cash', 'mobile-money', 'card'][Math.floor(Math.random() * 3)],
          paymentDate: status === 'completed' ? new Date() : null,
        });
        await bill.save();
      }

      if (i % 10 === 0) {
        console.log(`✅ Created ${i} appointments...`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log('======================');
    console.log(`👤 Admin Users: 1`);
    console.log(`👨‍⚕️ Doctors: ${doctors.length}`);
    console.log(`👥 Patients: ${patients.length}`);
    console.log(`📅 Appointments: 50`);
    console.log(`💊 Prescriptions: ~15`);
    console.log(`💰 Bills: ~15`);
    
    console.log('\n🔑 Demo Credentials:');
    console.log('===================');
    console.log('Admin: admin@clinic.com / admin123');
    console.log('Doctors: doctor1@clinic.com to doctor6@clinic.com / doctor123');
    console.log('Patients: patient1@email.com to patient20@email.com / patient123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();