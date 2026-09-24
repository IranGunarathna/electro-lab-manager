
const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    batchNo: { type: String, required: true, unique: true, trim: true },
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: true
    },
    dateReceived: { type: Date, default: Date.now },
    quantityInStock: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Batch', batchSchema);