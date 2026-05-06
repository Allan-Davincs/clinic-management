import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    bloodGroup: 'O+',
    // Doctor specific
    specialization: '',
    licenseNumber: '',
    consultationFee: '',
    // Admin specific
    clinicName: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate(`/${result.data.user.role}`);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      setError('');
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['patient', 'doctor', 'admin'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({...formData, role})}
                      className={`p-4 border rounded-lg text-center capitalize ${
                        formData.role === role 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0712345678"
                />
              </div>

              {formData.role === 'patient' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Dar es Salaam, Tanzania"
                    />
                  </div>
                </>
              )}

              {formData.role === 'doctor' && (
                <>
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="General Physician"
                    />
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Medical License Number
                    </label>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="MD12345"
                    />
                  </div>

                  <div>
                    <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee (TZS)
                    </label>
                    <input
                      id="consultationFee"
                      name="consultationFee"
                      type="number"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="20000"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                Back
              </button>
            )}
            
            {step < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary ml-auto"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;