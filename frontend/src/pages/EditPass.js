import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPass() {
  const { id } = useParams();
  const [documents, setDocuments] = useState({ collegeId: null, aadhar: null, feeReceipt: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    if (!documents.collegeId || !documents.aadhar || !documents.feeReceipt) {
      setError('Please upload all three required documents.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(documents).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });
      await axios.put(`/api/pass/edit-docs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('✅ Documents updated successfully! Awaiting admin review.');
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update documents');
    }
    setLoading(false);
  };

  return (
    <div className="center-card-layout">
      <div className="card-wrapper animate-fade-in" style={{ maxWidth: '520px' }}>
        <div className="glass-container">
          <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            🔄 Re-upload Documents
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '24px', fontSize: '14px' }}>
            Your application was rejected. Please upload valid documents to request a new review. You do not need to pay again.
          </p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleDocumentSubmit}>
            <div className="form-group">
              <label className="form-label">College ID</label>
              <input type="file" className="form-input" accept="application/pdf,image/*" onChange={e => setDocuments({ ...documents, collegeId: e.target.files[0] })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Aadhaar Card</label>
              <input type="file" className="form-input" accept="application/pdf,image/*" onChange={e => setDocuments({ ...documents, aadhar: e.target.files[0] })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Fee Receipt</label>
              <input type="file" className="form-input" accept="application/pdf,image/*" onChange={e => setDocuments({ ...documents, feeReceipt: e.target.files[0] })} required />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')} disabled={loading}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Submit Documents'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
