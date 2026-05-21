import React, { useEffect, useState } from 'react';
import axios from 'axios';

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    axios.get('/api/report/summary').then(r => setSummary(r.data));
    axios.get('/api/report/monthly').then(r => setMonthly(r.data));
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '32px' }}>📊 Reports & Analytics</h1>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>{summary?.total ?? '—'}</h3>
          <p>Total Applications</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: 'var(--success)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{summary?.approved ?? '—'}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: 'var(--danger)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{summary?.rejected ?? '—'}</h3>
          <p>Rejected</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: 'var(--warning)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{summary?.pending ?? '—'}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: '#94a3b8', WebkitBackgroundClip: 'text', color: 'transparent' }}>{summary?.expired ?? '—'}</h3>
          <p>Expired</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px' }}>
          <h3 style={{ background: '#8b5cf6', WebkitBackgroundClip: 'text', color: 'transparent' }}>{summary?.students ?? '—'}</h3>
          <p>Students</p>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Pass Type Breakdown</h2>
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Pass Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.byType || []).map(t => (
                <tr key={t._id}>
                  <td style={{ textTransform: 'capitalize' }}>{t._id || 'N/A'}</td>
                  <td><strong>{t.count}</strong></td>
                </tr>
              ))}
              {(!summary?.byType?.length) && <tr><td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-light)' }}>No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Monthly Applications</h2>
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Applications</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((m, i) => (
                <tr key={i}>
                  <td>{months[m._id.month]}</td>
                  <td>{m._id.year}</td>
                  <td><strong>{m.count}</strong></td>
                </tr>
              ))}
              {!monthly.length && <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-light)' }}>No data yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
