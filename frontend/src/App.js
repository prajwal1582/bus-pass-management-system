import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyPass from './pages/ApplyPass';
import MyPasses from './pages/MyPasses';
import AdminPasses from './pages/AdminPasses';
import Reports from './pages/Reports';
import BusRoutes from './pages/BusRoutes';
import EditPass from './pages/EditPass';
import RenewPass from './pages/RenewPass';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-card-layout"><h2>Loading...</h2></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PrivateRoute>{user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}</PrivateRoute>} />
        <Route path="/apply" element={<PrivateRoute><ApplyPass /></PrivateRoute>} />
        <Route path="/edit-pass/:id" element={<PrivateRoute><EditPass /></PrivateRoute>} />
        <Route path="/renew/:id" element={<PrivateRoute><RenewPass /></PrivateRoute>} />
        <Route path="/my-passes" element={<PrivateRoute><MyPasses /></PrivateRoute>} />
        <Route path="/admin/passes" element={<PrivateRoute adminOnly><AdminPasses /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute adminOnly><Reports /></PrivateRoute>} />
        <Route path="/routes" element={<PrivateRoute><BusRoutes /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
