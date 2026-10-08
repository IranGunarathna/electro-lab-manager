const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    borrowId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentRegNo: {
      type: String,
      required: true,
      trim: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    studentEmail: {
      type: String,
      trim: true
    },
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: true
    },
    componentName: {
      type: String,
      required: true,
      trim: true
    },
    componentSpec: {
      type: String,
      trim: true
    },
    lab: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: 'Main Store / Worktable'
    },
    project: {
      type: String,
      required: true,
      trim: true
    },
    projectType: {
      type: String,
      default: 'Coursework Project'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
      default: 3
    },
    notes: {
      type: String,
      trim: true
    },
    // Status lifecycle:
    // 'Pending': Student requested, awaiting Admin approval
    // 'Approved': Admin approved, pickup window & allocated duration set
    // 'Active': Student picked up, currently in use
    // 'Rejected': Admin rejected with reason
    // 'Returned': Component returned to lab inventory
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Active', 'Rejected', 'Returned'],
      default: 'Pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedByName: {
      type: String
    },
    reviewedAt: {
      type: Date
    },
    pickupTime: {
      type: String // e.g. "Tomorrow 10:00 AM - 12:00 PM at Lab Issue Counter"
    },
    allocatedTime: {
      type: String // e.g. "3 Days (Due: Oct 10, 2026)"
    },
    dueDate: {
      type: Date
    },
    rejectionReason: {
      type: String
    },
    adminNotes: {
      type: String
    },
    returnedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Borrow', borrowSchema);
