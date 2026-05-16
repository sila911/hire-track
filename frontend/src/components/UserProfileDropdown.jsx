import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth-context';
import { FaUser, FaCog, FaSignOutAlt, FaSun, FaMoon, FaPalette } from 'react-icons/fa';

export default function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="relative z-[60]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-xl hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300 shadow-lg active:scale-95 overflow-hidden"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Soft inner glow refraction */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full"></div>
        {user.profile_image_url ? (
          <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="relative text-sm font-black text-black dark:text-white tracking-tighter drop-shadow-sm">
            {initials}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ 
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute right-0 left-auto top-full mt-2 w-72 origin-top-right rounded-[2.5rem] bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl z-50 transition-colors duration-300"
          >
            {/* Top glass refraction line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/30 to-transparent"></div>
            
            <div className="p-7 pb-5 flex flex-col items-center border-b border-slate-200 dark:border-white/10">
              <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center mb-4 shadow-inner overflow-hidden">
                {user.profile_image_url ? (
                  <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-black dark:text-white">{initials}</span>
                )}
              </div>
              <p className="text-lg font-bold text-black dark:text-white tracking-tight text-center truncate w-full px-2">{user.name}</p>
              <p className="text-xs text-black/60 dark:text-white/50 font-semibold tracking-wide text-center mt-1 truncate w-full px-2 uppercase">{user.email}</p>
            </div>
            
            <div className="p-3 space-y-1">
              <Link 
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full gap-4 px-5 py-3.5 text-sm font-bold text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 rounded-3xl transition-all duration-200 group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-colors">
                  <FaUser className="text-xs" />
                </div>
                <span>Profile</span>
              </Link>
              
              <Link 
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full gap-4 px-5 py-3.5 text-sm font-bold text-black dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 rounded-3xl transition-all duration-200 group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-colors">
                  <FaCog className="text-xs" />
                </div>
                <span>Settings</span>
              </Link>

              {/* Theme Switcher Row */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-4 text-black dark:text-white">
                  <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                    <FaPalette className="text-xs" />
                  </div>
                  <span className="text-sm font-bold">Theme</span>
                </div>
                
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-black dark:text-amber-400 hover:scale-105 transition-all shadow-sm"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
                </button>
              </div>

              <div className="my-3 mx-6 h-px bg-black/5 dark:bg-white/10"></div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center w-full gap-4 px-5 py-3.5 text-sm font-black text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-3xl transition-all duration-200 group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:border-red-500/30 transition-colors">
                  <FaSignOutAlt className="text-xs" />
                </div>
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
