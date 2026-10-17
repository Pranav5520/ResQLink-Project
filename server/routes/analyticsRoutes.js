const express = require('express');
const router = express.Router();
const {
  getOverview,
  getEmergenciesByCategory,
  getRequestsByStatus,
  getSeverityDistribution,
  getVolunteerDeployment,
  getRequestsByType,
  getRequestsOverTime,
  getAdvancedAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/overview', protect, authorize('admin'), getOverview);
router.get('/emergencies-by-category', protect, authorize('admin'), getEmergenciesByCategory);
router.get('/requests-by-status', protect, authorize('admin'), getRequestsByStatus);
router.get('/severity-distribution', protect, authorize('admin'), getSeverityDistribution);
router.get('/volunteer-deployment', protect, authorize('admin'), getVolunteerDeployment);
router.get('/requests-by-type', protect, authorize('admin'), getRequestsByType);
router.get('/requests-over-time', protect, authorize('admin'), getRequestsOverTime);
router.get('/advanced', protect, authorize('admin'), getAdvancedAnalytics);

module.exports = router;
