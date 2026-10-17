const mongoose = require('mongoose');

const resourceDistributionSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  quantityDistributed: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  reliefCamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReliefCamp'
  },
  emergencyArea: {
    type: String,
    trim: true
  },
  distributedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  distributionDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

resourceDistributionSchema.index({ resource: 1 });
resourceDistributionSchema.index({ distributionDate: -1 });

module.exports = mongoose.model('ResourceDistribution', resourceDistributionSchema);
