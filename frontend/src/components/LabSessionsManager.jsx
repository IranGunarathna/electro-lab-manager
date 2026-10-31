import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Search,
  Check,
  Box,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  UserCheck,
  PackageCheck,
  Plus,
  X,
  Users,
  Trash2
} from 'lucide-react';
import './LabSessionsManager.css';

export default function LabSessionsManager({ currentUser }) {
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'LabAssistant';
  const studentIdentifier = currentUser?.regNo || currentUser?.uniEmail || currentUser?.userId;

  // Student specific session state
  const [studentSession, setStudentSession] = useState(null);

  // Admin sessions & students state
  const [allSessions, setAllSessions] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Admin Allocation Modal State
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocMode, setAllocMode] = useState('group'); // 'group' or 'single'
  const [allocGroupType, setAllocGroupType] = useState('batch'); // 'batch' or 'single-group'
  const [selectedGroupNum, setSelectedGroupNum] = useState(1);
  const [semesterGroups, setSemesterGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [allocForm, setAllocForm] = useState({
    semester: 3,
    studentId: '',
    courseCode: 'EE3301',
    labNumber: 1,
    worktable: 'Worktable 1',
    scheduledDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 - 12:00'
  });

  // Admin Verification Modal State
  const [verifyModalSession, setVerifyModalSession] = useState(null);
  const [damagedItems, setDamagedItems] = useState([]);
  const [inspectionRemarks, setInspectionRemarks] = useState('');

  // Expand equipment tray
  const [expandedTray, setExpandedTray] = useState(true);

  // Available practicals for Admin allocation
  const practicalOptions = [
    // Semester 3
    { sem: 3, code: 'EE3301', labNum: 1, label: 'EE3301 Lab 1: Semiconductor Diodes' },
    { sem: 3, code: 'EE3301', labNum: 2, label: 'EE3301 Lab 2: Basic Amplifiers & Biasing' },
    { sem: 3, code: 'EE3301', labNum: 3, label: 'EE3301 Lab 3: Operational Amplifiers' },
    { sem: 3, code: 'EE3301', labNum: 4, label: 'EE3301 Lab 4: Oscillators & Analog Filters' },
    { sem: 3, code: 'EE3203', labNum: 1, label: 'EE3203 Lab 1: DC & AC Bridges' },
    { sem: 3, code: 'EE3203', labNum: 2, label: 'EE3203 Lab 2: Oscilloscope Probe Testing' },
    { sem: 3, code: 'EE3203', labNum: 3, label: 'EE3203 Lab 3: Spectrum Analyzer' },
    { sem: 3, code: 'EE3306', labNum: 1, label: 'EE3306 Lab 1: Analog/Digital Conversion' },

    // Semester 4
    { sem: 4, code: 'EE4306', labNum: 1, label: 'EE4306 Lab 1: Electromagnetics Principles' },
    { sem: 4, code: 'EE4306', labNum: 2, label: 'EE4306 Lab 2: Antenna Radiation Patterns' },
    { sem: 4, code: 'EE4301', labNum: 1, label: 'EE4301 Lab 1: Amplitude Modulation (AM)' },
    { sem: 4, code: 'EE4301', labNum: 2, label: 'EE4301 Lab 2: Frequency Modulation (FM)' },
    { sem: 4, code: 'EE4301', labNum: 3, label: 'EE4301 Lab 3: Digital Carrier Wave (ASK/FSK/PSK)' },
    { sem: 4, code: 'EE4301', labNum: 4, label: 'EE4301 Lab 4: Pulse Code Modulation (PCM)' },
    { sem: 4, code: 'EE4304', labNum: 1, label: 'EE4304 Lab 1: Combinational Logic Circuits' },
    { sem: 4, code: 'EE4304', labNum: 2, label: 'EE4304 Lab 2: Synchronous Sequential Logic' },
    { sem: 4, code: 'EE4304', labNum: 3, label: 'EE4304 Lab 3: Logic Families (TTL vs CMOS)' },
    { sem: 4, code: 'EE4302', labNum: 1, label: 'EE4302 Lab 1: Output Characteristics of DC Machines' },
    { sem: 4, code: 'EE4302', labNum: 2, label: 'EE4302 Lab 2: Synchronous Generator Parameters' },
    { sem: 4, code: 'EE4302', labNum: 3, label: 'EE4302 Lab 3: Single Phase Transformer' }
  ];

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
      fetchSemesterGroups(allocForm.semester);
    } else {
      loadStudentData();
    }
  }, [currentUser]);

  // Fetch groups of 4 for the given semester
  const fetchSemesterGroups = async (sem) => {
    try {
      setGroupsLoading(true);
      const res = await axios.get(`http://localhost:5000/api/lab-sessions/groups?semester=${sem}&groupSize=4`);
      if (res.data && res.data.groups) {
        setSemesterGroups(res.data.groups);
      }
    } catch (err) {
      console.error('Error fetching semester groups:', err);
    } finally {
      setGroupsLoading(false);
    }
  };

  // Load single assigned lab for student
  const loadStudentData = async () => {
    try {
      if (!studentIdentifier) {
        setStudentSession(null);
        return;
      }
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/lab-sessions/student/${encodeURIComponent(studentIdentifier)}`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Show their active or latest session
        const active = res.data.find(s => s.status === 'In-Progress') || res.data[0];
        setStudentSession(active);
      } else {
        setStudentSession(null);
      }
    } catch (err) {
      console.error('Error loading student session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load full view for Admin
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [sessRes, stdRes] = await Promise.allSettled([
        axios.get('http://localhost:5000/api/lab-sessions'),
        axios.get('http://localhost:5000/api/lab-sessions/students')
      ]);

      if (sessRes.status === 'fulfilled') setAllSessions(sessRes.value.data || []);
      if (stdRes.status === 'fulfilled') setStudentsList(stdRes.value.data || []);
    } catch (err) {
      console.error('Error loading admin lab data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Student Check-In to Worktable
  const handleCheckIn = async (sessionId) => {
    try {
      setActionLoading(true);
      await axios.put(`http://localhost:5000/api/lab-sessions/${sessionId}/check-in`);
      setSuccessMessage('Station claimed! Equipment allocated to your worktable.');
      setTimeout(() => setSuccessMessage(''), 4000);
      loadStudentData();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Student Marks Complete
  const handleComplete = async (sessionId) => {
    try {
      setActionLoading(true);
      await axios.put(`http://localhost:5000/api/lab-sessions/${sessionId}/complete`);
      setSuccessMessage('Lab finished! Please leave components on the worktable for inspection.');
      setTimeout(() => setSuccessMessage(''), 4000);
      loadStudentData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete lab');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Allocates Lab Session (Group or Single)
  const handleAllocateSubmit = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      if (allocMode === 'group') {
        if (allocGroupType === 'batch') {
          // Batch distribute all groups to worktables
          const res = await axios.post('http://localhost:5000/api/lab-sessions/allocate-batch-groups', {
            semester: allocForm.semester,
            courseCode: allocForm.courseCode,
            labNumber: allocForm.labNumber,
            scheduledDate: allocForm.scheduledDate,
            timeSlot: allocForm.timeSlot,
            groupSize: 4
          });
          setSuccessMessage(res.data.message || 'All student groups successfully distributed to worktables!');
        } else {
          // Allocate single group
          const res = await axios.post('http://localhost:5000/api/lab-sessions/allocate-group', {
            semester: allocForm.semester,
            courseCode: allocForm.courseCode,
            labNumber: allocForm.labNumber,
            groupNumber: selectedGroupNum,
            worktable: allocForm.worktable,
            scheduledDate: allocForm.scheduledDate,
            timeSlot: allocForm.timeSlot
          });
          setSuccessMessage(res.data.message || 'Group allocated successfully!');
        }
      } else {
        // Single student allocation
        if (!allocForm.studentId) {
          alert('Please select a student');
          setActionLoading(false);
          return;
        }
        const res = await axios.post('http://localhost:5000/api/lab-sessions/allocate', allocForm);
        setSuccessMessage(res.data.message || 'Lab session allocated successfully!');
      }

      setTimeout(() => setSuccessMessage(''), 5000);
      setShowAllocateModal(false);
      loadAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to allocate station');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Deletes an Allocated Session
  const handleDeleteSession = async (sessionId, worktableName) => {
    if (!window.confirm(`Are you sure you want to delete the allocation for ${worktableName || 'this station'}?`)) return;
    try {
      setActionLoading(true);
      await axios.delete(`http://localhost:5000/api/lab-sessions/${sessionId}`);
      setSuccessMessage('Allocation removed successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
      loadAdminData();
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Failed to delete allocation');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin Return Verification & Restock
  const handleConfirmVerification = async () => {
    if (!verifyModalSession) return;
    try {
      setActionLoading(true);
      await axios.put(`http://localhost:5000/api/lab-sessions/${verifyModalSession._id}/verify-return`, {
        inspectedBy: `${currentUser?.firstName || 'Admin'} ${currentUser?.lastName || 'Officer'}`,
        remarks: inspectionRemarks,
        itemDamages: damagedItems
      });
      setSuccessMessage('Inspection complete. Reusable items restocked to inventory!');
      setTimeout(() => setSuccessMessage(''), 4000);
      setVerifyModalSession(null);
      loadAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify session');
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================================
  // VIEW 1: CLEAN & SIMPLE STUDENT VIEW (Zero Clutter, 1 Lab Only)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="lab-sessions-container">
        {/* Simple Header */}
        <div className="student-lab-header">
          <div>
            <span className="student-portal-tag">
              <GraduationCap size={15} />
              <span>Student Laboratory Portal</span>
            </span>
            <h1 className="student-main-title">My Assigned Lab Session</h1>
            <p className="student-sub-desc">
              Logged in as <strong>{currentUser?.firstName} {currentUser?.lastName}</strong> &middot;{' '}
              <span className="badge-regno">{currentUser?.regNo || currentUser?.userId}</span>
            </p>
          </div>

          <button className="btn-refresh-simple" onClick={loadStudentData} title="Refresh My Allocation">
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>

        {successMessage && (
          <div className="session-alert-banner">
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="sessions-loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your assigned station...</p>
          </div>
        ) : !studentSession ? (
          <div className="student-no-session-card">
            <div className="no-session-icon">
              <Clock size={36} />
            </div>
            <h3>No Lab Session Assigned Right Now</h3>
            <p>
              Your System Admin or Lab Officer has not scheduled your station yet.
              Once assigned, your worktable, time slot, and equipment tray will appear here.
            </p>
          </div>
        ) : (
          <div className="student-assigned-focus-card">
            {/* Top course and status header */}
            <div className="assigned-card-top">
              <div className="top-pills">
                <span className="focus-course-code">{studentSession.courseCode}</span>
                <span className="focus-lab-num">Lab {studentSession.labNumber}</span>
                <span className="focus-sem-pill">Semester {studentSession.semester}</span>
              </div>

              <div className={`status-pill pill-${studentSession.status.toLowerCase()}`}>
                {studentSession.status === 'In-Progress' && <span className="live-pulse-dot"></span>}
                {studentSession.status === 'Scheduled' && <Clock size={13} />}
                {studentSession.status === 'Completed' && <CheckCircle size={13} />}
                {studentSession.status === 'Verified' && <ShieldCheck size={13} />}
                <span>{studentSession.status}</span>
              </div>
            </div>

            {/* Practical Title */}
            <h2 className="focus-title">{studentSession.title}</h2>
            <div className="focus-course-name">{studentSession.courseName}</div>

            {/* Crucial Info: Location, Worktable, Date/Time */}
            <div className="focus-logistics-grid">
              <div className="focus-grid-item">
                <span className="grid-item-label">Laboratory Venue</span>
                <div className="grid-item-val">
                  <MapPin size={16} className="item-icon" />
                  <span>{studentSession.labName}</span>
                </div>
              </div>

              <div className="focus-grid-item bench-item">
                <span className="grid-item-label">Your Station / Bench</span>
                <div className="grid-item-val">
                  <Layers size={18} className="item-icon highlight" />
                  <strong className="bench-number">{studentSession.worktable}</strong>
                </div>
              </div>

              <div className="focus-grid-item">
                <span className="grid-item-label">Scheduled Date & Time</span>
                <div className="grid-item-val">
                  <Calendar size={16} className="item-icon" />
                  <span>
                    {new Date(studentSession.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })} &middot; {studentSession.timeSlot}
                  </span>
                </div>
              </div>
            </div>

            {/* Worktable Team Section (Group Members) */}
            {studentSession.students && studentSession.students.length > 0 && (
              <div className="student-team-section">
                <div className="student-team-header">
                  <div className="student-team-title">
                    <Users size={16} />
                    <span>Worktable Team &bull; {studentSession.groupName || `Group ${studentSession.groupNumber || '1'}`} ({studentSession.students.length} Members)</span>
                  </div>
                  <span className="badge-regno">{studentSession.worktable}</span>
                </div>
                <div className="team-members-grid">
                  {studentSession.students.map((member, mIdx) => {
                    const isMe = (
                      member.regNo === currentUser?.regNo ||
                      member.userId === currentUser?.userId ||
                      member.uniEmail === currentUser?.uniEmail
                    );
                    return (
                      <div key={mIdx} className={`team-member-card ${isMe ? 'is-current-user' : ''}`}>
                        <span className="team-member-reg">{member.regNo || member.userId}</span>
                        <span className="team-member-name">{member.name}</span>
                        {isMe && <span className="team-you-badge">You</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Components at this Worktable */}
            <div className="focus-tray-section">
              <div className="tray-section-header">
                <div className="tray-title-left">
                  <Box size={16} />
                  <span>Components & Equipment on {studentSession.worktable}</span>
                  <span className="tray-count-chip">{studentSession.requiredEquipment?.length || 0} items</span>
                </div>
                <button
                  className="toggle-tray-btn"
                  onClick={() => setExpandedTray(!expandedTray)}
                >
                  {expandedTray ? 'Hide Equipment' : 'View Equipment'}
                  {expandedTray ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {expandedTray && (
                <div className="focus-equipment-table-wrap">
                  <table className="tray-table">
                    <thead>
                      <tr>
                        <th>Equipment / Component</th>
                        <th>Qty</th>
                        <th>Type</th>
                        <th>Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSession.requiredEquipment?.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="comp-name-cell">{item.name}</div>
                            {item.spec && <div className="comp-spec-cell">{item.spec}</div>}
                          </td>
                          <td><strong>{item.quantityRequired || 1}</strong></td>
                          <td>
                            <span className={`type-tag ${item.isConsumable ? 'tag-consumable' : 'tag-reusable'}`}>
                              {item.isConsumable ? 'Consumable' : 'Reusable Benchtop'}
                            </span>
                          </td>
                          <td>
                            <span className="condition-ready-tag">
                              <Check size={11} /> Ready at Bench
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Clean Student Actions */}
            <div className="focus-card-actions">
              {studentSession.status === 'Scheduled' && (
                <button
                  className="btn-focus-action btn-start"
                  disabled={actionLoading}
                  onClick={() => handleCheckIn(studentSession._id)}
                >
                  <Play size={16} />
                  <span>I am Seated at {studentSession.worktable} &middot; Start Lab</span>
                </button>
              )}

              {studentSession.status === 'In-Progress' && (
                <button
                  className="btn-focus-action btn-finish"
                  disabled={actionLoading}
                  onClick={() => handleComplete(studentSession._id)}
                >
                  <CheckCircle size={16} />
                  <span>Complete Practical & Submit for Inspection</span>
                </button>
              )}

              {studentSession.status === 'Completed' && (
                <div className="student-status-notice notice-pending">
                  <Clock size={16} />
                  <span>Practical finished. Please keep equipment at <strong>{studentSession.worktable}</strong>. Awaiting Lab Officer sign-off.</span>
                </div>
              )}

              {studentSession.status === 'Verified' && (
                <div className="student-status-notice notice-verified">
                  <ShieldCheck size={16} />
                  <span>Practical signed off and verified by {studentSession.adminInspection?.inspectedBy || 'Lab Officer'}.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: SYSTEM ADMIN / LAB OFFICER ALLOCATION PORTAL
  // =========================================================================
  return (
    <div className="lab-sessions-container">
      {/* Admin Header */}
      <div className="admin-portal-header">
        <div>
          <span className="admin-badge">
            <ShieldCheck size={15} />
            <span>System Administrator & Lab Officer Portal</span>
          </span>
          <h1 className="sessions-title">Lab Stations & Student Allocations</h1>
          <p className="sessions-subtitle">
            Distribute student groups (4 per group) or individuals across worktables, track bench progress, and verify returns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="btn-allocate-new"
            onClick={() => {
              setAllocMode('group');
              setAllocGroupType('batch');
              setShowAllocateModal(true);
            }}
          >
            <Users size={16} />
            <span>Allocate Student Groups (4/Grp)</span>
          </button>

          <button
            className="btn-allocate-outline"
            onClick={() => {
              setAllocMode('single');
              setShowAllocateModal(true);
            }}
          >
            <Plus size={16} />
            <span>Individual Student</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="session-alert-banner">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Admin Stats Row */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <span className="stat-label">Total Registered Students</span>
          <span className="stat-value">{studentsList.length}</span>
          <span className="stat-detail">39 Sem 3 &middot; 39 Sem 4</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Allocated Stations</span>
          <span className="stat-value">{allSessions.length}</span>
          <span className="stat-detail">Across 12 Worktables</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Active Right Now</span>
          <span className="stat-value">{allSessions.filter(s => s.status === 'In-Progress').length}</span>
          <span className="stat-detail">In-Progress on benches</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Pending Inspection</span>
          <span className="stat-value">{allSessions.filter(s => s.status === 'Completed').length}</span>
          <span className="stat-detail">Ready to restock</span>
        </div>
      </div>

      {/* Allocated Sessions List */}
      <div className="admin-sessions-section">
        <div className="section-header-row">
          <h3>Allocated Student Stations ({allSessions.length})</h3>
          <button className="btn-refresh-simple" onClick={loadAdminData}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="admin-sessions-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Station / Bench</th>
                <th>Group / Student</th>
                <th>Enrolled Members</th>
                <th>Sem & Batch</th>
                <th>Practical</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allSessions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px 20px', color: '#64748b' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: '#334155' }}>
                      No lab station allocations yet
                    </div>
                    <div style={{ fontSize: '13px' }}>
                      Click <strong>Allocate Student Groups (4/Grp)</strong> above to auto-distribute groups across worktables.
                    </div>
                  </td>
                </tr>
              ) : (
                allSessions.map((session) => (
                  <tr key={session._id}>
                    <td>
                      <span className="table-bench-badge">{session.worktable}</span>
                    </td>
                    <td>
                      {session.groupName || session.groupNumber ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span className="table-group-pill">
                            <Users size={13} />
                            <span>{session.groupName || `Group ${session.groupNumber}`}</span>
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                            {session.students?.length || 1} Students Assigned
                          </span>
                        </div>
                      ) : (
                        <div>
                          <strong>{session.studentDetails?.name || 'Assigned Student'}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {session.studentDetails?.userId}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {session.students && session.students.length > 0 ? (
                        <div className="table-group-members-list">
                          {session.students.map((s, sIdx) => (
                            <span key={sIdx} className="member-chip" title={s.name}>
                              <strong>{s.regNo || s.userId}</strong> &middot; {s.name.split(' ').slice(0, 2).join(' ')}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="badge-regno">{session.studentDetails?.userId || session.batch}</span>
                      )}
                    </td>
                    <td>
                      <div>Sem {session.semester}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{session.batch}</div>
                    </td>
                    <td>
                      <div className="table-practical-cell">
                        <span className="table-code-tag">{session.courseCode} L{session.labNumber}</span>
                        <span className="table-title-sub">{session.title}</span>
                      </div>
                    </td>
                    <td>
                      {new Date(session.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{session.timeSlot}</div>
                    </td>
                    <td>
                      <span className={`status-pill pill-${session.status.toLowerCase()}`}>
                        {session.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {session.status === 'Completed' && (
                          <button
                            className="btn-table-action btn-inspect"
                            onClick={() => {
                              setVerifyModalSession(session);
                              setDamagedItems([]);
                              setInspectionRemarks('Verified good condition. Restocked.');
                            }}
                          >
                            <PackageCheck size={14} />
                            <span>Inspect & Restock</span>
                          </button>
                        )}
                        {session.status === 'Verified' && (
                          <span className="verified-check">
                            <Check size={14} /> Restocked
                          </span>
                        )}
                        {(session.status === 'Scheduled' || session.status === 'In-Progress') && (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Active</span>
                        )}
                        <button
                          className="btn-table-action btn-delete"
                          title="Delete Allocation"
                          disabled={actionLoading}
                          onClick={() => handleDeleteSession(session._id, session.worktable)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Admin Allocate Station Modal */}
      {showAllocateModal && (
        <div className="modal-backdrop" onClick={() => setShowAllocateModal(false)}>
          <div className="allocate-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-header">
              <div className="modal-icon-badge alloc-icon">
                {allocMode === 'group' ? <Users size={20} /> : <Plus size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <h2>{allocMode === 'group' ? 'Allocate Student Groups to Worktables' : 'Allocate Individual Student'}</h2>
                <p>
                  {allocMode === 'group'
                    ? 'Organize students into 4-member groups and assign to lab benches.'
                    : 'Assign a single student to a specific worktable and practical.'}
                </p>
              </div>
              <button className="btn-close-modal" onClick={() => setShowAllocateModal(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Allocation Mode Segmented Tabs */}
            <div className="modal-alloc-type-tabs">
              <button
                type="button"
                className={`alloc-type-tab ${allocMode === 'group' ? 'active' : ''}`}
                onClick={() => setAllocMode('group')}
              >
                <Users size={14} />
                <span>Group Allocation (4 Students/Group)</span>
              </button>
              <button
                type="button"
                className={`alloc-type-tab ${allocMode === 'single' ? 'active' : ''}`}
                onClick={() => setAllocMode('single')}
              >
                <Plus size={14} />
                <span>Individual Student</span>
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit} className="allocate-form">
              {/* Semester Toggle */}
              <div className="form-row">
                <label>1. Select Semester:</label>
                <div className="sem-toggle-group">
                  <button
                    type="button"
                    className={`sem-toggle-btn ${allocForm.semester === 3 ? 'active' : ''}`}
                    onClick={() => {
                      setAllocForm({ ...allocForm, semester: 3, studentId: '' });
                      fetchSemesterGroups(3);
                    }}
                  >
                    Semester 3 (39 Students)
                  </button>
                  <button
                    type="button"
                    className={`sem-toggle-btn ${allocForm.semester === 4 ? 'active' : ''}`}
                    onClick={() => {
                      setAllocForm({ ...allocForm, semester: 4, studentId: '' });
                      fetchSemesterGroups(4);
                    }}
                  >
                    Semester 4 (39 Students)
                  </button>
                </div>
              </div>

              {/* Group Mode Specific Options */}
              {allocMode === 'group' ? (
                <>
                  <div className="alloc-info-box">
                    <Users size={16} />
                    <span>
                      <strong>{semesterGroups.length > 0 ? `${semesterGroups.reduce((a, c) => a + c.studentCount, 0)} Students enrolled` : '39 Students enrolled'}</strong>:
                      Organized into <strong>{semesterGroups.length || 10} Groups</strong> ({semesterGroups.length > 0 ? `${semesterGroups.length - 1} groups of 4 + 1 group of ${semesterGroups[semesterGroups.length - 1]?.studentCount} remainder` : '9 groups of 4 + 1 group of 3 remainder'}).
                    </span>
                  </div>

                  <div className="form-row">
                    <label>2. Distribution Method:</label>
                    <div className="sem-toggle-group">
                      <button
                        type="button"
                        className={`sem-toggle-btn ${allocGroupType === 'batch' ? 'active' : ''}`}
                        onClick={() => setAllocGroupType('batch')}
                      >
                        Auto-Distribute All {semesterGroups.length || 10} Groups (Worktables 1&ndash;{semesterGroups.length || 10})
                      </button>
                      <button
                        type="button"
                        className={`sem-toggle-btn ${allocGroupType === 'single-group' ? 'active' : ''}`}
                        onClick={() => setAllocGroupType('single-group')}
                      >
                        Assign Single Group
                      </button>
                    </div>
                  </div>

                  {allocGroupType === 'single-group' && (
                    <div className="form-columns-2">
                      <div className="form-row">
                        <label>Choose Group:</label>
                        <select
                          value={selectedGroupNum}
                          onChange={(e) => {
                            const num = Number(e.target.value);
                            setSelectedGroupNum(num);
                            setAllocForm({ ...allocForm, worktable: `Worktable ${num}` });
                          }}
                        >
                          {semesterGroups.map((g) => (
                            <option key={g.groupNumber} value={g.groupNumber}>
                              {g.groupName} ({g.studentCount} students)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-row">
                        <label>Assign to Worktable:</label>
                        <select
                          value={allocForm.worktable}
                          onChange={(e) => setAllocForm({ ...allocForm, worktable: e.target.value })}
                        >
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={`Worktable ${i + 1}`}>
                              Worktable {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Group Preview Accordion */}
                  <div className="form-row">
                    <label>Generated Student Groups Preview ({semesterGroups.length} Groups):</label>
                    <div className="group-preview-container">
                      {groupsLoading ? (
                        <div style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>Loading groups...</div>
                      ) : (
                        semesterGroups.map((g) => (
                          <div key={g.groupNumber} className="group-preview-card">
                            <div className="group-card-header">
                              <span className="group-card-title">
                                <Users size={12} />
                                <span>{g.groupName} &bull; {g.studentCount} Students</span>
                              </span>
                              <span className="group-card-table-badge">
                                Assigned: Worktable {g.groupNumber}
                              </span>
                            </div>
                            <div className="group-card-members">
                              {g.students.map((st) => (
                                <span key={st.regNo || st.userId} className="group-member-tag">
                                  {st.regNo || st.userId} &middot; {st.name.split(' ').slice(0, 2).join(' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Single Student Selection */
                <div className="form-row">
                  <label>2. Select Student:</label>
                  <select
                    required
                    value={allocForm.studentId}
                    onChange={(e) => setAllocForm({ ...allocForm, studentId: e.target.value })}
                  >
                    <option value="">-- Choose a Student from Database --</option>
                    {studentsList
                      .filter((s) => s.semester === allocForm.semester)
                      .map((s) => (
                        <option key={s._id} value={s.userId}>
                          {s.regNo || s.userId} &middot; {s.lastName} {s.firstName}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Common Fields: Practical, Worktable (if single mode), Date & Time */}
              <div className="form-row">
                <label>3. Select Lab Practical:</label>
                <select
                  required
                  value={`${allocForm.courseCode}-${allocForm.labNumber}`}
                  onChange={(e) => {
                    const [code, num] = e.target.value.split('-');
                    setAllocForm({ ...allocForm, courseCode: code, labNumber: Number(num) });
                  }}
                >
                  {practicalOptions
                    .filter((p) => p.sem === allocForm.semester)
                    .map((p) => (
                      <option key={`${p.code}-${p.labNum}`} value={`${p.code}-${p.labNum}`}>
                        {p.label}
                      </option>
                    ))}
                </select>
              </div>

              {allocMode === 'single' && (
                <div className="form-row">
                  <label>4. Assigned Worktable:</label>
                  <select
                    value={allocForm.worktable}
                    onChange={(e) => setAllocForm({ ...allocForm, worktable: e.target.value })}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={`Worktable ${i + 1}`}>
                        Worktable {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-columns-2">
                <div className="form-row">
                  <label>{allocMode === 'group' ? '4. Scheduled Date:' : '5. Scheduled Date:'}</label>
                  <input
                    type="date"
                    required
                    value={allocForm.scheduledDate}
                    onChange={(e) => setAllocForm({ ...allocForm, scheduledDate: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <label>{allocMode === 'group' ? '5. Time Slot:' : '6. Time Slot:'}</label>
                  <select
                    value={allocForm.timeSlot}
                    onChange={(e) => setAllocForm({ ...allocForm, timeSlot: e.target.value })}
                  >
                    <option value="09:00 - 12:00">09:00 AM - 12:00 PM</option>
                    <option value="13:00 - 16:00">01:00 PM - 04:00 PM</option>
                    <option value="16:00 - 18:00">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowAllocateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn-modal-confirm"
                >
                  {allocMode === 'group' ? <Users size={16} /> : <Plus size={16} />}
                  <span>
                    {actionLoading
                      ? 'Allocating...'
                      : allocMode === 'group'
                      ? allocGroupType === 'batch'
                        ? `Distribute All ${semesterGroups.length || 10} Groups`
                        : `Allocate Group ${selectedGroupNum}`
                      : 'Assign Station to Student'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Admin Verify Return & Restock Modal */}
      {verifyModalSession && (
        <div className="modal-backdrop" onClick={() => setVerifyModalSession(null)}>
          <div className="verify-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="verify-modal-header">
              <div className="modal-icon-badge">
                <PackageCheck size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h2>Worktable Return Inspection</h2>
                <p>
                  {verifyModalSession.studentDetails?.name} ({verifyModalSession.worktable}) &middot; {verifyModalSession.courseCode}
                </p>
              </div>
              <button className="btn-close-modal" onClick={() => setVerifyModalSession(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="verify-modal-body">
              <p className="inspection-instructions">
                Inspect physical items on <strong>{verifyModalSession.worktable}</strong>. Uncheck or flag any item that was broken or consumed.
              </p>

              <div className="checklist-box">
                {verifyModalSession.requiredEquipment?.map((item, idx) => {
                  const isDamaged = damagedItems.includes(item.name);
                  return (
                    <div
                      key={idx}
                      className={`checklist-row ${isDamaged ? 'damaged-highlight' : ''}`}
                    >
                      <div className="check-item-info">
                        <span className="check-item-name">{item.name}</span>
                        <span className="check-item-qty">x{item.quantityRequired || 1} &middot; {item.isConsumable ? 'Consumable' : 'Reusable'}</span>
                      </div>

                      {!item.isConsumable && (
                        <button
                          type="button"
                          className={`btn-flag-damaged ${isDamaged ? 'flagged' : ''}`}
                          onClick={() => {
                            if (damagedItems.includes(item.name)) {
                              setDamagedItems(damagedItems.filter((i) => i !== item.name));
                            } else {
                              setDamagedItems([...damagedItems, item.name]);
                            }
                          }}
                        >
                          {isDamaged ? 'Marked Damaged' : 'Flag Damaged'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="remarks-field">
                <label>Inspection Notes:</label>
                <textarea
                  rows={2}
                  value={inspectionRemarks}
                  onChange={(e) => setInspectionRemarks(e.target.value)}
                />
              </div>
            </div>

            <div className="verify-modal-footer">
              <button
                className="btn-modal-cancel"
                onClick={() => setVerifyModalSession(null)}
              >
                Cancel
              </button>
              <button
                className="btn-modal-confirm"
                disabled={actionLoading}
                onClick={handleConfirmVerification}
              >
                <Check size={16} />
                <span>Confirm & Restock Components</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
