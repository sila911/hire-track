import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Search, Sun, Moon, Plus, ChevronDown } from 'lucide-react';
import { useAuth } from '../auth-context';
import Sidebar from './Sidebar';

export default function AppLayout({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  onNewApplication 
}) {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden relative">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className={`flex-1 flex flex-col min-h-screen text-black dark:text-slate-100 font-sans tracking-tight transition-all duration-300 overflow-hidden relative ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            
            {/* New Header Section */}
            <header className="mb-8 flex flex-col gap-6">
              <div className="flex items-center justify-between md:hidden">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Menu size={24} />
                </button>
                
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-4">
                {/* Left: Hidden on mobile, empty on desktop to help centering */}
                <div className="hidden lg:block">
                  <h1 className="text-2xl font-black tracking-tighter">
                    {location.pathname === '/dashboard' ? 'Dashboard' : 
                     location.pathname === '/analysis' ? 'Analytics' : 
                     location.pathname === '/applications' ? 'Applications' : 'HireTrack'}
                  </h1>
                </div>

                {/* Center: Search and Filter */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500/50 text-sm font-bold py-2.5 pl-11 pr-4 rounded-2xl outline-none shadow-sm transition-all"
                    />
                  </div>

                  <div className="relative w-full sm:w-auto shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500/50 text-xs font-black py-2.5 pl-4 pr-10 rounded-2xl outline-none shadow-sm transition-all cursor-pointer"
                    >
                      <option value="date_applied_desc">NEWEST</option>
                      <option value="company_asc">A-Z</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Right: New Application Button */}
                <div className="flex justify-end items-center gap-4">
                  <button
                    onClick={onNewApplication}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    <Plus size={16} strokeWidth={3} />
                    <span>New App</span>
                  </button>
                  
                  <button
                    onClick={toggleTheme}
                    className="hidden md:flex p-2.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors shadow-sm"
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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

