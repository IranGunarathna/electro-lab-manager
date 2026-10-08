// backend/routes/componentRoutes.js
const express = require('express');
const router = express.Router();

const {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent,
  uploadImage,
  upload
} = require('../controllers/componentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Dedicated standalone image upload endpoint
router.post(
  '/upload',
  protect,
  authorizeRoles('LabAssistant', 'Admin'),
  upload.single('image'),
  uploadImage
);

router
  .route('/')
  .get(getComponents)
  .post(
    protect,
    authorizeRoles('LabAssistant', 'Admin'),
    upload.single('image'),
    createComponent
  );

router
  .route('/:id')
  .get(getComponentById)
  .put(
    protect,
    authorizeRoles('LabAssistant', 'Admin'),
    upload.single('image'),
    updateComponent
  );

module.exports = router;