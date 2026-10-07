
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    uniEmail: '',
    password: '',
    role: 'Student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '24px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>ElectroLab Account Registration</h2>
      {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '12px' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '14px' }}>User ID / Reg No</label>
          <input name="userId" required value={formData.userId} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="e.g. EG/2021/4500" />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px' }}>First Name</label>
            <input name="firstName" required value={formData.firstName} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px' }}>Last Name</label>
            <input name="lastName" required value={formData.lastName} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '14px' }}>University Email</label>
          <input type="email" name="uniEmail" required value={formData.uniEmail} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="name@eng.ruh.ac.lk" />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '14px' }}>Password</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px' }}>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="Student">Student</option>
            <option value="LabAssistant">Lab Assistant</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register Account
        </button>
      </form>
      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
        Already have an account? <Link to="/login">Sign in here</Link>
      </div>
    </div>
  );
}