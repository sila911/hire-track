import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, Globe, Sun, Moon, LayoutDashboard, BarChart2, Briefcase } from 'lucide-react';
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
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const handleScroll = (e) => {
      const currentScrollY = e.target.scrollTop;
      
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setVisible(false); // Scrolling down - hide
      } else {
        setVisible(true);  // Scrolling up - show
      }
      setLastScrollY(currentScrollY);
    };

    const mainElement = document.getElementById('main-content');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lastScrollY]);

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

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analysis', path: '/analysis', icon: BarChart2 },
    { name: 'Applications', path: '/applications', icon: Briefcase },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className={`flex-1 flex flex-col min-h-screen text-black dark:text-slate-100 font-sans tracking-tight transition-all duration-300 overflow-hidden relative ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* Floating Capsule Navbar */}
        <nav className={`
          fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-14 rounded-full 
          bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 
          backdrop-blur-xl px-5 shadow-lg flex items-center justify-between z-50
          transition-all duration-300 ease-out
          ${visible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-20 opacity-0 scale-95 pointer-events-none'}
        `}>
          {/* Left: Avatar & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 md:hidden hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-black overflow-hidden shadow-sm border border-white/20">
              {user?.profile_image_url ? (
                <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <span className="hidden sm:block text-slate-900 dark:text-white font-bold text-sm truncate max-w-[120px]">
              {user?.name}
            </span>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm text-slate-500 font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  hover:text-indigo-500 dark:hover:text-white transition-colors relative py-1
                  ${isActive ? 'text-indigo-600 dark:text-white' : 'dark:text-slate-400'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right: Search, Lang, Theme */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="relative group hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/5 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 text-xs font-bold py-2 pl-9 pr-4 rounded-full outline-none w-32 lg:w-48 transition-all"
              />
            </div>

            <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors">
              <Globe size={18} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </nav>

        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8 pt-24 md:pt-28 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

