import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import api from '../axios';
import { AuthContext } from '../auth-context';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

export default function AuthGate({ children }) {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(authed);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/user');
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && !user) {
      void fetchUser();
    } else {
      setLoading(false);
    }
  }, [authed, user, fetchUser]);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
      // still clear local session
    }
    localStorage.removeItem('token');
    setAuthed(false);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(() => ({ logout, user, setUser }), [logout, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authed) {
    return (
      <Routes>
        <Route path="/login" element={<Login onAuthed={(userData) => {
          if (userData) setUser(userData);
          setAuthed(true);
        }} />} />
        <Route path="/register" element={<Register onAuthed={(userData) => {
          if (userData) setUser(userData);
          setAuthed(true);
        }} />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
