// backend/controllers/componentController.js
const Component = require('../models/Component');

// @desc    Get all components (with optional search/filtering)
// @route   GET /api/components
// @access  Public (or Protected)
exports.getComponents = async (req, res) => {
  try {
    const { search, type } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { compId: { $regex: search, $options: 'i' } },
        { spec: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    const components = await Component.find(query);
    res.status(200).json(components);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single component by ID
// @route   GET /api/components/:id
// @access  Public
exports.getComponentById = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.status(200).json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new component
// @route   POST /api/components
// @access  Private (LabAssistant, Admin)
exports.createComponent = async (req, res) => {
  try {
    const { compId, type, spec, shelfLoc, stockQty } = req.body;

    const existingComp = await Component.findOne({ compId });
    if (existingComp) {
      return res.status(400).json({ message: 'Component ID already exists' });
    }

    const component = await Component.create({
      compId,
      type,
      spec,
      shelfLoc,
      stockQty: stockQty || 0
    });

    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update component details
// @route   PUT /api/components/:id
// @access  Private (LabAssistant, Admin)
exports.updateComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    res.status(200).json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};