const mongoose = require('mongoose');

const reliefCampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Camp name is required'],
    trim: true,
    maxlength: 200
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  state: {
    type: String,
    trim: true
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
  maxCapacity: {
    type: Number,
    required: [true, 'Maximum capacity is required'],
    min: 1
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: 0
  },
  contactPerson: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  facilities: [{
    type: String,
    enum: ['Food', 'Water', 'Beds', 'Toilets', 'Medical Support', 'Electricity', 'Women & Children Area', 'Accessibility Support']
  }],
  foodAvailable: {
    type: Boolean,
    default: false
  },
  waterAvailable: {
    type: Boolean,
    default: false
  },
  medicalSupport: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Nearly Full', 'Full', 'Closed'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Auto-update status based on occupancy
reliefCampSchema.pre('save', function (next) {
  if (this.currentOccupancy >= this.maxCapacity) {
    this.status = 'Full';
  } else if (this.currentOccupancy >= this.maxCapacity * 0.85) {
    this.status = 'Nearly Full';
  } else if (this.status !== 'Closed') {
    this.status = 'Active';
  }
  next();
});

reliefCampSchema.virtual('availableSpace').get(function () {
  return Math.max(0, this.maxCapacity - this.currentOccupancy);
});

reliefCampSchema.set('toJSON', { virtuals: true });

reliefCampSchema.index({ district: 1, status: 1 });
reliefCampSchema.index({ status: 1 });

module.exports = mongoose.model('ReliefCamp', reliefCampSchema);
