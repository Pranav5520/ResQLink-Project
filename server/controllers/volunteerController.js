const VolunteerProfile = require('../models/VolunteerProfile');
const User = require('../models/User');

// @desc    Create/Update volunteer profile
// @route   POST /api/volunteers/profile
const createOrUpdateProfile = async (req, res) => {
  try {
    let profile = await VolunteerProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      // Create
      profile = await VolunteerProfile.create({
        ...req.body,
        user: req.user._id
      });
    }

    const populated = await profile.populate('user', 'name email phone location');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get volunteer profile
// @route   GET /api/volunteers/profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await VolunteerProfile.findOne({ user: req.user._id })
      .populate('user', 'name email phone location');
    if (!profile) {
      return res.status(404).json({ message: 'Volunteer profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all volunteers (admin)
// @route   GET /api/volunteers
const getVolunteers = async (req, res) => {
  try {
    const { availability, skill, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (availability) query.availability = availability;
    if (skill) query.skills = { $in: Array.isArray(skill) ? skill : [skill] };
    if (search) {
      query.$or = [
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await VolunteerProfile.countDocuments(query);
    const volunteers = await VolunteerProfile.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      volunteers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available volunteers
// @route   GET /api/volunteers/available
const getAvailableVolunteers = async (req, res) => {
  try {
    const volunteers = await VolunteerProfile.find({ availability: 'Available', isActive: true })
      .populate('user', 'name email phone location');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single volunteer profile
// @route   GET /api/volunteers/:id
const getVolunteerById = async (req, res) => {
  try {
    const profile = await VolunteerProfile.findById(req.params.id)
      .populate('user', 'name email phone location');
    if (!profile) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update volunteer availability
// @route   PUT /api/volunteers/availability
const updateAvailability = async (req, res) => {
  try {
    const profile = await VolunteerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Volunteer profile not found' });
    }
    profile.availability = req.body.availability;
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createOrUpdateProfile, getMyProfile, getVolunteers, getAvailableVolunteers, getVolunteerById, updateAvailability };
