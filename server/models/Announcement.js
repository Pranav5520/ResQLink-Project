const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['Flood', 'Cyclone', 'Earthquake', 'Fire', 'Landslide', 'Medical Emergency', 'Building Collapse', 'Road Accident', 'General', 'Other'],
    default: 'General'
  },
  targetArea: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Information', 'Warning', 'Emergency'],
    default: 'Information'
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiryDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

announcementSchema.index({ isActive: 1, priority: 1 });
announcementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
