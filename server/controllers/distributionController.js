const ResourceDistribution = require('../models/ResourceDistribution');
const Resource = require('../models/Resource');

// @desc    Create a distribution record
// @route   POST /api/distributions
const createDistribution = async (req, res) => {
  try {
    const { resourceId, quantityDistributed, destination, reliefCamp, emergencyArea, notes } = req.body;

    // Check resource availability
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    if (resource.quantity < quantityDistributed) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${resource.quantity} ${resource.unit}`
      });
    }

    // Deduct from inventory
    resource.quantity -= quantityDistributed;
    await resource.save();

    // Create distribution record
    const distribution = await ResourceDistribution.create({
      resource: resourceId,
      quantityDistributed,
      destination,
      reliefCamp,
      emergencyArea,
      distributedBy: req.user._id,
      notes
    });

    const populated = await distribution.populate([
      { path: 'resource', select: 'name category unit' },
      { path: 'distributedBy', select: 'name' },
      { path: 'reliefCamp', select: 'name' }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all distributions
// @route   GET /api/distributions
const getDistributions = async (req, res) => {
  try {
    const { page = 1, limit = 20, resourceId } = req.query;
    const query = {};

    if (resourceId) query.resource = resourceId;

    const total = await ResourceDistribution.countDocuments(query);
    const distributions = await ResourceDistribution.find(query)
      .populate('resource', 'name category unit')
      .populate('distributedBy', 'name')
      .populate('reliefCamp', 'name')
      .sort({ distributionDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      distributions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get distribution statistics
// @route   GET /api/distributions/stats
const getDistributionStats = async (req, res) => {
  try {
    const totalDistributions = await ResourceDistribution.countDocuments();

    const byResource = await ResourceDistribution.aggregate([
      {
        $lookup: {
          from: 'resources',
          localField: 'resource',
          foreignField: '_id',
          as: 'resourceInfo'
        }
      },
      { $unwind: '$resourceInfo' },
      {
        $group: {
          _id: '$resourceInfo.category',
          totalDistributed: { $sum: '$quantityDistributed' },
          count: { $sum: 1 }
        }
      }
    ]);

    const recentDistributions = await ResourceDistribution.find()
      .populate('resource', 'name category')
      .sort({ distributionDate: -1 })
      .limit(10);

    res.json({ totalDistributions, byResource, recentDistributions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDistribution, getDistributions, getDistributionStats };
