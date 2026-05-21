import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-brand">🚌 Bus Pass System</Link>
      <div className="nav-links">
        <Link to="/routes" className="nav-link">Bus Routes</Link>
        {user?.role === 'student' && (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/apply" className="nav-link">Apply Pass</Link>
            <Link to="/my-passes" className="nav-link">My Passes</Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/passes" className="nav-link">Manage Passes</Link>
            <Link to="/admin/reports" className="nav-link">Reports</Link>
          </>
        )}
        <span className="badge badge-approved" style={{ marginRight: '10px' }}>
          {user?.name} ({user?.role})
        </span>
        <button className="btn btn-danger btn-small" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
