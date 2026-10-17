const express = require('express');
const router = express.Router();
const { createResource, getResources, getResourceById, updateResource, deleteResource, getResourceStats } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/stats/overview', protect, getResourceStats);
router.route('/')
  .get(protect, getResources)
  .post(protect, authorize('admin'), createResource);
router.route('/:id')
  .get(protect, getResourceById)
  .put(protect, authorize('admin'), updateResource)
  .delete(protect, authorize('admin'), deleteResource);

module.exports = router;
