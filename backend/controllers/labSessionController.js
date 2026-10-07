// backend/controllers/labSessionController.js
const LabSession = require('../models/LabSession');
const Component = require('../models/Component');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get all lab sessions (with optional query filters)
// @route   GET /api/lab-sessions
exports.getAllLabSessions = async (req, res) => {
  try {
    const { semester, courseCode, status, labName, studentEmail } = req.query;
    const filter = {};

    if (semester) filter.semester = Number(semester);
    if (courseCode) filter.courseCode = courseCode.toUpperCase();
    if (status) filter.status = status;
    if (labName) filter.labName = labName;
    if (studentEmail) filter['studentDetails.uniEmail'] = studentEmail;

    const sessions = await LabSession.find(filter)
      .populate('assignedStudent', 'firstName lastName uniEmail userId role')
      .sort({ scheduledDate: 1 });

    res.status(200).json(sessions);
  } catch (err) {
    console.error('Error fetching lab sessions:', err);
    res.status(500).json({ message: 'Failed to retrieve lab sessions', error: err.message });
  }
};

// @desc    Get lab sessions assigned to the logged-in student
// @route   GET /api/lab-sessions/student/:identifier
exports.getStudentLabSessions = async (req, res) => {
  try {
    const { email } = req.params;
    const cleanId = decodeURIComponent(email || '').trim();

    // Check User collection to match email, userId, or regNo
    const student = await User.findOne({
      $or: [
        { uniEmail: cleanId.toLowerCase() },
        { userId: cleanId },
        { regNo: cleanId }
      ]
    });

    const conditions = [
      { 'studentDetails.uniEmail': cleanId.toLowerCase() },
      { 'studentDetails.userId': cleanId }
    ];

    if (student) {
      conditions.push({ assignedStudent: student._id });
      conditions.push({ 'studentDetails.uniEmail': student.uniEmail });
      conditions.push({ 'studentDetails.userId': student.userId });
    }

    const sessions = await LabSession.find({ $or: conditions })
      .sort({ scheduledDate: 1 });

    res.status(200).json(sessions);
  } catch (err) {
    console.error('Error fetching student sessions:', err);
    res.status(500).json({ message: 'Failed to retrieve student sessions', error: err.message });
  }
};

// @desc    Get list of all students (for Admin allocation dropdown)
// @route   GET /api/lab-sessions/students
exports.getStudentsList = async (req, res) => {
  try {
    const { semester } = req.query;
    const filter = { role: 'Student' };
    if (semester) filter.semester = Number(semester);

    const students = await User.find(filter)
      .select('firstName lastName uniEmail userId regNo semester dept')
      .sort({ regNo: 1 });

    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students list:', err);
    res.status(500).json({ message: 'Failed to retrieve students', error: err.message });
  }
};

// @desc    Admin allocates a lab practical to a student at a specific worktable & date/time
// @route   POST /api/lab-sessions/allocate
exports.allocateStudentLabSession = async (req, res) => {
  try {
    const {
      studentId, // user _id or regNo or email
      courseCode,
      labNumber,
      worktable,
      scheduledDate,
      timeSlot
    } = req.body;

    const student = await User.findOne({
      $or: [
        { userId: studentId },
        { regNo: studentId },
        { uniEmail: (studentId || '').toLowerCase() }
      ]
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found in database' });
    }

    // Find template/reference practical from curriculum
    const templateSession = await LabSession.findOne({
      courseCode: courseCode.toUpperCase(),
      labNumber: Number(labNumber)
    });

    if (!templateSession) {
      return res.status(404).json({ message: 'Lab practical template not found' });
    }

    // Check if student already has this session allocated, update it or create new
    let session = await LabSession.findOne({
      assignedStudent: student._id,
      courseCode: courseCode.toUpperCase(),
      labNumber: Number(labNumber)
    });

    if (session) {
      session.worktable = worktable || 'Worktable 1';
      session.scheduledDate = scheduledDate ? new Date(scheduledDate) : new Date();
      session.timeSlot = timeSlot || '09:00 - 12:00';
      session.status = 'Scheduled';
      await session.save();
    } else {
      session = await LabSession.create({
        sessionId: `SESS-${courseCode}-L${labNumber}-${student.regNo.replace(/[^a-zA-Z0-9]/g, '')}`,
        courseCode: templateSession.courseCode,
        courseName: templateSession.courseName,
        semester: templateSession.semester,
        labNumber: templateSession.labNumber,
        title: templateSession.title,
        labName: templateSession.labName,
        worktable: worktable || 'Worktable 1',
        scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
        timeSlot: timeSlot || '09:00 - 12:00',
        assignedStudent: student._id,
        studentDetails: {
          userId: student.userId,
          name: `${student.firstName} ${student.lastName}`,
          uniEmail: student.uniEmail
        },
        batch: `E/23/Sem${templateSession.semester}`,
        requiredEquipment: templateSession.requiredEquipment.map((eq) => ({
          componentId: eq.componentId,
          name: eq.name,
          spec: eq.spec,
          quantityRequired: eq.quantityRequired,
          isConsumable: eq.isConsumable,
          status: 'Allocated'
        })),
        status: 'Scheduled'
      });
    }

    res.status(201).json({
      message: `Successfully allocated ${session.courseCode} Lab ${session.labNumber} at ${session.worktable} to ${student.firstName} ${student.lastName} (${student.regNo})`,
      session
    });
  } catch (err) {
    console.error('Error allocating lab session:', err);
    res.status(500).json({ message: 'Failed to allocate lab session', error: err.message });
  }
};

// @desc    Get a single lab session by ID
// @route   GET /api/lab-sessions/:id
exports.getLabSessionById = async (req, res) => {
  try {
    const session = await LabSession.findById(req.params.id)
      .populate('assignedStudent', 'firstName lastName uniEmail userId');

    if (!session) {
      return res.status(404).json({ message: 'Lab session not found' });
    }

    res.status(200).json(session);
  } catch (err) {
    console.error('Error fetching lab session:', err);
    res.status(500).json({ message: 'Error retrieving lab session', error: err.message });
  }
};

// @desc    Student checks in to the lab session and claims the worktable equipment
// @route   PUT /api/lab-sessions/:id/check-in
exports.checkInLabSession = async (req, res) => {
  try {
    const session = await LabSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Lab session not found' });
    }

    if (session.status === 'In-Progress') {
      return res.status(400).json({ message: 'Session is already in progress' });
    }

    session.status = 'In-Progress';
    session.checkInTime = new Date();

    // Deduct availableQuantity from inventory for non-consumable and consumable equipment
    for (const item of session.requiredEquipment) {
      item.status = 'Checked Out';

      // Find matching component by name in the lab
      const comp = await Component.findOne({
        name: { $regex: new RegExp(`^${item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') },
        lab: session.labName
      }) || await Component.findOne({
        name: { $regex: new RegExp(item.name.split(' ')[0], 'i') },
        lab: session.labName
      });

      if (comp) {
        item.componentId = comp.compId;
        const deductQty = Math.min(comp.availableQuantity, item.quantityRequired || 1);
        comp.availableQuantity = Math.max(0, comp.availableQuantity - deductQty);
        await comp.save();

        // Record BORROW transaction if student user is known
        if (session.assignedStudent) {
          try {
            await Transaction.create({
              transId: `TR-CO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              initiator: session.assignedStudent,
              component: comp._id,
              actionType: 'BORROW',
              quantity: deductQty,
              date: new Date()
            });
          } catch (tErr) {
            console.warn('Transaction logging skipped:', tErr.message);
          }
        }
      }
    }

    await session.save();
    res.status(200).json({ message: 'Check-in successful. Equipment allocated to your worktable.', session });
  } catch (err) {
    console.error('Error during lab check-in:', err);
    res.status(500).json({ message: 'Failed to process check-in', error: err.message });
  }
};

