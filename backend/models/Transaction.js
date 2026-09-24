
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transId: { type: String, 
        required: true, 
        unique: true,
         trim: true },
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: true
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch'
    },
    actionType: {
      type: String,
      enum: ['RESTOCK', 'BORROW', 'RETURN', 'DISCARD'],
      required: true
    },
    quantity: { type: Number, 
        required: true, 
        min: 1 },
    date: { type: Date, 
        default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);