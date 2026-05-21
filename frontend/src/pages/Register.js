import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', usn: '', email: '', mobile: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="center-card-layout">
      <div className="card-wrapper animate-fade-in" style={{ maxWidth: '540px' }}>
        <div className="glass-container">
          <h2 className="page-title" style={{ fontSize: 24, marginBottom: 24 }}>🚌 Student Registration</h2>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={set('name')} required placeholder="Prajwal K" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">USN</label>
                <input className="form-input" value={form.usn} onChange={set('usn')} required placeholder="4NI23CS146" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={set('email')} required placeholder="you@nie.ac.in" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile</label>
                <input className="form-input" value={form.mobile} onChange={set('mobile')} required placeholder="9876543210" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                <label className="form-label">Password</label>
                <input className="form-input" type="password" value={form.password} onChange={set('password')} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Address</label>
                <input className="form-input" value={form.address} onChange={set('address')} placeholder="Your home address" />
              </div>
            </div>
            
            <button className="btn btn-primary" style={{ marginTop: '10px' }} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
