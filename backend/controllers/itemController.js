const Item = require('../models/Item');

// @desc    Get all items (with optional search and category filters)
// @route   GET /api/items
// @access  Public (or Protected)
const getItems = async (req, res) => {
  try {
    const { keyword, category, status } = req.query;
    const query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new item/equipment
// @route   POST /api/items
// @access  Private (Admin, LabAssistant)
const createItem = async (req, res) => {
  try {
    const { name, category, lab, location, totalQuantity, availableQuantity, description } = req.body;

    const newItem = new Item({
      name,
      category,
      lab,
      location,
      totalQuantity: Number(totalQuantity),
      availableQuantity: availableQuantity !== undefined ? Number(availableQuantity) : Number(totalQuantity),
      description,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private (Admin, LabAssistant)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (Admin)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem };