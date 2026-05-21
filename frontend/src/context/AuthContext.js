import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// Do NOT set a hardcoded baseURL here.
// In development, package.json "proxy" forwards /api/* to localhost:5000.
// In production (Docker), nginx proxies /api/* to the backend container.
// Relative URLs like '/api/auth/login' work correctly in both environments.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('buspass_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      axios.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('buspass_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('buspass_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
