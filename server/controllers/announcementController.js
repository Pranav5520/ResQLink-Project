const Announcement = require('../models/Announcement');

// @desc    Create an announcement
// @route   POST /api/announcements
const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      publishedBy: req.user._id
    });
    const populated = await announcement.populate('publishedBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all announcements
// @route   GET /api/announcements
const getAnnouncements = async (req, res) => {
  try {
    const { priority, isActive, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (priority) query.priority = priority;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (category) query.category = category;

    // Non-admin users only see active announcements
    if (req.user.role !== 'admin') {
      query.isActive = true;
    }

    const total = await Announcement.countDocuments(query);
    const announcements = await Announcement.find(query)
      .populate('publishedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      announcements,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active public announcements (for landing page)
// @route   GET /api/announcements/public
const getPublicAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ priority: 1, createdAt: -1 })
      .limit(10);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    Object.assign(announcement, req.body);
    const updated = await announcement.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    await announcement.deleteOne();
    res.json({ message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAnnouncement, getAnnouncements, getPublicAnnouncements, updateAnnouncement, deleteAnnouncement };