// @desc    Student completes the experiment and submits worktable for inspection
// @route   PUT /api/lab-sessions/:id/complete
exports.completeLabSession = async (req, res) => {
  try {
    const session = await LabSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Lab session not found' });
    }

    session.status = 'Completed';
    session.completionTime = new Date();
    session.adminInspection = {
      remarks: 'Practical completed by student. Awaiting Lab Assistant physical inspection and sign-off.'
    };

    await session.save();
    res.status(200).json({ message: 'Session marked as completed. Ready for Lab Officer inspection.', session });
  } catch (err) {
    console.error('Error completing lab session:', err);
    res.status(500).json({ message: 'Failed to complete session', error: err.message });
  }
};

// @desc    Admin / Lab Assistant inspects returned components and restocks inventory
// @route   PUT /api/lab-sessions/:id/verify-return
exports.verifyAndRestockLabSession = async (req, res) => {
  try {
    const { inspectedBy, remarks, itemDamages } = req.body;
    const session = await LabSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Lab session not found' });
    }

    session.status = 'Verified';
    session.adminInspection = {
      inspectedBy: inspectedBy || 'Lab Officer in Charge',
      inspectedAt: new Date(),
      remarks: remarks || 'All worktable equipment inspected and verified intact. Restocked to storage.',
      damagesOrShortages: itemDamages || []
    };

    // Restock returned equipment back into inventory
    for (const item of session.requiredEquipment) {
      const isDamaged = itemDamages && itemDamages.includes(item.name);

      if (item.isConsumable) {
        item.status = 'Consumed';
      } else if (isDamaged) {
        item.status = 'Damaged';
      } else {
        item.status = 'Returned Good';

        // Add back availableQuantity to component
        const comp = await Component.findOne({
          name: { $regex: new RegExp(`^${item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') },
          lab: session.labName
        }) || await Component.findOne({
          name: { $regex: new RegExp(item.name.split(' ')[0], 'i') },
          lab: session.labName
        });

        if (comp) {
          const restockQty = item.quantityRequired || 1;
          comp.availableQuantity = Math.min(comp.totalQuantity, comp.availableQuantity + restockQty);
          await comp.save();

          // Record RETURN transaction
          if (session.assignedStudent) {
            try {
              await Transaction.create({
                transId: `TR-RET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                initiator: session.assignedStudent,
                component: comp._id,
                actionType: 'RETURN',
                quantity: restockQty,
                date: new Date()
              });
            } catch (tErr) {
              console.warn('Transaction return logging skipped:', tErr.message);
            }
          }
        }
      }
    }

    await session.save();
    res.status(200).json({
      message: 'Inspection verified successfully. All reusable instruments restocked to lab inventory.',
      session
    });
  } catch (err) {
    console.error('Error verifying lab return:', err);
    res.status(500).json({ message: 'Failed to verify and restock session', error: err.message });
  }
};
