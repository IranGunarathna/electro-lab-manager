// backend/controllers/authController.js
const User = require('../models/User');
const PasswordResetRequest = require('../models/PasswordResetRequest');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { userId, uniEmail, password, firstName, lastName, dept, phoneNumbers, role } = req.body;

    const userExists = await User.findOne({ $or: [{ uniEmail }, { userId }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this ID or Email already exists' });
    }

    const user = await User.create({
      userId,
      uniEmail,
      password,
      firstName,
      lastName,
      dept,
      phoneNumbers,
      role
    });

    res.status(201).json({
      _id: user._id,
      userId: user.userId,
      uniEmail: user.uniEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { uniEmail, password } = req.body;
    const identifier = (uniEmail || '').trim();
    const upperId = identifier.toUpperCase();
    const emailCandidate = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');

    const user = await User.findOne({
      $or: [
        { uniEmail: identifier.toLowerCase() },
        { uniEmail: `${emailCandidate}@eng.ruh.ac.lk` },
        { userId: upperId },
        { regNo: upperId },
        { userId: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        { regNo: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      ]
    });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        userId: user.userId,
        regNo: user.regNo || user.userId,
        semester: user.semester,
        uniEmail: user.uniEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Initiate password reset (Generate verification code)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ message: 'Registration number or university email is required.' });
    }

    const cleanId = identifier.trim();
    const upperId = cleanId.toUpperCase();
    const emailCandidate = cleanId.toLowerCase().replace(/[^a-z0-9]/g, '');

    const user = await User.findOne({
      $or: [
        { uniEmail: cleanId.toLowerCase() },
        { uniEmail: `${emailCandidate}@eng.ruh.ac.lk` },
        { userId: upperId },
        { regNo: upperId },
        { userId: new RegExp(`^${cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        { regNo: new RegExp(`^${cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: `No account found for "${cleanId}". Please check your Student Registration No. or contact DEIE Lab Administration.`
      });
    }

    // Generate 6-digit OTP verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = expires;
    await user.save();

    // Mask the email address for privacy
    const emailParts = user.uniEmail.split('@');
    const prefix = emailParts[0];
    const maskedPrefix = prefix.length > 3 ? `${prefix.slice(0, 2)}***${prefix.slice(-1)}` : `${prefix}***`;
    const maskedEmail = `${maskedPrefix}@${emailParts[1] || 'eng.ruh.ac.lk'}`;

    res.status(200).json({
      success: true,
      message: `Password verification code generated for ${user.firstName} ${user.lastName}.`,
      regNo: user.regNo || user.userId,
      email: maskedEmail,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      resetCode // Included for seamless course testing & verification
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password using verification code
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { identifier, resetCode, newPassword } = req.body;

    if (!identifier || !resetCode || !newPassword) {
      return res.status(400).json({ message: 'Identifier, verification code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const cleanId = identifier.trim();
    const upperId = cleanId.toUpperCase();
    const emailCandidate = cleanId.toLowerCase().replace(/[^a-z0-9]/g, '');

    const user = await User.findOne({
      $or: [
        { uniEmail: cleanId.toLowerCase() },
        { uniEmail: `${emailCandidate}@eng.ruh.ac.lk` },
        { userId: upperId },
        { regNo: upperId }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    if (!user.resetPasswordToken || user.resetPasswordToken !== resetCode.trim()) {
      return res.status(400).json({ message: 'Invalid or incorrect verification code. Please check and try again.' });
    }

    if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
    }

    // Set new password (pre-save hook hashes with bcrypt automatically)
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Student submits request for admin password reset
// @route   POST /api/auth/password-reset-request
// @access  Public
exports.submitPasswordResetRequest = async (req, res) => {
  try {
    const { identifier, contactPhone, reason } = req.body;
    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ message: 'Registration number or university email is required.' });
    }

    const cleanId = identifier.trim();
    const upperId = cleanId.toUpperCase();
    const emailCandidate = cleanId.toLowerCase().replace(/[^a-z0-9]/g, '');

    const user = await User.findOne({
      $or: [
        { uniEmail: cleanId.toLowerCase() },
        { uniEmail: `${emailCandidate}@eng.ruh.ac.lk` },
        { userId: upperId },
        { regNo: upperId },
        { userId: new RegExp(`^${cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        { regNo: new RegExp(`^${cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: `No student record found matching "${cleanId}". Please check your Student Registration No. or contact the DEIE Admin.`
      });
    }

    // Check if there is already a Pending request for this student
    const existingPending = await PasswordResetRequest.findOne({
      student: user._id,
      status: 'Pending'
    });

    if (existingPending) {
      return res.status(200).json({
        success: true,
        alreadyPending: true,
        message: `A password reset request is already active for ${user.firstName} ${user.lastName} (${user.regNo || user.userId}). The DEIE Administrator has been notified.`
      });
    }

    const newRequest = await PasswordResetRequest.create({
      student: user._id,
      studentRegNo: user.regNo || user.userId,
      studentName: `${user.firstName} ${user.lastName}`.trim(),
      studentEmail: user.uniEmail,
      contactPhone: contactPhone ? contactPhone.trim() : (user.phoneNumbers?.[0] || ''),
      reason: reason ? reason.trim() : 'Student forgot password and requested reset via login portal.',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: `Password reset request submitted successfully. The DEIE Administrator has been notified to verify and reset your credentials.`,
      request: newRequest
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all password reset requests (Admin only)
// @route   GET /api/auth/password-reset-requests
// @access  Private (Admin)
exports.getPasswordResetRequests = async (req, res) => {
  try {
    const requests = await PasswordResetRequest.find()
      .populate('student', 'firstName lastName regNo uniEmail semester dept')
      .sort({ createdAt: -1 });

    const pendingCount = requests.filter((r) => r.status === 'Pending').length;

    res.status(200).json({ requests, pendingCount });
  } catch (error) {
    console.error('Error fetching reset requests:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin resets student password & marks request resolved
// @route   PUT /api/auth/password-reset-requests/:id/resolve
// @access  Private (Admin)
exports.resolvePasswordResetRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword = 'password123', adminNotes } = req.body;

    const resetReq = await PasswordResetRequest.findById(id);
    if (!resetReq) {
      return res.status(404).json({ message: 'Reset request not found' });
    }

    const student = await User.findById(resetReq.student);
    if (!student) {
      return res.status(404).json({ message: 'Associated student record not found' });
    }

    const finalPassword = (newPassword && newPassword.trim().length >= 6) ? newPassword.trim() : 'password123';

    // Update password (pre-save hook hashes with bcrypt automatically)
    student.password = finalPassword;
    student.resetPasswordToken = null;
    student.resetPasswordExpires = null;
    await student.save();

    resetReq.status = 'Resolved';
    resetReq.resolvedBy = req.user._id;
    resetReq.resolvedAt = new Date();
    resetReq.adminNotes = adminNotes || `Password reset to "${finalPassword}" by System Admin`;
    await resetReq.save();

    res.status(200).json({
      success: true,
      message: `Password for ${student.firstName} ${student.lastName} (${student.regNo || student.userId}) has been reset to "${finalPassword}".`,
      resetReq
    });
  } catch (error) {
    console.error('Error resolving password reset:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin dismisses a password reset request
// @route   PUT /api/auth/password-reset-requests/:id/dismiss
// @access  Private (Admin)
exports.dismissPasswordResetRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const resetReq = await PasswordResetRequest.findById(id);
    if (!resetReq) {
      return res.status(404).json({ message: 'Reset request not found' });
    }

    resetReq.status = 'Dismissed';
    resetReq.resolvedBy = req.user._id;
    resetReq.resolvedAt = new Date();
    await resetReq.save();

    res.status(200).json({
      success: true,
      message: 'Password reset request dismissed.',
      resetReq
    });
  } catch (error) {
    console.error('Error dismissing reset request:', error);
    res.status(500).json({ message: error.message });
  }
};


