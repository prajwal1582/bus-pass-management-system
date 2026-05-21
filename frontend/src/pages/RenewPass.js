import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function RenewPass() {
  const { id } = useParams();
  const [form, setForm] = useState({ passType: 'monthly' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await axios.post(`/api/pass/renew/${id}`, { passType: form.passType, paymentStatus: 'completed' });
      setSuccess('✅ Payment successful & Renewal submitted! Awaiting admin approval.');
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Renewal failed');
    }
    setLoading(false);
  };

  return (
    <div className="center-card-layout">
      <div className="card-wrapper animate-fade-in" style={{ maxWidth: '520px' }}>
        <div className="glass-container">
          <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
            💳 Renew Bus Pass
          </h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <label className="form-label">Pass Type</label>
              <select className="form-select" value={form.passType} onChange={(e) => setForm({ ...form, passType: e.target.value })}>
                <option value="monthly">Monthly (₹500)</option>
                <option value="quarterly">Quarterly (₹1400)</option>
                <option value="yearly">Yearly (₹5000)</option>
              </select>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '20px 0' }} />
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-color)' }}>Payment Details (Mock)</h3>

            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input className="form-input" required placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Expiry</label>
                <input className="form-input" required placeholder="MM/YY" defaultValue="12/26" />
              </div>
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input className="form-input" type="password" required placeholder="123" defaultValue="123" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')} disabled={loading}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Pay & Renew'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
