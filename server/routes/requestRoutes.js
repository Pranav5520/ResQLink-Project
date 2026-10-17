const express = require('express');
const router = express.Router();
const { createRequest, getRequests, getRequestById, updateRequest, getVolunteerRequests } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getRequests)
  .post(protect, createRequest);

router.get('/volunteer/my', protect, getVolunteerRequests);

router.route('/:id')
  .get(protect, getRequestById)
  .put(protect, updateRequest);

module.exports = router;
