const express = require('express');
const router = express.Router();
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getItems)
  .post(protect, authorizeRoles('Admin', 'LabAssistant'), createItem);

router.route('/:id')
  .put(protect, authorizeRoles('Admin', 'LabAssistant'), updateItem)
  .delete(protect, authorizeRoles('Admin'), deleteItem);

module.exports = router;