const VolunteerAssignment = require('../models/VolunteerAssignment');
const VolunteerProfile = require('../models/VolunteerProfile');
const AssistanceRequest = require('../models/AssistanceRequest');

// @desc    Create a volunteer assignment
// @route   POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const { volunteerId, requestId, taskDescription, priority } = req.body;

    // Check if volunteer exists and is available
    const volunteer = await VolunteerProfile.findOne({ user: volunteerId });
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer profile not found' });
    }

    // Create assignment
    const assignment = await VolunteerAssignment.create({
      volunteer: volunteerId,
      request: requestId,
      taskDescription,
      assignedBy: req.user._id,
      priority: priority || 'Normal'
    });

    // Update volunteer availability
    volunteer.availability = 'Assigned';
    await volunteer.save();

    // Update request status
    await AssistanceRequest.findByIdAndUpdate(requestId, {
      status: 'Assigned',
      assignedVolunteer: volunteerId
    });

    const populated = await assignment.populate([
      { path: 'volunteer', select: 'name email phone' },
      { path: 'request' },
      { path: 'assignedBy', select: 'name' }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get assignments (filtered by role)
// @route   GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const { status, volunteerId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (req.user.role === 'volunteer') {
      query.volunteer = req.user._id;
    }

    if (status) query.status = status;
    if (volunteerId) query.volunteer = volunteerId;

    const total = await VolunteerAssignment.countDocuments(query);
    const assignments = await VolunteerAssignment.find(query)
      .populate('volunteer', 'name email phone')
      .populate('request')
      .populate('assignedBy', 'name')
      .sort({ assignedDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      assignments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update assignment status
// @route   PUT /api/assignments/:id
const updateAssignment = async (req, res) => {
  try {
    const assignment = await VolunteerAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Volunteers can only update their own assignments (and only status)
    if (req.user.role === 'volunteer') {
      if (assignment.volunteer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this assignment' });
      }
      // Volunteers can only update status
      const allowed = ['status'];
      const updates = {};
      allowed.forEach(field => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });
      Object.assign(assignment, updates);
    } else {
      Object.assign(assignment, req.body);
    }

    if (req.body.status === 'Completed') {
      assignment.completionDate = new Date();

      // Update volunteer stats
      const profile = await VolunteerProfile.findOne({ user: assignment.volunteer });
      if (profile) {
        profile.completedAssignments += 1;
        profile.availability = 'Available';
        await profile.save();
      }

      // Update request status
      await AssistanceRequest.findByIdAndUpdate(assignment.request, {
        status: 'Completed'
      });
    }

    if (req.body.status === 'In Progress' && oldStatus === 'Assigned') {
      await AssistanceRequest.findByIdAndUpdate(assignment.request, {
        status: 'In Progress'
      });
    }

    const updated = await assignment.save();
    const populated = await updated.populate([
      { path: 'volunteer', select: 'name email phone' },
      { path: 'request' },
      { path: 'assignedBy', select: 'name' }
    ]);

    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get volunteer task statistics
// @route   GET /api/assignments/stats
const getVolunteerStats = async (req, res) => {
  try {
    const volunteerId = req.user._id;

    const assigned = await VolunteerAssignment.countDocuments({ volunteer: volunteerId, status: 'Assigned' });
    const inProgress = await VolunteerAssignment.countDocuments({ volunteer: volunteerId, status: 'In Progress' });
    const completed = await VolunteerAssignment.countDocuments({ volunteer: volunteerId, status: 'Completed' });

    res.json({ assigned, inProgress, completed, total: assigned + inProgress + completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAssignment, getAssignments, updateAssignment, getVolunteerStats };
