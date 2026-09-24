// backend/controllers/authController.js
const User = require('../models/User');
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

    const user = await User.findOne({ uniEmail });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        userId: user.userId,
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