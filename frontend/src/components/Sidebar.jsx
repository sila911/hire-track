import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Briefcase, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../auth-context';
import { useDialog } from '../dialog-context';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const { user, logout } = useAuth();
  const { confirm } = useDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  const menuItems = [
    {
      group: 'CORE MENU',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Analysis', icon: BarChart2, path: '/analysis' },
        { name: 'Applications', icon: Briefcase, path: '/applications' },
      ]
    },
    {
      group: 'ACCOUNT & TOOLS',
      items: [
        { name: 'Settings', icon: Settings, path: '/settings' },
      ]
    }
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to sign out of your account?',
      confirmLabel: 'Logout',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (ok) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-[60] h-screen transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${isCollapsed ? 'md:w-20 items-center' : 'md:w-64'}
        w-64 bg-white/60 dark:bg-slate-950/40 border-r border-slate-200 dark:border-white/5 backdrop-blur-xl flex flex-col
      `}>
        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full p-1.5 shadow-lg z-50 text-slate-500 hover:text-black dark:hover:text-white transition-all hover:scale-110 active:scale-95 transform translate-x-0"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand Section */}
        <div className="pt-8 transition-all duration-300 w-full">
          <div className={`flex items-center w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-5'} overflow-hidden`}>
            <div className="w-8 h-8 bg-black dark:bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <Briefcase size={18} className="text-white dark:text-black" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-black tracking-tighter text-black dark:text-white truncate"
              >
                HireTrack
              </motion.span>
            )}
          </div>
        </div>

        {/* Profile Banner */}
        <div className={`pt-6 pb-6 flex flex-col items-center transition-all duration-300 w-full ${isCollapsed ? 'md:px-2' : 'px-6'}`}>
          <div className={`
            relative rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 
            ${isCollapsed ? 'md:w-10 md:h-10' : 'w-20 h-20'}
            w-20 h-20 flex items-center justify-center mb-4 overflow-hidden transition-all duration-500 shadow-inner
          `}>
            {user.profile_image_url ? (
              <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className={`${isCollapsed ? 'md:text-sm' : 'text-2xl'} text-2xl font-black text-black dark:text-white`}>
                {initials}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none"></div>
          </div>
          
          {(!isCollapsed || window.innerWidth < 768) && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-center w-full overflow-hidden"
            >
              <p className="text-lg font-bold text-black dark:text-white tracking-tight truncate px-2">{user.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.15em] mt-1 truncate px-2 uppercase opacity-80">{user.email}</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-8 overflow-y-auto custom-scrollbar-slim w-full">
          {menuItems.map((group) => (
            <div key={group.group} className="space-y-4 w-full">
              {(!isCollapsed || window.innerWidth < 768) && (
                <h3 className="px-4 text-[10px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase opacity-60">
                  {group.group}
                </h3>
              )}
              <div className="space-y-1.5 w-full">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => { if(window.innerWidth < 768) setIsOpen(false); }}
                    className={({ isActive }) => `
                      flex items-center w-full py-3.5 rounded-2xl transition-all duration-200 group relative
                      ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-5'}
                      ${isActive 
                        ? 'bg-slate-200/50 dark:bg-white/10 font-bold text-black dark:text-white shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-200/30 dark:hover:bg-white/5 hover:text-black dark:hover:text-white hover:scale-[1.02]'}
                    `}
                  >
                    <item.icon size={20} className={`transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? 'md:shrink-0' : 'shrink-0'}`} />
                    {(!isCollapsed || window.innerWidth < 768) && (
                      <span className="text-sm tracking-tight">{item.name}</span>
                    )}
                    {location.pathname === item.path && isCollapsed && (
                      <div className="absolute right-2 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] hidden md:block"></div>
                    )}
                  </NavLink>
                ))}
                {group.group === 'ACCOUNT & TOOLS' && (
                  <button
                    onClick={toggleTheme}
                    className={`
                      flex items-center w-full py-3.5 rounded-2xl transition-all duration-200 group relative
                      ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-5'}
                      text-slate-500 hover:bg-slate-200/30 dark:hover:bg-white/5 hover:text-black dark:hover:text-white hover:scale-[1.02]
                    `}
                  >
                    {theme === 'dark' ? <Sun size={20} className="transition-transform duration-200 group-hover:scale-110 shrink-0" /> : <Moon size={20} className="transition-transform duration-200 group-hover:scale-110 shrink-0" />}
                    {(!isCollapsed || window.innerWidth < 768) && (
                      <span className="text-sm tracking-tight">Theme</span>
                    )}
                    {(!isCollapsed || window.innerWidth < 768) && (
                      <div className="ml-auto p-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-black dark:text-amber-400 border border-black/5 dark:border-white/10 shadow-sm">
                        {theme === 'dark' ? <Sun size={12} fill="currentColor" /> : <Moon size={12} fill="currentColor" />}
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/5 w-full">
            <button
              onClick={handleLogout}
              className={`
                flex items-center w-full py-3.5 rounded-2xl transition-all duration-200 group
                ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-5'}
                text-red-500 hover:bg-red-500/10 hover:scale-[1.02]
              `}
            >
              <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
              {(!isCollapsed || window.innerWidth < 768) && <span className="font-bold text-sm tracking-tight">Logout</span>}
            </button>
          </div>
        </nav>

        {/* Upgrade Widget */}
        <div className="mt-auto w-full">
          <AnimatePresence>
            {(!isCollapsed || window.innerWidth < 768) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3.5 mx-4 mb-8 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 backdrop-blur-md relative overflow-hidden group"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                
                <div className="flex items-center gap-3 mb-2.5 relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-inner flex items-center justify-center">
                    <Zap size={14} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-white tracking-wide">Free Plan</p>
                    <p className="text-[10px] text-slate-500 font-bold opacity-60">Standard</p>
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3.5 leading-relaxed font-medium opacity-80">
                  Unlock power features and unlimited job tracking.
                </p>
                
                <button className="w-full py-1.5 px-3 bg-black dark:bg-white text-white dark:text-black rounded-lg md:rounded-xl text-[11px] font-bold tracking-wider hover:scale-[0.98] active:scale-95 transition-all shadow-lg shadow-indigo-500/10">
                  UPGRADE TO PRO
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  );
}
