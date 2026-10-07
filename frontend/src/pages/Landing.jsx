import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoOscilloscope from '../assets/D · Oscilloscope@2x (1).png';
import logoDeie from '../assets/Deie.png';
import rigolDs9604 from '../assets/rigol-ds9604.jpg';
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
  LogIn
} from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTag, setActiveFilterTag] = useState('All');
  const [selectedLabModal, setSelectedLabModal] = useState(null);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      image: '/assets/components/ic_chip.jpg',
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
        'Capstone Hardware Project Workbenches'
      ],
      openStations: 20,
      totalStations: 25,
      status: 'Open Now'
    }
  ];

  // Quick search keywords
  const quickTags = [
    'All',
    'Oscilloscopes',
    'High Voltage',
    'Renewable Energy',
    'High Performance Computing',
    'FPGA Dev Benches',
    'Cisco Networking',
    'Robotics & 3D Print'
  ];

  // Search filtering logic across all 8 labs and their equipment
  const filteredLabs = useMemo(() => {
    return laboratories.filter((lab) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        lab.name.toLowerCase().includes(q) ||
        lab.code.toLowerCase().includes(q) ||
        lab.location.toLowerCase().includes(q) ||
        lab.items.some((it) => it.toLowerCase().includes(q));

      if (activeFilterTag === 'All') return matchesSearch;

      const tagMap = {
        'Oscilloscopes': lab.id === 3,
        'High Voltage': lab.id === 2 || lab.id === 1,
        'Renewable Energy': lab.id === 2,
        'SMT Workshop': lab.id === 4,
        'FPGA Dev Benches': lab.id === 6,
        'Cisco Networking': lab.id === 7,
        'Robotics & 3D Print': lab.id === 8
      };

      const matchesTag = tagMap[activeFilterTag] ?? true;
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeFilterTag]);

  const scrollToMatrix = () => {
    const el = document.getElementById('labs-matrix');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className= "landing-page">
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
          <span>⚡ 12 Lab Stations Open Now across DEIE &middot; Real-time workbench reservation &amp; equipment counter operational</span>
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

              {/* Quick Search Tag Chips */}
              <div className="hero-quick-tags-panel">
                <span className="quick-tag-label">Quick Filters:</span>
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    className={`quick-tag-btn ${activeFilterTag === tag ? 'active' : ''}`}
                    onClick={() => {
                      setActiveFilterTag(tag);
                      scrollToMatrix();
                    }}
                  >
                    {tag}
                  </button>
                ))}
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
                    {item}
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

            <div className="modal-body" style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Officer-in-Charge</div>
                  <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {selectedLabModal.inCharge}
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Real-Time Availability</div>
                  <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--color-emerald-text)', marginTop: '4px' }}>
                    {selectedLabModal.openStations} of {selectedLabModal.totalStations} Workbenches Available
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '10px' }}>Specialized Modules &amp; Equipment</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(selectedLabModal.items || selectedLabModal.equipment || []).map((eq, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '13.5px',
                        fontWeight: '500'
                      }}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>


              <div style={{
                padding: '14px 18px',
                backgroundColor: 'var(--primary-navy-soft)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary-navy)' }}>
                    Reserve Workbench or Request Gear
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Requires university student/staff SSO authentication
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

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="modal-overlay" onClick={() => setShowGoalsModal(false)}>
          <div className="modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-accent" style={{ backgroundColor: '#0f224a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target size={26} color="#ffffff" />
                <div>
                  <h3 className="modal-title">DEIE Department Goals &amp; Modernization</h3>
                  <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
                    Strategic Vision &middot; Infrastructure Modernization &middot; Academic Excellence
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowGoalsModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '28px' }}>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                The Department of Electrical &amp; Information Engineering is dedicated to advancing world-class
                laboratory facilities for undergraduate innovation, advanced postgraduate research, and seamless
                engineering operations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontWeight: '700', fontSize: '15.5px', color: 'var(--primary-navy)' }}>
                    Goal 1: 100% Digital Lab Allocation &amp; Smart Inventory
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                    Centralized digital workbench bookings, real-time equipment tracking, and automated verification across all 8 specialized departmental facilities.
                  </div>
                </div>

                <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontWeight: '700', fontSize: '15.5px', color: 'var(--primary-navy)' }}>
                    Goal 2: High-Precision Instrumentation Upgrades
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                    Equipping workstations with 4-channel digital storage oscilloscopes, RF spectrum analyzers, and multi-output precision DC power supplies.
                  </div>
                </div>

                <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontWeight: '700', fontSize: '15.5px', color: 'var(--primary-navy)' }}>
                    Goal 3: Green Energy &amp; High Voltage Research Standards
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                    Expanding solar microgrid testbenches, grid-tie power converters, and modernized high-voltage impulse testing apparatus.
                  </div>
                </div>

                <div style={{ padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontWeight: '700', fontSize: '15.5px', color: 'var(--primary-navy)' }}>
                    Goal 4: Industry Collaboration &amp; Capstone Grants
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                    Partnering with engineering industry leaders and alumni networks to sponsor hardware testbeds and undergraduate project grants.
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                For departmental partnerships or inquiries, contact: <strong style={{ color: 'var(--text-primary)' }}>deie@eng.ruh.ac.lk</strong>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowGoalsModal(false)}>
                Close
              </button>
              <button className="btn-submit" onClick={() => alert('Thank you for your interest in DEIE Department Goals! Contact deie@eng.ruh.ac.lk for details.')}>
                Contact Department Office
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
                  <h3 className="modal-title">Help &amp; Laboratory Operations Directory</h3>
                  <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
                    Safety Guidelines &middot; Technical Support &middot; Equipment Policies
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowHelpModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>Equipment Check-out &amp; Return Hours</div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Monday &ndash; Friday: 08:30 AM &ndash; 04:45 PM (Counter B, Block D Ground Floor)
                  </div>
                </div>

                <div style={{ padding: '14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>High-Voltage &amp; Power Safety Clearance</div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Access to HVRE and EMPS labs requires safety briefing and active presence of Technical Officer.
                  </div>
                </div>

                <div style={{ padding: '14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>University SSO Login Issues</div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    If you cannot access your account, email <strong>helpdesk@eng.ruh.ac.lk</strong> or visit IT Services Block F.
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