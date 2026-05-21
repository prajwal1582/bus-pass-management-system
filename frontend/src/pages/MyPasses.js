import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const statusColor = { pending: '#f39c12', approved: '#27ae60', rejected: '#e74c3c', expired: '#95a5a6' };

const s = {
  page: { padding: '28px 24px', maxWidth: 960, margin: '0 auto' },
  title: { fontSize: 22, fontWeight: 800, color: '#1a3a5c', marginBottom: 22 },
  card: { background: '#fff', borderRadius: 14, padding: '20px 22px', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  badge: { padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  renewBtn: { padding: '8px 18px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  cardBtn: { padding: '8px 16px', background: '#8e44ad', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
};

function BusPassCard({ pass, user, cardRef }) {
  const validFrom = pass.validFrom ? new Date(pass.validFrom).toLocaleDateString('en-IN') : '—';
  const validTo   = pass.validTo   ? new Date(pass.validTo).toLocaleDateString('en-IN')   : '—';
  return (
    <div ref={cardRef} style={{ width: 520, background: 'linear-gradient(135deg,#0f2744 0%,#1a4a7a 50%,#0f2744 100%)', borderRadius: 18, padding: '0 0 20px 0', fontFamily: "'Segoe UI',sans-serif", boxShadow: '0 8px 32px rgba(0,0,0,0.3)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ background: 'linear-gradient(90deg,#f39c12,#e67e22)', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>NIE MYSURU — BUS PASS</div>
        <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>🚌 OFFICIAL</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px 8px', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#f39c12,#e67e22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🎓</div>
        <div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{pass.name || user?.name}</div>
          <div style={{ color: '#a8c8f0', fontSize: 13 }}>{pass.usn || user?.usn} · {pass.branch || 'NIE Mysuru'}</div>
          <div style={{ color: '#a8c8f0', fontSize: 12 }}>{pass.semester || ''}{pass.semester ? ' · ' : ''}{pass.mobile || user?.mobile}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ background: '#27ae60', color: '#fff', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>APPROVED ✓</div>
          <div style={{ color: '#f39c12', fontSize: 11, fontWeight: 600 }}>{pass.passType?.toUpperCase()} PASS</div>
        </div>
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '0 24px 16px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '0 24px' }}>
        {[['Pass Number',pass.passNumber],['Route',`${pass.from} → ${pass.to}`],['Valid From',validFrom],['Valid To',validTo],['Distance',pass.distance?`${pass.distance} km`:'N/A'],['Bus Route',pass.busRoute||'College Route']].map(([label,val])=>(
          <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ color: '#a8c8f0', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{val||'—'}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: '16px 24px 0', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#a8c8f0', fontSize: 11 }}>No 50, Koorgalli Village, Hootagalli Industrial Area, Mysuru 570018</div>
        <div style={{ color: '#f39c12', fontSize: 20 }}>🚌</div>
      </div>
      <div style={{ position: 'absolute', bottom: 60, right: 20, opacity: 0.06, fontSize: 80, fontWeight: 900, color: '#fff', transform: 'rotate(-20deg)', pointerEvents: 'none' }}>NIE</div>
    </div>
  );
}

function PassCardModal({ pass, user, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      if (!window.html2canvas) {
        await new Promise((res, rej) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = res; script.onerror = rej;
          document.head.appendChild(script);
        });
      }
      const canvas = await window.html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `BusPass_${pass.passNumber || 'card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Download failed. Right-click the card to save as image.');
    }
    setDownloading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
      <div style={{ background: '#f0f4f8', borderRadius: 20, padding: 32, maxWidth: 600, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: '#1a3a5c', marginBottom: 4 }}>🎫 Your Bus Pass Card</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Download your official bus pass card below.</div>
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

export default function MyPasses() {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewCardPass, setViewCardPass] = useState(null);
  const [renewingId, setRenewingId] = useState(null);
  const [renewType, setRenewType] = useState('monthly');

  const load = () => {
    setLoading(true);
    axios.get('/api/pass/my').then(r => { setPasses(r.data); setLoading(false); });
  };
  useEffect(load, []);

  const renew = async (id) => {
    await axios.post(`/api/pass/renew/${id}`, { passType: renewType });
    setRenewingId(null);
    load();
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80, color: '#888', fontSize: 16 }}>Loading your passes...</div>;

  return (
    <div style={s.page}>
      {viewCardPass && <PassCardModal pass={viewCardPass} user={user} onClose={() => setViewCardPass(null)} />}

      <div style={s.title}>🎫 My Bus Passes</div>

      {!passes.length && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚌</div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>No pass applications yet.</div>
          <Link to="/apply" style={{ color: '#2980b9', fontWeight: 700, fontSize: 15 }}>Apply for your first bus pass →</Link>
        </div>
      )}

      {passes.map(p => {
        const isRenewing = renewingId === p._id;
        const daysLeft = p.validTo ? Math.ceil((new Date(p.validTo) - new Date()) / 86400000) : null;
        const expiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 7;

        return (
          <div key={p._id} style={{ ...s.card, border: p.status === 'rejected' ? '2px solid #e74c3c' : p.status === 'approved' ? '2px solid #27ae60' : '1.5px solid #eee' }}>
            {/* Main row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#aaa', marginBottom: 3 }}>{p.passNumber ? `Pass #${p.passNumber}` : 'Awaiting Approval'}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1a3a5c', marginBottom: 6 }}>{p.from} → {p.to}</div>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: '#666' }}>
                  <span>Type: <strong>{p.passType}</strong></span>
                  <span>Applied: {new Date(p.appliedAt).toLocaleDateString()}</span>
                  {p.validFrom && <span>Valid: {new Date(p.validFrom).toLocaleDateString()} – {new Date(p.validTo).toLocaleDateString()}</span>}
                  {p.distance && <span>📍 {p.distance} km</span>}
                  {p.semester && <span>📚 {p.semester}</span>}
                </div>
                {expiringSoon && <div style={{ marginTop: 6, fontSize: 12, color: '#f39c12', fontWeight: 700 }}>⏰ Expiring in {daysLeft} days!</div>}
                {p.status === 'rejected' && (p.rejectionReason || p.remarks) && (
                  <div style={{ marginTop: 8, background: '#fdecea', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
                    <strong style={{ color: '#c0392b' }}>❌ Rejection Reason:</strong>
                    <span style={{ color: '#922b21', marginLeft: 6 }}>{p.rejectionReason || p.remarks}</span>
                  </div>
                )}
              </div>

              {/* Right side actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <span style={{ ...s.badge, background: statusColor[p.status] + '22', color: statusColor[p.status] }}>{p.status.toUpperCase()}</span>
                {p.status === 'approved' && (
                  <button style={s.cardBtn} onClick={() => setViewCardPass(p)}>🎫 View & Download Card</button>
                )}
                {(p.status === 'approved' || p.status === 'expired') && (
                  <button style={{ ...s.renewBtn, background: isRenewing ? '#555' : '#2980b9' }}
                    onClick={() => setRenewingId(isRenewing ? null : p._id)}>
                    {isRenewing ? '✕ Cancel' : '🔄 Renew Pass'}
                  </button>
                )}
                {p.status === 'rejected' && (
                  <Link to="/apply" style={{ padding: '7px 16px', background: '#e74c3c', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>+ Apply Again</Link>
                )}
              </div>
            </div>

            {/* Renew panel */}
            {isRenewing && (
              <div style={{ marginTop: 16, borderTop: '1.5px dashed #ddd', paddingTop: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1a3a5c', marginBottom: 12 }}>🔄 Select New Pass Type to Renew:</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                  {[['monthly','Monthly','₹300','1 month'],['quarterly','Quarterly','₹800','3 months'],['yearly','Yearly','₹2800','12 months']].map(([val,label,price,dur]) => (
                    <div key={val} onClick={() => setRenewType(val)}
                      style={{ flex: 1, minWidth: 120, padding: '12px', borderRadius: 10, border: `2px solid ${renewType === val ? '#2980b9' : '#ddd'}`, background: renewType === val ? '#e8f4fd' : '#fafafa', cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, color: '#1a3a5c' }}>{label}</div>
                      <div style={{ color: '#27ae60', fontWeight: 800, fontSize: 18 }}>{price}</div>
                      <div style={{ color: '#888', fontSize: 11 }}>{dur}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => renew(p._id)}
                  style={{ width: '100%', padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  ✅ Submit Renewal — {renewType === 'monthly' ? '₹300' : renewType === 'quarterly' ? '₹800' : '₹2800'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
