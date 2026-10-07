import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cpu, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  const [email, setEmail] = useState('akila@eng.ruh.ac.lk');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (roleParam === 'admin' || roleParam === 'staff') {
      setEmail('admin@eng.ruh.ac.lk');
      setPassword('password123');
    } else if (roleParam === 'student') {
      setEmail('akila@eng.ruh.ac.lk');
      setPassword('password123');
    }
  }, [roleParam]);

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
        setError('Cannot connect to backend server. Make sure port 5000 is running.');
      } else {
        setError('Invalid university email or password. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-app)',
      padding: '24px',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-flat-hover)',
        border: '1px solid var(--border-subtle)',
        padding: '40px 36px'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '58px',
            height: '58px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-navy)',
            color: '#ffffff',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(15, 34, 74, 0.22)'
          }}>
            <Cpu size={30} />
          </div>
          <h2 style={{
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '-0.3px'
          }}>
            Electronics Equipment Portal
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '15px',
            margin: 0
          }}>
            Sign in to reserve lab equipment & workbench parts
          </p>
        </div>

        {/* Quick Demo Credentials Pill Selector */}
        <div style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          border: '1px solid var(--border-divider)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px' }}>
            <Sparkles size={15} color="var(--primary-navy)" />
            <span>QUICK DEMO ACCOUNTS</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('akila@eng.ruh.ac.lk', 'password123')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: email === 'akila@eng.ruh.ac.lk' ? 'var(--primary-navy)' : '#ffffff',
                color: email === 'akila@eng.ruh.ac.lk' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Student (Akila)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@eng.ruh.ac.lk', 'password123')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: email === 'admin@eng.ruh.ac.lk' ? 'var(--primary-navy)' : '#ffffff',
                color: email === 'admin@eng.ruh.ac.lk' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-rose-bg)',
            border: '1px solid #fecaca',
            color: 'var(--color-rose-text)',
            fontSize: '14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14.5px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '7px'
            }}>
              University Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} />
              <input
                type="email"
                required
                placeholder="name@eng.ruh.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label style={{
                fontSize: '14.5px',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Password
              </label>
              <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>
                Default: password123
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '9px',
              padding: '13px',
              backgroundColor: 'var(--primary-navy)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              fontWeight: '600',
              fontSize: '15.5px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '6px',
              boxShadow: '0 2px 8px rgba(15, 34, 74, 0.22)',
              opacity: isLoading ? 0.8 : 1
            }}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-divider)',
          textAlign: 'center',
          fontSize: '13.5px',
          color: 'var(--text-muted)'
        }}>
          Faculty of Engineering &middot; DEIE Lab System
        </div>
      </div>
    </div>
  );
}