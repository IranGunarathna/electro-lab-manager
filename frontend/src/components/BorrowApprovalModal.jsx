import { useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '../api/axios';
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  FolderKanban,
  Check,
  PackageCheck
} from 'lucide-react';

export default function BorrowApprovalModal({
  borrow,
  isOpen,
  mode = 'APPROVE', // 'APPROVE' | 'REJECT' | 'RETURN' | 'HANDOVER'
  onClose,
  onSuccess
}) {
  if (!isOpen || !borrow) return null;

  // Calculate default due date based on borrow duration
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + (borrow.durationDays || 3));
  const dateFormatted = defaultDueDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const [pickupTime, setPickupTime] = useState(
    `Today 2:00 PM - 4:30 PM at ${borrow.lab || 'Lab'} Issue Counter`
  );
  const [allocatedTime, setAllocatedTime] = useState(
    `${borrow.durationDays || 3} Days (Due: ${dateFormatted})`
  );
  const [adminNotes, setAdminNotes] = useState('Please bring your University Student ID upon collection.');
  const [rejectionReason, setRejectionReason] = useState(
    'Equipment reserved for scheduled EE undergraduate laboratory practicals.'
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const token = getAuthToken();
      if (!token) {
        setErrorMsg('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const borrowId = borrow._id;

      if (mode === 'APPROVE') {
        await axios.put(
          `http://localhost:5000/api/borrows/${borrowId}/approve`,
          {
            pickupTime,
            allocatedTime,
            durationDays: borrow.durationDays || 3,
            adminNotes
          },
          { headers }
        );
      } else if (mode === 'REJECT') {
        await axios.put(
          `http://localhost:5000/api/borrows/${borrowId}/reject`,
          {
            rejectionReason,
            adminNotes
          },
          { headers }
        );
      } else if (mode === 'HANDOVER') {
        await axios.put(
          `http://localhost:5000/api/borrows/${borrowId}/handover`,
          {},
          { headers }
        );
      } else if (mode === 'RETURN') {
        await axios.put(
          `http://localhost:5000/api/borrows/${borrowId}/return`,
          { adminNotes },
          { headers }
        );
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(`Failed to execute ${mode}:`, err);
      setErrorMsg(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', animation: 'modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: mode === 'REJECT' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(37, 99, 235, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {mode === 'APPROVE' && <CheckCircle size={22} style={{ color: '#059669' }} />}
            {mode === 'REJECT' && <XCircle size={22} style={{ color: '#dc2626' }} />}
            {mode === 'HANDOVER' && <PackageCheck size={22} style={{ color: '#2563eb' }} />}
            {mode === 'RETURN' && <CheckCircle size={22} style={{ color: '#059669' }} />}
            <div>
              <h3 className="modal-title" style={{ fontSize: '18px', fontWeight: '700' }}>
                {mode === 'APPROVE' && 'Approve Borrow Request'}
                {mode === 'REJECT' && 'Reject Borrow Request'}
                {mode === 'HANDOVER' && 'Confirm Equipment Handover'}
                {mode === 'RETURN' && 'Confirm Equipment Return'}
              </h3>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Request ID: {borrow.borrowId || borrow._id}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body" style={{ padding: '22px 24px', gap: '16px' }}>
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#dc2626',
                fontSize: '13px'
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Student & Equipment Card */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13.5px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} style={{ color: 'var(--text-muted)' }} />
                <strong>{borrow.studentName}</strong> ({borrow.studentRegNo})
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{borrow.studentEmail}</span>
            </div>

            <div style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '4px' }}>
              {borrow.componentName} &bull; <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>Qty: {borrow.quantity}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12.5px' }}>
              <MapPin size={13} />
              <span>{borrow.lab} &bull; {borrow.location}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-navy)', fontSize: '12.5px', marginTop: '6px', fontWeight: '500' }}>
              <FolderKanban size={13} />
              <span>Project: {borrow.project} ({borrow.projectType || 'Coursework'})</span>
            </div>
          </div>

          <form id="approval-form" onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'APPROVE' && (
              <>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Scheduled Pickup Time & Location Window <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                    placeholder="e.g. Tomorrow 10:00 AM - 12:00 PM at Electronics Lab Counter"
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Student will be notified with this exact pickup time.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Allocated Usage Time & Return Deadline
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={allocatedTime}
                    onChange={(e) => setAllocatedTime(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                    placeholder="e.g. 3 Days (Due: Oct 10, 2026)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Admin Instructions / Notes for Student
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                    placeholder="e.g. Please bring student ID card and return in original bin."
                  />
                </div>
              </>
            )}

            {mode === 'REJECT' && (
              <>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Reason for Rejection <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                  >
                    <option value="Equipment reserved for scheduled EE undergraduate laboratory practicals.">
                      Equipment reserved for scheduled EE laboratory practicals
                    </option>
                    <option value="Item currently undergoing periodic calibration or routine maintenance.">
                      Item currently undergoing calibration / maintenance
                    </option>
                    <option value="Insufficient units available in laboratory stock for takeaway.">
                      Insufficient units available for takeaway loan
                    </option>
                    <option value="Exceeds maximum permissible loan duration for this equipment class.">
                      Exceeds maximum allowable duration
                    </option>
                    <option value="Custom">Custom Reason (specified below)</option>
                  </select>
                </div>

                {rejectionReason === 'Custom' && (
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px' }}>
                      Custom Rejection Explanation
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Type reason to inform student..."
                      onChange={(e) => setRejectionReason(e.target.value)}
                      style={{ fontSize: '13.5px', padding: '9px 12px' }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Additional Admin Notes (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                    placeholder="e.g. Please reapply for next Monday or contact Lab Assistant."
                  />
                </div>
              </>
            )}

            {mode === 'HANDOVER' && (
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0' }}>
                Confirm that <strong>{borrow.studentName}</strong> has physically arrived at the laboratory counter and collected <strong>{borrow.componentName}</strong>. The status will transition to <strong>Active (In Use)</strong>.
              </p>
            )}

            {mode === 'RETURN' && (
              <div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 12px 0' }}>
                  Confirm that the equipment has been verified, inspected for damage, and returned into the lab inventory. Available stock in database will be restored.
                </p>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px' }}>
                    Inspection / Return Notes (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tested in working order. Returned complete."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    style={{ fontSize: '13.5px', padding: '9px 12px' }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div
          className="modal-footer"
          style={{
            padding: '16px 24px',
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
            form="approval-form"
            className="btn-submit"
            disabled={loading}
            style={{
              padding: '8px 22px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13.5px',
              fontWeight: '600',
              backgroundColor:
                mode === 'REJECT'
                  ? '#dc2626'
                  : mode === 'APPROVE'
                  ? '#059669'
                  : 'var(--primary-navy)',
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              'Processing...'
            ) : mode === 'APPROVE' ? (
              'Confirm Approval & Notify Student'
            ) : mode === 'REJECT' ? (
              'Confirm Rejection'
            ) : mode === 'HANDOVER' ? (
              'Confirm Handover'
            ) : (
              'Confirm Return & Restock'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
