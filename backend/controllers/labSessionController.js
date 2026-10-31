// backend/controllers/labSessionController.js
const LabSession = require('../models/LabSession');
const Component = require('../models/Component');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const practicalCurriculum = require('../data/curriculumData');

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
    if (studentEmail) {
      filter.$or = [
        { 'studentDetails.uniEmail': studentEmail },
        { 'students.uniEmail': studentEmail }
      ];
    }

    const sessions = await LabSession.find(filter)
      .populate('assignedStudent', 'firstName lastName uniEmail userId role')
      .populate('students.studentId', 'firstName lastName uniEmail userId role regNo')
      .sort({ scheduledDate: 1, worktable: 1 });

    res.status(200).json(sessions);
  } catch (err) {
    console.error('Error fetching lab sessions:', err);
    res.status(500).json({ message: 'Failed to retrieve lab sessions', error: err.message });
  }
};

// @desc    Get lab sessions assigned to the logged-in student (either individual or group member)
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
      { 'studentDetails.userId': cleanId },
      { 'students.uniEmail': cleanId.toLowerCase() },
      { 'students.userId': cleanId },
      { 'students.regNo': cleanId }
    ];

    if (student) {
      conditions.push({ assignedStudent: student._id });
      conditions.push({ 'studentDetails.uniEmail': student.uniEmail });
      conditions.push({ 'studentDetails.userId': student.userId });
      conditions.push({ 'students.studentId': student._id });
      conditions.push({ 'students.uniEmail': student.uniEmail });
      conditions.push({ 'students.userId': student.userId });
      conditions.push({ 'students.regNo': student.regNo });
    }

    const sessions = await LabSession.find({ $or: conditions })
      .populate('assignedStudent', 'firstName lastName uniEmail userId regNo')
      .populate('students.studentId', 'firstName lastName uniEmail userId regNo')
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

// @desc    Get auto-distributed student groups for a semester (4 students per group, remaining in last group)
// @route   GET /api/lab-sessions/groups
exports.getStudentGroups = async (req, res) => {
  try {
    const { semester = 3, groupSize = 4 } = req.query;
    const size = Math.max(1, Number(groupSize) || 4);

    const students = await User.find({
      role: 'Student',
      semester: Number(semester)
    })
      .select('firstName lastName uniEmail userId regNo semester dept')
      .sort({ regNo: 1 });

    const totalStudents = students.length;
    const groups = [];

    for (let i = 0; i < totalStudents; i += size) {
      const groupStudents = students.slice(i, i + size);
      const groupNum = Math.floor(i / size) + 1;
      groups.push({
        groupNumber: groupNum,
        groupName: `Group ${String(groupNum).padStart(2, '0')}`,
        suggestedWorktable: `Worktable ${groupNum}`,
        studentCount: groupStudents.length,
        students: groupStudents.map(s => ({
          studentId: s._id,
          userId: s.userId,
          regNo: s.regNo || s.userId,
          name: `${s.firstName} ${s.lastName}`,
          uniEmail: s.uniEmail
        }))
      });
    }

    res.status(200).json({
      semester: Number(semester),
      totalStudents,
      groupSize: size,
      totalGroups: groups.length,
      groups
    });
  } catch (err) {
    console.error('Error getting student groups:', err);
    res.status(500).json({ message: 'Failed to generate student groups', error: err.message });
  }
};

