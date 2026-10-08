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
  X,
  RefreshCw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotTab, setForgotTab] = useState('online'); // 'online' | 'desk'
  const [forgotStep, setForgotStep] = useState(1); // 1: identify, 2: verify & new password
  const [forgotId, setForgotId] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [recoveryData, setRecoveryData] = useState(null);

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
          firstName: email.includes('admin') ? 'System' : 'Akila',
          lastName: email.includes('admin') ? 'Admin' : 'Jayan',
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

  // Step 1: Request reset code from backend
  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    if (!forgotId.trim()) {
      setForgotError('Please enter your University Registration No. or Email.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        identifier: forgotId.trim()
      });

      if (res.data && res.data.success) {
        setRecoveryData(res.data);
        if (res.data.resetCode) {
          setForgotCode(res.data.resetCode); // Auto-populate for convenient testing
        }
        setForgotStep(2);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to verify account. Please check details or consult DEIE Lab Admin.';
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Confirm code and set new password in backend
  const handlePerformPasswordReset = async (e) => {
    e.preventDefault();
    if (!forgotCode.trim()) {
      setForgotError('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword) {
      setForgotError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('New passwords do not match. Please re-enter.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        identifier: forgotId.trim(),
        resetCode: forgotCode.trim(),
        newPassword
      });

      if (res.data && res.data.success) {
        setSuccessMsg('Your password was updated successfully! Please sign in with your new password.');
        setEmail(forgotId.trim());
        setPassword(newPassword);
        closeForgotModal();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Password reset failed. Please check the code or request a new one.';
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotId('');
    setForgotCode('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError('');
    setForgotSuccess('');
    setRecoveryData(null);
  };

  const fillQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
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

        {/* Quick Demo Credentials Pill Bar for Testing */}
        <div className="login-demo-bar">
          <span>Quick fill:</span>
          <button
            type="button"
            className="login-demo-chip"
            onClick={() => fillQuickDemo('akila@eng.ruh.ac.lk', 'password123')}
          >
            Student
          </button>
          <button
            type="button"
            className="login-demo-chip"
            onClick={() => fillQuickDemo('officer@eng.ruh.ac.lk', 'password123')}
          >
            Lab Officer
          </button>
          <button
            type="button"
            className="login-demo-chip"
            onClick={() => fillQuickDemo('admin@eng.ruh.ac.lk', 'password123')}
          >
            Admin
          </button>
        </div>

        {/* Bottom Most Text */}
        <div className="login-footer-card">
          Faculty of Engineering &middot; DEIE Laboratory Management
        </div>
      </div>

      {/* ============================================================
          FORGOT PASSWORD MODAL MODULE
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
            <div className="forgot-modal-header">
              <div className="forgot-modal-icon">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="forgot-modal-title">Password Recovery</h3>
                <p className="forgot-modal-desc">
                  Reset your LabSync access credentials
                </p>
              </div>
            </div>

            {/* Recovery Tabs */}
            <div className="forgot-tabs-nav">
              <button
                type="button"
                className={`forgot-tab-btn ${forgotTab === 'online' ? 'active' : ''}`}
                onClick={() => {
                  setForgotTab('online');
                  setForgotError('');
                }}
              >
                <KeyRound size={15} />
                <span>University Verification</span>
              </button>
              <button
                type="button"
                className={`forgot-tab-btn ${forgotTab === 'desk' ? 'active' : ''}`}
                onClick={() => {
                  setForgotTab('desk');
                  setForgotError('');
                }}
              >
                <Building2 size={15} />
                <span>DEIE Lab Desk</span>
              </button>
            </div>

            {/* Error in modal */}
            {forgotError && (
              <div className="login-alert-banner login-alert-error" style={{ marginBottom: '14px' }}>
                <AlertCircle size={16} flexShrink={0} />
                <span>{forgotError}</span>
              </div>
            )}

            {/* TAB 1: Online University Verification */}
            {forgotTab === 'online' && (
              <div>
                {forgotStep === 1 ? (
                  <form onSubmit={handleRequestResetCode} className="forgot-step-box">
                    <div className="forgot-info-callout">
                      <HelpCircle size={18} flexShrink={0} />
                      <div>
                        Enter your <strong>Student Registration No.</strong> (e.g. <code>EG/2023/5000</code>) or registered <strong>University Email</strong>. We will generate a verification security code.
                      </div>
                    </div>

                    <div className="login-field-group">
                      <label className="login-field-label">Student Reg No. / University Email</label>
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

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="forgot-action-btn"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Checking Records...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify &amp; Generate Reset Code</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePerformPasswordReset} className="forgot-step-box">
                    <div className="forgot-info-callout" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                      <CheckCircle2 size={18} flexShrink={0} />
                      <div>
                        <div>Account matched for <strong>{recoveryData?.fullName || 'Student'}</strong> ({recoveryData?.regNo}).</div>
                        <div style={{ marginTop: '4px', fontSize: '12.5px', color: '#15803d' }}>
                          Linked Email: <strong>{recoveryData?.email}</strong>
                        </div>
                        {recoveryData?.resetCode && (
                          <div style={{ marginTop: '6px' }}>
                            <span style={{ fontSize: '12px' }}>Your 6-digit verification code:</span><br />
                            <span className="forgot-code-badge">{recoveryData.resetCode}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="login-field-group">
                      <label className="login-field-label">6-Digit Verification Code</label>
                      <div className="login-input-wrapper">
                        <KeyRound size={18} className="login-input-icon" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          value={forgotCode}
                          onChange={(e) => setForgotCode(e.target.value)}
                          className="login-text-input"
                        />
                      </div>
                    </div>

                    <div className="login-field-group">
                      <label className="login-field-label">New Password</label>
                      <div className="login-input-wrapper">
                        <Lock size={18} className="login-input-icon" />
                        <input
                          type="password"
                          required
                          placeholder="Minimum 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="login-text-input"
                        />
                      </div>
                    </div>

                    <div className="login-field-group">
                      <label className="login-field-label">Confirm New Password</label>
                      <div className="login-input-wrapper">
                        <Lock size={18} className="login-input-icon" />
                        <input
                          type="password"
                          required
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="login-text-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep(1);
                          setForgotError('');
                        }}
                        style={{
                          flex: '0 0 auto',
                          padding: '10px 14px',
                          background: 'none',
                          border: '1px solid var(--border-subtle, #e2e8f0)',
                          borderRadius: 'var(--radius-pill, 9999px)',
                          fontSize: '13.5px',
                          cursor: 'pointer',
                          color: 'var(--text-secondary, #475569)'
                        }}
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="forgot-action-btn"
                        style={{ flex: 1 }}
                      >
                        {forgotLoading ? 'Updating Password...' : 'Reset & Save Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: DEIE Lab Desk Support */}
            {forgotTab === 'desk' && (
              <div className="forgot-desk-card">
                <div className="forgot-desk-item">
                  <Building2 size={20} color="var(--primary-navy, #0f224a)" flexShrink={0} />
                  <div>
                    <strong>DEIE Department Laboratory Office</strong>
                    <div>Block E, Room 102 &bull; Faculty of Engineering</div>
                  </div>
                </div>

                <div className="forgot-desk-item">
                  <ShieldCheck size={20} color="var(--primary-navy, #0f224a)" flexShrink={0} />
                  <div>
                    <strong>Officer-in-Charge</strong>
                    <div>Eng. P. Bandara (Senior Technical Officer)</div>
                  </div>
                </div>

                <div className="forgot-desk-item">
                  <Mail size={20} color="var(--primary-navy, #0f224a)" flexShrink={0} />
                  <div>
                    <strong>Official Department Contact</strong>
                    <div><code>admin@eng.ruh.ac.lk</code> / <code>deie@eng.ruh.ac.lk</code></div>
                  </div>
                </div>

                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12.5px',
                  color: 'var(--text-muted, #64748b)'
                }}>
                  Please present your physical University Student Identity Card (DEIE) to the Technical Officer on duty during lab hours (08:30 AM &ndash; 04:30 PM) for manual credential reset.
                </div>

                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="forgot-action-btn"
                  style={{ marginTop: '8px' }}
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