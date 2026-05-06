import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

export const generateAppointmentPDF = (appointment) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('APPOINTMENT RECEIPT', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('ClinicPro Healthcare System', 105, 30, { align: 'center' });
  doc.text('Tel: 0712 345 678 | Email: info@clinicpro.com', 105, 36, { align: 'center' });
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
  
  // Appointment Details
  doc.setFontSize(14);
  doc.text('Appointment Details', 20, 50);
  
  doc.setFontSize(12);
  doc.text(`Appointment ID: ${appointment._id}`, 20, 60);
  doc.text(`Date: ${format(new Date(appointment.appointmentDate), 'dd/MM/yyyy')}`, 20, 66);
  doc.text(`Time: ${appointment.appointmentTime}`, 20, 72);
  doc.text(`Status: ${appointment.status}`, 20, 78);
  
  // Patient Information
  doc.setFontSize(14);
  doc.text('Patient Information', 20, 90);
  
  doc.setFontSize(12);
  doc.text(`Name: ${appointment.patientId?.fullName}`, 20, 98);
  doc.text(`Phone: ${appointment.patientId?.phone}`, 20, 104);
  
  // Doctor Information
  doc.setFontSize(14);
  doc.text('Doctor Information', 20, 116);
  
  doc.setFontSize(12);
  doc.text(`Name: Dr. ${appointment.doctorId?.fullName}`, 20, 124);
  doc.text(`Specialization: ${appointment.doctorId?.specialization}`, 20, 130);
  doc.text(`Consultation Fee: TZS ${appointment.doctorId?.consultationFee?.toLocaleString()}`, 20, 136);
  
  // Reason and Notes
  if (appointment.reason) {
    doc.setFontSize(14);
    doc.text('Reason for Visit', 20, 148);
    doc.setFontSize(12);
    const reasonLines = doc.splitTextToSize(appointment.reason, 170);
    doc.text(reasonLines, 20, 156);
  }
  
  if (appointment.notes) {
    const yPos = appointment.reason ? 156 + (reasonLines.length * 7) + 10 : 156;
    doc.setFontSize(14);
    doc.text('Additional Notes', 20, yPos);
    doc.setFontSize(12);
    const notesLines = doc.splitTextToSize(appointment.notes, 170);
    doc.text(notesLines, 20, yPos + 8);
  }
  
  // Footer
  doc.setFontSize(10);
  doc.text('Thank you for choosing ClinicPro!', 105, 280, { align: 'center' });
  doc.text('Please arrive 15 minutes before your scheduled time.', 105, 286, { align: 'center' });
  
  return doc;
};