// @desc    Admin allocates a practical to an entire student group at a worktable
// @route   POST /api/lab-sessions/allocate-group
exports.allocateGroupLabSession = async (req, res) => {
  try {
    const {
      semester,
      courseCode,
      labNumber,
      groupNumber,
      worktable,
      scheduledDate,
      timeSlot,
      studentIds
    } = req.body;

    const template = practicalCurriculum.find(
      p => p.courseCode.toUpperCase() === courseCode.toUpperCase() && p.labNumber === Number(labNumber)
    );

    if (!template) {
      return res.status(404).json({ message: 'Lab practical not found in curriculum' });
    }

    let groupStudents = [];

    if (Array.isArray(studentIds) && studentIds.length > 0) {
      const users = await User.find({
        $or: [
          { userId: { $in: studentIds } },
          { regNo: { $in: studentIds } },
          { _id: { $in: studentIds.filter(id => id.match(/^[0-9a-fA-F]{24}$/)) } }
        ]
      }).sort({ regNo: 1 });

      groupStudents = users.map(s => ({
        studentId: s._id,
        userId: s.userId,
        regNo: s.regNo || s.userId,
        name: `${s.firstName} ${s.lastName}`,
        uniEmail: s.uniEmail
      }));
    } else {
      // Auto-fetch group by groupNumber (4 students per group)
      const allSemStudents = await User.find({
        role: 'Student',
        semester: Number(semester || template.semester)
      }).sort({ regNo: 1 });

      const groupIdx = (Number(groupNumber) || 1) - 1;
      const sliced = allSemStudents.slice(groupIdx * 4, groupIdx * 4 + 4);
      groupStudents = sliced.map(s => ({
        studentId: s._id,
        userId: s.userId,
        regNo: s.regNo || s.userId,
        name: `${s.firstName} ${s.lastName}`,
        uniEmail: s.uniEmail
      }));
    }

    if (groupStudents.length === 0) {
      return res.status(400).json({ message: 'No students found for this group' });
    }

    const assignedWorktable = worktable || `Worktable ${groupNumber || 1}`;
    const sessId = `SESS-${template.courseCode}-L${template.labNumber}-GRP${groupNumber || 1}`;

    const sessionPayload = {
      sessionId: sessId,
      courseCode: template.courseCode,
      courseName: template.courseName,
      semester: template.semester,
      labNumber: template.labNumber,
      title: template.title,
      labName: template.labName,
      worktable: assignedWorktable,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      timeSlot: timeSlot || '09:00 - 12:00',
      groupNumber: Number(groupNumber) || 1,
      groupName: `Group ${String(groupNumber || 1).padStart(2, '0')}`,
      students: groupStudents,
      assignedStudent: groupStudents[0].studentId,
      studentDetails: {
        userId: groupStudents[0].userId,
        name: groupStudents[0].name,
        uniEmail: groupStudents[0].uniEmail
      },
      batch: `E/23/EE-Sem${template.semester}`,
      requiredEquipment: template.requiredEquipment.map(eq => ({
        componentId: eq.componentId,
        name: eq.name,
        spec: eq.spec,
        quantityRequired: eq.quantityRequired,
        isConsumable: eq.isConsumable,
        status: 'Allocated'
      })),
      status: 'Scheduled'
    };

    let session = await LabSession.findOne({
      courseCode: template.courseCode,
      labNumber: template.labNumber,
      groupNumber: Number(groupNumber)
    });

    if (session) {
      Object.assign(session, sessionPayload);
      await session.save();
    } else {
      session = await LabSession.create(sessionPayload);
    }

    res.status(201).json({
      message: `Successfully allocated Group ${groupNumber} (${groupStudents.length} students) to ${assignedWorktable} for ${template.courseCode} Lab ${template.labNumber}. All ${groupStudents.length} students have received their allocation!`,
      session
    });
  } catch (err) {
    console.error('Error allocating group session:', err);
    res.status(500).json({ message: 'Failed to allocate group session', error: err.message });
  }
};

