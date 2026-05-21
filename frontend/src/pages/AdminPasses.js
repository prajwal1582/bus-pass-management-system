import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusColor = { pending: '#f39c12', approved: '#27ae60', rejected: '#e74c3c', expired: '#95a5a6' };

const s = {
  page: { padding: 32, maxWidth: 1100, margin: '0 auto' },
  title: { fontSize: 22, fontWeight: 700, color: '#1a3a5c', marginBottom: 20 },
  filters: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 18px', borderRadius: 20, border: '1.5px solid #ddd', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  th: { background: '#1a3a5c', color: '#fff', padding: '12px 14px', textAlign: 'left', fontSize: 13 },
  td: { padding: '12px 14px', borderBottom: '1px solid #f5f5f5', fontSize: 13, verticalAlign: 'top' },
  badge: { padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  approveBtn: { padding: '5px 14px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, marginRight: 6, fontSize: 12 },
  rejectBtn: { padding: '5px 14px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 },
  // Modal
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, padding: '32px', width: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#1a3a5c', marginBottom: 8 },
  modalSub: { fontSize: 13, color: '#888', marginBottom: 20 },
  textarea: { width: '100%', padding: '12px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, minHeight: 100, resize: 'vertical', boxSizing: 'border-box', outline: 'none' },
  detailBox: { background: '#f8f9fa', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12 },
};

function RejectModal({ pass, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');

  const QUICK = ['Incomplete documents', 'Distance exceeds 70 km', 'Invalid Aadhar details', 'Fees receipt not valid', 'Duplicate application', 'Route not available'];

  const submit = () => {
    if (!reason.trim()) { setErr('Please enter a rejection reason.'); return; }
    onConfirm(pass._id, reason.trim());
  };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.modalTitle}>❌ Reject Bus Pass Application</div>
        <div style={s.modalSub}>This reason will be shown to the student on their dashboard.</div>

        <div style={s.detailBox}>
          <strong>{pass.name}</strong> · {pass.usn}<br />
          Route: {pass.from} → {pass.to} · {pass.passType}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 8 }}>Quick reasons:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK.map(q => (
              <span key={q} onClick={() => setReason(q)}
                style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: reason === q ? '#1a3a5c' : '#f0f4f8', color: reason === q ? '#fff' : '#555', cursor: 'pointer', border: '1px solid #ddd' }}>
                {q}
              </span>
            ))}
          </div>
        </div>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>Rejection Reason <span style={{ color: '#e74c3c' }}>*</span></label>
        <textarea style={s.textarea} value={reason} onChange={e => { setReason(e.target.value); setErr(''); }}
          placeholder="Enter detailed reason for rejection..." />
        {err && <div style={{ color: '#e74c3c', fontSize: 13, marginTop: 4 }}>{err}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={submit} style={{ flex: 1, padding: '11px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Confirm Rejection
          </button>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', background: '#f0f4f8', color: '#555', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPasses() {
  const [passes, setPasses] = useState([]);
  const [filter, setFilter] = useState('');
  const [rejectPass, setRejectPass] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = (status = '') => {
    setFilter(status);
    const url = status ? `/api/admin/passes?status=${status}` : '/api/admin/passes';
    axios.get(url).then(r => setPasses(r.data));
  };

  useEffect(() => load(), []);

  const approve = async (id) => {
    await axios.put(`/api/admin/passes/${id}/approve`, {});
    load(filter);
  };

  const confirmReject = async (id, reason) => {
    await axios.put(`/api/admin/passes/${id}/reject`, { reason });
    setRejectPass(null);
    load(filter);
  };

  const statuses = ['', 'pending', 'approved', 'rejected', 'expired'];

  return (
    <div style={s.page}>
      {rejectPass && <RejectModal pass={rejectPass} onConfirm={confirmReject} onCancel={() => setRejectPass(null)} />}

      <div style={s.title}>📋 Manage Bus Passes</div>
      <div style={s.filters}>
        {statuses.map(st => (
          <button key={st}
            style={{ ...s.filterBtn, background: filter === st ? '#1a3a5c' : '#fff', color: filter === st ? '#fff' : '#333', borderColor: filter === st ? '#1a3a5c' : '#ddd' }}
            onClick={() => load(st)}>
            {st ? st.charAt(0).toUpperCase() + st.slice(1) : 'All'} ({st ? passes.filter(p => p.status === st).length : passes.length})
          </button>
        ))}
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Student</th>
            <th style={s.th}>Route</th>
            <th style={s.th}>Details</th>
            <th style={s.th}>Applied</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {passes.map(p => (
            <React.Fragment key={p._id}>
              <tr style={{ background: expandedId === p._id ? '#f8fbff' : '#fff' }}>
                <td style={s.td}>
                  <div style={{ fontWeight: 700, color: '#1a3a5c' }}>{p.student?.name || p.name}</div>
                  <div style={{ color: '#888', fontSize: 12 }}>{p.usn}</div>
                  <div style={{ color: '#888', fontSize: 12 }}>{p.student?.email}</div>
                  {p.mobile && <div style={{ color: '#888', fontSize: 12 }}>📞 {p.mobile}</div>}
                </td>
                <td style={s.td}>
                  <div style={{ fontWeight: 600 }}>{p.from} → {p.to}</div>
                  {p.distance && <div style={{ fontSize: 12, color: '#888' }}>📍 {p.distance} km</div>}
                  {p.busRoute && <div style={{ fontSize: 12, color: '#888' }}>🚌 {p.busRoute}</div>}
                </td>
                <td style={s.td}>
                  <div>{p.passType} pass</div>
                  {p.semester && <div style={{ fontSize: 12, color: '#888' }}>{p.semester} · {p.branch}</div>}
                  <span onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
                    style={{ fontSize: 12, color: '#2980b9', cursor: 'pointer', fontWeight: 600 }}>
                    {expandedId === p._id ? '▲ Less' : '▼ More details'}
                  </span>
                </td>
                <td style={s.td}>{new Date(p.appliedAt).toLocaleDateString()}</td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: statusColor[p.status] + '22', color: statusColor[p.status] }}>
                    {p.status.toUpperCase()}
                  </span>
                  {p.status === 'rejected' && p.rejectionReason && (
                    <div style={{ fontSize: 11, color: '#e74c3c', marginTop: 4, maxWidth: 140 }}>Reason: {p.rejectionReason}</div>
                  )}
                </td>
                <td style={s.td}>
                  {p.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button style={s.approveBtn} onClick={() => approve(p._id)}>✓ Approve</button>
                      <button style={s.rejectBtn} onClick={() => setRejectPass(p)}>✗ Reject</button>
                    </div>
                  )}
                  {p.status !== 'pending' && <span style={{ color: '#ccc', fontSize: 12 }}>—</span>}
                </td>
              </tr>
              {expandedId === p._id && (
                <tr>
                  <td colSpan={6} style={{ ...s.td, background: '#f8fbff', borderTop: '1px solid #e8f0fe' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: 12 }}>
                      {[
                        ['DOB', p.dob], ['Gender', p.gender], ['Category', p.category],
                        ['Parent', p.parentName], ['Parent Mobile', p.parentMobile],
                        ['Emergency', p.emergencyContact], ['Landmark', p.landmark],
                        ['Address', p.address]
                      ].map(([label, val]) => val ? (
                        <div key={label}><span style={{ color: '#888' }}>{label}:</span> <strong>{val}</strong></div>
                      ) : null)}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {passes.length === 0 && (
            <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: 40 }}>No passes found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
