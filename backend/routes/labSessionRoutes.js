// backend/routes/labSessionRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllLabSessions,
  getStudentLabSessions,
  getStudentsList,
  getStudentGroups,
  allocateStudentLabSession,
  allocateGroupLabSession,
  batchAllocateGroups,
  deleteLabSession,
  getLabSessionById,
  checkInLabSession,
  completeLabSession,
  verifyAndRestockLabSession
} = require('../controllers/labSessionController');

// List all sessions (supports filtering query params)
router.get('/', getAllLabSessions);

// Get list of all students for Admin allocation
router.get('/students', getStudentsList);

// Get student groups auto-distributed into 4 per group
router.get('/groups', getStudentGroups);

// Admin allocates an individual student to a worktable
router.post('/allocate', allocateStudentLabSession);

// Admin allocates an entire group to a worktable
router.post('/allocate-group', allocateGroupLabSession);

// Admin batch-allocates all groups in semester across worktables in one click
router.post('/allocate-batch-groups', batchAllocateGroups);

// Delete an allocated session
router.delete('/:id', deleteLabSession);

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