// @desc    Admin batch-allocates all groups in a semester across worktables in one click
// @route   POST /api/lab-sessions/allocate-batch-groups
exports.batchAllocateGroups = async (req, res) => {
  try {
    const {
      semester,
      courseCode,
      labNumber,
      scheduledDate,
      timeSlot,
      groupSize = 4
    } = req.body;

    const template = practicalCurriculum.find(
      p => p.courseCode.toUpperCase() === courseCode.toUpperCase() && p.labNumber === Number(labNumber)
    );

    if (!template) {
      return res.status(404).json({ message: 'Lab practical not found in curriculum' });
    }

    const students = await User.find({
      role: 'Student',
      semester: Number(semester || template.semester)
    }).sort({ regNo: 1 });

    if (students.length === 0) {
      return res.status(404).json({ message: `No registered students found for Semester ${semester}` });
    }

    const size = Math.max(1, Number(groupSize) || 4);
    const createdSessions = [];

    let groupIndex = 0;
    for (let i = 0; i < students.length; i += size) {
      groupIndex++;
      const groupStudents = students.slice(i, i + size);
      const groupNum = groupIndex;
      const worktable = `Worktable ${groupNum}`;
      const sessId = `SESS-${template.courseCode}-L${template.labNumber}-GRP${groupNum}`;

      const mappedStudents = groupStudents.map(s => ({
        studentId: s._id,
        userId: s.userId,
        regNo: s.regNo || s.userId,
        name: `${s.firstName} ${s.lastName}`,
        uniEmail: s.uniEmail
      }));

      const sessionPayload = {
        sessionId: sessId,
        courseCode: template.courseCode,
        courseName: template.courseName,
        semester: template.semester,
        labNumber: template.labNumber,
        title: template.title,
        labName: template.labName,
        worktable: worktable,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
        timeSlot: timeSlot || '09:00 - 12:00',
        groupNumber: groupNum,
        groupName: `Group ${String(groupNum).padStart(2, '0')}`,
        students: mappedStudents,
        assignedStudent: mappedStudents[0].studentId,
        studentDetails: {
          userId: mappedStudents[0].userId,
          name: mappedStudents[0].name,
          uniEmail: mappedStudents[0].uniEmail
        },
        batch: `E/23/EE-Sem${template.semester}`,
        requiredEquipment: template.requiredEquipment.map(eq => ({
          componentId: eq.componentId,
          name: eq.name,
          spec: eq.spec,
          quantityRequired: eq.quantityRequired,
          isConsumable: eq.isConsumable,
          status: 'Allocated'
        })),
        status: 'Scheduled'
      };

      let session = await LabSession.findOne({
        courseCode: template.courseCode,
        labNumber: template.labNumber,
        groupNumber: groupNum
      });

      if (session) {
        Object.assign(session, sessionPayload);
        await session.save();
        createdSessions.push(session);
      } else {
        session = await LabSession.create(sessionPayload);
        createdSessions.push(session);
      }
    }

    res.status(201).json({
      message: `Successfully allocated all ${createdSessions.length} student groups (${students.length} students) across Worktables 1–${createdSessions.length} for ${template.courseCode} Lab ${template.labNumber}!`,
      count: createdSessions.length,
      totalStudents: students.length,
      sessions: createdSessions
    });
  } catch (err) {
    console.error('Error batch-allocating groups:', err);
    res.status(500).json({ message: 'Failed to batch-allocate student groups', error: err.message });
  }
};

// @desc    Admin deletes an allocated lab session
// @route   DELETE /api/lab-sessions/:id
exports.deleteLabSession = async (req, res) => {
  try {
    const session = await LabSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Lab session not found' });
    }
    res.status(200).json({ message: `Allocation for ${session.worktable} (${session.courseCode}) deleted successfully.` });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).json({ message: 'Failed to delete lab session', error: err.message });
  }
};

// @desc    Admin allocates a lab practical to an individual student at a specific worktable & date/time
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

    // Find template practical from curriculum data
    const templateSession = practicalCurriculum.find(
      p => p.courseCode.toUpperCase() === courseCode.toUpperCase() && p.labNumber === Number(labNumber)
    );

    if (!templateSession) {
      return res.status(404).json({ message: 'Lab practical not found in curriculum' });
    }

    // Check if student already has this session allocated, update it or create new
    let session = await LabSession.findOne({
      assignedStudent: student._id,
      courseCode: templateSession.courseCode,
      labNumber: templateSession.labNumber
    });

    const studentObj = {
      studentId: student._id,
      userId: student.userId,
      regNo: student.regNo || student.userId,
      name: `${student.firstName} ${student.lastName}`,
      uniEmail: student.uniEmail
    };

    if (session) {
      session.worktable = worktable || 'Worktable 1';
      session.scheduledDate = scheduledDate ? new Date(scheduledDate) : new Date();
      session.timeSlot = timeSlot || '09:00 - 12:00';
      session.students = [studentObj];
      session.status = 'Scheduled';
      await session.save();
    } else {
      session = await LabSession.create({
        sessionId: `SESS-${courseCode}-L${labNumber}-${(student.regNo || student.userId).replace(/[^a-zA-Z0-9]/g, '')}`,
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
        students: [studentObj],
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
