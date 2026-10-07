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
  Layers
} from 'lucide-react';
import LabCalendar from '../components/LabCalendar';
import './Dashboard.css';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);

  // Backend inventory and transactions
  const [dbComponents, setDbComponents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Active Loans List matching the user mockup
  const [activeLoans, setActiveLoans] = useState([
    {
      id: 1,
      title: 'Electronic Component',
      project: 'Project 1',
      dueText: '1 hrs ago',
      image: '/assets/components/ic_chip.jpg',
      category: 'ICs',
      progress: { green: 70, amber: 20, red: 10 },
      status: 'Active'
    },
    {
      id: 2,
      title: 'Electronic Component',
      project: 'Project 2',
      dueText: '23 hrs ago',
      image: '/assets/components/processor.jpg',
      category: 'Microcontrollers',
      progress: { green: 40, amber: 35, red: 25 },
      status: 'Review'
    },
    {
      id: 3,
      title: 'Electronic Component',
      project: 'Project 3',
      dueText: '17 hrs ago',
      image: '/assets/components/sensor.jpg',
      category: 'Sensors',
      progress: { green: 80, amber: 15, red: 5 },
      status: 'Active'
    },
    {
      id: 4,
      title: 'Project Linas',
      project: 'Project 1',
      dueText: '8 hrs ago',
      image: '/assets/components/dev_board.jpg',
      category: 'DevBoards',
      progress: { green: 90, amber: 10, red: 0 },
      status: 'Active'
    },
    {
      id: 5,
      title: 'Electronic Component',
      project: 'Project 2',
      dueText: '21 hrs ago',
      image: '/assets/components/ic_chip.jpg',
      category: 'ICs',
      progress: { green: 30, amber: 40, red: 30 },
      status: 'Due Soon'
    },
    {
      id: 6,
      title: 'Project Complier',
      project: 'Project 3',
      dueText: '12 hrs ago',
      image: '/assets/components/processor.jpg',
      category: 'Microcontrollers',
      progress: { green: 55, amber: 25, red: 20 },
      status: 'Active'
    }
  ]);

  // Notifications matching mockup
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'amber',
      title: 'Waitlist Alert',
      desc: 'Your waitlist alerts an electronic equipment: core waitlist.',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'emerald',
      title: 'Waitlist Alert',
      desc: 'Your waitlist equipment alert: lab collection waitlist ready.',
      time: '5 minutes ago'
    }
  ]);

  // New Loan Form State
  const [loanForm, setLoanForm] = useState({
    componentName: 'Rigol DS1054Z Digital Oscilloscope',
    project: 'Project 1',
    category: 'Equipment',
    durationDays: '3',
    notes: ''
  });

  const rawUser = localStorage.getItem('userInfo') || localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : { firstName: 'Hiran', lastName: 'Gunarathna', role: 'Student' };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const fetchBackendData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [compRes] = await Promise.allSettled([
        axios.get('http://localhost:5000/api/components', { headers })
      ]);

      if (compRes.status === 'fulfilled' && compRes.value.data?.length > 0) {
        setDbComponents(compRes.value.data);
      }
    } catch (err) {
      console.log('Using local state for dashboard demo:', err.message);
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

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    
    // Choose appropriate image based on category or form
    let img = '/assets/components/dev_board.jpg';
    if (loanForm.category === 'ICs') img = '/assets/components/ic_chip.jpg';
    if (loanForm.category === 'Sensors') img = '/assets/components/sensor.jpg';
    if (loanForm.category === 'Microcontrollers') img = '/assets/components/processor.jpg';

    const newLoan = {
      id: Date.now(),
      title: loanForm.componentName,
      project: loanForm.project,
      dueText: `in ${loanForm.durationDays} days`,
      image: img,
      category: loanForm.category,
      progress: { green: 100, amber: 0, red: 0 },
      status: 'Active'
    };

    setActiveLoans([newLoan, ...activeLoans]);
    setShowNewLoanModal(false);

    // Also attempt backend borrow if user is logged in
    try {
      const token = localStorage.getItem('token');
      if (token && dbComponents.length > 0) {
        const target = dbComponents.find(c => c.spec?.toLowerCase().includes(loanForm.componentName.toLowerCase())) || dbComponents[0];
        if (target) {
          await axios.post('http://localhost:5000/api/transactions/borrow', {
            componentId: target._id,
            quantity: 1
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
    } catch (err) {
      console.log('Backend sync simulated:', err.message);
    }
  };

  // Filtered loans list based on search and category
  const filteredLoans = useMemo(() => {
    return activeLoans.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeLoans, searchQuery, filterCategory]);

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
              className={`nav-item ${activeNav === 'study' ? 'active' : ''}`}
              onClick={() => setActiveNav('study')}
            >
              <GraduationCap className="nav-icon" />
              <span>Study</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveNav('projects')}
            >
              <FolderKanban className="nav-icon" />
              <span>Projects</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'loans' ? 'active' : ''}`}
              onClick={() => setActiveNav('loans')}
            >
              <ArrowLeftRight className="nav-icon" />
              <span>Loan Loans</span>
              <ChevronDown className="nav-chevron" />
            </button>

            <button
              className={`nav-item ${activeNav === 'equipments' ? 'active' : ''}`}
              onClick={() => setActiveNav('equipments')}
            >
              <Layers className="nav-icon" />
              <span>Equipments</span>
              <ChevronDown className="nav-chevron" />
            </button>

            <button
              className={`nav-item ${activeNav === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveNav('notifications')}
            >
              <Bell className="nav-icon" />
              <span>Notifications</span>
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
              placeholder="Search Students / Equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Topbar Right Actions */}
          <div className="topbar-actions">
            <button className="icon-btn" title="Messages">
              <Mail size={18} />
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
                  {user.role || 'EE Student'}
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
                {/* Workspace Title & "+ New Loan" Button */}
                <div className="workspace-header">
                  <h1 className="workspace-title">My Workspace</h1>
                  <button
                    className="btn-primary-loan"
                    onClick={() => setShowNewLoanModal(true)}
                  >
                    <Plus size={16} />
                    <span>New My Loan</span>
                  </button>
                </div>

                {/* Active Loans Section */}
                <section className="loans-section">
                  <div className="section-subheader">
                    <h2 className="section-title">Active Loans</h2>
                    <select
                      className="filter-select"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="All">All Items</option>
                      <option value="ICs">Integrated Circuits</option>
                      <option value="Microcontrollers">Microcontrollers</option>
                      <option value="Sensors">Sensors</option>
                      <option value="DevBoards">Development Boards</option>
                    </select>
                  </div>

                  {/* 3-Column Card Grid */}
                  <div className="cards-grid">
                    {filteredLoans.map((loan) => (
                      <div key={loan.id} className="loan-card">
                        <div className="card-img-container">
                          <img
                            src={loan.image}
                            alt={loan.title}
                            className="card-img"
                            onError={(e) => {
                              e.target.src = '/assets/components/dev_board.jpg';
                            }}
                          />
                        </div>

                        <div className="card-title">{loan.title}</div>
                        <div className="card-project">{loan.project}</div>

                        <div className="card-due-row">
                          <span className="card-due-label">Due Date</span>
                          <span className="card-due-time">{loan.dueText}</span>
                        </div>

                        {/* Segmented Progress Bar (Green, Amber, Red) */}
                        <div className="card-progress-bar">
                          <div
                            className="progress-segment seg-green"
                            style={{ flex: loan.progress.green }}
                          ></div>
                          <div
                            className="progress-segment seg-amber"
                            style={{ flex: loan.progress.amber }}
                          ></div>
                          <div
                            className="progress-segment seg-red"
                            style={{ flex: loan.progress.red }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Equipments Catalog View */}
            {activeNav === 'equipments' && (
              <div>
                <div className="workspace-header">
                  <h1 className="workspace-title">Equipments & Inventory Catalog</h1>
                  <button
                    className="btn-primary-loan"
                    onClick={() => setShowNewLoanModal(true)}
                  >
                    <Plus size={16} />
                    <span>Request Item</span>
                  </button>
                </div>

                <div className="widget-box" style={{ padding: '0', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <tr>
                        <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>EQUIPMENT / COMPONENT</th>
                        <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>CATEGORY</th>
                        <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>LOCATION</th>
                        <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>AVAILABILITY</th>
                        <th style={{ padding: '16px 20px', fontSize: '13.5px', fontWeight: '600', color: 'var(--text-muted)' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dbComponents.length > 0 ? dbComponents : [
                        { _id: '1', compId: 'OSC-1054', spec: 'Rigol DS1054Z 50MHz 4-CH Digital Oscilloscope', type: 'Instrument', shelfLoc: 'Lab R1 - Bench 3', stockQty: 4 },
                        { _id: '2', compId: 'ESP32-WROOM', spec: 'ESP32-WROOM-32 Wi-Fi & BLE Development Board', type: 'Microcontroller', shelfLoc: 'Cabinet B - Shelf 2', stockQty: 28 },
                        { _id: '3', compId: 'FLK-117', spec: 'Fluke 117 True RMS Digital Multimeter', type: 'Instrument', shelfLoc: 'Lab R2 - Bench 1', stockQty: 12 },
                        { _id: '4', compId: 'STM32F4', spec: 'STM32F401 Black Pill ARM Cortex M4', type: 'Microcontroller', shelfLoc: 'Cabinet A - Shelf 4', stockQty: 19 },
                        { _id: '5', compId: 'SHT31-D', spec: 'Sensirion SHT31-D High Accuracy Temp/Humidity Sensor', type: 'Sensor', shelfLoc: 'Drawer 04 - Bin 2', stockQty: 35 }
                      ]).map((item) => (
                        <tr key={item._id} style={{ borderBottom: '1px solid var(--border-divider)' }}>
                          <td style={{ padding: '16px 20px', fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.spec || item.name}</td>
                          <td style={{ padding: '16px 20px', fontSize: '14.5px', color: 'var(--text-secondary)' }}>{item.type || item.category || 'General'}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{item.shelfLoc || 'EE Lab R1'}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '5px 12px',
                              borderRadius: 'var(--radius-pill)',
                              fontSize: '13px',
                              fontWeight: '600',
                              backgroundColor: (item.stockQty ?? 10) > 0 ? 'var(--color-emerald-bg)' : 'var(--color-rose-bg)',
                              color: (item.stockQty ?? 10) > 0 ? 'var(--color-emerald-text)' : 'var(--color-rose-text)'
                            }}>
                              {(item.stockQty ?? 10) > 0 ? `${item.stockQty ?? 10} In Stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <button
                              onClick={() => {
                                setLoanForm({
                                  ...loanForm,
                                  componentName: item.spec || item.name,
                                  category: item.type || 'Equipment'
                                });
                                setShowNewLoanModal(true);
                              }}
                              style={{
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--primary-navy)',
                                color: '#ffffff',
                                fontSize: '13.5px',
                                fontWeight: '500'
                              }}
                            >
                              Borrow
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Projects / Study / Notifications Other Views */}
            {activeNav === 'projects' && (
              <div>
                <div className="workspace-header">
                  <h1 className="workspace-title">Active Engineering Projects</h1>
                  <button className="btn-primary-loan" onClick={() => setShowNewLoanModal(true)}>
                    <Plus size={16} />
                    <span>Assign Equipment</span>
                  </button>
                </div>
                <div className="cards-grid">
                  {['Project 1 - Autonomous Robotics', 'Project 2 - IoT Environmental Sensing', 'Project 3 - Signal DSP Filter'].map((proj, idx) => (
                    <div key={idx} className="loan-card">
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{proj}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                        EE4207 Capstone laboratory cohort. 2 active loans assigned.
                      </p>
                      <button
                        className="btn-view-more"
                        onClick={() => {
                          setFilterCategory('All');
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

            {activeNav === 'notifications' && (
              <div>
                <div className="workspace-header">
                  <h1 className="workspace-title">Notifications & Alerts</h1>
                </div>
                <div className="widget-box" style={{ maxWidth: '680px' }}>
                  <div className="notifications-list">
                    {notifications.map((n) => (
                      <div key={n.id} className="notif-card">
                        <div className={`notif-icon-circle notif-${n.type}`}>
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
                </div>
              </div>
            )}

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
                      <input className="form-input" style={{ width: '100%', marginTop: '4px' }} defaultValue={`${user.firstName || 'Hiran'} ${user.lastName || 'Gunarathna'}`} />
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
              4. RIGHT WIDGET PANEL (Notifications & Calendar)
              ================================================================ */}
          <aside className="right-panel">
            {/* Notifications Widget */}
            <div className="widget-box">
              <div className="widget-header">
                <h3 className="widget-title">Notifications</h3>
                <button className="widget-more-btn" title="More options">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="notifications-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className="notif-card">
                    <div className={`notif-icon-circle notif-${notif.type}`}>
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
            </div>

            {/* Interactive Upcoming Lab Calendar Widget with Sliding Months & User Reminders */}
            <LabCalendar activeLoans={activeLoans} user={user} />
          </aside>
        </div>
      </div>

      {/* ====================================================================
          5. MODALS (New Loan Request & Upcoming Lab View More)
          ==================================================================== */}
      {showNewLoanModal && (
        <div className="modal-overlay" onClick={() => setShowNewLoanModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">New Equipment Loan</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowNewLoanModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLoan}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Equipment / Component Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={loanForm.componentName}
                    onChange={(e) => setLoanForm({ ...loanForm, componentName: e.target.value })}
                    placeholder="e.g. Rigol DS1054Z, ESP32 DevKit, IC 74HC04"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Project / Lab Session</label>
                  <select
                    className="form-select"
                    value={loanForm.project}
                    onChange={(e) => setLoanForm({ ...loanForm, project: e.target.value })}
                  >
                    <option value="Project 1">Project 1 (Robotics Bench)</option>
                    <option value="Project 2">Project 2 (IoT Wireless)</option>
                    <option value="Project 3">Project 3 (Embedded Control)</option>
                    <option value="Personal Study">General Lab Study</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={loanForm.category}
                    onChange={(e) => setLoanForm({ ...loanForm, category: e.target.value })}
                  >
                    <option value="ICs">Integrated Circuits (DIP/SMD)</option>
                    <option value="Microcontrollers">Microcontroller Boards</option>
                    <option value="Sensors">Sensors & Modules</option>
                    <option value="DevBoards">Development Kits</option>
                    <option value="Equipment">Test & Measurement Gear</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Loan Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    className="form-input"
                    value={loanForm.durationDays}
                    onChange={(e) => setLoanForm({ ...loanForm, durationDays: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowNewLoanModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Confirm Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}