// backend/routes/equipmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEquipment,
  createEquipment,
  updateEquipmentStatus
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getEquipment)
  .post(protect, authorize('LabAssistant', 'Admin'), createEquipment);

router
  .route('/:id/status')
  .patch(protect, authorize('LabAssistant', 'Admin'), updateEquipmentStatus);

module.exports = router;