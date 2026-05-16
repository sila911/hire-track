import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../axios';
import { firstErrorPerField } from '../utils/laravelErrors';

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

const STATUSES = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];

export default function ApplicationModal({ open, application, onClose, onSaved }) {
  const isEdit = Boolean(application?.id);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [appliedAt, setAppliedAt] = useState(todayISODate());
  const [status, setStatus] = useState('Applied');
  const [logoUrl, setLogoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setFieldErrors({});
      setBanner(null);
      if (application) {
        setCompany(application.company ?? '');
        setRole(application.role ?? '');
        const ad = application.applied_at;
        setAppliedAt(typeof ad === 'string' ? ad.slice(0, 10) : todayISODate());
        setStatus(application.status ?? 'Applied');
        setLogoUrl(application.logo_url ?? '');
      } else {
        setCompany('');
        setRole('');
        setAppliedAt(todayISODate());
        setStatus('Applied');
        setLogoUrl('');
      }
    });
  }, [open, application]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!company) {
      if (!isEdit) setLogoUrl('');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const query = encodeURIComponent(company.trim());
        const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.length > 0 && data[0].logo) {
          setLogoUrl(data[0].logo);
        }
      } catch (err) {
        // ignore errors
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [company, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setBanner(null);
    try {
      const payload = { company: company.trim(), role: role.trim(), applied_at: appliedAt, status, logo_url: logoUrl };
      const res = isEdit
        ? await api.put(`/applications/${application.id}`, payload)
        : await api.post('/applications', payload);
      onSaved(res.data);
      onClose();
    } catch (err) {
      const statusCode = err.response?.status;
      const data = err.response?.data;
      if (statusCode === 422 && data?.errors) {
        setFieldErrors(firstErrorPerField(data.errors));
      } else if (!err.response) {
        setBanner('Unable to reach the server. Check your connection and try again.');
      } else {
        setBanner(
          typeof data?.message === 'string' ? data.message : 'Something went wrong. Please try again.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-modal-title"
            className="relative w-full max-w-lg rounded-[2rem] border border-slate-200 dark:border-white/20 bg-white/90 dark:bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/35 to-transparent" />

            <div className="mb-6 flex items-start justify-between gap-4">
              <h2
                id="application-modal-title"
                className="text-2xl font-black tracking-tight text-black dark:text-white"
              >
                {isEdit ? 'Edit application' : 'New application'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 dark:border-white/15 bg-black/5 dark:bg-white/10 px-3 py-2 text-sm font-black text-black dark:text-white transition hover:bg-black/10 dark:hover:bg-white/20"
              >
                Close
              </button>
            </div>

            {banner && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200"
              >
                {banner}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="app-company" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Company
                </label>
                <input
                  id="app-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="organization"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 px-4 py-3 text-black dark:text-white placeholder-slate-400 dark:placeholder-white/30 outline-none ring-slate-200 dark:ring-white/20 focus:ring-2 transition-all"
                  placeholder="Acme Inc."
                  required
                />
                {fieldErrors.company && (
                  <p className="mt-1.5 text-xs font-bold text-red-400">{fieldErrors.company}</p>
                )}
              </div>

              <div>
                <label htmlFor="app-logo-url" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Company Logo URL
                </label>
                <input
                  id="app-logo-url"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 px-4 py-3 text-black dark:text-white placeholder-slate-400 dark:placeholder-white/30 outline-none ring-slate-200 dark:ring-white/20 focus:ring-2 transition-all"
                  placeholder="https://example.com/logo.png (Optional)"
                />
                {fieldErrors.logo_url && (
                  <p className="mt-1.5 text-xs font-bold text-red-400">{fieldErrors.logo_url}</p>
                )}
              </div>

              <div>
                <label htmlFor="app-role" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Job title
                </label>
                <input
                  id="app-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  autoComplete="organization-title"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 px-4 py-3 text-black dark:text-white placeholder-slate-400 dark:placeholder-white/30 outline-none ring-slate-200 dark:ring-white/20 focus:ring-2 transition-all"
                  placeholder="Software Engineer"
                  required
                />
                {fieldErrors.role && (
                  <p className="mt-1.5 text-xs font-bold text-red-400">{fieldErrors.role}</p>
                )}
              </div>

              <div>
                <label htmlFor="app-date" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Applied on
                </label>
                <input
                  id="app-date"
                  type="date"
                  value={appliedAt}
                  onChange={(e) => setAppliedAt(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 px-4 py-3 text-black dark:text-white outline-none ring-slate-200 dark:ring-white/20 focus:ring-2 [color-scheme:light] dark:[color-scheme:dark] transition-all"
                  required
                />
                {fieldErrors.applied_at && (
                  <p className="mt-1.5 text-xs font-bold text-red-400">{fieldErrors.applied_at}</p>
                )}
              </div>

              <div>
                <label htmlFor="app-status" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Status
                </label>
                <select
                  id="app-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 px-4 py-3 text-black dark:text-white outline-none ring-slate-200 dark:ring-white/20 focus:ring-2 transition-all cursor-pointer"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-white dark:bg-slate-900 text-black dark:text-white">
                      {s}
                    </option>
                  ))}
                </select>
                {fieldErrors.status && (
                  <p className="mt-1.5 text-xs font-bold text-red-400">{fieldErrors.status}</p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-3 text-sm font-black text-black dark:text-white transition hover:bg-black/10 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 dark:border-white/20 bg-black dark:bg-white px-6 py-3 text-sm font-black text-white dark:text-black shadow-xl transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
