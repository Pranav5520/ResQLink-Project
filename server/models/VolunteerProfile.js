const mongoose = require('mongoose');

const volunteerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: [{
    type: String,
    enum: ['First Aid', 'Medical Support', 'Rescue', 'Food Distribution', 'Transportation', 'Communication', 'Shelter Management', 'Technical Support', 'General Volunteer']
  }],
  availability: {
    type: String,
    enum: ['Available', 'Assigned', 'Busy', 'Offline'],
    default: 'Available'
  },
  location: {
    type: String,
    trim: true
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180
  },
  experience: {
    type: String,
    trim: true,
    maxlength: 500
  },
  completedAssignments: {
    type: Number,
    default: 0
  },
  totalHours: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

volunteerProfileSchema.index({ availability: 1 });
volunteerProfileSchema.index({ skills: 1 });

module.exports = mongoose.model('VolunteerProfile', volunteerProfileSchema);
