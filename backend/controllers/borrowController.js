// backend/controllers/borrowController.js
const Borrow = require('../models/Borrow');
const Component = require('../models/Component');
const PasswordResetRequest = require('../models/PasswordResetRequest');

// @desc    Student requests a component borrow
// @route   POST /api/borrows
// @access  Private (Student, TA, Admin)
exports.createBorrowRequest = async (req, res) => {
  try {
    const {
      componentId,
      project,
      projectType,
      durationDays,
      quantity = 1,
      notes
    } = req.body;

    if (!componentId) {
      return res.status(400).json({ message: 'Component ID is required' });
    }
    if (!project || !project.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const component = await Component.findById(componentId);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    const reqQty = Number(quantity) || 1;
    if (component.availableQuantity < reqQty) {
      return res.status(400).json({
        message: `Insufficient stock available. Requested: ${reqQty}, Available: ${component.availableQuantity}`
      });
    }

    const borrowId = `BRW-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const studentName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Student';
    const studentRegNo = req.user.regNo || req.user.userId || 'EG/2023/STUDENT';

    const borrow = await Borrow.create({
      borrowId,
      student: req.user._id,
      studentRegNo,
      studentName,
      studentEmail: req.user.uniEmail,
      component: component._id,
      componentName: component.name || component.spec,
      componentSpec: component.spec || component.name,
      lab: component.lab,
      location: component.location || component.shelfLoc || 'Lab Worktable',
      project: project.trim(),
      projectType: projectType || 'Coursework Project',
      quantity: reqQty,
      durationDays: Number(durationDays) || 3,
      notes: notes || '',
      status: 'Pending'
    });

    res.status(201).json({
      message: 'Borrow request submitted successfully and queued for Lab Admin review.',
      borrow
    });
  } catch (error) {
    console.error('Error creating borrow request:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// @desc    Get logged-in user's personal borrow history & active items
// @route   GET /api/borrows/my-borrows
// @access  Private
exports.getMyBorrows = async (req, res) => {
  try {
    const studentReg = req.user.regNo || req.user.userId;
    const borrows = await Borrow.find({
      $or: [
        { student: req.user._id },
        { studentRegNo: studentReg },
        { studentEmail: req.user.uniEmail }
      ]
    })
      .populate('component', 'name spec lab location availableQuantity totalQuantity')
      .sort({ createdAt: -1 });

    res.status(200).json(borrows);
  } catch (error) {
    console.error('Error fetching personal borrows:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all borrow requests (for Lab Assistants & Admins)
// @route   GET /api/borrows
// @access  Private (LabAssistant, Admin)
exports.getAllBorrows = async (req, res) => {
  try {
    const { status, lab } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (lab && lab !== 'All') {
      filter.lab = lab;
    }

    const borrows = await Borrow.find(filter)
      .populate('student', 'firstName lastName regNo uniEmail role')
      .populate('component', 'name spec lab location availableQuantity')
      .sort({ createdAt: -1 });

    // Calculate status breakdown stats
    const allRecords = await Borrow.find({});
    const stats = {
      total: allRecords.length,
      pending: allRecords.filter((b) => b.status === 'Pending').length,
      approved: allRecords.filter((b) => b.status === 'Approved').length,
      active: allRecords.filter((b) => b.status === 'Active').length,
      rejected: allRecords.filter((b) => b.status === 'Rejected').length,
      returned: allRecords.filter((b) => b.status === 'Returned').length
    };

    res.status(200).json({ borrows, stats });
  } catch (error) {
    console.error('Error fetching all borrows:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin approves borrow request with pickup window and allocated time
// @route   PUT /api/borrows/:id/approve
// @access  Private (LabAssistant, Admin)
exports.approveBorrow = async (req, res) => {
  try {
    const { pickupTime, allocatedTime, durationDays, adminNotes } = req.body;

    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    const component = await Component.findById(borrow.component);
    if (component && component.availableQuantity < borrow.quantity && borrow.status === 'Pending') {
      return res.status(400).json({
        message: `Insufficient inventory stock to approve. Available: ${component.availableQuantity}, Requested: ${borrow.quantity}`
      });
    }

    // If approving from Pending, decrement available stock
    if (component && borrow.status === 'Pending') {
      component.availableQuantity = Math.max(0, component.availableQuantity - borrow.quantity);
      if (component.availableQuantity === 0) {
        component.status = 'Out of Stock';
      }
      await component.save();
    }

    const days = Number(durationDays) || borrow.durationDays || 3;
    const due = new Date();
    due.setDate(due.getDate() + days);

    borrow.status = 'Approved';
    borrow.reviewedBy = req.user._id;
    borrow.reviewedByName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Lab Admin';
    borrow.reviewedAt = new Date();
    borrow.pickupTime = pickupTime || 'Today during Lab hours (9:00 AM - 4:00 PM) at Lab Counter';
    borrow.allocatedTime = allocatedTime || `${days} Days (Due: ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
    borrow.dueDate = due;
    if (adminNotes) borrow.adminNotes = adminNotes;

    await borrow.save();

    res.status(200).json({
      message: 'Borrow request approved successfully and notification sent to student.',
      borrow
    });
  } catch (error) {
    console.error('Error approving borrow:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin marks item as handed over (Active in use)
// @route   PUT /api/borrows/:id/handover
// @access  Private (LabAssistant, Admin)
exports.handoverBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    borrow.status = 'Active';
    await borrow.save();

    res.status(200).json({
      message: 'Equipment handed over to student. Status marked as Active.',
      borrow
    });
  } catch (error) {
    console.error('Error handing over equipment:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin rejects borrow request with reason
// @route   PUT /api/borrows/:id/reject
// @access  Private (LabAssistant, Admin)
exports.rejectBorrow = async (req, res) => {
  try {
    const { rejectionReason, adminNotes } = req.body;

    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    // If previously approved, restore available stock
    if (borrow.status === 'Approved' || borrow.status === 'Active') {
      const component = await Component.findById(borrow.component);
      if (component) {
        component.availableQuantity += borrow.quantity;
        if (component.status === 'Out of Stock' && component.availableQuantity > 0) {
          component.status = 'Available';
        }
        await component.save();
      }
    }

    borrow.status = 'Rejected';
    borrow.reviewedBy = req.user._id;
    borrow.reviewedByName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Lab Admin';
    borrow.reviewedAt = new Date();
    borrow.rejectionReason = rejectionReason || 'Equipment reserved for curriculum laboratory sessions.';
    if (adminNotes) borrow.adminNotes = adminNotes;

    await borrow.save();

    res.status(200).json({
      message: 'Borrow request rejected and reason communicated to student.',
      borrow
    });
  } catch (error) {
    console.error('Error rejecting borrow:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin confirms equipment return & restores component inventory
// @route   PUT /api/borrows/:id/return
// @access  Private (LabAssistant, Admin)
exports.returnBorrow = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    // Restore stock if it was approved/active
    if (borrow.status === 'Approved' || borrow.status === 'Active') {
      const component = await Component.findById(borrow.component);
      if (component) {
        component.availableQuantity += borrow.quantity;
        if (component.status === 'Out of Stock' && component.availableQuantity > 0) {
          component.status = 'Available';
        }
        await component.save();
      }
    }

    borrow.status = 'Returned';
    borrow.returnedAt = new Date();
    if (adminNotes) borrow.adminNotes = adminNotes;

    await borrow.save();

    res.status(200).json({
      message: 'Equipment return processed successfully. Inventory restocked.',
      borrow
    });
  } catch (error) {
    console.error('Error processing return:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dynamic borrow notifications for current user
// @route   GET /api/borrows/notifications
// @access  Private
exports.getBorrowNotifications = async (req, res) => {
  try {
    const userRole = req.user.role;
    let notifications = [];

    if (userRole === 'Admin' || userRole === 'LabAssistant') {
      // Pending requests waiting for admin action
      const pendingBorrows = await Borrow.find({ status: 'Pending' })
        .sort({ createdAt: -1 })
        .limit(10);

      notifications = pendingBorrows.map((b) => ({
        id: `admin-notif-${b._id}`,
        type: 'amber',
        title: 'New Borrow Request Pending',
        desc: `${b.studentName} (${b.studentRegNo}) requested ${b.componentName} for "${b.project}".`,
        time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        borrowId: b._id,
        status: b.status
      }));
    } else {
      // For student: alerts on approved, rejected, or active requests
      const studentReg = req.user.regNo || req.user.userId;
      const recentBorrows = await Borrow.find({
        $or: [
          { student: req.user._id },
          { studentRegNo: studentReg },
          { studentEmail: req.user.uniEmail }
        ]
      })
        .sort({ updatedAt: -1 })
        .limit(10);

      notifications = recentBorrows.map((b) => {
        if (b.status === 'Approved') {
          return {
            id: `notif-${b._id}`,
            type: 'emerald',
            title: 'Borrow Request Approved!',
            desc: `${b.componentName}: Ready for pickup! ${b.pickupTime || 'Collect at Lab Counter'}. Allocated: ${b.allocatedTime || '3 Days'}.`,
            time: b.reviewedAt ? new Date(b.reviewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            borrowId: b._id,
            status: b.status
          };
        }
        if (b.status === 'Rejected') {
          return {
            id: `notif-${b._id}`,
            type: 'rose',
            title: 'Borrow Request Rejected',
            desc: `${b.componentName}: ${b.rejectionReason || 'Unavailable for requested duration.'}`,
            time: b.reviewedAt ? new Date(b.reviewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            borrowId: b._id,
            status: b.status
          };
        }
        if (b.status === 'Active') {
          return {
            id: `notif-${b._id}`,
            type: 'blue',
            title: 'Active Borrow in Use',
            desc: `${b.componentName} currently allocated for ${b.project}. ${b.allocatedTime ? `Allocated: ${b.allocatedTime}` : ''}`,
            time: 'In Progress',
            borrowId: b._id,
            status: b.status
          };
        }
        return {
          id: `notif-${b._id}`,
          type: 'amber',
          title: 'Request Queued for Approval',
          desc: `Your request for ${b.componentName} is pending Lab Admin review.`,
          time: 'Pending',
          borrowId: b._id,
          status: b.status
        };
      });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: error.message });
  }
};
