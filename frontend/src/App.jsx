import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ApplicationModal from './components/ApplicationModal';
import QuickStatsSection from './components/QuickStatsSection';
import { AuthProvider } from './auth-context';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Analysis from './pages/Analysis';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { useDialog } from './dialog-context';
import { useNotification } from './notification-context';
import api from './axios';

function DashboardPage({ applications, stats, loading, handleStatusChange, setModal, handleDelete }) {
  return (
    <>
      <QuickStatsSection stats={stats} loading={loading} />
      <Dashboard
        applications={applications}
        loading={loading}
        onStatusChange={handleStatusChange}
        onEdit={(app) => setModal({ open: true, application: app })}
        onDelete={handleDelete}
      />
    </>
  );
}

function AppShell() {
  const { confirm } = useDialog();
  const { addNotification } = useNotification();
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
      addNotification({
        type: 'success',
        title: 'Status Updated',
        description: `Application status changed to ${newStatus}.`,
      });
      void refreshStats();
    } catch (error) {
      console.error('Failed to update status:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        description: 'Could not update application status.',
      });
    }
  };

  const handleDelete = async (application) => {
    const company = (application.company ?? '').trim() || 'this company';
    const role = (application.role ?? '').trim() || 'this position';
    const ok = await confirm({
      title: 'Delete application',
      message: (
        <p className="m-0 text-sm leading-relaxed text-white">
          Delete the{' '}
          <strong className="font-extrabold text-amber-200">{company}</strong>
          {' '}
          application as{' '}
          <strong className="font-extrabold text-sky-300">{role}</strong>
          ?{' '}
          <span className="font-semibold text-red-300">This cannot be undone.</span>
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
      addNotification({
        type: 'success',
        title: 'Application Deleted',
        description: `${application.company} application removed successfully.`,
      });
      void refreshStats();
    } catch (error) {
      console.error('Failed to delete application:', error);
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        description: 'Failed to delete application.',
      });
    }
  };

  const handleSaved = (saved) => {
    const appsList = Array.isArray(applications) ? applications : [];
    const exists = appsList.some((a) => a.id === saved.id);
    
    setApplications((prev) => {
      const prevList = Array.isArray(prev) ? prev : [];
      if (exists) return prevList.map((a) => (a.id === saved.id ? saved : a));
      return [saved, ...prevList];
    });

    addNotification({
      type: 'success',
      title: exists ? 'Application Updated' : 'Application Created',
      description: `${saved.company} application has been ${exists ? 'updated' : 'added'} successfully.`,
    });

    void refreshStats();
  };

  const filteredAndSortedApplications = (Array.isArray(applications) ? applications : [])
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
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute>
          <AppLayout 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
            onNewApplication={() => setModal({ open: true, application: null })}
          />
        </ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage 
            applications={filteredAndSortedApplications}
            stats={stats}
            loading={loading}
            handleStatusChange={handleStatusChange}
            setModal={setModal}
            handleDelete={handleDelete}
          />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/applications" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Applications List Coming Soon</h2></div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>

      <ApplicationModal
        open={modal.open}
        application={modal.application}
        onClose={() => setModal({ open: false, application: null })}
        onSaved={handleSaved}
      />
    </AuthProvider>
  );
}

import { NotificationProvider } from './notification-context';
import { DialogProvider } from './dialog-context';

function App() {
  return (
    <NotificationProvider>
      <DialogProvider>
        <AppShell />
      </DialogProvider>
    </NotificationProvider>
  );
}

export default App;
