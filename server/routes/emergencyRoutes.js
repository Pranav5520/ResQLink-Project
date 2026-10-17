const express = require('express');
const router = express.Router();
const { createEmergency, getEmergencies, getEmergencyById, updateEmergency, deleteEmergency } = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getEmergencies)
  .post(protect, createEmergency);

router.get('/public', async (req, res) => {
  try {
    const Emergency = require('../models/Emergency');
    const emergencies = await Emergency.find({ status: { $in: ['Reported', 'Verified', 'In Progress'] } })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.route('/:id')
  .get(protect, getEmergencyById)
  .put(protect, authorize('admin'), updateEmergency)
  .delete(protect, authorize('admin'), deleteEmergency);

module.exports = router;
