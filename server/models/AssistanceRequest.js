const mongoose = require('mongoose');

const assistanceRequestSchema = new mongoose.Schema({
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestType: {
    type: String,
    required: [true, 'Request type is required'],
    enum: ['Rescue', 'Food', 'Drinking Water', 'Medicine', 'Medical Assistance', 'Shelter', 'Clothing', 'Transportation', 'Electricity', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  peopleCount: {
    type: Number,
    default: 1,
    min: 1
  },
  priority: {
    type: String,
    enum: ['Normal', 'Urgent', 'Critical'],
    default: 'Normal'
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
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed', 'Rejected'],
    default: 'Pending'
  },
  assignedVolunteer: {
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
  },
  resolvedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

assistanceRequestSchema.index({ status: 1, priority: 1 });
assistanceRequestSchema.index({ citizen: 1 });
assistanceRequestSchema.index({ assignedVolunteer: 1 });
assistanceRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AssistanceRequest', assistanceRequestSchema);
