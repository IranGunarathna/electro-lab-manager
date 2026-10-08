import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X,
  Upload,
  Cpu,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { getAuthToken } from '../api/axios';

const LABS = [
  'Electronics and Measurements Laboratory',
  'Communication and Systems Laboratory',
  'Electric Machines and Power Systems Laboratory',
  'Computer and Information Engineering Laboratory',
  'High Voltage and Renewable Energy Laboratory',
  'Networking Laboratory',
  'High Performance Computer Laboratory',
  'Undergraduate Project Development Laboratory'
];

const CATEGORIES = [
  'Equipment',
  'Microcontroller',
  'Active Component',
  'Passive Component',
  'Sensor',
  'Module',
  'Tool',
  'Consumable',
  'General'
];

const USAGE_TYPES = [
  'Takeaway Borrowable',
  'Lab-Reference Only',
  'Consumable'
];

export default function AdminComponentModal({
  isOpen,
  onClose,
  onSuccess,
  editComponent = null
}) {
  const [formData, setFormData] = useState({
    compId: '',
    name: '',
    spec: '',
    type: 'Equipment',
    category: 'Equipment',
    lab: LABS[0],
    location: 'Worktable 1',
    totalQuantity: 5,
    availableQuantity: 5,
    usageType: 'Takeaway Borrowable',
    maxLoanDurationDays: 3,
    description: '',
    imageUrl: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (editComponent) {
      setFormData({
        compId: editComponent.compId || '',
        name: editComponent.name || '',
        spec: editComponent.spec || '',
        type: editComponent.type || 'Equipment',
        category: editComponent.category || 'Equipment',
        lab: editComponent.lab || LABS[0],
        location: editComponent.location || editComponent.shelfLoc || 'Worktable 1',
        totalQuantity: editComponent.totalQuantity || 1,
        availableQuantity: editComponent.availableQuantity ?? editComponent.stockQty ?? 1,
        usageType: editComponent.usageType || 'Takeaway Borrowable',
        maxLoanDurationDays: editComponent.maxLoanDurationDays || 3,
        description: editComponent.description || '',
        imageUrl: editComponent.imageUrl || ''
      });
      setPreviewUrl(
        editComponent.imageUrl
          ? editComponent.imageUrl.startsWith('http') || editComponent.imageUrl.startsWith('/assets')
            ? editComponent.imageUrl
            : `http://localhost:5000${editComponent.imageUrl}`
          : ''
      );
    } else {
      setFormData({
        compId: `COMP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        spec: '',
        type: 'Equipment',
        category: 'Equipment',
        lab: LABS[0],
        location: 'Worktable 1',
        totalQuantity: 5,
        availableQuantity: 5,
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        description: '',
        imageUrl: ''
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setErrorMsg('');
    setSuccessMsg('');
  }, [editComponent, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.compId.trim()) {
      setErrorMsg('Component Name and Component ID are required.');
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        setErrorMsg('Admin authorization expired. Please log in again.');
        setLoading(false);
        return;
      }

      const postData = new FormData();
      Object.keys(formData).forEach((key) => {
        postData.append(key, formData[key]);
      });

      if (selectedFile) {
        postData.append('image', selectedFile);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };

      if (editComponent && editComponent._id) {
        await axios.put(
          `http://localhost:5000/api/components/${editComponent._id}`,
          postData,
          { headers }
        );
        setSuccessMsg('Component updated successfully with new photo!');
      } else {
        await axios.post('http://localhost:5000/api/components', postData, { headers });
        setSuccessMsg('New component added to database and image saved to uploads folder!');
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error saving component:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save component. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            padding: '18px 26px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(15, 34, 74, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={22} style={{ color: 'var(--primary-navy)' }} />
            <div>
              <h3 className="modal-title" style={{ fontSize: '18px', fontWeight: '700' }}>
                {editComponent ? 'Edit Equipment & Component' : 'Add New Lab Equipment / Component'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Admin & Lab Assistant Management &bull; Saves photo to local server uploads
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body" style={{ padding: '22px 26px', overflowY: 'auto', gap: '18px' }}>
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '13px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                color: '#059669',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <CheckCircle size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form id="admin-comp-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* PHOTO UPLOAD BOX */}
            <div
              style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: '10px',
                padding: '18px',
                background: 'var(--bg-surface-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                textAlign: 'center'
              }}
            >
              {previewUrl ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '280px', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/assets/components/dev_board.jpg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                      setFormData({ ...formData, imageUrl: '' });
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Remove Photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Upload size={22} />
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Upload Component Photo
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    PNG, JPG, or WebP up to 10MB (Saves into backend/uploads/components/)
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--primary-navy)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={14} />
                  <span>{previewUrl ? 'Change Photo' : 'Select Photo from Computer'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Basic Info: ID & Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Component ID / Code <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. DMM-6500"
                  value={formData.compId}
                  onChange={(e) => setFormData({ ...formData, compId: e.target.value })}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Equipment / Component Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Keithley DMM6500 6.5-Digit Multimeter"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                />
              </div>
            </div>

            {/* Spec & Description */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '13px' }}>
                Technical Specification / Model Details
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 6.5-Digit Graphical Touchscreen DMM, True RMS, 15 Measurement Functions"
                value={formData.spec}
                onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                style={{ fontSize: '13.5px', padding: '9px 12px' }}
              />
            </div>

            {/* Laboratory & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Assigned Laboratory <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.lab}
                  onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                >
                  {LABS.map((lab) => (
                    <option key={lab} value={lab}>
                      {lab}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Location / Worktable
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Worktable 5, Cabinet B"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                />
              </div>
            </div>

            {/* Category & Usage Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Category
                </label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, type: e.target.value })}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Usage Type
                </label>
                <select
                  className="form-select"
                  value={formData.usageType}
                  onChange={(e) => setFormData({ ...formData, usageType: e.target.value })}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                >
                  {USAGE_TYPES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantities & Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Total Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.totalQuantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      totalQuantity: val,
                      availableQuantity: Math.min(val, formData.availableQuantity)
                    });
                  }}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Available Stock
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalQuantity}
                  className="form-input"
                  value={formData.availableQuantity}
                  onChange={(e) => setFormData({ ...formData, availableQuantity: Number(e.target.value) })}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px' }}>
                  Max Loan (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="form-input"
                  value={formData.maxLoanDurationDays}
                  onChange={(e) => setFormData({ ...formData, maxLoanDurationDays: Number(e.target.value) })}
                  style={{ fontSize: '13.5px', padding: '9px 12px' }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
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
            style={{ padding: '8px 18px', borderRadius: 'var(--radius-pill)', fontSize: '13.5px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="admin-comp-form"
            className="btn-submit"
            disabled={loading}
            style={{
              padding: '8px 22px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13.5px',
              fontWeight: '600',
              backgroundColor: 'var(--primary-navy)',
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save size={15} />
                <span>{editComponent ? 'Save Changes' : 'Create & Save Component'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
