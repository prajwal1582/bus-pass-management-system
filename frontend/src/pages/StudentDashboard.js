import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const statusColor = { pending: '#f39c12', approved: '#27ae60', rejected: '#e74c3c', expired: '#95a5a6' };

const s = {
  page: { padding: '28px 24px', maxWidth: 980, margin: '0 auto' },
  card: { background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', marginBottom: 22 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#1a3a5c', marginBottom: 16 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#1a3a5c', color: '#fff', padding: '11px 14px', textAlign: 'left', fontSize: 13 },
  td: { padding: '11px 14px', borderBottom: '1px solid #f0f0f0', fontSize: 13 },
  badge: { padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  btn: { padding: '10px 22px', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none', textDecoration: 'none', display: 'inline-block' },
  renewBtn: { padding: '7px 18px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  payBtn: { padding: '8px 20px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  downloadBtn: { padding: '8px 18px', background: '#8e44ad', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 },
};

/* ─── BUS PASS CARD ─── */
function BusPassCard({ pass, user, cardRef }) {
  const validFrom = pass.validFrom ? new Date(pass.validFrom).toLocaleDateString('en-IN') : '—';
  const validTo   = pass.validTo   ? new Date(pass.validTo).toLocaleDateString('en-IN')   : '—';

  return (
    <div ref={cardRef} style={{
      width: 520, background: 'linear-gradient(135deg, #0f2744 0%, #1a4a7a 50%, #0f2744 100%)',
      borderRadius: 18, padding: '0 0 20px 0', fontFamily: "'Segoe UI', sans-serif",
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)', overflow: 'hidden', position: 'relative'
    }}>
      {/* Top strip */}
      <div style={{ background: 'linear-gradient(90deg, #f39c12, #e67e22)', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>NIE MYSURU — BUS PASS</div>
        <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>🚌 OFFICIAL</div>
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px 8px', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#f39c12,#e67e22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🎓</div>
        <div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: 0.5 }}>{pass.name || user?.name}</div>
          <div style={{ color: '#a8c8f0', fontSize: 13 }}>{pass.usn || user?.usn} · {pass.branch || 'NIE Mysuru'}</div>
          <div style={{ color: '#a8c8f0', fontSize: 12 }}>{pass.semester || ''}{pass.semester ? ' · ' : ''}{pass.mobile || user?.mobile}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ background: '#27ae60', color: '#fff', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>APPROVED ✓</div>
          <div style={{ color: '#f39c12', fontSize: 11, fontWeight: 600 }}>{pass.passType?.toUpperCase()} PASS</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '0 24px 16px' }} />

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '0 24px' }}>
        {[
          ['Pass Number', pass.passNumber],
          ['Route', `${pass.from} → ${pass.to}`],
          ['Valid From', validFrom],
          ['Valid To', validTo],
          ['Distance', pass.distance ? `${pass.distance} km` : 'N/A'],
          ['Bus Route', pass.busRoute || 'College Route'],
        ].map(([label, val]) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ color: '#a8c8f0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{val || '—'}</div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ margin: '16px 24px 0', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#a8c8f0', fontSize: 11 }}>
          No 50, Koorgalli Village, Hootagalli Industrial Area, Mysuru 570018
        </div>
        <div style={{ color: '#f39c12', fontSize: 20 }}>🚌</div>
      </div>

      {/* Watermark */}
      <div style={{ position: 'absolute', bottom: 60, right: 20, opacity: 0.06, fontSize: 80, fontWeight: 900, color: '#fff', transform: 'rotate(-20deg)', pointerEvents: 'none' }}>NIE</div>
    </div>
  );
}

