import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import {
  DocumentTextIcon,
  PrinterIcon,
  DownloadIcon,
  UserCircleIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const PrescriptionViewer = ({ prescriptionId }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescription();
    }
  }, [prescriptionId]);

  const fetchPrescription = async () => {
    try {
      const response = await axios.get(`/api/prescriptions/${prescriptionId}`);
      setPrescription(response.data);
    } catch (error) {
      console.error('Failed to fetch prescription:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!prescription) return;

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
    doc.text(`Blood Group: ${prescription.patientId?.bloodGroup || 'N/A'}`, 20, 111);
    
    // Line separator
    doc.line(20, 115, 190, 115);
    
    // Diagnosis
    doc.setFontSize(14);
    doc.text('Diagnosis:', 20, 125);
    doc.setFontSize(12);
    const diagnosisLines = doc.splitTextToSize(prescription.diagnosis, 170);
    doc.text(diagnosisLines, 20, 133);
    
    // Medications
    let yPos = 145;
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
        if (test.instructions) {
          doc.text(`   Instructions: ${test.instructions}`, 25, yPos);
          yPos += 7;
        }
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
      yPos += adviceLines.length * 7;
    }
    
    // Next Visit
    if (prescription.nextVisitDate) {
      yPos += 10;
      doc.setFontSize(14);
      doc.text('Next Visit:', 20, yPos);
      doc.setFontSize(12);
      doc.text(`Date: ${format(new Date(prescription.nextVisitDate), 'dd/MM/yyyy')}`, 25, yPos + 7);
    }
    
    // Footer
    yPos = 280;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Prescription ID: ${prescription._id}`, 20, yPos);
    doc.text(`Date: ${format(new Date(prescription.createdAt), 'dd/MM/yyyy HH:mm')}`, 105, yPos, { align: 'center' });
    doc.text('Digital Signature', 170, yPos, { align: 'right' });
    
    // Save the PDF
    doc.save(`prescription-${prescription._id}.pdf`);
  };

  const printPrescription = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Prescription not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Prescription</h2>
          <p className="text-gray-600 mt-1">
            ID: {prescription._id} • Created: {format(new Date(prescription.createdAt), 'dd/MM/yyyy')}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={printPrescription}
            className="btn-secondary flex items-center"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print
          </button>
          <button
            onClick={generatePDF}
            className="btn-primary flex items-center"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Prescription Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Doctor & Patient Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Doctor Card */}
          <div className="card">
            <div className="flex items-center mb-4">
              <AcademicCapIcon className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Prescribing Doctor</h3>
                <p className="text-sm text-gray-500">Medical Practitioner</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">Dr. {prescription.doctorId?.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-medium">{prescription.doctorId?.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="font-medium">{prescription.doctorId?.licenseNumber}</p>
              </div>
            </div>
          </div>

          {/* Patient Card */}
          <div className="card">
            <div className="flex items-center mb-4">
              <UserCircleIcon className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Patient Information</h3>
                <p className="text-sm text-gray-500">Medical Record</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{prescription.patientId?.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">
                  {format(new Date(prescription.patientId?.dateOfBirth), 'dd/MM/yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{prescription.patientId?.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Blood Group</p>
                <p className="font-medium">{prescription.patientId?.bloodGroup || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Medical Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Diagnosis */}
          <div className="card">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Diagnosis</h3>
            <p className="text-gray-700">{prescription.diagnosis}</p>
            {prescription.symptoms && prescription.symptoms.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Symptoms Reported:</p>
                <div className="flex flex-wrap gap-2">
                  {prescription.symptoms.map((symptom, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Medications */}
          {prescription.medications && prescription.medications.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Prescribed Medications</h3>
              <div className="space-y-4">
                {prescription.medications.map((medication, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Dosage</p>
                            <p className="font-medium">{medication.dosage}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Frequency</p>
                            <p className="font-medium">{medication.frequency}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Duration</p>
                            <p className="font-medium">{medication.duration}</p>
                          </div>
                        </div>
                        {medication.instructions && (
                          <div className="mt-3">
                            <p className="text-gray-600">Instructions</p>
                            <p className="text-sm mt-1">{medication.instructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab Tests */}
          {prescription.labTests && prescription.labTests.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Recommended Lab Tests</h3>
              <div className="space-y-3">
                {prescription.labTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{typeof test === 'string' ? test : test.name}</p>
                      {test.instructions && (
                        <p className="text-sm text-gray-600 mt-1">{test.instructions}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">Required</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advice & Next Visit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescription.advice && (
              <div className="card">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Medical Advice</h3>
                <p className="text-gray-700 whitespace-pre-line">{prescription.advice}</p>
              </div>
            )}

            {prescription.nextVisitDate && (
              <div className="card">
                <div className="flex items-center mb-4">
                  <CalendarIcon className="h-6 w-6 text-primary-600 mr-2" />
                  <h3 className="font-semibold text-lg text-gray-900">Next Visit</h3>
                </div>
                <div className="text-center py-4">
                  <p className="text-2xl font-bold text-primary-600">
                    {format(new Date(prescription.nextVisitDate), 'dd MMM, yyyy')}
                  </p>
                  <p className="text-gray-600 mt-2">Follow-up appointment scheduled</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-prescription, .print-prescription * {
            visibility: visible;
          }
          .print-prescription {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrescriptionViewer;