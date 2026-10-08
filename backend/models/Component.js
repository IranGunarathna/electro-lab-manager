const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema(
  {
    compId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    spec: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      default: 'General'
    },
    category: {
      type: String,
      default: 'Component'
    },
    lab: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true,
      default: 'Worktable 1'
    },
    shelfLoc: {
      type: String,
      default: 'Worktable 1'
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    stockQty: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    usageType: {
      type: String,
      enum: ['Takeaway Borrowable', 'Lab-Reference Only', 'Consumable'],
      default: 'Lab-Reference Only'
    },
    maxLoanDurationDays: {
      type: Number,
      default: 3
    },
    status: {
      type: String,
      enum: ['Available', 'Low Stock', 'Out of Stock', 'Under Maintenance'],
      default: 'Available'
    },
    description: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Component', componentSchema);
