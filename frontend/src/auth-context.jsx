import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axios';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
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
    navigate('/', { replace: true });
  }, [navigate]);

  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setAuthed(true);
  }, []);

  const value = useMemo(() => ({ authed, login, logout, user, setUser, loading }), [authed, login, logout, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
