const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  
  // Mock response for now
  res.json({ 
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: { email, role: 'patient' }
  });
});

// Register
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  
  res.status(201).json({ 
    message: 'Registration successful',
    token: 'mock-jwt-token',
    user: { email, role: 'patient' }
  });
});

module.exports = router;