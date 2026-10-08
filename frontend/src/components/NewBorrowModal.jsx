import { useState, useMemo } from 'react';
import axios from 'axios';
import { getAuthToken } from '../api/axios';
import {
  X,
  Search,
  Cpu,
  Layers,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderKanban,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const LAB_OPTIONS = [
  'All Laboratories',
  'Electronics and Measurements Laboratory',
  'Communication and Systems Laboratory',
  'Electric Machines and Power Systems Laboratory',
  'Computer and Information Engineering Laboratory',
  'High Voltage and Renewable Energy Laboratory',
  'Networking Laboratory',
  'High Performance Computer Laboratory',
  'Undergraduate Project Development Laboratory'
];

const PROJECT_TYPE_OPTIONS = [
  'Coursework Laboratory Project',
  'Final Year Undergraduate Project (FYP)',
  'Robotics & Embedded Systems Research',
  'Competition / Student Society Project',
  'Personal Academic Self-Study'
];

export default function NewBorrowModal({
  isOpen,
  onClose,
  dbComponents = [],
  onSuccess,
  currentUser = {}
}) {
  const [project, setProject] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPE_OPTIONS[0]);
  const [selectedLab, setSelectedLab] = useState('All Laboratories');
  const [componentSearch, setComponentSearch] = useState('');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [durationDays, setDurationDays] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter components by lab and search term
  const filteredComponents = useMemo(() => {
    return dbComponents.filter((comp) => {
      // Lab check
      if (selectedLab !== 'All Laboratories' && comp.lab !== selectedLab) {
        return false;
      }
      // Search term check
      if (componentSearch.trim()) {
        const q = componentSearch.toLowerCase();
        const nameMatch = (comp.name || '').toLowerCase().includes(q);
        const specMatch = (comp.spec || '').toLowerCase().includes(q);
        const idMatch = (comp.compId || '').toLowerCase().includes(q);
        const typeMatch = (comp.type || comp.category || '').toLowerCase().includes(q);
        return nameMatch || specMatch || idMatch || typeMatch;
      }
      return true;
    });
  }, [dbComponents, selectedLab, componentSearch]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!project.trim()) {
      setErrorMsg('Please specify the Project or Coursework Name.');
      return;
    }

    if (!selectedComponent) {
      setErrorMsg('Please select a component or piece of equipment to borrow.');
      return;
    }

    const avail = selectedComponent.availableQuantity ?? selectedComponent.stockQty ?? 1;
    if (avail < Number(quantity)) {
      setErrorMsg(`Only ${avail} unit(s) currently available in the laboratory.`);
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setErrorMsg('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        componentId: selectedComponent._id,
        project: project.trim(),
        projectType,
        quantity: Number(quantity),
        durationDays: Number(durationDays),
        notes: notes.trim()
      };

      const res = await axios.post('http://localhost:5000/api/borrows', payload, { headers });

      setSuccessMsg('Borrow request submitted successfully! Queued for Lab Admin review.');
      setTimeout(() => {
        if (onSuccess) onSuccess(res.data.borrow);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to submit borrow request:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit borrow request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-borrow-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '20px 26px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="modal-title" style={{ fontSize: '20px', fontWeight: '700' }}>
                New Equipment & Component Borrow
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#2563eb',
                  letterSpacing: '0.5px'
                }}
              >
                LIVE INVENTORY
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Request equipment, ICs, or modules for your academic project from any faculty lab.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ padding: '24px 26px', overflowY: 'auto', gap: '20px' }}>
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '13.5px'
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                color: '#059669',
                fontSize: '13.5px',
                fontWeight: '600'
              }}
            >
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form id="new-borrow-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step 1: Project Information */}
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FolderKanban size={17} style={{ color: 'var(--primary-navy)' }} />
                <span style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  1. Project Details
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Project / Coursework Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. EE4207 Autonomous Rover, Signal DSP Filter"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Project Type
                  </label>
                  <select
                    className="form-select"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                  >
                    {PROJECT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Laboratory Selection */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <MapPin size={15} style={{ color: 'var(--primary-navy)' }} />
                <span>2. Select Laboratory Facility</span>
              </label>
              <select
                className="form-select"
                value={selectedLab}
                onChange={(e) => {
                  setSelectedLab(e.target.value);
                  setSelectedComponent(null); // reset selection when lab changes
                }}
                style={{ fontSize: '14px', padding: '10px 14px' }}
              >
                {LAB_OPTIONS.map((lab) => (
                  <option key={lab} value={lab}>
                    {lab}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Component Search & Selection */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Cpu size={15} style={{ color: 'var(--primary-navy)' }} />
                  <span>3. Search & Select Component from Database <span style={{ color: '#ef4444' }}>*</span></span>
                </label>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {filteredComponents.length} items found
                </span>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by component name, spec, or code (e.g. Rigol, ESP32, 100k, Diode, STM32)..."
                  value={componentSearch}
                  onChange={(e) => setComponentSearch(e.target.value)}
                  style={{ paddingLeft: '38px', fontSize: '13.5px' }}
                />
              </div>

              {/* Component Picker List */}
              <div
                style={{
                  maxHeight: '190px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  background: 'var(--bg-surface)',
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {filteredComponents.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
                    No components found matching your search in {selectedLab}.
                  </div>
                ) : (
                  filteredComponents.slice(0, 40).map((comp) => {
                    const isSelected = selectedComponent?._id === comp._id;
                    const stock = comp.availableQuantity ?? comp.stockQty ?? 1;
                    const isOutOfStock = stock <= 0;

                    return (
                      <div
                        key={comp._id}
                        onClick={() => {
                          if (!isOutOfStock) {
                            setSelectedComponent(comp);
                            setErrorMsg('');
                          }
                        }}
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--border-subtle)',
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          backgroundColor: isSelected
                            ? 'rgba(37, 99, 235, 0.08)'
                            : isOutOfStock
                            ? 'rgba(241, 245, 249, 0.5)'
                            : 'transparent',
                          borderLeft: isSelected ? '4px solid #2563eb' : '4px solid transparent',
                          opacity: isOutOfStock ? 0.6 : 1,
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ flex: 1, paddingRight: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: isSelected ? '700' : '600', color: 'var(--text-primary)' }}>
                              {comp.spec || comp.name}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: 'var(--bg-surface-subtle)',
                                color: 'var(--text-muted)'
                              }}
                            >
                              {comp.compId}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {comp.lab} &bull; <span style={{ color: 'var(--text-secondary)' }}>{comp.location || comp.shelfLoc || 'Lab Store'}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: '600',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: stock > 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                              color: stock > 0 ? '#059669' : '#dc2626'
                            }}
                          >
                            {stock > 0 ? `${stock} In Stock` : 'Out of Stock'}
                          </span>
                          {isSelected && <CheckCircle size={18} style={{ color: '#2563eb' }} />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Highlight Selected Component Card */}
              {selectedComponent && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(37, 99, 235, 0.05)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11.5px', textTransform: 'uppercase', fontWeight: '700', color: '#2563eb' }}>
                      Selected for Request
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {selectedComponent.spec || selectedComponent.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Location: {selectedComponent.location || selectedComponent.shelfLoc} ({selectedComponent.lab})
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedComponent(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Step 4: Borrow Duration, Quantity & Usage Notes */}
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Clock size={17} style={{ color: 'var(--primary-navy)' }} />
                <span style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  4. Duration & Allocation
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Quantity Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedComponent ? (selectedComponent.availableQuantity ?? selectedComponent.stockQty ?? 5) : 5}
                    className="form-input"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Borrow Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    className="form-input"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                  />
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Standard loan duration is 1-7 days.
                  </span>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Purpose / Lab Usage Notes (Optional)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bench testing for sensor module and PWM signal verification"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer Actions */}
        <div
          className="modal-footer"
          style={{
            padding: '16px 26px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{ padding: '9px 20px', borderRadius: 'var(--radius-pill)', fontSize: '14px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="new-borrow-form"
            className="btn-submit"
            disabled={loading || !selectedComponent || !project.trim()}
            style={{
              padding: '9px 24px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: 'var(--primary-navy)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: loading || !selectedComponent || !project.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !selectedComponent || !project.trim() ? 0.6 : 1
            }}
          >
            {loading ? (
              <span>Submitting...</span>
            ) : (
              <>
                <span>Submit Borrow Request</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
