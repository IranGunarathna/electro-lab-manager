import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import logoOscilloscope from '../assets/D · Oscilloscope@2x (1).png';
import {
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Phone,
  X,
  RefreshCw,
  FileText
} from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password Reset Request Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotId, setForgotId] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [resetReason, setResetReason] = useState('Forgot password / Locked out');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (auth && auth.login) {
        await auth.login(email, password);
      } else {
        // Fallback demo storage if context not loaded
        const demoUser = {
          firstName: email.includes('admin') ? 'System' : 'Engineering',
          lastName: email.includes('admin') ? 'Admin' : 'Student',
          uniEmail: email,
          role: email.includes('admin') ? 'Admin' : 'Student',
          token: 'demo-jwt-token'
        };
        localStorage.setItem('userInfo', JSON.stringify(demoUser));
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Make sure the backend on port 5000 is active.');
      } else {
        setError('Invalid university registration number / email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Submit password reset request to DEIE Admin
  const handleSendResetRequest = async (e) => {
    e.preventDefault();
    if (!forgotId.trim()) {
      setForgotError('Please enter your University Registration No. or Email.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/password-reset-request', {
        identifier: forgotId.trim(),
        contactPhone: contactPhone.trim(),
        reason: resetReason.trim()
      });

      if (res.data && res.data.success) {
        setForgotSuccess(true);
        setSubmittedInfo({
          identifier: forgotId.trim(),
          phone: contactPhone.trim(),
          message: res.data.message
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit reset request. Please check your Registration No. or contact the DEIE Admin.';
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotId('');
    setContactPhone('');
    setResetReason('Forgot password / Locked out');
    setForgotError('');
    setForgotSuccess(false);
    setSubmittedInfo(null);
  };

  return (
    <div className="login-page-container">
      {/* Return to Home Arrow Button */}
      <button
        type="button"
        className="login-back-nav"
        onClick={() => navigate('/')}
        aria-label="Return to Home"
        title="Return to Home"
      >
        <ArrowLeft size={19} />
      </button>

      {/* Main Login Card */}
      <div className="login-card">
        {/* Brand Header with Official LabSync Oscilloscope Logo */}
        <div className="login-brand-header">
          <div className="login-logo-badge">
            <img
              src={logoOscilloscope}
              alt="LabSync Logo"
              className="login-logo-img"
            />
          </div>
          <h1 className="login-brand-title">LabSync Portal</h1>
          <p className="login-brand-subtitle">
            Electronics Equipment &amp; Laboratory Management
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="login-alert-banner login-alert-error">
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="login-alert-banner login-alert-success">
            <CheckCircle2 size={18} flexShrink={0} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field-group">
            <label className="login-field-label">
              Registration No. or University Email
            </label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />
              <input
                type="text"
                required
                placeholder="EG/2023/xxxx or user@eng.ruh.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-text-input"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-field-group">
            <div className="login-field-label">
              <span>Password</span>
            </div>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-text-input login-password-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Under-Password Forgot Password Section */}
            <div className="login-forgot-section">
              <button
                type="button"
                className="login-forgot-link-btn"
                onClick={() => {
                  setShowForgotModal(true);
                  if (email) setForgotId(email);
                  setForgotError('');
                  setForgotSuccess(false);
                }}
              >
                <KeyRound size={13} />
                <span>Forgot password?</span>
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="login-submit-btn"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Bottom Most Text */}
        <div className="login-footer-card">
          Faculty of Engineering &middot; DEIE Laboratory Management
        </div>
      </div>

      {/* ============================================================
          FORGOT PASSWORD: ADMIN RESET REQUEST MODAL
          ============================================================ */}
      {showForgotModal && (
        <div className="forgot-modal-backdrop" onClick={closeForgotModal}>
          <div
            className="forgot-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="forgot-modal-close-btn"
              onClick={closeForgotModal}
              title="Close"
            >
              <X size={19} />
            </button>

            {/* Modal Header */}
            <div className="forgot-modal-header" style={{ marginBottom: '20px' }}>
              <div className="forgot-modal-icon">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="forgot-modal-title">Password Reset Request</h3>
              </div>
            </div>

            {/* Error in modal */}
            {forgotError && (
              <div className="login-alert-banner login-alert-error" style={{ marginBottom: '14px' }}>
                <AlertCircle size={16} flexShrink={0} />
                <span>{forgotError}</span>
              </div>
            )}

            {!forgotSuccess ? (
              <form onSubmit={handleSendResetRequest} className="forgot-step-box">
                <div className="login-field-group">
                  <label className="login-field-label">Student Reg No. / University Email *</label>
                  <div className="login-input-wrapper">
                    <Mail size={18} className="login-input-icon" />
                    <input
                      type="text"
                      required
                      placeholder="EG/2023/xxxx or user@eng.ruh.ac.lk"
                      value={forgotId}
                      onChange={(e) => setForgotId(e.target.value)}
                      className="login-text-input"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="login-field-group">
                  <label className="login-field-label">Contact Phone Number (Optional)</label>
                  <div className="login-input-wrapper">
                    <Phone size={18} className="login-input-icon" />
                    <input
                      type="tel"
                      placeholder="07xxxxxxxx (For Administrator verification)"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="login-text-input"
                    />
                  </div>
                </div>

                <div className="login-field-group">
                  <label className="login-field-label">Reason / Notes (Optional)</label>
                  <div className="login-input-wrapper">
                    <FileText size={18} className="login-input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. Forgot password / Locked out"
                      value={resetReason}
                      onChange={(e) => setResetReason(e.target.value)}
                      className="login-text-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="forgot-action-btn"
                >
                  {forgotLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Reset Request to Admin</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="forgot-step-box">
                <div className="forgot-info-callout" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', alignItems: 'center' }}>
                  <CheckCircle2 size={20} flexShrink={0} />
                  <strong>Request Queued</strong>
                </div>

                <div className="forgot-desk-card">
                  <div className="forgot-desk-item">
                    <Building2 size={20} color="var(--primary-navy, #0f224a)" flexShrink={0} />
                    <div style={{ color: 'var(--text-secondary, #475569)', lineHeight: 1.45 }}>
                      System Administrator will review your request and inform you shortly.
                    </div>
                  </div>

                  <div className="forgot-desk-item">
                    <Mail size={20} color="var(--primary-navy, #0f224a)" flexShrink={0} />
                    <div>
                      <strong>Administrator Contact:</strong>
                      <div><code>admin@eng.ruh.ac.lk</code></div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="forgot-action-btn"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}