export const generatePrescriptionPDF = (prescription) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('MEDICAL PRESCRIPTION', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('ClinicPro Healthcare System', 105, 30, { align: 'center' });
  doc.text('Tel: 0712 345 678 | Email: info@clinicpro.com', 105, 36, { align: 'center' });
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
  
  // Doctor Info
  doc.setFontSize(14);
  doc.text('Prescribing Doctor:', 20, 50);
  doc.setFontSize(12);
  doc.text(`Dr. ${prescription.doctorId?.fullName}`, 20, 58);
  doc.text(`License: ${prescription.doctorId?.licenseNumber}`, 20, 64);
  doc.text(`Specialization: ${prescription.doctorId?.specialization}`, 20, 70);
  
  // Patient Info
  doc.setFontSize(14);
  doc.text('Patient Information:', 20, 85);
  doc.setFontSize(12);
  doc.text(`Name: ${prescription.patientId?.fullName}`, 20, 93);
  doc.text(`Date of Birth: ${format(new Date(prescription.patientId?.dateOfBirth), 'dd/MM/yyyy')}`, 20, 99);
  doc.text(`Gender: ${prescription.patientId?.gender}`, 20, 105);
  
  // Line separator
  doc.line(20, 110, 190, 110);
  
  // Diagnosis
  doc.setFontSize(14);
  doc.text('Diagnosis:', 20, 120);
  doc.setFontSize(12);
  const diagnosisLines = doc.splitTextToSize(prescription.diagnosis, 170);
  doc.text(diagnosisLines, 20, 128);
  
  // Medications
  let yPos = 140;
  if (prescription.medications?.length > 0) {
    doc.setFontSize(14);
    doc.text('Prescribed Medications:', 20, yPos);
    yPos += 10;
    
    prescription.medications.forEach((med, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${med.name}`, 25, yPos);
      yPos += 7;
      doc.text(`   Dosage: ${med.dosage} - ${med.frequency} for ${med.duration}`, 25, yPos);
      yPos += 7;
      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`, 25, yPos);
        yPos += 7;
      }
      yPos += 3;
    });
  }
  
  // Lab Tests
  if (prescription.labTests?.length > 0) {
    yPos += 5;
    doc.setFontSize(14);
    doc.text('Recommended Lab Tests:', 20, yPos);
    yPos += 10;
    
    prescription.labTests.forEach((test, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${test.name || test}`, 25, yPos);
      yPos += 7;
    });
  }
  
  // Advice
  if (prescription.advice) {
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Medical Advice:', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    const adviceLines = doc.splitTextToSize(prescription.advice, 170);
    doc.text(adviceLines, 20, yPos);
  }
  
  // Signature
  doc.setFontSize(10);
  doc.text(`Date: ${format(new Date(prescription.createdAt), 'dd/MM/yyyy HH:mm')}`, 20, 280);
  doc.text('Doctor Signature: ___________________', 120, 280);
  
  return doc;
};

export const generatePatientReportPDF = (patient, appointments, prescriptions) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('PATIENT MEDICAL REPORT', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('ClinicPro Healthcare System', 105, 30, { align: 'center' });
  doc.text('Confidential Medical Document', 105, 36, { align: 'center' });
  
  // Patient Information
  doc.setFontSize(14);
  doc.text('Patient Information', 20, 50);
  
  doc.setFontSize(12);
  doc.text(`Name: ${patient.fullName}`, 20, 58);
  doc.text(`Date of Birth: ${format(new Date(patient.dateOfBirth), 'dd/MM/yyyy')}`, 20, 64);
  doc.text(`Gender: ${patient.gender}`, 20, 70);
  doc.text(`Blood Group: ${patient.bloodGroup || 'N/A'}`, 20, 76);
  doc.text(`Phone: ${patient.phone}`, 20, 82);
  doc.text(`Address: ${patient.address || 'N/A'}`, 20, 88);
  
  if (patient.allergies?.length > 0) {
    doc.text(`Allergies: ${patient.allergies.join(', ')}`, 20, 94);
  }
  
  // Medical History Summary
  doc.setFontSize(14);
  doc.text('Medical History Summary', 20, 110);
  
  doc.setFontSize(12);
  doc.text(`Total Appointments: ${appointments.length}`, 20, 118);
  doc.text(`Total Prescriptions: ${prescriptions.length}`, 20, 124);
  
  // Recent Appointments
  doc.setFontSize(14);
  doc.text('Recent Appointments', 20, 140);
  
  let yPos = 148;
  appointments.slice(0, 5).forEach((apt, index) => {
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${format(new Date(apt.appointmentDate), 'dd/MM/yyyy')} - Dr. ${apt.doctorId?.fullName} - ${apt.reason}`, 25, yPos);
    yPos += 7;
  });
  
  // Recent Prescriptions
  yPos += 10;
  doc.setFontSize(14);
  doc.text('Recent Prescriptions', 20, yPos);
  yPos += 8;
  
  prescriptions.slice(0, 5).forEach((pres, index) => {
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${format(new Date(pres.createdAt), 'dd/MM/yyyy')} - ${pres.diagnosis}`, 25, yPos);
    yPos += 7;
  });
  
  // Footer
  doc.setFontSize(10);
  doc.text('Generated on: ' + format(new Date(), 'dd/MM/yyyy HH:mm'), 20, 280);
  doc.text('This report is confidential and intended for medical use only.', 105, 286, { align: 'center' });
  
  return doc;
};

// Export functions
export default {
  generateAppointmentPDF,
  generatePrescriptionPDF,
  generatePatientReportPDF,
};