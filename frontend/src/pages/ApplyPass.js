import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MAX_DISTANCE = 70;

const s = {
  page: { padding: '28px 20px', maxWidth: 720, margin: '0 auto' },
  card: { background: '#fff', borderRadius: 16, padding: '28px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#1a3a5c', marginBottom: 18, paddingBottom: 10, borderBottom: '2px solid #e8f0fe', display: 'flex', alignItems: 'center', gap: 8 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 5 },
  hint: { fontSize: 11, color: '#aaa', marginTop: -12, marginBottom: 14 },
  input: { width: '100%', padding: '10px 13px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box', transition: 'border 0.2s' },
  inputErr: { borderColor: '#e74c3c', background: '#fff8f8' },
  select: { width: '100%', padding: '10px 13px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 16, background: '#fff', boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 },
  btn: { width: '100%', padding: '14px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  err: { background: '#fdecea', color: '#c0392b', padding: '12px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 500 },
  warn: { background: '#fff3cd', color: '#856404', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13, fontWeight: 600, border: '1.5px solid #ffc107' },
  success: { background: '#eafaf1', color: '#27ae60', padding: 14, borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 600 },
  uploadBox: { border: '2px dashed #c0d4f0', borderRadius: 10, padding: '16px', marginBottom: 8, background: '#f8fbff', cursor: 'pointer', textAlign: 'center' },
  uploadDone: { border: '2px solid #27ae60', background: '#f0faf5' },
  aiBox: { borderRadius: 8, padding: '12px 14px', marginBottom: 16, fontSize: 13 },
  aiChecking: { background: '#fff8e1', border: '1.5px solid #f39c12', color: '#856404' },
  aiPass: { background: '#eafaf1', border: '1.5px solid #27ae60', color: '#155724' },
  aiFail: { background: '#fdecea', border: '1.5px solid #e74c3c', color: '#721c24' },
  stepBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e8f0fe', color: '#1a3a5c', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 6 },
  distBar: { height: 8, borderRadius: 4, background: '#e0e0e0', marginBottom: 6, overflow: 'hidden' },
  required: { color: '#e74c3c', marginLeft: 3 },
};

const DOC_TYPES = [
  { key: 'aadhar', label: 'Aadhar Card', icon: '🪪', hint: 'Upload front side of Aadhar card (JPG/PNG)' },
  { key: 'fees', label: 'Fees Receipt', icon: '🧾', hint: 'Latest semester fees receipt from college' },
  { key: 'collegeId', label: 'College ID', icon: '🎓', hint: 'Front side of your NIE Mysuru college ID card' },
];

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function verifyDocumentWithAI(file, docType) {
  const base64 = await toBase64(file);
  const mediaType = file.type || 'image/jpeg';
  const prompt = `You are a document verification assistant for NIE Mysuru bus pass system.
The student uploaded a document claiming to be: "${docType}"
Respond ONLY in JSON (no markdown):
{"valid":true/false,"confidence":"high"/"medium"/"low","documentDetected":"describe what you see","issues":"any issue or empty","suggestion":"brief message to student"}
Rules:
- Aadhar Card: look for 12-digit number, UIDAI, government ID layout
- Fees Receipt: college name, amount paid, receipt number, date
- College ID: college name, student photo, ID card format
- Blurry/wrong document = valid:false`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: prompt }
        ]}]
      })
    });
    const data = await response.json();
    const text = (data.content?.[0]?.text || '{}').replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch {
    return { valid: false, confidence: 'low', documentDetected: 'Unknown', issues: 'Could not verify', suggestion: 'Please re-upload a clear image' };
  }
}

