import React from 'react';

const mockRoutes = [
  { id: 1, routeNum: '201', from: 'City Bus Stand (CBS)', to: 'Kuvempunagar', via: 'RTO, Ballal Circle', timing: 'Every 15 mins' },
  { id: 2, routeNum: '69', from: 'CBS', to: 'NIE College', via: 'JLB Road, Vidyaranyapuram', timing: 'Every 20 mins' },
  { id: 3, routeNum: '135', from: 'CBS', to: 'Infosys Campus', via: 'Hebbal, Ring Road', timing: 'Every 30 mins' },
  { id: 4, routeNum: '204', from: 'Siddarthanagar', to: 'Vijayanagar', via: 'CBS, Railway Station', timing: 'Every 15 mins' },
  { id: 5, routeNum: '11', from: 'CBS', to: 'Chamundi Hill', via: 'Zoo, Race Course', timing: 'Every 45 mins' },
];

export default function BusRoutes() {
  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '32px' }}>🗺️ Bus Route Tracking</h1>
      
      <div className="glass-container" style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--text-light)', marginBottom: '16px' }}>
          Welcome to the static route tracker. You can view all available major bus routes in Mysuru here.
        </p>
        
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Route No</th>
                <th>From</th>
                <th>To</th>
                <th>Via Stops</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {mockRoutes.map(r => (
                <tr key={r.id}>
                  <td><span className="badge badge-approved" style={{ background: 'var(--primary-color)', color: '#fff' }}>{r.routeNum}</span></td>
                  <td style={{ fontWeight: 600 }}>{r.from}</td>
                  <td style={{ fontWeight: 600 }}>{r.to}</td>
                  <td style={{ color: 'var(--text-light)' }}>{r.via}</td>
                  <td>{r.timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="stat-card glass-container" style={{ padding: '24px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-dark)', marginBottom: '8px' }}>🚌 Real-time GPS Tracking</h4>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Real-time bus tracking is currently under development. Soon you'll be able to see exactly where your bus is on a live map.</p>
        </div>
        <div className="stat-card glass-container" style={{ padding: '24px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-dark)', marginBottom: '8px' }}>⏱️ Route Timings</h4>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Bus timings are approximate and subject to traffic conditions. Standard KSRTC city services operate from 5:30 AM to 10:30 PM.</p>
        </div>
      </div>
    </div>
  );
}
