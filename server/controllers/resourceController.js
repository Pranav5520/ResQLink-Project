const Resource = require('../models/Resource');

// @desc    Create a resource
// @route   POST /api/resources
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      lastUpdatedBy: req.user._id
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all resources with filtering
// @route   GET /api/resources
const getResources = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { storageLocation: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Resource.countDocuments(query);
    const resources = await Resource.find(query)
      .populate('lastUpdatedBy', 'name')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      resources,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('lastUpdatedBy', 'name');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    Object.assign(resource, req.body, { lastUpdatedBy: req.user._id });
    const updated = await resource.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resource statistics
// @route   GET /api/resources/stats/overview
const getResourceStats = async (req, res) => {
  try {
    const byCategory = await Resource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } }
    ]);

    const byStatus = await Resource.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const totalResources = await Resource.countDocuments();
    const lowStock = await Resource.countDocuments({ status: 'Low Stock' });
    const outOfStock = await Resource.countDocuments({ status: 'Out of Stock' });

    res.json({ byCategory, byStatus, totalResources, lowStock, outOfStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createResource, getResources, getResourceById, updateResource, deleteResource, getResourceStats };
