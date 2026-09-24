// backend/routes/componentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent
} = require('../controllers/componentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getComponents)
  .post(protect, authorize('LabAssistant', 'Admin'), createComponent);

router
  .route('/:id')
  .get(getComponentById)
  .put(protect, authorize('LabAssistant', 'Admin'), updateComponent);

module.exports = router;