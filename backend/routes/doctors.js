const express = require('express');
const router = express.Router();

// Get all doctors
router.get('/', (req, res) => {
  res.json({ 
    message: 'Doctors route working',
    doctors: []
  });
});

module.exports = router;