import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/api/report/summary').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '8px' }}>Admin Dashboard 🛡️</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>Manage all bus pass applications and students</p>

      <div className="stats-grid">
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>{stats?.total ?? '—'}</h3>
          <p>Total</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: 'var(--warning)', WebkitBackgroundClip: 'text' }}>{stats?.pending ?? '—'}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: 'var(--success)', WebkitBackgroundClip: 'text' }}>{stats?.approved ?? '—'}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: 'var(--danger)', WebkitBackgroundClip: 'text' }}>{stats?.rejected ?? '—'}</h3>
          <p>Rejected</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: '#8b5cf6', WebkitBackgroundClip: 'text', color: 'transparent' }}>{stats?.students ?? '—'}</h3>
          <p>Students Registered</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: '#94a3b8', WebkitBackgroundClip: 'text', color: 'transparent' }}>{stats?.expired ?? '—'}</h3>
          <p>Expired Passes</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <Link to="/admin/passes" className="btn btn-primary" style={{ width: 'auto' }}>Manage Passes</Link>
        <Link to="/admin/reports" className="btn btn-outline" style={{ width: 'auto' }}>View Reports</Link>
      </div>
    </div>
  );
}
