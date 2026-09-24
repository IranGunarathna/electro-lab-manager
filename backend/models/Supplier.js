
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    suppId: { type: String, required: true, unique: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, trim: true },
    suppEmail: { type: String, required: true, lowercase: true, trim: true },
    contactNo: { type: String, trim: true },
    suppliedComponents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Component'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);