export default function ApplyPass() {
  const [form, setForm] = useState({
    studentName: '', mobile: '', dob: '', gender: '', category: '',
    parentName: '', parentMobile: '', emergencyContact: '',
    semester: '', branch: '', busRoute: '',
    from: '', to: '', distance: '', landmark: '', address: '', passType: 'monthly'
  });
  const [distErr, setDistErr] = useState('');
  const [files, setFiles] = useState({ aadhar: null, fees: null, collegeId: null });
  const [aiResults, setAiResults] = useState({ aadhar: null, fees: null, collegeId: null });
  const [aiLoading, setAiLoading] = useState({ aadhar: false, fees: false, collegeId: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    if (k === 'distance') {
      if (val && Number(val) > MAX_DISTANCE) setDistErr(`⚠️ Distance ${val} km exceeds the maximum allowed limit of ${MAX_DISTANCE} km. Bus pass cannot be issued.`);
      else setDistErr('');
    }
  };

  const handleFileUpload = async (docKey, file) => {
    if (!file) return;
    setFiles(p => ({ ...p, [docKey]: file }));
    setAiResults(p => ({ ...p, [docKey]: null }));
    setAiLoading(p => ({ ...p, [docKey]: true }));
    const docLabel = DOC_TYPES.find(d => d.key === docKey)?.label;
    try {
      const result = await verifyDocumentWithAI(file, docLabel);
      setAiResults(p => ({ ...p, [docKey]: result }));
    } catch {
      setAiResults(p => ({ ...p, [docKey]: { valid: false, suggestion: 'Verification failed, please re-upload' } }));
    }
    setAiLoading(p => ({ ...p, [docKey]: false }));
  };

  const allDocsVerified = DOC_TYPES.every(d => aiResults[d.key]?.valid === true);
  const distanceOk = !form.distance || Number(form.distance) <= MAX_DISTANCE;
  const distPct = Math.min((Number(form.distance) / MAX_DISTANCE) * 100, 100);
  const distColor = distPct > 90 ? '#e74c3c' : distPct > 70 ? '#f39c12' : '#27ae60';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!distanceOk) { setError('Distance exceeds 70 km limit. Cannot submit.'); return; }
    if (!allDocsVerified) { setError('Please upload and verify all 3 documents before submitting.'); return; }
    setError(''); setSuccess(''); setLoading(true);
    try {
      await axios.post('/api/pass/apply', form);
      setSuccess('✅ Application submitted successfully! Awaiting admin approval.');
      setTimeout(() => navigate('/my-passes'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>

      {/* Header Card */}
      <div style={s.card}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1a3a5c', marginBottom: 4 }}>🎫 Bus Pass Application</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>NIE Mysuru — Fill all details carefully. All fields marked <span style={s.required}>*</span> are mandatory.</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[['1','#2980b9','Personal Details'],['2','#8e44ad','Route & Pass Info'],['3','#e67e22','Document Upload'],['4','#27ae60','Submit']].map(([n,c,t]) => (
            <div key={n} style={s.stepBadge}><span style={{ background: c, color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{n}</span>{t}</div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div style={s.err}>❌ {error}</div>}
        {success && <div style={s.success}>{success}</div>}

        {/* STEP 1 — Personal Details */}
        <div style={s.card}>
          <div style={s.sectionTitle}>👤 Step 1 — Personal Details</div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Full Name <span style={s.required}>*</span></label>
              <input style={s.input} value={form.studentName} onChange={set('studentName')} required placeholder="As on Aadhar card" />
            </div>
            <div>
              <label style={s.label}>Date of Birth <span style={s.required}>*</span></label>
              <input style={s.input} type="date" value={form.dob} onChange={set('dob')} required />
            </div>
          </div>

          <div style={s.grid3}>
            <div>
              <label style={s.label}>Gender <span style={s.required}>*</span></label>
              <select style={s.select} value={form.gender} onChange={set('gender')} required>
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Category <span style={s.required}>*</span></label>
              <select style={s.select} value={form.category} onChange={set('category')} required>
                <option value="">Select</option>
                <option>General</option><option>OBC</option><option>SC</option><option>ST</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Mobile <span style={s.required}>*</span></label>
              <input style={s.input} value={form.mobile} onChange={set('mobile')} required placeholder="10-digit number" maxLength={10} />
            </div>
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Parent / Guardian Name <span style={s.required}>*</span></label>
              <input style={s.input} value={form.parentName} onChange={set('parentName')} required placeholder="Father/Mother name" />
            </div>
            <div>
              <label style={s.label}>Parent Mobile <span style={s.required}>*</span></label>
              <input style={s.input} value={form.parentMobile} onChange={set('parentMobile')} required placeholder="Parent contact number" maxLength={10} />
            </div>
          </div>

          <div>
            <label style={s.label}>Emergency Contact Number</label>
            <input style={s.input} value={form.emergencyContact} onChange={set('emergencyContact')} placeholder="Alternative emergency number" maxLength={10} />
          </div>
        </div>

        {/* STEP 2 — Academic & Route Details */}
        <div style={s.card}>
          <div style={s.sectionTitle}>🏫 Step 2 — Academic & Route Details</div>

          <div style={s.grid3}>
            <div>
              <label style={s.label}>Semester <span style={s.required}>*</span></label>
              <select style={s.select} value={form.semester} onChange={set('semester')} required>
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n}>Sem {n}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Branch <span style={s.required}>*</span></label>
              <select style={s.select} value={form.branch} onChange={set('branch')} required>
                <option value="">Select</option>
                <option>Computer Science</option><option>Electronics</option><option>Mechanical</option>
                <option>Civil</option><option>Electrical</option><option>ISE</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Bus Route No.</label>
              <input style={s.input} value={form.busRoute} onChange={set('busRoute')} placeholder="e.g. Route 5B" />
            </div>
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Boarding Point (From) <span style={s.required}>*</span></label>
              <input style={s.input} value={form.from} onChange={set('from')} required placeholder="e.g. Kuvempunagar" />
            </div>
            <div>
              <label style={s.label}>Destination (To) <span style={s.required}>*</span></label>
              <input style={s.input} value={form.to} onChange={set('to')} required placeholder="e.g. NIE College Gate" />
            </div>
          </div>

          {/* Distance with live bar */}
          <div>
            <label style={s.label}>Distance (in KM) <span style={s.required}>*</span> <span style={{ fontSize: 11, color: '#888', fontWeight: 400 }}>— Max allowed: {MAX_DISTANCE} km</span></label>
            <input
              style={{ ...s.input, ...(distErr ? s.inputErr : {}) }}
              type="number" min="1" max="200"
              value={form.distance} onChange={set('distance')} required placeholder="Enter distance in km"
            />
            {form.distance && (
              <div style={{ marginTop: -12, marginBottom: 14 }}>
                <div style={s.distBar}>
                  <div style={{ height: '100%', width: `${distPct}%`, background: distColor, borderRadius: 4, transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: 12, color: distColor, fontWeight: 600 }}>{form.distance} km / {MAX_DISTANCE} km max {distPct >= 100 ? '— EXCEEDS LIMIT ❌' : distPct >= 90 ? '— Near limit ⚠️' : '✓'}</div>
              </div>
            )}
            {distErr && <div style={s.warn}>{distErr}</div>}
          </div>

          <div>
            <label style={s.label}>Nearest Landmark</label>
            <input style={s.input} value={form.landmark} onChange={set('landmark')} placeholder="e.g. Near City Bus Stand" />
          </div>

          <div>
            <label style={s.label}>Full Home Address <span style={s.required}>*</span></label>
            <input style={s.input} value={form.address} onChange={set('address')} required placeholder="Door no, Street, City, Pincode" />
          </div>

          <div>
            <label style={s.label}>Pass Type <span style={s.required}>*</span></label>
            <select style={s.select} value={form.passType} onChange={set('passType')}>
              <option value="monthly">Monthly — ₹300 (Valid 1 month)</option>
              <option value="quarterly">Quarterly — ₹800 (Valid 3 months)</option>
              <option value="yearly">Yearly — ₹2800 (Valid 12 months)</option>
            </select>
          </div>
        </div>

        {/* STEP 3 — Documents */}
        <div style={s.card}>
          <div style={s.sectionTitle}>🤖 Step 3 — Upload & AI Verify Documents</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 20, background: '#f8fbff', padding: '10px 14px', borderRadius: 8, border: '1px solid #d6eaf8' }}>
            📌 Each document is verified by AI automatically. All 3 must pass verification before you can submit.
          </div>

          {DOC_TYPES.map(doc => (
            <div key={doc.key} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
              <label style={s.label}>{doc.icon} {doc.label} <span style={s.required}>*</span></label>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>{doc.hint}</div>

              <label style={{ ...s.uploadBox, ...(files[doc.key] ? s.uploadDone : {}) }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>{files[doc.key] ? '✅' : '📎'}</div>
                <div style={{ fontSize: 13, color: files[doc.key] ? '#27ae60' : '#2980b9', fontWeight: 600 }}>
                  {files[doc.key] ? files[doc.key].name : `Click to upload ${doc.label}`}
                </div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>JPG, PNG — max 5MB</div>
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => handleFileUpload(doc.key, e.target.files[0])} />
              </label>

              {aiLoading[doc.key] && (
                <div style={{ ...s.aiBox, ...s.aiChecking }}>
                  <strong>🤖 AI Verifying...</strong> Analyzing your {doc.label}, please wait a moment...
                </div>
              )}
              {aiResults[doc.key] && !aiLoading[doc.key] && (
                <div style={{ ...s.aiBox, ...(aiResults[doc.key].valid ? s.aiPass : s.aiFail) }}>
                  <strong>{aiResults[doc.key].valid ? '✅ Document Verified' : '❌ Verification Failed'}</strong>
                  {aiResults[doc.key].documentDetected && <span> — Detected: <em>{aiResults[doc.key].documentDetected}</em>.</span>}
                  <div style={{ marginTop: 4 }}>{aiResults[doc.key].suggestion}</div>
                  {aiResults[doc.key].issues && <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>Issue: {aiResults[doc.key].issues}</div>}
                </div>
              )}
            </div>
          ))}

          {allDocsVerified && (
            <div style={{ background: '#eafaf1', border: '2px solid #27ae60', borderRadius: 10, padding: 14, textAlign: 'center', fontWeight: 700, color: '#27ae60', fontSize: 15 }}>
              ✅ All 3 documents verified! You can now submit your application.
            </div>
          )}
          {DOC_TYPES.some(d => aiResults[d.key]?.valid === false) && !allDocsVerified && (
            <div style={{ background: '#fdecea', border: '1.5px solid #e74c3c', borderRadius: 10, padding: 12, textAlign: 'center', fontSize: 13, color: '#c0392b' }}>
              ⚠️ One or more documents failed verification. Please re-upload the correct documents.
            </div>
          )}
        </div>

        {/* STEP 4 — Submit */}
        <div style={s.card}>
          <div style={s.sectionTitle}>🚀 Step 4 — Submit Application</div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.7 }}>
            By submitting this form you confirm that all information provided is accurate.<br />
            After submission, admin will review your application within <strong>1–2 working days</strong>.
          </div>
          <button
            style={{ ...s.btn, opacity: (allDocsVerified && distanceOk) ? 1 : 0.5 }}
            type="submit"
            disabled={loading || !allDocsVerified || !distanceOk}
          >
            {loading ? '⏳ Submitting...' : !distanceOk ? '❌ Distance Exceeds 70 KM Limit' : !allDocsVerified ? '⚠️ Verify All Documents First' : '✅ Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
