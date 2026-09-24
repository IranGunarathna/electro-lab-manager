// backend/controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Component = require('../models/Component');

// @desc    Request a component borrow
// @route   POST /api/transactions/borrow
// @access  Private (Students, TAs, Admins)
exports.requestBorrow = async (req, res) => {
  try {
    const { componentId, quantity } = req.body;

    const component = await Component.findById(componentId);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    if (component.stockQty < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Generate unique transaction ID
    const transId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const transaction = await Transaction.create({
      transId,
      initiator: req.user._id,
      component: component._id,
      actionType: 'BORROW',
      quantity
    });

    // Deduct stock from the component
    component.stockQty -= quantity;
    await component.save();

    res.status(201).json({
      message: 'Borrow transaction logged successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a borrowed component
// @route   POST /api/transactions/return
// @access  Private (LabAssistant, Admin)
exports.returnComponent = async (req, res) => {
  try {
    const { componentId, quantity, initiatorId } = req.body;

    const component = await Component.findById(componentId);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    const transId = `RET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const transaction = await Transaction.create({
      transId,
      initiator: initiatorId || req.user._id,
      component: component._id,
      actionType: 'RETURN',
      quantity
    });

    // Increment stock
    component.stockQty += Number(quantity);
    await component.save();

    res.status(201).json({
      message: 'Return transaction processed',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's personal transaction history
// @route   GET /api/transactions/my-history
// @access  Private
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ initiator: req.user._id })
      .populate('component', 'compId spec type shelfLoc')
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all transactions (Audit log)
// @route   GET /api/transactions
// @access  Private (LabAssistant, Admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('initiator', 'userId firstName lastName uniEmail role')
      .populate('component', 'compId spec type shelfLoc')
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};