const mongoose = require('mongoose');

const requiredEquipmentItemSchema = new mongoose.Schema({
  componentId: { type: String, trim: true },
  name: { type: String, required: true },
  spec: { type: String },
  quantityRequired: { type: Number, default: 1 },
  isConsumable: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Allocated', 'Checked Out', 'Returned Good', 'Damaged', 'Consumed'],
    default: 'Allocated'
  }
});

const labSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    courseCode: {
      type: String,
      required: true,
      trim: true
    }, // e.g. 'EE3301', 'EE4306', 'EE3203', 'EE3306', 'EE4301', 'EE4304'
    courseName: {
      type: String,
      required: true,
      trim: true
    }, // e.g. 'Analog Electronics', 'Engineering Electromagnetics'
    semester: {
      type: Number,
      required: true,
      enum: [3, 4]
    },
    labNumber: {
      type: Number,
      required: true
    }, // 1, 2, 3, 4
    title: {
      type: String,
      required: true,
      trim: true
    },
    labName: {
      type: String,
      required: true
    }, // e.g. 'Electronics and Measurements Laboratory'
    worktable: {
      type: String,
      required: true,
      default: 'Worktable 1'
    }, // Worktable 1 to Worktable 12
    scheduledDate: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      required: true,
      default: '09:00 - 12:00'
    },
    assignedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    studentDetails: {
      userId: { type: String },
      name: { type: String },
      uniEmail: { type: String }
    },
    batch: {
      type: String,
      default: 'E/21/EE'
    },
    requiredEquipment: [requiredEquipmentItemSchema],
    status: {
      type: String,
      enum: ['Scheduled', 'In-Progress', 'Completed', 'Verified', 'Cancelled'],
      default: 'Scheduled'
    },
    checkInTime: {
      type: Date
    },
    completionTime: {
      type: Date
    },
    adminInspection: {
      inspectedBy: { type: String },
      inspectedAt: { type: Date },
      remarks: { type: String },
      damagesOrShortages: [{ type: String }]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LabSession', labSessionSchema);
