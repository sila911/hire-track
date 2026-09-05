import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SearchNormal1, Sun1, Moon, Add, ArrowDown2, Briefcase, Logout } from 'iconsax-react';
import Sidebar from './Sidebar';
import { useAuth } from '../auth-context';
import { useDialog } from '../dialog-context';

export default function AppLayout({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  onNewApplication 
}) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { confirm } = useDialog();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to sign out?',
      confirmLabel: 'Logout',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (ok) logout();
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden relative">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/20 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-rose-500/15 dark:bg-rose-500/15 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        <div className="absolute bottom-[-5%] right-[10%] w-[45%] h-[45%] bg-blue-500/20 dark:bg-blue-500/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[40%] left-[30%] w-[35%] h-[35%] bg-amber-400/15 dark:bg-amber-400/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className={`flex-1 flex flex-col min-h-screen text-black dark:text-slate-100 font-sans tracking-tight transition-all duration-300 overflow-hidden relative ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        <main id="main-content" className="flex-1 overflow-y-auto p-4 pb-32 md:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            
            {/* Header Section */}
            <header className="mb-4 md:mb-8 flex flex-col md:gap-6">
              
              {/* MOBILE HEADER ONLY */}
              <div className="flex items-center justify-between md:hidden bg-white/40 dark:bg-white/5 backdrop-blur-lg p-3 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm relative z-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black dark:bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Briefcase size={16} className="text-white dark:text-black" />
                  </div>
                  <span className="font-black tracking-tighter text-lg">HireTracking</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={toggleTheme} className="p-2 rounded-xl bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    {theme === 'dark' ? <Sun1 size={18} variant="Linear" color="currentColor" /> : <Moon size={18} variant="Linear" color="currentColor" />}
                  </button>
                  <button 
                    onClick={onNewApplication} 
                    className="w-9 h-9 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                  >
                    <Add size={20} color="currentColor" variant="Linear" className="stroke-[3px]" />
                  </button>
                </div>
              </div>

              {/* DESKTOP/SHARED TOOLBAR */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 items-center gap-4">
                {/* Left: Hidden on mobile, empty on desktop to help centering */}
                <div className="hidden lg:block">
                  <h1 className="text-2xl font-black tracking-tighter">
                    {location.pathname === '/dashboard' ? 'Dashboard' : 
                     location.pathname === '/analysis' ? 'Analytics' : 
                     location.pathname === '/applications' ? 'Applications' : 
                     location.pathname === '/settings' ? 'Settings' : 'HireTracking'}
                  </h1>
                </div>

                <div className="hidden lg:block lg:col-span-2">
                  {/* Search and filter removed per user request */}
                </div>

                {/* Right: New Application Button */}
                <div className="flex justify-end items-center gap-4">
                  <button
                    onClick={onNewApplication}
                    className="hidden md:flex w-10 h-10 items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0"
                    title="New Application"
                  >
                    <Add size={20} variant="Linear" color="currentColor" className="stroke-[3px]" />
                  </button>
                  
                  <button
                    onClick={toggleTheme}
                    className="hidden md:flex p-2.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors shadow-sm"
                  >
                    {theme === 'dark' ? <Sun1 size={18} variant="Linear" color="currentColor" /> : <Moon size={18} variant="Linear" color="currentColor" />}
                  </button>
                </div>
              </div>
            </header>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
