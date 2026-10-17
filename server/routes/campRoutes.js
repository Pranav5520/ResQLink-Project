const express = require('express');
const router = express.Router();
const { createCamp, getCamps, getCampById, updateCamp, deleteCamp, getCampStats } = require('../controllers/campController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats/overview', protect, getCampStats);
router.route('/')
  .get(protect, getCamps)
  .post(protect, authorize('admin'), createCamp);
router.route('/:id')
  .get(protect, getCampById)
  .put(protect, authorize('admin'), updateCamp)
  .delete(protect, authorize('admin'), deleteCamp);

module.exports = router;
