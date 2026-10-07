// backend/routes/componentRoutes.js
const express = require('express');
const router = express.Router();

const {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent,
} = require('../controllers/componentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getComponents)
  .post(protect, authorizeRoles('LabAssistant', 'Admin'), createComponent);

router
  .route('/:id')
  .get(getComponentById)
  .put(protect, authorizeRoles('LabAssistant', 'Admin'), updateComponent);

module.exports = router;