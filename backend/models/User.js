
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    userId: { type: String,
         required: true, 
         unique: true, 
         trim: true },
    uniEmail: { type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true },
    password: { type: String,
         required: true },
    firstName: { type: String,
         required: true, 
         trim: true },
    lastName: { type: String, 
        required: true,
         trim: true },
    dept: { type: String,
         required: true },
    phoneNumbers: [{ type: String,
         trim: true }],
    role: {
      type: String,
      enum: ['Student', 'LabAssistant', 'Admin'],
      default: 'Student'
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

// password hashing

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//comparing the stored hash with the entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);