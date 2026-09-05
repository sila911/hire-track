/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center relative shadow-2xl overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 dark:via-black/20 to-transparent"></div>
            <svg className="w-8 h-8 text-white dark:text-black relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-black/50 dark:text-white/50 font-black tracking-widest text-xs uppercase animate-pulse">
          Loading Workspace
        </p>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
        `}</style>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
