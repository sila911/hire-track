import { useCallback, useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import ApplicationModal from './components/ApplicationModal';
import QuickStatsSection from './components/QuickStatsSection';
import AuthGate from './components/AuthGate';
import UserProfileDropdown from './components/UserProfileDropdown';
import { useAuth } from './auth-context';
import { useDialog } from './dialog-context';
import api from './axios';

function AppShell() {
  const { confirm, alert: alertDialog } = useDialog();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_applied_desc');

  const [modal, setModal] = useState({ open: false, application: null });

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        api.get('/applications'),
        api.get('/applications/stats'),
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const { data } = await api.get('/applications/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadDashboard();
    });
  }, [loadDashboard]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/applications/${id}`, { status: newStatus });
      setApplications((prev) => prev.map((app) => (app.id === id ? data : app)));
      void refreshStats();
    } catch (error) {
      console.error('Failed to update status:', error);
      void alertDialog('Failed to update status.', 'Could not update');
    }
  };

  const handleDelete = async (application) => {
    const company = (application.company ?? '').trim() || 'this company';
    const role = (application.role ?? '').trim() || 'this position';
    const ok = await confirm({
      title: 'Delete application',
      message: (
        <p className="m-0 text-sm leading-relaxed text-white/75">
          Delete the{' '}
          <strong className="font-extrabold text-amber-200">{company}</strong>
          {' '}
          application as{' '}
          <strong className="font-extrabold text-sky-300">{role}</strong>
          ?{' '}
          <span className="font-semibold text-red-300/95">This cannot be undone.</span>
        </p>
      ),
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await api.delete(`/applications/${application.id}`);
      setApplications((prev) => prev.filter((app) => app.id !== application.id));
      void refreshStats();
    } catch (error) {
      console.error('Failed to delete application:', error);
      void alertDialog('Failed to delete application.', 'Could not delete');
    }
  };

  const handleSaved = (saved) => {
    setApplications((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      if (exists) return prev.map((a) => (a.id === saved.id ? saved : a));
      return [saved, ...prev];
    });
    void refreshStats();
  };

  const filteredAndSortedApplications = applications
    .filter((app) => {
      if (!searchQuery) return true;
      const lowerQuery = searchQuery.toLowerCase();
      const company = (app.company || '').toLowerCase();
      const role = (app.role || '').toLowerCase();
      return company.includes(lowerQuery) || role.includes(lowerQuery);
    })
    .sort((a, b) => {
      if (sortBy === 'date_applied_desc') {
        const dateA = new Date(a.applied_at || 0).getTime();
        const dateB = new Date(b.applied_at || 0).getTime();
        return dateB - dateA;
      } else if (sortBy === 'company_asc') {
        const companyA = (a.company || '').toLowerCase();
        const companyB = (b.company || '').toLowerCase();
        return companyA.localeCompare(companyB);
      }
      return 0;
    });

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
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm font-medium py-3 pl-11 pr-4 rounded-xl outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all shadow-inner"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="relative min-w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium py-3 pl-4 pr-10 rounded-xl outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all shadow-inner cursor-pointer"
                >
                  <option value="date_applied_desc" className="text-black">Sort: Date Applied</option>
                  <option value="company_asc" className="text-black">Sort: Company (A-Z)</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex flex-row gap-3 items-center whitespace-nowrap w-full xl:w-auto justify-end">
              <UserProfileDropdown />
              <button
                type="button"
                onClick={() => setModal({ open: true, application: null })}
                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold tracking-tight transition-all hover:bg-white/90 hover:scale-[0.98] active:scale-95 shadow-xl shadow-white/5"
              >
                + New Application
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
          <QuickStatsSection stats={stats} loading={loading} />

          <Dashboard
            applications={filteredAndSortedApplications}
            loading={loading}
            onStatusChange={handleStatusChange}
            onEdit={(app) => setModal({ open: true, application: app })}
            onDelete={handleDelete}
          />
        </main>

        <ApplicationModal
          open={modal.open}
          application={modal.application}
          onClose={() => setModal({ open: false, application: null })}
          onSaved={handleSaved}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthGate>
      <AppShell />
    </AuthGate>
  );
}

export default App;
