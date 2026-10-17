const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, getPublicAnnouncements, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/public', async (req, res) => {
  try {
    const Announcement = require('../models/Announcement');
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 }).limit(10);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.route('/')
  .get(protect, getAnnouncements)
  .post(protect, authorize('admin'), createAnnouncement);
router.route('/:id')
  .put(protect, authorize('admin'), updateAnnouncement)
  .delete(protect, authorize('admin'), deleteAnnouncement);

module.exports = router;
