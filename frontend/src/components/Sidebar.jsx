import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Briefcase, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../auth-context';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`
      relative h-screen flex flex-col transition-all duration-300 ease-in-out z-40
      ${isCollapsed ? 'w-20' : 'w-64'}
      bg-white/60 dark:bg-slate-950/40 border-r border-slate-200 dark:border-white/5 backdrop-blur-xl
    `}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full p-1.5 shadow-lg z-50 text-slate-500 hover:text-black dark:hover:text-white transition-all hover:scale-110 active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Profile Banner */}
      <div className={`pt-8 pb-6 flex flex-col items-center transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-6'}`}>
         <div className={`
          relative rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 
          ${isCollapsed ? 'w-10 h-10' : 'w-20 h-20'}
          flex items-center justify-center mb-4 overflow-hidden transition-all duration-500 shadow-inner
        `}>
          {user.profile_image_url ? (
            <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className={`${isCollapsed ? 'text-sm' : 'text-2xl'} font-black text-black dark:text-white`}>
              {initials}
            </span>
          )}
          {/* Glass glare effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none"></div>
        </div>
        
        {!isCollapsed && (
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
      <nav className="flex-1 px-3 py-4 space-y-8 overflow-y-auto custom-scrollbar-slim">
        {menuItems.map((group) => (
          <div key={group.group} className="space-y-4">
            {!isCollapsed && (
              <h3 className="px-4 text-[10px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase opacity-60">
                {group.group}
              </h3>
            )}
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-slate-200/50 dark:bg-white/10 font-bold text-black dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-200/30 dark:hover:bg-white/5 hover:text-black dark:hover:text-white hover:scale-[1.02]'}
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <item.icon size={20} className={`transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? '' : 'shrink-0'}`} />
                  {!isCollapsed && (
                    <span className="text-sm tracking-tight">{item.name}</span>
                  )}
                  {/* Active Indicator Dot */}
                  {location.pathname === item.path && isCollapsed && (
                    <div className="absolute right-2 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/5">
           <button
            onClick={handleLogout}
            className={`
              flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl transition-all duration-200 group
              text-red-500 hover:bg-red-500/10 hover:scale-[1.02]
              ${isCollapsed ? 'justify-center px-0' : ''}
            `}
          >
            <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            {!isCollapsed && <span className="font-bold text-sm tracking-tight">Logout</span>}
          </button>
        </div>
      </nav>

      {/* Upgrade Widget */}
      <div className="mt-auto">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 mx-4 mb-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
              
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-inner">
                  <Zap size={16} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-black dark:text-white uppercase tracking-wider">Free Plan</p>
                  <p className="text-[10px] text-slate-500 font-bold">Standard Features</p>
                </div>
              </div>
              
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium">
                Unlock power features and unlimited job tracking.
              </p>
              
              <button className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[0.98] active:scale-95 transition-all shadow-lg shadow-indigo-500/10">
                Upgrade to Pro
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
