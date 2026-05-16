import { Outlet } from 'react-router-dom';
import UserProfileDropdown from './UserProfileDropdown';

export default function AppLayout({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  onNewApplication 
}) {
  return (
    <div className="min-h-screen animate-bg-flow">
      <div className="min-h-screen dark-overlay text-slate-100 font-sans tracking-tight selection:bg-white/30">
        <header className="sticky top-0 z-50 w-full mb-4 px-4 md:px-8 py-4 backdrop-blur-2xl bg-[#020617]/40 border-b border-white/5">
          <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row justify-between items-center gap-6 relative z-10">
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-sm whitespace-nowrap">
              HireTrack
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl flex-1 justify-center xl:px-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search company or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white text-sm font-black py-3 pl-11 pr-4 rounded-xl outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all shadow-inner"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="relative min-w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full bg-white/5 border border-white/10 text-white text-sm font-black py-3 pl-4 pr-10 rounded-xl outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all shadow-inner cursor-pointer"
                >
                  <option value="date_applied_desc" className="text-black">Sort: Date Applied</option>
                  <option value="company_asc" className="text-black">Sort: Company (A-Z)</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex flex-row gap-3 items-center whitespace-nowrap w-full xl:w-auto justify-end">
              <button
                type="button"
                onClick={onNewApplication}
                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black tracking-tight transition-all hover:bg-white/90 hover:scale-[0.98] active:scale-95 shadow-xl shadow-white/5"
              >
                + New Application
              </button>
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
