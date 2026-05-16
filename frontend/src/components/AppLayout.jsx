import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppLayout({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  onNewApplication 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 animate-bg-flow overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen dark-overlay text-black dark:text-slate-100 font-sans tracking-tight selection:bg-black/10 dark:selection:bg-white/30 transition-colors duration-300 overflow-hidden relative">
        <header className="z-30 w-full px-4 md:px-8 py-4 backdrop-blur-2xl bg-white/40 dark:bg-[#020617]/40 border-b border-slate-200/50 dark:border-white/5 transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 relative z-10">
            <div className="flex items-center justify-between w-full md:w-auto">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-600 dark:text-slate-400 md:hidden hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                <Menu size={24} />
              </button>
              
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-black to-slate-700 dark:from-white dark:to-white/60 drop-shadow-sm whitespace-nowrap transition-all duration-300">
                HireTrack
              </h1>

              <button
                type="button"
                onClick={onNewApplication}
                className="md:hidden p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-lg"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl flex-1 justify-center md:px-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-black dark:text-white placeholder-slate-500 dark:placeholder-white text-sm font-black py-3 px-11 rounded-xl outline-none focus:border-black/20 dark:focus:border-white/30 transition-all shadow-inner"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-white pointer-events-none transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="relative min-w-[140px] sm:min-w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-black dark:text-white text-sm font-black py-3 pl-4 pr-10 rounded-xl outline-none focus:border-black/20 dark:focus:border-white/30 transition-all shadow-inner cursor-pointer"
                >
                  <option value="date_applied_desc">Date Applied</option>
                  <option value="company_asc">Company (A-Z)</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-white pointer-events-none transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="hidden md:flex flex-row gap-3 items-center whitespace-nowrap">
              <button
                type="button"
                onClick={onNewApplication}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-black tracking-tight transition-all hover:bg-slate-800 dark:hover:bg-white/90 hover:scale-[0.98] active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/5 flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden xl:inline">New Application</span>
                <span className="inline xl:hidden text-sm">New</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

