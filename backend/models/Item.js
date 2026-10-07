const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    compId: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an item name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    spec: {
      type: String,
      trim: true,
    },
    lab: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      default: 'Worktable 1',
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    usageType: {
      type: String,
      enum: ['Takeaway Borrowable', 'Lab-Reference Only', 'Consumable'],
      default: 'Lab-Reference Only',
    },
    maxLoanDurationDays: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      enum: ['Available', 'Low Stock', 'Out of Stock', 'Under Maintenance'],
      default: 'Available',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-update status based on availability before save
itemSchema.pre('save', function (next) {
  if (this.availableQuantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.availableQuantity < 5) {
    this.status = 'Low Stock';
  } else if (this.status !== 'Under Maintenance') {
    this.status = 'Available';
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);