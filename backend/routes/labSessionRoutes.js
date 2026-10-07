// backend/routes/labSessionRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllLabSessions,
  getStudentLabSessions,
  getStudentsList,
  allocateStudentLabSession,
  getLabSessionById,
  checkInLabSession,
  completeLabSession,
  verifyAndRestockLabSession
} = require('../controllers/labSessionController');

// List all sessions (supports filtering query params)
router.get('/', getAllLabSessions);

// Get list of all students for Admin allocation
router.get('/students', getStudentsList);

// Admin allocates a lab session to a student
router.post('/allocate', allocateStudentLabSession);

// Get student's assigned lab sessions
router.get('/student/:email', getStudentLabSessions);

// Get specific lab session details
router.get('/:id', getLabSessionById);

// Student check-in to worktable
router.put('/:id/check-in', checkInLabSession);

// Student marks session completed
router.put('/:id/complete', completeLabSession);

// Admin/Lab officer verifies return and restocks inventory
router.put('/:id/verify-return', verifyAndRestockLabSession);

module.exports = router;
