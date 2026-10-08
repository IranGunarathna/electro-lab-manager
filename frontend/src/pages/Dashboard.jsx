import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  GraduationCap,
  FolderKanban,
  ArrowLeftRight,
  Cpu,
  Bell,
  LogOut,
  Clock,
  Settings,
  Search,
  Mail,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  MoreHorizontal,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertTriangle,
  Layers,
  MapPin,
  Clock3,
  CheckCircle2,
  XCircle,
  PackageCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import LabCalendar from '../components/LabCalendar';
import LabSessionsManager from '../components/LabSessionsManager';
import NewBorrowModal from '../components/NewBorrowModal';
import BorrowApprovalModal from '../components/BorrowApprovalModal';
import AdminComponentModal from '../components/AdminComponentModal';
import { getAuthToken } from '../api/axios';
import './Dashboard.css';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewBorrowModal, setShowNewBorrowModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState({ isOpen: false, borrow: null, mode: 'APPROVE' });
  const [adminCompModal, setAdminCompModal] = useState({ isOpen: false, editComponent: null });

  // Backend state
  const [dbComponents, setDbComponents] = useState([]);
  const [assignedSession, setAssignedSession] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [adminStats, setAdminStats] = useState({ total: 0, pending: 0, approved: 0, active: 0, rejected: 0, returned: 0 });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const rawUser = localStorage.getItem('userInfo') || localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : { firstName: 'Hiran', lastName: 'Gunarathna', role: 'Student' };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const fetchBackendData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const studentId = user.regNo || user.uniEmail || user.userId;
      const sessionUrl = user.role === 'Student'
        ? `http://localhost:5000/api/lab-sessions/student/${encodeURIComponent(studentId)}`
        : 'http://localhost:5000/api/lab-sessions';

      const borrowUrl = (user.role === 'Admin' || user.role === 'LabAssistant')
        ? 'http://localhost:5000/api/borrows'
        : 'http://localhost:5000/api/borrows/my-borrows';

      const [compRes, sessionRes, borrowRes, notifRes] = await Promise.allSettled([
        axios.get('http://localhost:5000/api/components', { headers }),
        axios.get(sessionUrl, { headers }),
        axios.get(borrowUrl, { headers }),
        axios.get('http://localhost:5000/api/borrows/notifications', { headers })
      ]);

      if (compRes.status === 'fulfilled' && compRes.value.data?.length > 0) {
        setDbComponents(compRes.value.data);
      }
      if (sessionRes.status === 'fulfilled' && sessionRes.value.data?.length > 0) {
        const found = sessionRes.value.data.find((s) => s.status === 'In-Progress') || sessionRes.value.data[0];
        setAssignedSession(found);
      } else {
        setAssignedSession(null);
      }

      if (borrowRes.status === 'fulfilled') {
        const data = borrowRes.value.data;
        if (Array.isArray(data)) {
          setBorrows(data);
        } else if (data && data.borrows) {
          setBorrows(data.borrows);
          if (data.stats) setAdminStats(data.stats);
        }
      }

      if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value.data)) {
        setNotifications(notifRes.value.data);
      }
    } catch (err) {
      console.log('Error fetching backend data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleDismissNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Helper to determine component thumbnail
  const getComponentImage = (compName = '', spec = '', lab = '', item = null) => {
    // 1. Direct custom imageUrl on item or populated component
    const customImg = item?.imageUrl || item?.component?.imageUrl;
    if (customImg) {
      return customImg.startsWith('/uploads/') ? `http://localhost:5000${customImg}` : customImg;
    }

    // 2. Lookup in dbComponents by matching name, spec, or compId
    if (dbComponents && dbComponents.length > 0) {
      const match = dbComponents.find(
        (c) =>
          (c.name && compName && c.name.toLowerCase() === compName.toLowerCase()) ||
          (c.spec && spec && c.spec.toLowerCase() === spec.toLowerCase()) ||
          (item?.componentId && c.compId === item.componentId) ||
          (item?._id && c._id === item._id)
      );
      if (match?.imageUrl) {
        return match.imageUrl.startsWith('/uploads/') ? `http://localhost:5000${match.imageUrl}` : match.imageUrl;
      }
    }

    // 3. Fallback to category asset
    const text = `${compName} ${spec} ${lab}`.toLowerCase();
    if (text.includes('ic') || text.includes('diode') || text.includes('74hc') || text.includes('resistor')) {
      return '/assets/components/ic_chip.jpg';
    }
    if (text.includes('esp32') || text.includes('board') || text.includes('breadboard') || text.includes('dev')) {
      return '/assets/components/dev_board.jpg';
    }
    if (text.includes('sensor') || text.includes('sht31') || text.includes('transceiver') || text.includes('rf')) {
      return '/assets/components/sensor.jpg';
    }
    if (text.includes('stm32') || text.includes('dsp') || text.includes('microcontroller') || text.includes('processor') || text.includes('oscilloscope')) {
      return '/assets/components/processor.jpg';
    }
    return '/assets/components/dev_board.jpg';
  };

  // Filtered borrows list based on search and status
  const filteredBorrows = useMemo(() => {
    return borrows.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (item.componentName || '').toLowerCase().includes(q) ||
        (item.componentSpec || '').toLowerCase().includes(q) ||
        (item.project || '').toLowerCase().includes(q) ||
        (item.studentName || '').toLowerCase().includes(q) ||
        (item.studentRegNo || '').toLowerCase().includes(q);

      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [borrows, searchQuery, filterStatus]);

  return (
    <div className="dashboard-layout">
      {/* ====================================================================
          1. LEFT SIDEBAR
          ==================================================================== */}
      <aside className="sidebar">
        <div>
          {/* Logo & Brand Header */}
          <div className="sidebar-header">
            <div className="sidebar-logo-icon">
              <Cpu size={22} />
            </div>
            <div className="sidebar-logo-title">
              Electronics Equipment<br />Management System
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveNav('dashboard')}
            >
              <LayoutDashboard className="nav-icon" />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'practicals' ? 'active' : ''}`}
              onClick={() => setActiveNav('practicals')}
            >
              <GraduationCap className="nav-icon" />
              <span>{user.role === 'Student' ? 'My Lab Station' : 'Lab Station Allocations'}</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'loans' ? 'active' : ''}`}
              onClick={() => setActiveNav('loans')}
            >
              <ArrowLeftRight className="nav-icon" />
              <span>{user.role === 'Student' ? 'My Borrowings' : 'Borrow Approvals'}</span>
              {user.role !== 'Student' && adminStats.pending > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '10px'
                  }}
                >
                  {adminStats.pending}
                </span>
              )}
            </button>

            {user.role !== 'Student' && (
              <>
                <button
                  className={`nav-item ${activeNav === 'projects' ? 'active' : ''}`}
                  onClick={() => setActiveNav('projects')}
                >
                  <FolderKanban className="nav-icon" />
                  <span>Projects</span>
                </button>

                <button
                  className={`nav-item ${activeNav === 'equipments' ? 'active' : ''}`}
                  onClick={() => setActiveNav('equipments')}
                >
                  <Cpu className="nav-icon" />
                  <span>All Equipments</span>
                </button>
              </>
            )}

            <button
              className={`nav-item ${activeNav === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveNav('notifications')}
            >
              <Bell className="nav-icon" />
              <span>Notifications</span>
              {notifications.length > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '10px'
                  }}
                >
                  {notifications.length}
                </span>
              )}
            </button>

            <button
              className="nav-item"
              onClick={handleLogout}
              style={{ color: '#ef4444' }}
            >
              <LogOut className="nav-icon" style={{ color: '#ef4444' }} />
              <span>Log Out</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'waitlist' ? 'active' : ''}`}
              onClick={() => setActiveNav('waitlist')}
            >
              <Clock className="nav-icon" />
              <span>Waitlist Alert</span>
            </button>
          </nav>
        </div>

        {/* Bottom Settings Link */}
        <div className="sidebar-footer">
          <button
            className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveNav('settings')}
          >
            <Settings className="nav-icon" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* ====================================================================
          2. MAIN WRAPPER & TOPBAR
          ==================================================================== */}
      <div className="main-wrapper">
        <header className="topbar">
          {/* Search bar */}
          <div className="topbar-search">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search components, projects, or registrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Topbar Right Actions */}
          <div className="topbar-actions">
            <button
              className="icon-btn"
              title="Refresh Data"
              onClick={fetchBackendData}
            >
              <RefreshCw size={17} className={loading ? 'spin' : ''} />
            </button>

            <button
              className="icon-btn"
              title="Notifications"
              onClick={() => setActiveNav('notifications')}
            >
              <Bell size={18} />
              {notifications.length > 0 && <span className="notif-badge-dot"></span>}
            </button>

            <div className="user-profile-btn">
              <div className="user-avatar">
                {user.firstName ? user.firstName[0].toUpperCase() : 'H'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user.firstName || 'Student'} {user.lastName || ''}
                </span>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {user.role === 'Student' ? (user.regNo || 'EE Student') : user.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ==================================================================
            3. MAIN CONTENT BODY + RIGHT WIDGET PANEL
            ================================================================== */}
        <div className="content-body">
          {/* Main Workspace Area */}
          <main className="workspace-area">
            {activeNav === 'dashboard' && (
              <>
                {/* Workspace Title & "+ New Borrow" Button */}
                <div className="workspace-header">
                  <h1 className="workspace-title">My Workspace</h1>
                  <button
                    className="btn-primary-loan"
                    onClick={() => setShowNewBorrowModal(true)}
                  >
                    <Plus size={16} />
                    <span>New Borrow</span>
                  </button>
                </div>

                {/* Upcoming Assigned Lab Session Banner */}
                {assignedSession && (
                  <div className="upcoming-practical-banner">
                    <div className="banner-left-info">
                      <div className="banner-tag-row">
                        <span className="banner-course-pill">{assignedSession.courseCode}</span>
                        <span className="banner-sem-pill">Semester {assignedSession.semester}</span>
                        <span className="banner-lab-pill">Lab {assignedSession.labNumber}</span>
                        <span className={`banner-status-pill status-${assignedSession.status.toLowerCase()}`}>
                          {assignedSession.status === 'In-Progress' ? '🔴 Live Session' : assignedSession.status}
                        </span>
                      </div>

                      <h3 className="banner-practical-title">{assignedSession.title}</h3>

                      <div className="banner-logistics-bar">
                        <div className="banner-log-item">
                          <MapPin size={14} />
                          <span>{assignedSession.labName}</span>
                        </div>
                        <div className="banner-log-item table-highlight">
                          <Layers size={14} />
                          <strong>Assigned: {assignedSession.worktable}</strong>
                        </div>
                        <div className="banner-log-item">
                          <CalendarIcon size={14} />
                          <span>
                            {new Date(assignedSession.scheduledDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}{' '}
                            &middot; {assignedSession.timeSlot}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="banner-right-action">
                      <div className="banner-tray-preview">
                        <span className="tray-badge-count">
                          {assignedSession.requiredEquipment?.length || 0}
                        </span>
                        <span>Components Tray</span>
                      </div>
                      <button
                        className="btn-banner-view-practicals"
                        onClick={() => setActiveNav('practicals')}
                      >
                        <span>Manage Practical & Tray</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Borrowings Section (Student or Admin Summary) */}
                <section className="loans-section">
                  <div className="section-subheader">
                    <div>
                      <h2 className="section-title">
                        {user.role === 'Student' ? 'My Borrowings' : 'Active Borrowings & Requests'}
                      </h2>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {filteredBorrows.length} record(s) found
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <select
                        className="filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending Approval</option>
                        <option value="Approved">Approved (Pickup Ready)</option>
                        <option value="Active">Active (In Use)</option>
                        <option value="Returned">Returned</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Empty State */}
                  {filteredBorrows.length === 0 ? (
                    <div className="borrow-empty-box">
                      <div className="borrow-empty-icon">
                        <ArrowLeftRight size={28} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                          No Borrowing Records Found
                        </h3>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
                          {user.role === 'Student'
                            ? "You don't have any active borrowings or pending requests. Need an oscilloscope, development board, or ICs for your project?"
                            : 'No borrow requests matching the selected filter in the laboratory database.'}
                        </p>
                      </div>
                      <button
                        className="btn-primary-loan"
                        style={{ padding: '9px 20px', fontSize: '14px' }}
                        onClick={() => setShowNewBorrowModal(true)}
                      >
                        <Plus size={16} />
                        <span>New Borrow</span>
                      </button>
                    </div>
                  ) : (
                    /* 3-Column Borrowings Card Grid */
                    <div className="cards-grid">
                      {filteredBorrows.map((b) => (
                        <div key={b._id} className="borrow-card">
                          {/* Image Container */}
                          <div className="card-img-container">
                            <img
                              src={getComponentImage(b.componentName, b.componentSpec, b.lab)}
                              alt={b.componentName}
                              className="card-img"
                              onError={(e) => {
                                e.target.src = '/assets/components/dev_board.jpg';
                              }}
                            />
                          </div>

                          {/* Status Badge & Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div className="card-title" style={{ fontSize: '16px', lineHeight: '1.3' }}>
                              {b.componentName}
                            </div>
                            <span className={`borrow-badge badge-${b.status.toLowerCase()}`}>
                              {b.status === 'Pending' && '🟡 Pending'}
                              {b.status === 'Approved' && '🟢 Approved'}
                              {b.status === 'Active' && '🔵 In Use'}
                              {b.status === 'Rejected' && '🔴 Rejected'}
                              {b.status === 'Returned' && '⚪ Returned'}
                            </span>
                          </div>

                          {/* Project & Location Details */}
                          <div className="card-project" style={{ fontSize: '13.5px', marginBottom: '4px' }}>
                            <strong>Project:</strong> {b.project}
                          </div>

                          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                            <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {b.lab} &bull; {b.location || 'Bench Counter'}
                          </div>

                          {/* Specific Information Box based on Status */}
                          <div className="borrow-info-box">
                            {b.status === 'Pending' && (
                              <>
                                <div>
                                  <strong>Requested Duration:</strong> {b.durationDays} Days (Qty: {b.quantity})
                                </div>
                                <div style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <Clock3 size={13} />
                                  <span>Awaiting Lab Admin approval</span>
                                </div>
                              </>
                            )}

                            {b.status === 'Approved' && (
                              <>
                                <div style={{ color: '#059669', fontWeight: '700' }}>
                                  Ready for Lab Counter Pickup
                                </div>
                                <div>
                                  <strong>Pickup:</strong> {b.pickupTime || 'Today during lab hours'}
                                </div>
                                <div>
                                  <strong>Allocated:</strong> {b.allocatedTime || `${b.durationDays} Days`}
                                </div>
                                {b.adminNotes && (
                                  <div style={{ color: 'var(--text-muted)', fontSize: '11.5px', fontStyle: 'italic' }}>
                                    &ldquo;{b.adminNotes}&rdquo;
                                  </div>
                                )}
                              </>
                            )}

                            {b.status === 'Active' && (
                              <>
                                <div style={{ color: '#2563eb', fontWeight: '700' }}>
                                  Item Currently in Active Use
                                </div>
                                <div>
                                  <strong>Allocated Time:</strong> {b.allocatedTime || `${b.durationDays} Days`}
                                </div>
                                <div>
                                  <strong>Quantity:</strong> {b.quantity} unit(s)
                                </div>
                              </>
                            )}

                            {b.status === 'Rejected' && (
                              <>
                                <div style={{ color: '#dc2626', fontWeight: '700' }}>
                                  Request Declined by Admin
                                </div>
                                <div>
                                  <strong>Reason:</strong> {b.rejectionReason || 'Equipment reserved for scheduled classes.'}
                                </div>
                              </>
                            )}

                            {b.status === 'Returned' && (
                              <>
                                <div style={{ color: '#64748b', fontWeight: '600' }}>
                                  Returned & Restocked
                                </div>
                                <div>
                                  <strong>Returned:</strong>{' '}
                                  {b.returnedAt ? new Date(b.returnedAt).toLocaleDateString() : 'Completed'}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Admin Quick Action Button on Cards */}
                          {user.role !== 'Student' && (
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                              {b.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => setApprovalModal({ isOpen: true, borrow: b, mode: 'APPROVE' })}
                                    style={{
                                      flex: 1,
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      background: '#059669',
                                      color: '#fff',
                                      fontSize: '12.5px',
                                      fontWeight: '600',
                                      border: 'none',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => setApprovalModal({ isOpen: true, borrow: b, mode: 'REJECT' })}
                                    style={{
                                      flex: 1,
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      background: '#dc2626',
                                      color: '#fff',
                                      fontSize: '12.5px',
                                      fontWeight: '600',
                                      border: 'none',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {b.status === 'Approved' && (
                                <button
                                  onClick={() => setApprovalModal({ isOpen: true, borrow: b, mode: 'HANDOVER' })}
                                  style={{
                                    width: '100%',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: '#2563eb',
                                    color: '#fff',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Handover to Student
                                </button>
                              )}
                              {b.status === 'Active' && (
                                <button
                                  onClick={() => setApprovalModal({ isOpen: true, borrow: b, mode: 'RETURN' })}
                                  style={{
                                    width: '100%',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: '#475569',
                                    color: '#fff',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Process Return
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* Admin Borrow Approvals / Student Borrowings View */}
            {activeNav === 'loans' && (
              <div>
                <div className="workspace-header">
                  <div>
                    <h1 className="workspace-title">
                      {user.role === 'Student' ? 'My Borrow History & Active Gear' : 'Borrow Requests & Approvals'}
                    </h1>
                    <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                      {user.role === 'Student'
                        ? 'Track equipment pickup times, loan deadlines, and return statuses.'
                        : 'Review student borrow requests, allocate pickup windows, or process equipment returns.'}
                    </span>
                  </div>

                  <button className="btn-primary-loan" onClick={() => setShowNewBorrowModal(true)}>
                    <Plus size={16} />
                    <span>New Borrow</span>
                  </button>
                </div>

                {/* Admin Quick Stat Overview Pills */}
                {user.role !== 'Student' && (
                  <div className="borrow-stats-row">
                    <div className="borrow-stat-pill" style={{ borderLeft: '4px solid #f59e0b' }}>
                      <span className="borrow-stat-val" style={{ color: '#d97706' }}>{adminStats.pending}</span>
                      <span className="borrow-stat-lbl">Pending Review</span>
                    </div>
                    <div className="borrow-stat-pill" style={{ borderLeft: '4px solid #10b981' }}>
                      <span className="borrow-stat-val" style={{ color: '#059669' }}>{adminStats.approved}</span>
                      <span className="borrow-stat-lbl">Ready for Pickup</span>
                    </div>
                    <div className="borrow-stat-pill" style={{ borderLeft: '4px solid #2563eb' }}>
                      <span className="borrow-stat-val" style={{ color: '#2563eb' }}>{adminStats.active}</span>
                      <span className="borrow-stat-lbl">Active in Use</span>
                    </div>
                    <div className="borrow-stat-pill" style={{ borderLeft: '4px solid #64748b' }}>
                      <span className="borrow-stat-val" style={{ color: '#64748b' }}>{adminStats.returned}</span>
                      <span className="borrow-stat-lbl">Returned / Restocked</span>
                    </div>
                  </div>
                )}

                {/* Table View of Borrow Requests */}
                <div className="widget-box" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['All', 'Pending', 'Approved', 'Active', 'Returned', 'Rejected'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setFilterStatus(st)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            border: '1px solid var(--border-subtle)',
                            background: filterStatus === st ? 'var(--primary-navy)' : 'var(--bg-surface)',
                            color: filterStatus === st ? '#ffffff' : 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Showing {filteredBorrows.length} request(s)
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <tr>
                          {user.role !== 'Student' && (
                            <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', minWidth: '180px' }}>
                              STUDENT
                            </th>
                          )}
                          <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', minWidth: '200px' }}>
                            EQUIPMENT / COMPONENT
                          </th>
                          <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', minWidth: '180px' }}>
                            PROJECT & LAB
                          </th>
                          <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', minWidth: '110px' }}>
                            STATUS
                          </th>
                          <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', minWidth: '160px' }}>
                            TIMELINE & PICKUP
                          </th>
                          <th style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right', minWidth: '170px', whiteSpace: 'nowrap' }}>
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBorrows.length === 0 ? (
                          <tr>
                            <td colSpan={user.role !== 'Student' ? 6 : 5} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                              No requests found matching &ldquo;{filterStatus}&rdquo;.
                            </td>
                          </tr>
                        ) : (
                          filteredBorrows.map((row) => (
                            <tr key={row._id} style={{ borderBottom: '1px solid var(--border-divider)' }}>
                              {user.role !== 'Student' && (
                                <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                                  <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                                    {row.studentName}
                                  </div>
                                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {row.studentRegNo} &bull; {row.studentEmail}
                                  </div>
                                </td>
                              )}
                              <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                                  {row.componentName}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                  Qty: {row.quantity} &bull; {row.componentSpec}
                                </div>
                              </td>
                              <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                                <div style={{ fontWeight: '500', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                                  {row.project}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                  {row.lab} ({row.location || 'Bench Counter'})
                                </div>
                              </td>
                              <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                                <span className={`borrow-badge badge-${row.status.toLowerCase()}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>
                                {row.status === 'Approved' && (
                                  <div>
                                    <div style={{ color: '#059669', fontWeight: '600' }}>{row.pickupTime}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.allocatedTime}</div>
                                  </div>
                                )}
                                {row.status === 'Active' && <div>{row.allocatedTime || `${row.durationDays} Days`}</div>}
                                {row.status === 'Pending' && <div>Requested: {row.durationDays} Days</div>}
                                {row.status === 'Rejected' && <div style={{ color: '#dc2626' }}>{row.rejectionReason}</div>}
                                {row.status === 'Returned' && <div>Returned on {new Date(row.returnedAt || row.updatedAt).toLocaleDateString()}</div>}
                              </td>
                              <td style={{ padding: '14px 18px', textAlign: 'right', minWidth: '170px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                {user.role !== 'Student' ? (
                                  <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                                    {row.status === 'Pending' && (
                                      <>
                                        <button
                                          onClick={() => setApprovalModal({ isOpen: true, borrow: row, mode: 'APPROVE' })}
                                          style={{
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            background: '#059669',
                                            color: '#fff',
                                            fontSize: '12.5px',
                                            fontWeight: '600',
                                            border: 'none',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => setApprovalModal({ isOpen: true, borrow: row, mode: 'REJECT' })}
                                          style={{
                                            padding: '6px 14px',
                                            borderRadius: '6px',
                                            background: '#dc2626',
                                            color: '#fff',
                                            fontSize: '12.5px',
                                            fontWeight: '600',
                                            border: 'none',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                    {row.status === 'Approved' && (
                                      <button
                                        onClick={() => setApprovalModal({ isOpen: true, borrow: row, mode: 'HANDOVER' })}
                                        style={{
                                          padding: '6px 14px',
                                          borderRadius: '6px',
                                          background: '#2563eb',
                                          color: '#fff',
                                          fontSize: '12.5px',
                                          fontWeight: '600',
                                          border: 'none',
                                          cursor: 'pointer',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        Handover
                                      </button>
                                    )}
                                    {row.status === 'Active' && (
                                      <button
                                        onClick={() => setApprovalModal({ isOpen: true, borrow: row, mode: 'RETURN' })}
                                        style={{
                                          padding: '6px 14px',
                                          borderRadius: '6px',
                                          background: '#475569',
                                          color: '#fff',
                                          fontSize: '12.5px',
                                          fontWeight: '600',
                                          border: 'none',
                                          cursor: 'pointer',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        Return
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setShowNewBorrowModal(true)}
                                    style={{
                                      padding: '6px 14px',
                                      borderRadius: '6px',
                                      background: 'var(--bg-surface-subtle)',
                                      color: 'var(--text-primary)',
                                      fontSize: '12.5px',
                                      border: '1px solid var(--border-subtle)',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    Borrow More
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Lab Practicals Manager View */}
            {activeNav === 'practicals' && (
              <LabSessionsManager currentUser={user} />
            )}

            {/* Equipments Catalog View */}
            {activeNav === 'equipments' && (
              <div>
                <div className="workspace-header">
                  <div>
                    <h1 className="workspace-title">Faculty Equipments & Inventory Catalog</h1>
                    <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                      Browse 300+ components, instruments, and development modules across all 8 department labs.
                    </span>
                  </div>

                  <button className="btn-primary-loan" onClick={() => setShowNewBorrowModal(true)}>
                    <Plus size={16} />
                    <span>New Borrow</span>
                  </button>
                </div>

                <div className="widget-box" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <tr>
                          <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>EQUIPMENT / COMPONENT</th>
                          <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>LABORATORY</th>
                          <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>LOCATION</th>
                          <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>AVAILABILITY</th>
                          <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right', minWidth: '120px' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbComponents.slice(0, 50).map((item) => {
                          const stock = item.availableQuantity ?? item.stockQty ?? 0;
                          return (
                            <tr key={item._id} style={{ borderBottom: '1px solid var(--border-divider)' }}>
                              <td style={{ padding: '16px 20px' }}>
                                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                  {item.spec || item.name}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                  Code: {item.compId} &bull; {item.type || item.category || 'Component'}
                                </div>
                              </td>
                              <td style={{ padding: '16px 20px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                                {item.lab}
                              </td>
                              <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13.5px' }}>
                                {item.location || item.shelfLoc || 'Lab Worktable'}
                              </td>
                              <td style={{ padding: '16px 20px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '5px 12px',
                                    borderRadius: 'var(--radius-pill)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    backgroundColor: stock > 0 ? 'var(--color-emerald-bg)' : 'var(--color-rose-bg)',
                                    color: stock > 0 ? 'var(--color-emerald-text)' : 'var(--color-rose-text)'
                                  }}
                                >
                                  {stock > 0 ? `${stock} In Stock` : 'Out of Stock'}
                                </span>
                              </td>
                              <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                <button
                                  onClick={() => setShowNewBorrowModal(true)}
                                  disabled={stock <= 0}
                                  style={{
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-pill)',
                                    background: stock > 0 ? 'var(--primary-navy)' : '#94a3b8',
                                    color: '#ffffff',
                                    fontSize: '13.5px',
                                    fontWeight: '500',
                                    border: 'none',
                                    cursor: stock > 0 ? 'pointer' : 'not-allowed',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  Borrow
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Projects View */}
            {activeNav === 'projects' && (
              <div>
                <div className="workspace-header">
                  <h1 className="workspace-title">Active Engineering Projects</h1>
                  <button className="btn-primary-loan" onClick={() => setShowNewBorrowModal(true)}>
                    <Plus size={16} />
                    <span>New Borrow</span>
                  </button>
                </div>
                <div className="cards-grid">
                  {['Project 1 - Autonomous Robotics', 'Project 2 - IoT Environmental Sensing', 'Project 3 - Signal DSP Filter'].map((proj, idx) => (
                    <div key={idx} className="loan-card">
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{proj}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                        EE4207 Capstone laboratory cohort. Active equipment borrowings assigned.
                      </p>
                      <button
                        className="btn-view-more"
                        onClick={() => {
                          setFilterStatus('All');
                          setActiveNav('dashboard');
                        }}
                      >
                        View Assigned Gear
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications View */}
            {activeNav === 'notifications' && (
              <div>
                <div className="workspace-header">
                  <h1 className="workspace-title">Notifications & Alerts</h1>
                </div>
                <div className="widget-box" style={{ maxWidth: '680px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No new notifications right now.
                    </div>
                  ) : (
                    <div className="notifications-list">
                      {notifications.map((n) => (
                        <div key={n.id} className="notif-card">
                          <div className={`notif-icon-circle notif-${n.type || 'emerald'}`}>
                            <Bell size={16} />
                          </div>
                          <div className="notif-content">
                            <div className="notif-heading">{n.title}</div>
                            <div className="notif-desc">{n.desc}</div>
                            <div className="notif-time">{n.time}</div>
                          </div>
                          <button
                            className="notif-close-btn"
                            onClick={() => handleDismissNotif(n.id)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings View */}
            {activeNav === 'settings' && (
              <div>
                <div className="workspace-header">
                  <h1 className="workspace-title">Lab & Account Settings</h1>
                </div>
                <div className="widget-box" style={{ maxWidth: '560px' }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Profile Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Full Name</label>
                      <input className="form-input" style={{ width: '100%', marginTop: '4px' }} defaultValue={`${user.firstName || 'Student'} ${user.lastName || ''}`} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Registration / ID</label>
                      <input className="form-input" style={{ width: '100%', marginTop: '4px' }} defaultValue={user.regNo || user.userId || 'EG/2023/5456'} disabled />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>University Email</label>
                      <input className="form-input" style={{ width: '100%', marginTop: '4px' }} defaultValue={user.uniEmail || 'user@eng.ruh.ac.lk'} disabled />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Department</label>
                      <input className="form-input" style={{ width: '100%', marginTop: '4px' }} defaultValue="Electrical & Information Engineering" disabled />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ================================================================
              4. RIGHT WIDGET PANEL (Notifications & Calendar on Dashboard)
              ================================================================ */}
          {activeNav === 'dashboard' && (
            <aside className="right-panel">
              {/* Notifications Widget */}
              <div className="widget-box">
                <div className="widget-header">
                  <h3 className="widget-title">Live Notifications</h3>
                  <button className="widget-more-btn" title="Refresh Notifications" onClick={fetchBackendData}>
                    <RefreshCw size={14} />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No active alerts.
                  </div>
                ) : (
                  <div className="notifications-list">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="notif-card">
                        <div className={`notif-icon-circle notif-${notif.type || 'emerald'}`}>
                          <Bell size={16} />
                        </div>
                        <div className="notif-content">
                          <div className="notif-heading">{notif.title}</div>
                          <div className="notif-desc">{notif.desc}</div>
                          <div className="notif-time">{notif.time}</div>
                        </div>
                        <button
                          className="notif-close-btn"
                          onClick={() => handleDismissNotif(notif.id)}
                          title="Dismiss"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Upcoming Lab Calendar Widget */}
              <LabCalendar
                activeLoans={borrows.map((b) => ({
                  id: b._id || b.borrowId,
                  title: b.componentName || b.componentSpec,
                  project: b.project,
                  dueText: b.allocatedTime || `in ${b.durationDays} days`,
                  status: b.status === 'Approved' ? 'Due Soon' : b.status
                }))}
                user={user}
              />
            </aside>
          )}
        </div>
      </div>

      {/* ====================================================================
          5. MODALS: Redesigned New Borrow Modal & Admin Approval Modal
          ==================================================================== */}
      <NewBorrowModal
        isOpen={showNewBorrowModal}
        onClose={() => setShowNewBorrowModal(false)}
        dbComponents={dbComponents}
        currentUser={user}
        onSuccess={fetchBackendData}
      />

      <BorrowApprovalModal
        isOpen={approvalModal.isOpen}
        borrow={approvalModal.borrow}
        mode={approvalModal.mode}
        onClose={() => setApprovalModal({ isOpen: false, borrow: null, mode: 'APPROVE' })}
        onSuccess={fetchBackendData}
      />
    </div>
  );
}