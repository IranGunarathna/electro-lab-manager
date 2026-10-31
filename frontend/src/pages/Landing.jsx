import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoOscilloscope from '../assets/D · Oscilloscope@2x (1).png';
import logoDeie from '../assets/Deie.png';
import rigolDs9604 from '../assets/rigol-ds9604.jpg';
import bambuA1UserImg from '../assets/bambu_a1_user.png';
import {
  Zap,
  SunMedium,
  Activity,
  Wrench,
  Radio,
  Cpu,
  Network,
  Boxes,
  Search,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  HeartHandshake,
  HelpCircle,
  ExternalLink,
  Info,
  PhoneCall,
  DollarSign,
  Target,
  LogIn,
  Copy,
  Check,
  Building,
  CreditCard,
  Users
} from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabModal, setSelectedLabModal] = useState(null);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Bambu Lab A1 Fundraiser State
  const [copiedBankNo, setCopiedBankNo] = useState(false);

  const handleCopyAccountNo = () => {
    navigator.clipboard.writeText('086-1001-2004-5678');
    setCopiedBankNo(true);
    setTimeout(() => setCopiedBankNo(false), 2000);
  };

  // Live database components
  const [dbComponents, setDbComponents] = useState([]);
  const [loadingComps, setLoadingComps] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoadingComps(true);
      const res = await axios.get('http://localhost:5000/api/components');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setDbComponents(res.data);
      }
    } catch (err) {
      console.log('Using default lab equipment list:', err.message);
    } finally {
      setLoadingComps(false);
    }
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled((prev) => {
            if (!prev && currentY > 60) {
              return true;
            }
            if (prev && currentY < 25) {
              return false;
            }
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 8 Specific Laboratories (cite: 1)
  const laboratories = [
    {
      id: 1,
      name: 'Electric Machines and Power Systems Laboratory',
      code: 'EMPS-LAB',
      location: 'Block E, Room 102',
      inCharge: 'Eng. P. Bandara (Senior Lab Officer)',
      image: '/assets/labs/power_machines.jpg',
      icon: Zap,
      color: '#0f224a',
      items: [
        'Motor-Generator Dynamometer Sets',
        'Three-Phase Power Transformers',
        'Grid Synchronization & Protection',
        'Torque & Speed Vector Analyzers'
      ],
      openStations: 10,
      totalStations: 12,
      status: 'Open Now'
    },
    {
      id: 2,
      name: 'High Voltage and Renewable Energy Laboratory',
      code: 'HVRE-LAB',
      location: 'Block E, Room 105 (High Bay)',
      inCharge: 'Dr. C. Jayawardena & Tech Support',
      image: '/assets/labs/renewable_energy.png',
      icon: SunMedium,
      color: '#d97706',
      items: [
        'Impulse High-Voltage Generators',
        'Solar PV Microgrid Test Platform',
        'Dielectric Breakdown & Oil Testers',
        'Wind Turbine Energy Emulators'
      ],
      openStations: 8,
      totalStations: 8,
      status: 'Open Now'
    },
    {
      id: 3,
      name: 'Electronics and Measurements Laboratory',
      code: 'EML-LAB',
      location: 'Block D, Room 204',
      inCharge: 'Mr. K. Perera (Lab Technician)',
      image: '/assets/labs/electronics_measurements.png',
      icon: Activity,
      color: '#2563eb',
      items: [
        'Rigol 4-CH Digital Storage O-Scopes',
        'Arbitrary Waveform Generators',
        'Fluke Precision Bench Multimeters',
        'Semiconductor Curve Tracing Systems'
      ],
      openStations: 16,
      totalStations: 20,
      status: 'Open Now'
    },
    {
      id: 4,
      name: 'High Performance Computer Laboratory',
      code: 'HPC-LAB',
      location: 'Block D, Room 108',
      inCharge: 'Technical Officer - HPC & Computing',
      image: '/assets/labs/hpc_servers.png',
      icon: Cpu,
      color: '#0284c7',
      items: [
        'GPU Cluster Compute Nodes (NVIDIA)',
        'Parallel Computing Workstations',
        'High-Throughput Storage Arrays',
        'AI & Simulation Servers'
      ],
      openStations: 14,
      totalStations: 15,
      status: 'Open Now'
    },
    {
      id: 5,
      name: 'Communication and Systems Laboratory',
      code: 'CSL-LAB',
      location: 'Block D, Room 302',
      inCharge: 'Senior Technical Officer - RF & Comms',
      image: '/assets/labs/communication_systems.png',
      icon: Radio,
      color: '#059669',
      items: [
        'Software Defined Radio (SDR) Nodes',
        'RF Vector Network Analyzers',
        'Optical Fiber Transmission Benches',
        'Antenna Radiation Pattern Systems'
      ],
      openStations: 12,
      totalStations: 16,
      status: 'Open Now'
    },
    {
      id: 6,
      name: 'Computer and Information Engineering Laboratory',
      code: 'CIEL-LAB',
      location: 'Block F, Room 201',
      inCharge: 'Systems Engineer & TA Cohort',
      image: '/assets/labs/information_engineering.png',
      icon: Cpu,
      color: '#4f46e5',
      items: [
        'Xilinx FPGA Hardware Synthesis Benches',
        'ARM Cortex Embedded Dev Boards',
        'High-Speed Logic Analyzers',
        'GPU Accelerated Workstations'
      ],
      openStations: 24,
      totalStations: 28,
      status: 'Open Now'
    },
    {
      id: 7,
      name: 'Networking Laboratory',
      code: 'NET-LAB',
      location: 'Block F, Room 205',
      inCharge: 'Network Engineer (DEIE)',
      image: '/assets/labs/networking_lab.png',
      icon: Network,
      color: '#7c3aed',
      items: [
        'Cisco Catalyst Enterprise Switches',
        'Modular Hardware Edge Routers',
        'Optical Fiber Structured Patch Bays',
        'Wireshark Network Capture Servers'
      ],
      openStations: 18,
      totalStations: 20,
      status: 'Open Now'
    },
    {
      id: 8,
      name: 'Undergraduate Project Development Laboratory',
      code: 'UPDL-LAB',
      location: 'Block D, Room 401 (Innovation Wing)',
      inCharge: 'Capstone Project Coordinator',
      image: '/assets/labs/undergraduate_project.jpg',
      icon: Boxes,
      color: '#0891b2',
      items: [
        'Precision FDM Rapid 3D Printers',
        'Autonomous Robotics & Drone Arena',
        'Battery Pack Spot-Welding Systems',
        'Capstone Hardware Project Worktables'
      ],
      openStations: 20,
      totalStations: 25,
      status: 'Open Now'
    }
  ];

  // Connect with live database components for each laboratory
  const dynamicLaboratories = useMemo(() => {
    return laboratories.map((lab) => {
      // Match database components to this laboratory
      const matching = dbComponents.filter((c) => {
        if (!c.lab) return false;
        const compLab = c.lab.trim().toLowerCase();
        const curLab = lab.name.trim().toLowerCase();
        return compLab === curLab || compLab.includes(curLab) || curLab.includes(compLab);
      });

      if (matching.length === 0) {
        return lab;
      }

      // First 4 featured items directly from MongoDB database (fallback-padded to guarantee exactly 4 rows)
      let dynamicItems = matching.slice(0, 4).map((c) => c.name);
      if (dynamicItems.length < 4) {
        const fallbacks = lab.items.filter((item) => !dynamicItems.includes(item));
        dynamicItems = [...dynamicItems, ...fallbacks].slice(0, 4);
      }

      const totalQty = matching.reduce(
        (sum, c) => sum + (c.totalQuantity ?? c.stockQty ?? 1),
        0
      );
      const availQty = matching.reduce(
        (sum, c) => sum + (c.availableQuantity ?? c.stockQty ?? 0),
        0
      );

      return {
        ...lab,
        items: dynamicItems,
        dbComponents: matching,
        totalItemsCount: matching.length,
        openStations: availQty,
        totalStations: totalQty,
        status: availQty > 0 ? 'Open Now' : 'Stock Depleted'
      };
    });
  }, [laboratories, dbComponents]);

  // Search filtering logic across all 8 labs and their live equipment
  const filteredLabs = useMemo(() => {
    if (!searchQuery.trim()) return dynamicLaboratories;
    const q = searchQuery.toLowerCase().trim();
    return dynamicLaboratories.filter((lab) => {
      return (
        lab.name.toLowerCase().includes(q) ||
        lab.code.toLowerCase().includes(q) ||
        lab.location.toLowerCase().includes(q) ||
        lab.items.some((it) => it.toLowerCase().includes(q)) ||
        (lab.dbComponents &&
          lab.dbComponents.some(
            (c) =>
              (c.name || '').toLowerCase().includes(q) ||
              (c.spec || '').toLowerCase().includes(q) ||
              (c.category || '').toLowerCase().includes(q) ||
              (c.location || '').toLowerCase().includes(q)
          ))
      );
    });
  }, [dynamicLaboratories, searchQuery]);

  const scrollToMatrix = () => {
    const el = document.getElementById('labs-matrix');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="landing-page">
      {/* ====================================================================
          1. GLOBAL NAVIGATION BAR
          ==================================================================== */}
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-crossfade-stage">
            {/* Top State: LabSync */}
            <div className={`brand-identity brand-top-identity ${!isScrolled ? 'visible' : 'hidden'}`}>
              <img
                src={logoOscilloscope}
                alt="LabSync Logo"
                className="logo-oscilloscope"
              />
              <div className="brand-text-block">
                <div className="brand-text-title top-title">LabSync</div>
                <div className="brand-text-sub">Electronics Equipment Management System</div>
              </div>
            </div>

            {/* Scrolled State: DEIE */}
            <div className={`brand-identity brand-scrolled-identity ${isScrolled ? 'visible' : 'hidden'}`}>
              <img
                src={logoDeie}
                alt="DEIE University of Ruhuna"
                className="logo-deie"
              />
              <div className="brand-text-block">
                <div className="brand-text-title scrolled-title">Electronics Equipment Management System</div>
                <div className="brand-text-sub">Faculty of Engineering - University of Ruhuna</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Navigation Links: Home, Labs Overview, Goals, Help, Login */}
        <div className="landing-nav-links">
          <button className="nav-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Home
          </button>
          <button className="nav-link-btn" onClick={scrollToMatrix}>
            Labs Overview
          </button>
          <button className="nav-link-btn" onClick={() => setShowGoalsModal(true)}>
            Goals
          </button>
          <button className="nav-link-btn" onClick={() => setShowHelpModal(true)}>
            Help
          </button>

          {/* Unified Login Button */}
          <div className="nav-auth-group">
            <button
              className="btn-nav-login"
              onClick={() => navigate('/login')}
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          2. UPDATES BAR
          ==================================================================== */}
      <div className="live-ticker-wrap">
        <div className="ticker-badge">
          <span className="ticker-pulse-dot"></span>
          <span>Updates</span>
        </div>

        <div className="ticker-single-announcement">
          <span>12 Lab Stations Open Now across DEIE &middot; Real-time worktable reservation &amp; equipment counter operational</span>
        </div>
      </div>

      {/* ====================================================================
          3. DYNAMIC 2-PANEL HERO SECTION
          ==================================================================== */}
      <header className="hero-split-gateway">
        <div className="hero-split-container">
          {/* 1. LEFT PANEL: Welcome Message, Department Intro & Action Pillars */}
          <div className="hero-panel-left">
            <h1 className="hero-welcome-title">
              Welcome to <span className="hero-brand-highlight">LabSync</span>
            </h1>

            <div className="hero-welcome-subheadline">
              Electrical and Information Engineering Department Laboratory Gateway
            </div>

            {/* Core Action Pillars: Test, Borrow, Research */}
            <div className="hero-action-pillars">
              <div className="pillar-item">
                <span className="pillar-bullet-dot"></span>
                <span>Test,</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-bullet-dot"></span>
                <span>Borrow,</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-bullet-dot"></span>
                <span>Research</span>
              </div>
            </div>

            {/* Authentication Gateway Button */}
            <div className="hero-auth-actions">
              <button
                className="btn-gateway-login"
                onClick={() => navigate('/login')}
              >
                <LogIn size={20} />
                <span>Access Laboratory Portal &middot; Login</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn-gateway-browse"
                onClick={scrollToMatrix}
              >
                <span>Browse 8 Labs &darr;</span>
              </button>
            </div>
          </div>

          {/* 2. RIGHT PANEL: Explore Labs Search Bar & Rigol DS9604 Main Image */}
          <div className="hero-panel-right">
            {/* Search Box */}
            <div className="hero-search-container-panel">
              <div className="hero-search-box">
                <Search className="hero-search-icon" />
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Search across 8 specialized laboratories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '10px' }}
                  >
                    <X size={18} />
                  </button>
                )}
                <button className="hero-search-btn" onClick={scrollToMatrix}>
                  Explore Labs
                </button>
              </div>


            </div>

            {/* Rigol DS9604 Showcase Card */}
            <div className="hero-instrument-card" onClick={scrollToMatrix}>
              <div className="instrument-card-header">
                <div className="instrument-badge">
                  <span className="instrument-live-pulse"></span>
                  <span>Rigol DS9604 Digital Oscilloscope &middot; 6 GHz / 20 GSa/s</span>
                </div>
                <span className="instrument-location-tag">Counter B Station</span>
              </div>

              <div className="instrument-image-frame">
                <img
                  src={rigolDs9604}
                  alt="Rigol DS9604 Digital Oscilloscope Station"
                  className="instrument-showcase-img"
                />
              </div>

              <div className="instrument-card-footer">
                <div className="spec-item">
                  <span className="spec-val">4 Channels</span>
                  <span className="spec-label">6 GHz Bandwidth</span>
                </div>
                <div className="spec-divider"></div>
                <div className="spec-item">
                  <span className="spec-val">20 GSa/s</span>
                  <span className="spec-label">Sample Rate</span>
                </div>
                <div className="spec-divider"></div>
                <div className="spec-item">
                  <span className="spec-val">10.1&quot; HD</span>
                  <span className="spec-label">Touch Display</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          4. LAB MATRIX (8 SPECIFIC LABS VISUAL GRID)
          ==================================================================== */}
      <section id="labs-matrix" className="lab-matrix-section">
        <div className="matrix-header">
          <div>
            <h2 className="matrix-title">Laboratory Facilities</h2>
            <p className="matrix-subtitle">
              Availability Status across all Department Laboratories.
            </p>
          </div>
          <div className="matrix-counter-badge">
            Showing {filteredLabs.length} of {laboratories.length} Facilities
          </div>
        </div>

        {/* 8-Card Inspired Architecture Grid */}
        <div className="matrix-grid">
          {filteredLabs.map((lab) => (
            <div key={lab.id} className="lab-card-inspired">
              {/* Centered Lab Title */}
              <div className="lab-card-header">
                <h3 className="lab-card-title">{lab.name}</h3>
              </div>

              {/* Circular Featured Image (matching user reference mockup) */}
              <div className="lab-circle-container">
                <img
                  src={lab.image}
                  alt={lab.name}
                  className="lab-circle-img"
                  onError={(e) => {
                    e.target.src = '/assets/components/dev_board.jpg';
                  }}
                />
              </div>

              {/* Stacked Clean Row Items */}
              <div className="lab-stacked-rows">
                {lab.items.map((item, idx) => (
                  <div key={idx} className="lab-row-item">
                    <span className="lab-row-item-text">{item}</span>
                  </div>
                ))}
              </div>

              {/* Card Bottom: Live Availability + Action */}
              <div className="lab-card-bottom">
                <div className="lab-meta-status">
                  <span className="status-live-dot"></span>
                  <span>{lab.openStations} / {lab.totalStations} Free</span>
                </div>

                <button
                  className="btn-lab-explore"
                  onClick={() => setSelectedLabModal(lab)}
                >
                  <span>Explore Lab</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          5. MODALS (Lab Detail, Fundraising, Help)
          ==================================================================== */}

      {/* Lab Detail Modal */}
      {selectedLabModal && (
        <div className="modal-overlay" onClick={() => setSelectedLabModal(null)}>
          <div className="modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-accent" style={{ backgroundColor: selectedLabModal.color }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <selectedLabModal.icon size={26} color="#ffffff" />
                <div>
                  <h3 className="modal-title">{selectedLabModal.name}</h3>
                  <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
                    {selectedLabModal.code} &middot; {selectedLabModal.location}
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedLabModal(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '16px 22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Officer-in-Charge</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedLabModal.inCharge}
                  </div>
                </div>

                <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-Time Availability</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-emerald-text)', marginTop: '2px' }}>
                    {selectedLabModal.openStations} of {selectedLabModal.totalStations} Worktables Available
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: '600' }}>
                    Live Inventory &amp; Equipment Catalog
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {selectedLabModal.dbComponents ? `${selectedLabModal.dbComponents.length} Items (Worktables 1-12)` : 'Assigned Gear'}
                  </span>
                </div>

                {selectedLabModal.dbComponents && selectedLabModal.dbComponents.length > 0 ? (
                  <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
                    {selectedLabModal.dbComponents.map((comp) => (
                      <div
                        key={comp._id || comp.compId}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: '600', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                              {comp.name}
                            </span>
                            <span style={{
                              fontSize: '10.5px',
                              fontWeight: '600',
                              padding: '2px 7px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: comp.usageType === 'Takeaway Borrowable' ? 'var(--color-emerald-bg)' : comp.usageType === 'Consumable' ? 'var(--color-blue-bg)' : 'var(--color-amber-bg)',
                              color: comp.usageType === 'Takeaway Borrowable' ? 'var(--color-emerald-text)' : comp.usageType === 'Consumable' ? 'var(--color-blue-text)' : 'var(--color-amber-text)'
                            }}>
                              {comp.usageType || 'Lab-Reference Only'}
                            </span>
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {comp.spec && <span>{comp.spec} &middot;</span>}
                            <span style={{ color: 'var(--primary-navy)', fontWeight: '500' }}>{comp.location || 'Worktable 1'}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {comp.availableQuantity ?? comp.stockQty ?? 0} In Stock
                          </div>
                          <button
                            onClick={() => navigate('/login')}
                            style={{
                              marginTop: '3px',
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-pill)',
                              background: 'var(--primary-navy)',
                              color: '#fff',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(selectedLabModal.items || selectedLabModal.equipment || []).map((eq, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '5px 12px',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '12.5px',
                          fontWeight: '500'
                        }}
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </div>


              <div style={{
                padding: '10px 16px',
                backgroundColor: 'var(--primary-navy-soft)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--primary-navy)' }}>
                    Reserve Worktable or Request Equipment
                  </div>
                </div>
                <button
                  className="btn-primary-loan"
                  onClick={() => navigate('/login')}
                >
                  Portal Login &rarr;
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedLabModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals & Modernization Fundraiser Modal */}
      {showGoalsModal && (
        <div className="modal-overlay" onClick={() => setShowGoalsModal(false)}>
          <div className="modal-card-fundraiser" onClick={(e) => e.stopPropagation()}>
            <div className="fundraiser-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target size={24} color="#38bdf8" />
                <div>
                  <h3 className="fundraiser-header-title">
                    Department Goals &middot; Fundraisers
                  </h3>
                  <div className="fundraiser-header-sub">
                    Undergraduate Project Laboratory
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowGoalsModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="fundraiser-modal-body">
              {/* LEFT COLUMN: Authentic single product photo provided by user */}
              <div className="fundraiser-photo-col">
                <div className="product-image-container">
                  <img
                    src={bambuA1UserImg}
                    alt="Bambu Lab A1 3D Printer with AMS Lite"
                    className="product-single-photo"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Details, Progress Bar & Bank Details */}
              <div className="fundraiser-info-col">
                <div className="product-title-wrap">
                  <h2 className="product-detail-name">
                    Bambu Lab A1 3D Printer (Global Version)
                  </h2>
                  <div className="product-price-row">
                    <span className="product-price-label">Estimated Cost:</span>
                    <span className="product-price-primary">LKR 225,205.20</span>
                  </div>
                </div>

                {/* Progress Bar Card */}
                <div className="fundraiser-campaign-card">
                  <div className="campaign-stat-header">
                    <div>
                      <span className="stat-label">Campaign Progress</span>
                      <div className="stat-amounts">
                        <strong>LKR 148,500.00</strong>
                        <span className="stat-target"> / LKR 198,000.00 Target</span>
                      </div>
                    </div>
                    <div className="campaign-percent-badge">
                      75% Funded
                    </div>
                  </div>

                  <div className="campaign-progress-bar-bg">
                    <div className="campaign-progress-bar-fill" style={{ width: '75%' }}></div>
                  </div>

                  <div className="campaign-meta-row">
                    <span className="campaign-meta-item">
                      <Users size={14} />
                      <span>38 Backers Contributed</span>
                    </span>
                    <span className="campaign-meta-item">
                      <Clock size={14} />
                      <span>LKR 49,500.00 Remaining</span>
                    </span>
                  </div>
                </div>

                {/* Direct Bank Account Details Card */}
                <div className="bank-account-card">
                  <div className="bank-account-card-header">
                    <Building size={16} color="#0284c7" />
                    <span>Contribute via Bank Transfer</span>
                  </div>

                  <div className="bank-account-fields">
                    <div className="bank-field-row">
                      <span className="bank-field-label">Bank:</span>
                      <span className="bank-field-value">People's Bank</span>
                    </div>
                    <div className="bank-field-row">
                      <span className="bank-field-label">Branch:</span>
                      <span className="bank-field-value">Hapugala Campus Branch (086)</span>
                    </div>
                    <div className="bank-field-row">
                      <span className="bank-field-label">Account Name:</span>
                      <span className="bank-field-value">Faculty of Engineering - DEIE Development Fund</span>
                    </div>

                    <div className="bank-account-num-box">
                      <div>
                        <span className="bank-acc-label">Account Number</span>
                        <span className="bank-acc-digits">086-1001-2004-5678</span>
                      </div>
                      <button
                        type="button"
                        className="btn-copy-acc"
                        onClick={handleCopyAccountNo}
                      >
                        {copiedBankNo ? (
                          <>
                            <Check size={14} color="#059669" />
                            <span style={{ color: '#059669', fontWeight: '600' }}>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bank-field-row">
                      <span className="bank-field-label">Reference:</span>
                      <span className="bank-field-value" style={{ color: '#0284c7', fontWeight: '600' }}>
                        Student Reg No - Bambu A1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '10px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Department of Electrical &amp; Information Engineering &middot; University of Ruhuna
              </div>
              <button className="btn-secondary" onClick={() => setShowGoalsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-accent" style={{ backgroundColor: '#0f224a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HelpCircle size={26} color="#ffffff" />
                <div>
                  <h3 className="modal-title">Help &amp; Laboratory Operations</h3>
                  <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
                    Safety Guidelines &middot; Technical Support &middot; Equipment Policies
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowHelpModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '16px 22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Equipment Checkout &amp; Return Hours</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Monday &ndash; Friday: 08:30 AM &ndash; 04:00 PM (Technical Office, Ground Floor)
                  </div>
                </div>

                <div style={{ padding: '10px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>High-Voltage &amp; Power Safety Clearance</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Access to High Voltage and Renewable Energy labs requires safety gear and active presence of Technical Officer.
                  </div>
                </div>

                <div style={{ padding: '10px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Portal Login Issues</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    If you cannot access your account, email <strong>adminhelp@eng.ruh.ac.lk</strong> or contact the respective student advisor.
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowHelpModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          6. FOOTER
          ==================================================================== */}
      <footer className="landing-footer">
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}>
            Department of Electrical &amp; Information Engineering (DEIE)
          </div>
          <div style={{ fontSize: '13px', marginTop: '3px' }}>
            Faculty of Engineering &middot; University Academic Year 2026
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button className="nav-link-btn" onClick={() => setShowHelpModal(true)}>
            Safety Policies
          </button>
          <button className="nav-link-btn" onClick={() => setShowGoalsModal(true)}>
            Goals
          </button>
          <button
            className="btn-lab-action"
            onClick={() => navigate('/login')}
          >
            Portal Login &rarr;
          </button>
        </div>
      </footer>
    </div>
  );
}