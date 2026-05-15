import { useCallback, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import api from '../axios';
import { AuthContext } from '../auth-context';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

export default function AuthGate({ children }) {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('token'));

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
      // still clear local session
    }
    localStorage.removeItem('token');
    setAuthed(false);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(() => ({ logout }), [logout]);

  if (!authed) {
    return (
      <Routes>
        <Route path="/login" element={<Login onAuthed={() => setAuthed(true)} />} />
        <Route path="/register" element={<Register onAuthed={() => setAuthed(true)} />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
