// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  submitPasswordResetRequest,
  getPasswordResetRequests,
  resolvePasswordResetRequest,
  dismissPasswordResetRequest
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Student request password reset
router.post('/password-reset-request', submitPasswordResetRequest);

// Admin-managed reset requests
router.get('/password-reset-requests', protect, authorize('Admin'), getPasswordResetRequests);
router.put('/password-reset-requests/:id/resolve', protect, authorize('Admin'), resolvePasswordResetRequest);
router.put('/password-reset-requests/:id/dismiss', protect, authorize('Admin'), dismissPasswordResetRequest);

module.exports = router;
