const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Flood', 'Cyclone', 'Earthquake', 'Fire', 'Landslide', 'Medical Emergency', 'Building Collapse', 'Road Accident', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: -180,
    max: 180
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  peopleAffected: {
    type: Number,
    default: 0,
    min: 0
  },
  contactNumber: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Reported'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  district: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

emergencySchema.index({ status: 1, severity: 1 });
emergencySchema.index({ category: 1 });
emergencySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Emergency', emergencySchema);
