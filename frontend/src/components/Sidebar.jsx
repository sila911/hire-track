import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home2,
  ChartSquare,
  Briefcase,
  Setting2,
  Logout,
  ArrowLeft2,
  ArrowRight2,
  Sun1,
  Moon
} from 'iconsax-react';
import { useAuth } from '../auth-context';
import { useDialog } from '../dialog-context';
import { motion } from 'framer-motion';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { user, logout } = useAuth();
  const { confirm } = useDialog();
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
    { name: 'Dashboard', icon: Home2, path: '/dashboard' },
    { name: 'Analysis', icon: ChartSquare, path: '/analysis' },
    { name: 'Applications', icon: Briefcase, path: '/applications' },
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
    }
  };

  return (
    <>
      {/* =========================================
          DESKTOP SIDEBAR (Hidden on Mobile)
      ========================================= */}
      <aside className={`
        hidden md:flex flex-col fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20 items-center' : 'w-64'}
        bg-white/60 dark:bg-slate-950/40 border-r border-slate-200 dark:border-white/5 backdrop-blur-xl
      `}>
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full p-1.5 shadow-lg z-50 text-slate-500 hover:text-black dark:hover:text-white transition-all hover:scale-110 active:scale-95"
        >
          {isCollapsed ? <ArrowRight2 size={14} color="currentColor" /> : <ArrowLeft2 size={14} color="currentColor" />}
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
                HireTracking
              </motion.span>
            )}
          </div>
        </div>


        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto custom-scrollbar-slim w-full">
          {!isCollapsed && (
            <h3 className="px-4 text-[10px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase opacity-60">
              CORE MENU
            </h3>
          )}
          <div className="space-y-1.5 w-full">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center w-full py-3.5 rounded-2xl transition-all duration-200 group relative
                  ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-5'}
                  ${isActive 
                    ? 'bg-slate-200/50 dark:bg-white/10 font-bold text-black dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-200/30 dark:hover:bg-white/5 hover:text-black dark:hover:text-white hover:scale-[1.02]'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} variant={isActive ? "Bold" : "Linear"} color="currentColor" className="transition-transform duration-200 group-hover:scale-110 shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm tracking-tight">{item.name}</span>
                    )}
                    {isActive && isCollapsed && (
                      <div className="absolute right-2 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto w-full pb-4">
          <div className={`px-3 space-y-1 ${isCollapsed ? '' : 'pt-2 border-t border-slate-200 dark:border-white/5 mx-2'}`}>
            <NavLink
              to="/settings"
              className={({ isActive }) => `
                flex items-center w-full py-3 rounded-xl transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-4'}
                ${isActive 
                  ? 'bg-slate-200/50 dark:bg-white/10 font-bold text-black dark:text-white' 
                  : 'text-slate-500 hover:bg-slate-200/30 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Setting2 size={20} variant={isActive ? "Bold" : "Linear"} color="currentColor" className="transition-transform duration-200 group-hover:rotate-45" />
                  {!isCollapsed && <span className="text-sm tracking-tight">Settings</span>}
                </>
              )}
            </NavLink>

            <button
              onClick={toggleTheme}
              className={`
                flex items-center w-full py-3 rounded-xl transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-4'}
                text-slate-500 hover:bg-slate-200/30 dark:hover:bg-white/5 hover:text-black dark:hover:text-white
              `}
            >
              {theme === 'dark' ? <Sun1 size={20} color="currentColor" className="shrink-0" /> : <Moon size={20} color="currentColor" className="shrink-0" />}
              {!isCollapsed && <span className="text-sm tracking-tight">Theme</span>}
              {!isCollapsed && (
                <div className="ml-auto p-1 rounded-lg bg-black/5 dark:bg-white/10 text-black dark:text-amber-400 border border-black/5 dark:border-white/10 shadow-sm">
                  {theme === 'dark' ? <Sun1 size={10} variant="Bold" color="currentColor" /> : <Moon size={10} variant="Bold" color="currentColor" />}
                </div>
              )}
            </button>

            <button
              onClick={handleLogout}
              className={`
                flex items-center w-full py-3 rounded-xl transition-all duration-200 group
                ${isCollapsed ? 'justify-center px-0' : 'justify-start gap-4 px-4'}
                text-red-500 hover:bg-red-500/10
              `}
            >
              <Logout size={20} color="currentColor" className="transition-transform group-hover:-translate-x-1" />
              {!isCollapsed && <span className="text-sm font-bold tracking-tight">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================
          MOBILE GLASS DOCK (Hidden on Desktop)
      ========================================= */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[85%] max-w-[320px] h-14 rounded-full bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-[100] flex items-center justify-around px-2">
        {/* Dynamic Highlight Pill */}
        <div className="absolute inset-y-1.5 w-[23%] rounded-full bg-white/60 dark:bg-white/10 shadow-sm border border-white/50 dark:border-white/5 pointer-events-none transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)" 
             style={{
               left: location.pathname === '/dashboard' ? '1%' :
                     location.pathname === '/analysis' ? '26%' :
                     location.pathname === '/applications' ? '51%' :
                     location.pathname === '/settings' ? '76%' : '-100%'
             }}
        />

        {[
          { icon: Home2, path: '/dashboard' },
          { icon: ChartSquare, path: '/analysis' },
          { icon: Briefcase, path: '/applications' },
          { icon: Setting2, path: '/settings' }
        ].map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative z-10 flex items-center justify-center w-1/4 h-full transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-white scale-110' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:scale-110'}`}
            >
              <item.icon size={22} variant={isActive ? "Bold" : "Linear"} color="currentColor" className={`transition-all duration-300 ${isActive ? 'drop-shadow-md' : ''}`} />
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
