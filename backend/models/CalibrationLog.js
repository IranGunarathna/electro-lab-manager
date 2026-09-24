// backend/models/CalibrationLog.js
const mongoose = require('mongoose');

const calibrationLogSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true, trim: true },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    dateCalibrated: { type: Date, default: Date.now },
    passedStatus: {
      type: String,
      enum: ['PASSED', 'FAILED', 'NEEDS_REPAIR'],
      required: true
    },
    toNotes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CalibrationLog', calibrationLogSchema);