const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Water', 'Medicine', 'Clothing', 'Blankets', 'Rescue Equipment', 'Hygiene Kits', 'Fuel', 'Other']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  storageLocation: {
    type: String,
    trim: true
  },
  minimumStockLevel: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Low Stock', 'Out of Stock'],
    default: 'Available'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Auto-update stock status
resourceSchema.pre('save', function (next) {
  if (this.quantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity <= this.minimumStockLevel) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Available';
  }
  next();
});

resourceSchema.index({ category: 1, status: 1 });
resourceSchema.index({ name: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
