const express = require('express');
const router = express.Router();
const { createDistribution, getDistributions, getDistributionStats } = require('../controllers/distributionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats', protect, getDistributionStats);
router.route('/')
  .get(protect, getDistributions)
  .post(protect, authorize('admin'), createDistribution);

module.exports = router;
