const mongoose = require('mongoose');

const volunteerAssignmentSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssistanceRequest',
    required: true
  },
  taskDescription: {
    type: String,
    required: [true, 'Task description is required'],
    maxlength: 1000
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['Normal', 'Urgent', 'Critical'],
    default: 'Normal'
  },
  status: {
    type: String,
    enum: ['Assigned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Assigned'
  },
  completionDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

volunteerAssignmentSchema.index({ volunteer: 1, status: 1 });
volunteerAssignmentSchema.index({ request: 1 });

module.exports = mongoose.model('VolunteerAssignment', volunteerAssignmentSchema);
