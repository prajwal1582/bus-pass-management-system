import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="center-card-layout">
      <div className="card-wrapper animate-fade-in">
        <div className="glass-container">
          <div style={{ textAlign: 'center', fontSize: 40, marginBottom: 8 }}>🚌</div>
          <h2 className="page-title" style={{ marginBottom: 4, fontSize: 24 }}>Bus Pass System</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: 28 }}>NIE Mysuru — Online Pass Management</p>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: 15 }}>
            <button
              className="btn btn-outline btn-small"
              onClick={() => setForm({ email: 'admin@buspass.com', password: 'admin123' })}
            >
              🛡️ Fill Admin Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
