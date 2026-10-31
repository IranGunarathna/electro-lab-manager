// backend/controllers/componentController.js
const Component = require('../models/Component');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/components');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${baseName}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed!'), false);
  }
};

exports.upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// @desc    Upload component image to local folder
// @route   POST /api/components/upload
// @access  Private (LabAssistant, Admin)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const relativePath = `/uploads/components/${req.file.filename}`;
    res.status(200).json({
      message: 'Image uploaded successfully to server folder',
      imageUrl: relativePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all components (with optional search/filtering)
// @route   GET /api/components
// @access  Public (or Protected)
exports.getComponents = async (req, res) => {
  try {
    const { search, type, lab } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { compId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { spec: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    if (lab && lab !== 'All' && lab !== 'All Laboratories') {
      query.lab = lab;
    }

    const components = await Component.find(query).sort({ createdAt: -1 });
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

// @desc    Create a new component (Admin / LabAssistant only)
// @route   POST /api/components
// @access  Private (LabAssistant, Admin)
exports.createComponent = async (req, res) => {
  try {
    const {
      compId,
      name,
      spec,
      type,
      category,
      lab,
      location,
      shelfLoc,
      totalQuantity = 1,
      stockQty,
      availableQuantity,
      usageType,
      maxLoanDurationDays = 3,
      description,
      imageUrl
    } = req.body;

    if (!compId || !name || !lab) {
      return res.status(400).json({ message: 'Component ID, Name, and Laboratory are required fields.' });
    }

    const existingComp = await Component.findOne({ compId });
    if (existingComp) {
      return res.status(400).json({ message: `Component with ID "${compId}" already exists in the inventory.` });
    }

    const finalImage = req.file ? `/uploads/components/${req.file.filename}` : (imageUrl || '');
    const finalTotal = Number(totalQuantity) || 1;
    const finalStock = stockQty !== undefined ? Number(stockQty) : finalTotal;
    const finalAvail = availableQuantity !== undefined ? Number(availableQuantity) : finalStock;

    const component = await Component.create({
      compId: compId.trim().toUpperCase(),
      name: name.trim(),
      spec: spec ? spec.trim() : name.trim(),
      type: type || 'Equipment',
      category: category || 'Equipment',
      lab: lab.trim(),
      location: location || shelfLoc || 'Worktable 1',
      shelfLoc: shelfLoc || location || 'Worktable 1',
      totalQuantity: finalTotal,
      stockQty: finalStock,
      availableQuantity: finalAvail,
      usageType: usageType || 'Takeaway Borrowable',
      maxLoanDurationDays: Number(maxLoanDurationDays) || 3,
      status: finalAvail > 0 ? 'Available' : 'Out of Stock',
      description: description || '',
      imageUrl: finalImage
    });

    res.status(201).json({
      message: 'New component created successfully and added to database',
      component
    });
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update component details (Admin / LabAssistant only)
// @route   PUT /api/components/:id
// @access  Private (LabAssistant, Admin)
exports.updateComponent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/components/${req.file.filename}`;
    }

    if (updateData.availableQuantity !== undefined) {
      updateData.availableQuantity = Number(updateData.availableQuantity);
      if (updateData.availableQuantity > 0 && updateData.status === 'Out of Stock') {
        updateData.status = 'Available';
      } else if (updateData.availableQuantity === 0) {
        updateData.status = 'Out of Stock';
      }
    }

    const component = await Component.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    res.status(200).json({
      message: 'Component updated successfully',
      component
    });
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete component safely (Admin / LabAssistant only)
// @route   DELETE /api/components/:id
// @access  Private (LabAssistant, Admin)
exports.deleteComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    // Safety check: ensure component is not tied to active/ongoing loans
    const Borrow = require('../models/Borrow');
    const activeBorrow = await Borrow.findOne({
      $or: [
        { component: component._id },
        { componentName: component.name }
      ],
      status: { $in: ['Requested', 'Approved', 'Borrowed', 'Issued'] }
    });

    if (activeBorrow) {
      return res.status(400).json({
        message: `Cannot safely delete "${component.name}". It is currently linked to an active loan record (ID: ${activeBorrow.borrowId}). Please return or resolve the loan first.`
      });
    }

    await Component.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: `Component "${component.name}" (${component.compId}) was safely removed from inventory.`
    });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ message: error.message });
  }
};