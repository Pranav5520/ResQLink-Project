const Emergency = require('../models/Emergency');

// @desc    Create a new emergency report
// @route   POST /api/emergencies
const createEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.create({
      ...req.body,
      reportedBy: req.user._id
    });
    const populated = await emergency.populate('reportedBy', 'name email phone');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all emergencies with filtering
// @route   GET /api/emergencies
const getEmergencies = async (req, res) => {
  try {
    const { category, severity, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Emergency.countDocuments(query);
    const emergencies = await Emergency.find(query)
      .populate('reportedBy', 'name email phone')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      emergencies,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get emergency by ID
// @route   GET /api/emergencies/:id
const getEmergencyById = async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('verifiedBy', 'name');
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update emergency
// @route   PUT /api/emergencies/:id
const updateEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    // If verifying, set verifiedBy
    if (req.body.status === 'Verified' && !emergency.verifiedBy) {
      req.body.verifiedBy = req.user._id;
    }

    const updated = await Emergency.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('reportedBy', 'name email phone')
      .populate('verifiedBy', 'name');

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete emergency
// @route   DELETE /api/emergencies/:id
const deleteEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    await emergency.deleteOne();
    res.json({ message: 'Emergency removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEmergency, getEmergencies, getEmergencyById, updateEmergency, deleteEmergency };
