const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments, updateAssignment, getVolunteerStats } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats', protect, getVolunteerStats);
router.route('/')
  .get(protect, getAssignments)
  .post(protect, authorize('admin'), createAssignment);
router.put('/:id', protect, updateAssignment);

module.exports = router;
