
const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema(
  {
    labId: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    building: { type: String, required: true },
    roomNo: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Laboratory', laboratorySchema);