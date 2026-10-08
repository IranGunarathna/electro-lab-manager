// backend/routes/borrowRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBorrowRequest,
  getMyBorrows,
  getAllBorrows,
  approveBorrow,
  rejectBorrow,
  handoverBorrow,
  returnBorrow,
  getBorrowNotifications
} = require('../controllers/borrowController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student & User routes
router.post('/', protect, createBorrowRequest);
router.get('/my-borrows', protect, getMyBorrows);
router.get('/notifications', protect, getBorrowNotifications);

// Admin & Lab Assistant routes
router.get('/', protect, authorize('LabAssistant', 'Admin'), getAllBorrows);
router.put('/:id/approve', protect, authorize('LabAssistant', 'Admin'), approveBorrow);
router.put('/:id/reject', protect, authorize('LabAssistant', 'Admin'), rejectBorrow);
router.put('/:id/handover', protect, authorize('LabAssistant', 'Admin'), handoverBorrow);
router.put('/:id/return', protect, authorize('LabAssistant', 'Admin'), returnBorrow);

module.exports = router;
