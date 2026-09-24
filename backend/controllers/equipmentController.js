// backend/controllers/equipmentController.js
const Equipment = require('../models/Equipment');
const Laboratory = require('../models/Laboratory');

// @desc    Get all equipment with lab location details
// @route   GET /api/equipment
// @access  Public
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().populate('laboratory', 'labId building roomNo capacity');
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new piece of equipment
// @route   POST /api/equipment
// @access  Private (Admin, LabAssistant)
exports.createEquipment = async (req, res) => {
  try {
    const { eqId, serialNo, modelName, status, laboratoryId } = req.body;

    const lab = await Laboratory.findById(laboratoryId);
    if (!lab) {
      return res.status(404).json({ message: 'Target laboratory does not exist' });
    }

    const item = await Equipment.create({
      eqId,
      serialNo,
      modelName,
      status: status || 'Available',
      laboratory: lab._id
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update equipment status (e.g. In Use, Under Maintenance)
// @route   PATCH /api/equipment/:id/status
// @access  Private (Admin, LabAssistant)
exports.updateEquipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Equipment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};