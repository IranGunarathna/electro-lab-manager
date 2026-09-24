// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  requestBorrow,
  returnComponent,
  getMyTransactions,
  getAllTransactions
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/borrow', protect, requestBorrow);
router.post('/return', protect, authorize('LabAssistant', 'Admin'), returnComponent);
router.get('/my-history', protect, getMyTransactions);
router.get('/', protect, authorize('LabAssistant', 'Admin'), getAllTransactions);

module.exports = router;