const ReliefCamp = require('../models/ReliefCamp');

// @desc    Create a relief camp
// @route   POST /api/camps
const createCamp = async (req, res) => {
  try {
    const camp = await ReliefCamp.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(camp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all camps with filtering
// @route   GET /api/camps
const getCamps = async (req, res) => {
  try {
    const { status, district, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (district) query.district = district;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await ReliefCamp.countDocuments(query);
    const camps = await ReliefCamp.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      camps,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single camp
// @route   GET /api/camps/:id
const getCampById = async (req, res) => {
  try {
    const camp = await ReliefCamp.findById(req.params.id)
      .populate('createdBy', 'name');
    if (!camp) {
      return res.status(404).json({ message: 'Relief camp not found' });
    }
    res.json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update camp
// @route   PUT /api/camps/:id
const updateCamp = async (req, res) => {
  try {
    const camp = await ReliefCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Relief camp not found' });
    }

    Object.assign(camp, req.body);
    // Validate occupancy doesn't exceed capacity
    if (camp.currentOccupancy > camp.maxCapacity) {
      return res.status(400).json({ message: `Occupancy (${camp.currentOccupancy}) cannot exceed capacity (${camp.maxCapacity})` });
    }
    if (camp.currentOccupancy < 0) {
      return res.status(400).json({ message: 'Occupancy cannot be negative' });
    }
    const updated = await camp.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete camp
// @route   DELETE /api/camps/:id
const deleteCamp = async (req, res) => {
  try {
    const camp = await ReliefCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Relief camp not found' });
    }
    await camp.deleteOne();
    res.json({ message: 'Camp removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get camp statistics
// @route   GET /api/camps/stats/overview
const getCampStats = async (req, res) => {
  try {
    const stats = await ReliefCamp.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCapacity: { $sum: '$maxCapacity' },
          totalOccupancy: { $sum: '$currentOccupancy' }
        }
      }
    ]);

    const totalCamps = await ReliefCamp.countDocuments();
    const totalCapacity = await ReliefCamp.aggregate([
      { $group: { _id: null, total: { $sum: '$maxCapacity' }, occupied: { $sum: '$currentOccupancy' } } }
    ]);

    res.json({
      byStatus: stats,
      totalCamps,
      totalCapacity: totalCapacity[0]?.total || 0,
      totalOccupied: totalCapacity[0]?.occupied || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCamp, getCamps, getCampById, updateCamp, deleteCamp, getCampStats };
