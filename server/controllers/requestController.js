const AssistanceRequest = require('../models/AssistanceRequest');

// @desc    Create a new assistance request
// @route   POST /api/requests
const createRequest = async (req, res) => {
  try {
    const request = await AssistanceRequest.create({
      ...req.body,
      citizen: req.user._id
    });
    const populated = await request.populate('citizen', 'name email phone');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get requests with filtering
// @route   GET /api/requests
const getRequests = async (req, res) => {
  try {
    const { requestType, priority, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    // If citizen, only show their requests
    if (req.user.role === 'citizen') {
      query.citizen = req.user._id;
    }

    if (requestType) query.requestType = requestType;
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await AssistanceRequest.countDocuments(query);
    const requests = await AssistanceRequest.find(query)
      .populate('citizen', 'name email phone')
      .populate('assignedVolunteer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      requests,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
const getRequestById = async (req, res) => {
  try {
    const request = await AssistanceRequest.findById(req.params.id)
      .populate('citizen', 'name email phone location')
      .populate('assignedVolunteer', 'name email phone');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    // Citizens can only see their own requests
    if (req.user.role === 'citizen' && request.citizen._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request
// @route   PUT /api/requests/:id
const updateRequest = async (req, res) => {
  try {
    const request = await AssistanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Citizens can only update their own requests (limited fields)
    if (req.user.role === 'citizen') {
      if (request.citizen.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      // Citizens can only cancel/modify limited fields
      const allowed = ['description', 'contactNumber', 'peopleCount'];
      const updates = {};
      allowed.forEach(field => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });
      Object.assign(request, updates);
    } else {
      Object.assign(request, req.body);
      if (req.body.status === 'Completed') {
        request.resolvedAt = new Date();
      }
    }

    const updated = await request.save();
    const populated = await updated.populate(['citizen', 'assignedVolunteer'], 'name email phone');
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get volunteer's assigned requests
// @route   GET /api/requests/volunteer/my
const getVolunteerRequests = async (req, res) => {
  try {
    const requests = await AssistanceRequest.find({ assignedVolunteer: req.user._id })
      .populate('citizen', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getRequests, getRequestById, updateRequest, getVolunteerRequests };
