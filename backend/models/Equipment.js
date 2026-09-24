
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    eqId: { type: String, required: true, unique: true, trim: true },
    serialNo: { type: String, required: true, unique: true, trim: true },
    modelName: { type: String, required: true },
    status: {
      type: String,
      enum: ['Available', 'In Use', 'Under Maintenance', 'Decommissioned'],
      default: 'Available'
    },
    laboratory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Laboratory',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);