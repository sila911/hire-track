import { useCallback, useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import ApplicationModal from './components/ApplicationModal';
import AuthGate from './components/AuthGate';
import { useAuth } from './auth-context';
import { useDialog } from './dialog-context';
import api from './axios';

function AppShell() {
  const { logout } = useAuth();
  const { confirm, alert: alertDialog } = useDialog();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, application: null });

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadApplications();
    });
  }, [loadApplications]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/applications/${id}`, { status: newStatus });
      setApplications((prev) => prev.map((app) => (app.id === id ? data : app)));
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
  };

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 font-sans tracking-tight selection:bg-white/30">
      <header className="mb-8 rounded-[2rem] p-6 backdrop-blur-xl bg-slate-900/40 border border-white/20 flex flex-col md:flex-row justify-between items-center shadow-2xl relative z-10 overflow-hidden">
        {/* Soft inner glow refraction */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        {/* Light-catcher top edge */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-sm relative z-10">
          HireTrack
        </h1>

        <div className="mt-4 md:mt-0 relative z-10 flex flex-col md:flex-row gap-3 items-center">
          <button
            type="button"
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md px-5 py-3 rounded-2xl font-bold tracking-tight transition-all text-sm"
          >
            Log out
          </button>
          <button
            type="button"
            onClick={() => setModal({ open: true, application: null })}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md px-6 py-3 rounded-2xl font-bold tracking-tight transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-95 active:scale-90"
          >
            + New Application
          </button>
        </div>
      </header>

      <Dashboard
        applications={applications}
        loading={loading}
        onStatusChange={handleStatusChange}
        onEdit={(app) => setModal({ open: true, application: app })}
        onDelete={handleDelete}
      />

      <ApplicationModal
        open={modal.open}
        application={modal.application}
        onClose={() => setModal({ open: false, application: null })}
        onSaved={handleSaved}
      />
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
