const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getMyProfile, getVolunteers, getAvailableVolunteers, getVolunteerById, updateAvailability } = require('../controllers/volunteerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/available', protect, getAvailableVolunteers);
router.get('/profile', protect, getMyProfile);
router.post('/profile', protect, createOrUpdateProfile);
router.put('/availability', protect, updateAvailability);
router.get('/', protect, authorize('admin'), getVolunteers);
router.get('/:id', protect, getVolunteerById);

module.exports = router;
