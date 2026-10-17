const Emergency = require('../models/Emergency');
const AssistanceRequest = require('../models/AssistanceRequest');
const VolunteerProfile = require('../models/VolunteerProfile');
const VolunteerAssignment = require('../models/VolunteerAssignment');
const ReliefCamp = require('../models/ReliefCamp');
const Resource = require('../models/Resource');
const User = require('../models/User');

// @desc    Get dashboard overview stats
// @route   GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    const [
      activeEmergencies,
      pendingRequests,
      criticalRequests,
      availableVolunteers,
      deployedVolunteers,
      busyVolunteers,
      activeCamps,
      campOccupancy,
      totalResources,
      lowStockResources,
      completedTasks,
      totalCitizens,
      totalEmergencies,
      totalRequests
    ] = await Promise.all([
      Emergency.countDocuments({ status: { $in: ['Reported', 'Verified', 'In Progress'] } }),
      AssistanceRequest.countDocuments({ status: 'Pending' }),
      AssistanceRequest.countDocuments({ priority: 'Critical', status: { $in: ['Pending', 'Verified', 'Assigned'] } }),
      VolunteerProfile.countDocuments({ availability: 'Available' }),
      VolunteerProfile.countDocuments({ availability: 'Assigned' }),
      VolunteerProfile.countDocuments({ availability: 'Busy' }),
      ReliefCamp.countDocuments({ status: { $in: ['Active', 'Nearly Full'] } }),
      ReliefCamp.aggregate([
        { $group: { _id: null, totalCapacity: { $sum: '$maxCapacity' }, totalOccupied: { $sum: '$currentOccupancy' } } }
      ]),
      Resource.countDocuments(),
      Resource.countDocuments({ status: { $in: ['Low Stock', 'Out of Stock'] } }),
      VolunteerAssignment.countDocuments({ status: 'Completed' }),
      User.countDocuments({ role: 'citizen' }),
      Emergency.countDocuments(),
      AssistanceRequest.countDocuments()
    ]);

    res.json({
      activeEmergencies,
      pendingRequests,
      criticalRequests,
      availableVolunteers,
      deployedVolunteers,
      busyVolunteers,
      activeCamps,
      totalCapacity: campOccupancy[0]?.totalCapacity || 0,
      totalOccupied: campOccupancy[0]?.totalOccupied || 0,
      totalResources,
      lowStockResources,
      completedTasks,
      totalCitizens,
      totalEmergencies,
      totalRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get emergencies by category
// @route   GET /api/analytics/emergencies-by-category
const getEmergenciesByCategory = async (req, res) => {
  try {
    const result = await Emergency.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result.map(r => ({ category: r._id, count: r.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests by status
// @route   GET /api/analytics/requests-by-status
const getRequestsByStatus = async (req, res) => {
  try {
    const result = await AssistanceRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(result.map(r => ({ status: r._id, count: r.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get severity distribution
// @route   GET /api/analytics/severity-distribution
const getSeverityDistribution = async (req, res) => {
  try {
    const result = await Emergency.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    res.json(result.map(r => ({ severity: r._id, count: r.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get volunteer deployment stats
// @route   GET /api/analytics/volunteer-deployment
const getVolunteerDeployment = async (req, res) => {
  try {
    const result = await VolunteerProfile.aggregate([
      { $group: { _id: '$availability', count: { $sum: 1 } } }
    ]);
    res.json(result.map(r => ({ status: r._id, count: r.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests by type
// @route   GET /api/analytics/requests-by-type
const getRequestsByType = async (req, res) => {
  try {
    const result = await AssistanceRequest.aggregate([
      { $group: { _id: '$requestType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result.map(r => ({ type: r._id, count: r.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests over time (daily)
// @route   GET /api/analytics/requests-over-time
const getRequestsOverTime = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const result = await AssistanceRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result.map(r => ({ date: r._id, count: r.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comprehensive analytics with filters
// @route   GET /api/analytics/advanced
const getAdvancedAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, category, status, severity, requestType } = req.query;

    const emergencyMatch = {};
    const requestMatch = {};

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      emergencyMatch.createdAt = dateFilter;
      requestMatch.createdAt = dateFilter;
    }
    if (category) emergencyMatch.category = category;
    if (severity) emergencyMatch.severity = severity;
    if (status) {
      emergencyMatch.status = status;
      requestMatch.status = status;
    }
    if (requestType) requestMatch.requestType = requestType;

    // Most common emergency type
    const commonEmergency = await Emergency.aggregate([
      { $match: emergencyMatch },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Areas with highest emergencies
    const topAreas = await Emergency.aggregate([
      { $match: emergencyMatch },
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most requested resource type
    const commonRequests = await AssistanceRequest.aggregate([
      { $match: requestMatch },
      { $group: { _id: '$requestType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Average completion time
    const completionTime = await AssistanceRequest.aggregate([
      {
        $match: {
          ...requestMatch,
          status: 'Completed',
          resolvedAt: { $exists: true }
        }
      },
      {
        $project: {
          duration: { $subtract: ['$resolvedAt', '$createdAt'] }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$duration' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Citizens assisted
    const citizensAssisted = await AssistanceRequest.aggregate([
      { $match: { ...requestMatch, status: 'Completed' } },
      { $group: { _id: '$citizen' } },
      { $count: 'total' }
    ]);

    // Relief camp occupancy
    const campStats = await ReliefCamp.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, capacity: { $sum: '$maxCapacity' }, occupied: { $sum: '$currentOccupancy' } } }
    ]);

    // Resource consumption
    const resourceConsumption = await Resource.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Response completion rate
    const totalRequests = await AssistanceRequest.countDocuments(requestMatch);
    const completedRequests = await AssistanceRequest.countDocuments({ ...requestMatch, status: 'Completed' });
    const completionRate = totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(1) : 0;

    // Requests over time
    const requestsTimeline = await AssistanceRequest.aggregate([
      { $match: requestMatch },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      commonEmergency,
      topAreas,
      commonRequests,
      averageCompletionTime: completionTime[0] ? Math.round(completionTime[0].avgTime / (1000 * 60 * 60)) : 0,
      citizensAssisted: citizensAssisted[0]?.total || 0,
      campStats,
      resourceConsumption,
      completionRate: parseFloat(completionRate),
      requestsTimeline: requestsTimeline.map(r => ({ date: r._id, count: r.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOverview,
  getEmergenciesByCategory,
  getRequestsByStatus,
  getSeverityDistribution,
  getVolunteerDeployment,
  getRequestsByType,
  getRequestsOverTime,
  getAdvancedAnalytics
};