/* ─── PASS DOWNLOAD MODAL ─── */
function PassCardModal({ pass, user, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const el = cardRef.current;
      // Use html2canvas via CDN script approach — inject if needed
      if (!window.html2canvas) {
        await new Promise((res, rej) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = res; script.onerror = rej;
          document.head.appendChild(script);
        });
      }
      const canvas = await window.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `BusPass_${pass.passNumber || 'card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('Download failed. Try right-clicking the card and saving as image.');
    }
    setDownloading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
      <div style={{ background: '#f0f4f8', borderRadius: 20, padding: 32, maxWidth: 600, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: '#1a3a5c', marginBottom: 6 }}>🎫 Your Bus Pass Card</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Right-click and save, or use the download button below.</div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <BusPassCard pass={pass} user={user} cardRef={cardRef} />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={handleDownload} disabled={downloading}
            style={{ padding: '12px 28px', background: '#8e44ad', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {downloading ? '⏳ Generating...' : '⬇️ Download as PNG'}
          </button>
          <button onClick={onClose}
            style={{ padding: '12px 24px', background: '#eee', color: '#555', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── RENEWAL SECTION ─── */
function RenewalSection({ passes, user, onRenew, onViewCard }) {
  const candidates = passes.filter(p => p.status === 'approved' || p.status === 'expired');
  const [renewingId, setRenewingId] = useState(null);
  const [renewType, setRenewType] = useState('monthly');
  const [renewed, setRenewed] = useState(null);

  if (!candidates.length) return (
    <div style={s.card}>
      <div style={s.sectionTitle}>🔄 Renewal Section</div>
      <div style={{ textAlign: 'center', padding: '30px 0', color: '#aaa' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🚌</div>
        <div style={{ fontSize: 14 }}>No passes eligible for renewal yet.</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Once your pass is approved, you can renew it here.</div>
      </div>
    </div>
  );

  const handleRenew = async (id) => {
    await onRenew(id, renewType);
    setRenewingId(null);
    setRenewed(id);
    setTimeout(() => setRenewed(null), 3000);
  };

  return (
    <div style={s.card}>
      <div style={s.sectionTitle}>🔄 Renewal Section</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 16, background: '#f0f9ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #d6eaf8' }}>
        📌 You can renew your pass before or after it expires. Choose a new pass type when renewing.
      </div>

      {candidates.map(p => {
        const daysLeft = p.validTo ? Math.ceil((new Date(p.validTo) - new Date()) / 86400000) : null;
        const expired = p.status === 'expired' || (daysLeft !== null && daysLeft <= 0);
        const expiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 7;
        const isRenewing = renewingId === p._id;
        const justRenewed = renewed === p._id;

        return (
          <div key={p._id} style={{
            borderRadius: 12, marginBottom: 14, border: `2px solid ${expired ? '#e74c3c' : expiringSoon ? '#f39c12' : '#27ae60'}`,
            background: expired ? '#fff8f8' : expiringSoon ? '#fffdf0' : '#f0fff8', overflow: 'hidden'
          }}>
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#1a3a5c' }}>{p.from} → {p.to}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
                  Pass #{p.passNumber} · {p.passType}
                  {p.validTo && <span> · Expires: <strong>{new Date(p.validTo).toLocaleDateString()}</strong></span>}
                  {daysLeft !== null && daysLeft > 0 && <span style={{ marginLeft: 6, color: expiringSoon ? '#f39c12' : '#27ae60', fontWeight: 700 }}>({daysLeft} days left)</span>}
                </div>
                {expired && <div style={{ fontSize: 12, color: '#e74c3c', fontWeight: 700, marginTop: 4 }}>⚠️ EXPIRED — Please renew immediately</div>}
                {expiringSoon && <div style={{ fontSize: 12, color: '#f39c12', fontWeight: 700, marginTop: 4 }}>⏰ Expiring in {daysLeft} days — Renew now</div>}
                {!expired && !expiringSoon && <div style={{ fontSize: 12, color: '#27ae60', fontWeight: 600, marginTop: 4 }}>✅ Active pass</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {p.status === 'approved' && (
                  <button style={s.downloadBtn} onClick={() => onViewCard(p)}>🎫 View Pass</button>
                )}
                <button style={{ ...s.renewBtn, background: isRenewing ? '#555' : '#2980b9' }}
                  onClick={() => setRenewingId(isRenewing ? null : p._id)}>
                  {isRenewing ? '✕ Cancel' : '🔄 Renew'}
                </button>
              </div>
            </div>

            {/* Renew form */}
            {isRenewing && (
              <div style={{ borderTop: `1px dashed ${expired ? '#e74c3c' : '#27ae60'}`, padding: '16px 18px', background: '#fff' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1a3a5c', marginBottom: 10 }}>Select New Pass Type:</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                  {[['monthly','Monthly','₹300','1 month'],['quarterly','Quarterly','₹800','3 months'],['yearly','Yearly','₹2800','12 months']].map(([val, label, price, dur]) => (
                    <div key={val} onClick={() => setRenewType(val)}
                      style={{ flex: 1, minWidth: 120, padding: '12px', borderRadius: 10, border: `2px solid ${renewType === val ? '#2980b9' : '#ddd'}`, background: renewType === val ? '#e8f4fd' : '#fafafa', cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, color: '#1a3a5c', fontSize: 14 }}>{label}</div>
                      <div style={{ color: '#27ae60', fontWeight: 800, fontSize: 17 }}>{price}</div>
                      <div style={{ color: '#888', fontSize: 11 }}>{dur}</div>
                    </div>
                  ))}
                </div>
                {justRenewed
                  ? <div style={{ background: '#eafaf1', color: '#27ae60', padding: '10px 14px', borderRadius: 8, fontWeight: 700, fontSize: 14 }}>✅ Renewal request submitted! Awaiting admin approval.</div>
                  : <button style={{ ...s.payBtn, width: '100%', padding: 12, fontSize: 14 }} onClick={() => handleRenew(p._id)}>
                      💳 Submit Renewal Request — {renewType === 'monthly' ? '₹300' : renewType === 'quarterly' ? '₹800' : '₹2800'}
                    </button>
                }
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── TIMELINE ─── */
const STEPS = [
  { label: 'Applied', icon: '📝', desc: 'Submitted' },
  { label: 'Docs Verified', icon: '🤖', desc: 'AI checked' },
  { label: 'Payment', icon: '💳', desc: 'Fee paid' },
  { label: 'Admin Review', icon: '🛡️', desc: 'Under review' },
  { label: 'Approved', icon: '✅', desc: 'Pass issued' },
];

function getStep(status) {
  if (status === 'approved') return 5;
  if (status === 'rejected') return 3;
  return 2;
}

function PaymentBox({ pass }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const fee = { monthly: 300, quarterly: 800, yearly: 2800 }[pass.passType] || 300;
  if (paid) return (
    <div style={{ marginTop: 16, background: '#eafaf1', border: '1.5px solid #27ae60', borderRadius: 10, padding: 14, textAlign: 'center' }}>
      <div style={{ fontWeight: 700, color: '#27ae60', fontSize: 15 }}>✅ Payment of ₹{fee} Successful!</div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Transaction ID: TXN{Date.now()} · Now under admin review.</div>
    </div>
  );
  return (
    <div style={{ marginTop: 16, background: '#fff8e1', border: '1.5px solid #f39c12', borderRadius: 10, padding: 16 }}>
      <div style={{ fontWeight: 700, color: '#856404', fontSize: 14, marginBottom: 10 }}>💳 Payment Required</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 13, color: '#555' }}>
          {pass.from} → {pass.to} · <strong>{pass.passType}</strong> · Fee: <strong style={{ color: '#27ae60', fontSize: 17 }}>₹{fee}</strong>
        </div>
        <button style={s.payBtn} onClick={() => { setPaying(true); setTimeout(() => { setPaying(false); setPaid(true); }, 2500); }} disabled={paying}>
          {paying ? '⏳ Processing...' : `💳 Pay ₹${fee}`}
        </button>
      </div>
    </div>
  );
}

function Timeline({ pass }) {
  const cur = getStep(pass.status);
  const rejected = pass.status === 'rejected';
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {STEPS.map((step, i) => {
          const done = i < cur;
          const active = i === cur - 1;
          const fail = rejected && i === 3;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {i > 0 && <div style={{ position: 'absolute', top: 17, right: '50%', width: '100%', height: 3, background: done ? '#27ae60' : '#e0e0e0', zIndex: 0 }} />}
              <div style={{ width: 34, height: 34, borderRadius: '50%', zIndex: 1, background: fail ? '#e74c3c' : done ? '#27ae60' : active ? '#2980b9' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, border: active ? '3px solid #1a5276' : '3px solid transparent' }}>
                {fail ? '✗' : done ? '✓' : step.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: fail ? '#e74c3c' : done ? '#27ae60' : active ? '#2980b9' : '#bbb', marginTop: 6, textAlign: 'center' }}>{step.label}</div>
              <div style={{ fontSize: 10, color: '#ccc', textAlign: 'center' }}>{step.desc}</div>
            </div>
          );
        })}
      </div>
      {rejected && pass.rejectionReason && (
        <div style={{ marginTop: 18, background: '#fdecea', border: '2px solid #e74c3c', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontWeight: 700, color: '#c0392b', fontSize: 14, marginBottom: 4 }}>❌ Rejected by Admin</div>
          <div style={{ fontSize: 13, color: '#922b21' }}><strong>Reason:</strong> {pass.rejectionReason}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
            Fix the issue and <Link to="/apply" style={{ color: '#e74c3c', fontWeight: 600 }}>Apply Again →</Link>
          </div>
        </div>
      )}
      {pass.status === 'pending' && <PaymentBox pass={pass} />}
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function StudentDashboard() {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewCardPass, setViewCardPass] = useState(null);

  const load = () => {
    axios.get('/api/pass/my').then(r => {
      setPasses(r.data);
      if (r.data.length) setSelected(r.data[0]);
    }).catch(() => {});
  };
  useEffect(load, []);

  const renew = async (id, passType) => {
    await axios.post(`/api/pass/renew/${id}`, { passType: passType || 'monthly' });
    load();
  };

  const active = passes.find(p => p.status === 'approved');
  const rejected = passes.filter(p => p.status === 'rejected');
  const stats = [
    [passes.length, '#2980b9', 'Total'],
    [passes.filter(p => p.status === 'approved').length, '#27ae60', 'Approved'],
    [passes.filter(p => p.status === 'pending').length, '#f39c12', 'Pending'],
    [passes.filter(p => p.status === 'rejected').length, '#e74c3c', 'Rejected'],
  ];

  return (
    <div style={s.page}>
      {viewCardPass && <PassCardModal pass={viewCardPass} user={user} onClose={() => setViewCardPass(null)} />}

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1a3a5c', marginBottom: 2 }}>Welcome, {user?.name} 👋</div>
        <div style={{ color: '#888', fontSize: 13 }}>USN: {user?.usn} · NIE Mysuru · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        {stats.map(([n, c, l]) => (
          <div key={l} style={{ background: '#fff', borderRadius: 12, padding: '18px 14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: c }}>{n}</div>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Rejection Alert */}
      {rejected.length > 0 && (
        <div style={{ background: '#fdecea', border: '2px solid #e74c3c', borderRadius: 14, padding: '18px 22px', marginBottom: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#c0392b', marginBottom: 10 }}>❌ {rejected.length} Application{rejected.length > 1 ? 's' : ''} Rejected</div>
          {rejected.map(p => (
            <div key={p._id} style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', marginBottom: 8, border: '1px solid #f5c6cb' }}>
              <div style={{ fontWeight: 600, color: '#1a3a5c', marginBottom: 4 }}>{p.from} → {p.to} · {p.passType}</div>
              <div style={{ fontSize: 13, color: '#922b21' }}><strong>Reason:</strong> {p.rejectionReason || p.remarks || 'No reason provided'}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Rejected on {new Date(p.updatedAt).toLocaleDateString()}</div>
            </div>
          ))}
          <Link to="/apply" style={{ display: 'inline-block', marginTop: 8, background: '#e74c3c', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>+ Apply Again</Link>
        </div>
      )}

      {/* Active Pass Banner */}
      {active && (
        <div style={{ background: 'linear-gradient(135deg, #0f2744, #2980b9)', borderRadius: 14, padding: '20px 24px', marginBottom: 22, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>🟢 Active Bus Pass</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{active.from} → {active.to}</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, opacity: 0.9 }}>
              <span>Pass #: <strong>{active.passNumber}</strong></span>
              <span>Type: <strong>{active.passType}</strong></span>
              <span>Valid till: <strong>{new Date(active.validTo).toLocaleDateString()}</strong></span>
            </div>
          </div>
          <button onClick={() => setViewCardPass(active)}
            style={{ padding: '10px 22px', background: '#f39c12', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            🎫 View & Download Pass Card
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <Link to="/apply" style={{ ...s.btn, background: '#1a3a5c', color: '#fff' }}>+ Apply for Pass</Link>
        <Link to="/my-passes" style={{ ...s.btn, background: '#fff', color: '#1a3a5c', border: '2px solid #1a3a5c' }}>📋 All Passes</Link>
      </div>

      {/* ── RENEWAL SECTION ── */}
      <RenewalSection passes={passes} user={user} onRenew={renew} onViewCard={setViewCardPass} />

      {/* Journey Tracker */}
      {passes.length > 0 && (
        <div style={s.card}>
          <div style={s.sectionTitle}>🗺️ Application Journey Tracker</div>
          {passes.length > 1 && (
            <select style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 13, marginBottom: 16, background: '#fff' }}
              value={selected?._id || ''}
              onChange={e => setSelected(passes.find(p => p._id === e.target.value))}>
              {passes.map(p => <option key={p._id} value={p._id}>{p.from} → {p.to} · {p.status} · {new Date(p.appliedAt).toLocaleDateString()}</option>)}
            </select>
          )}
          {selected && <Timeline pass={selected} />}
        </div>
      )}

      {/* Recent Table */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={s.sectionTitle}>📋 Recent Applications</div>
          <Link to="/my-passes" style={{ fontSize: 13, color: '#2980b9', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
        </div>
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>Pass No</th><th style={s.th}>Route</th><th style={s.th}>Type</th>
            <th style={s.th}>Applied</th><th style={s.th}>Valid Till</th><th style={s.th}>Status / Reason</th><th style={s.th}>Card</th>
          </tr></thead>
          <tbody>
            {passes.slice(0, 6).map(p => (
              <tr key={p._id}>
                <td style={s.td}>{p.passNumber || '—'}</td>
                <td style={s.td}><strong>{p.from}</strong> → {p.to}</td>
                <td style={s.td}>{p.passType}</td>
                <td style={s.td}>{new Date(p.appliedAt).toLocaleDateString()}</td>
                <td style={s.td}>{p.validTo ? new Date(p.validTo).toLocaleDateString() : '—'}</td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: statusColor[p.status] + '22', color: statusColor[p.status] }}>{p.status.toUpperCase()}</span>
                  {p.status === 'rejected' && (p.rejectionReason || p.remarks) && (
                    <div style={{ fontSize: 11, color: '#e74c3c', marginTop: 4 }}>📌 {p.rejectionReason || p.remarks}</div>
                  )}
                </td>
                <td style={s.td}>
                  {p.status === 'approved'
                    ? <button onClick={() => setViewCardPass(p)} style={{ padding: '5px 12px', background: '#8e44ad', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🎫 Card</button>
                    : <span style={{ color: '#ddd', fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
            {!passes.length && <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: 30 }}>No applications yet. <Link to="/apply" style={{ color: '#2980b9' }}>Apply now →</Link></td></tr>}
          </tbody>
        </table>
      </div>

      {/* Pricing Info */}
      <div style={{ ...s.card, background: '#f8fbff' }}>
        <div style={s.sectionTitle}>🚌 Pass Pricing Info</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[['📅','Monthly','₹300','1 month'],['📆','Quarterly','₹800','3 months'],['🗓️','Yearly','₹2800','12 months']].map(([icon,t,p,d]) => (
            <div key={t} style={{ background: '#fff', borderRadius: 10, padding: 16, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 26 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a3a5c', marginTop: 6 }}>{t}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#27ae60', margin: '4px 0' }}>{p}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
