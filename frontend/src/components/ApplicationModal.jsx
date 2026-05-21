import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaXmark, FaLinkedin, FaFacebook, FaTelegram } from 'react-icons/fa6';
import { Globe, UserPlus, MoreHorizontal, ChevronDown, Building2 } from 'lucide-react';
import api from '../axios';
import { firstErrorPerField } from '../utils/laravelErrors';
import StatusDropdown from './StatusDropdown';

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

const SOURCES = ['Telegram', 'LinkedIn', 'Facebook', 'Website', 'Referral', 'Other'];

const SOURCE_CONFIG = {
  Telegram: {
    icon: FaTelegram,
    color: 'text-sky-500 dark:text-sky-300',
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    border: 'border-sky-200 dark:border-sky-500/30',
  },
  LinkedIn: {
    icon: FaLinkedin,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    border: 'border-blue-200 dark:border-blue-500/30',
  },
  Facebook: {
    icon: FaFacebook,
    color: 'text-blue-500 dark:text-blue-300',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    border: 'border-blue-200 dark:border-blue-500/30',
  },
  Website: {
    icon: Globe,
    color: 'text-slate-600 dark:text-slate-300',
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    border: 'border-slate-200 dark:border-slate-500/30',
  },
  Referral: {
    icon: UserPlus,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    border: 'border-emerald-200 dark:border-emerald-500/30',
  },
  Other: {
    icon: MoreHorizontal,
    color: 'text-gray-500 dark:text-gray-400',
    bg: 'bg-gray-500/10 dark:bg-gray-500/20',
    border: 'border-gray-200 dark:border-gray-500/30',
  },
};

function SourceDropdown({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentConfig = SOURCE_CONFIG[value] || SOURCE_CONFIG.Other;
  const CurrentIcon = currentConfig.icon;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 md:py-2 rounded-xl border ${currentConfig.border} ${currentConfig.bg} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none shadow-sm`}
      >
        <div className={`flex items-center gap-2 ${currentConfig.color}`}>
          <CurrentIcon size={14} className="shrink-0" />
          <span className="text-[11px] md:text-sm font-bold uppercase tracking-wider">{value}</span>
        </div>
        <ChevronDown size={14} className={`shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 py-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden max-h-56 overflow-y-auto custom-scrollbar-slim"
          >
            {SOURCES.map((source) => {
              const config = SOURCE_CONFIG[source];
              const Icon = config.icon;
              const isSelected = value === source;

              return (
                <button
                  key={source}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(source);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-200
                    ${isSelected ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                  `}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full ${config.bg} ${config.color}`}>
                    <Icon size={12} />
                  </div>
                  <span className={`text-[11px] md:text-xs font-bold uppercase tracking-widest ${isSelected ? config.color : 'text-slate-600 dark:text-slate-300'}`}>
                    {source}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ApplicationModal({ open, application, onClose, onSaved }) {
  const isEdit = Boolean(application?.id);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [appliedAt, setAppliedAt] = useState(todayISODate());
  const [status, setStatus] = useState('Applied');
  const [source, setSource] = useState('Other');
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
        setSource(application.source ?? 'Other');
        setLogoUrl(application.logo_url ?? '');
      } else {
        setCompany('');
        setRole('');
        setAppliedAt(todayISODate());
        setStatus('Applied');
        setSource('Other');
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
      const payload = { company: company.trim(), role: role.trim(), applied_at: appliedAt, status, source, logo_url: logoUrl };
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
            className="relative w-full max-w-lg rounded-[2rem] border border-slate-200 dark:border-white/20 bg-[#0c1322]/90 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="mb-8 flex items-start justify-between gap-4">
              <h2
                id="application-modal-title"
                className="text-2xl font-black tracking-tight text-white"
              >
                {isEdit ? 'Edit application' : 'New application'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <FaXmark size={20} />
              </button>
            </div>

            {banner && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200"
              >
                {banner}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="app-company" className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Company
                  </label>
                  <input
                    id="app-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    autoComplete="organization"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/20 outline-none ring-white/10 focus:ring-2 transition-all"
                    placeholder="Acme Inc."
                    required
                  />
                  {fieldErrors.company && (
                    <p className="mt-1 text-[10px] font-bold text-red-400">{fieldErrors.company}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="app-role" className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Job title
                  </label>
                  <input
                    id="app-role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    autoComplete="organization-title"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/20 outline-none ring-white/10 focus:ring-2 transition-all"
                    placeholder="Software Engineer"
                    required
                  />
                  {fieldErrors.role && (
                    <p className="mt-1 text-[10px] font-bold text-red-400">{fieldErrors.role}</p>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-[7]">
                  <label htmlFor="app-logo-url" className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Company Logo URL
                  </label>
                  <input
                    id="app-logo-url"
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/20 outline-none ring-white/10 focus:ring-2 transition-all"
                    placeholder="https://example.com/logo.png"
                  />
                  {fieldErrors.logo_url && (
                    <p className="mt-1 text-[10px] font-bold text-red-400">{fieldErrors.logo_url}</p>
                  )}
                </div>
                <div className="flex-[3] flex justify-center">
                  <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                        }}
                      />
                    ) : (
                      <Building2 size={24} className="text-white/20" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-[200px]">
                  <label htmlFor="app-date" className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase text-center">
                    Applied on
                  </label>
                  <input
                    id="app-date"
                    type="date"
                    value={appliedAt}
                    onChange={(e) => setAppliedAt(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white text-center outline-none ring-white/10 focus:ring-2 [color-scheme:dark] transition-all"
                    required
                  />
                  {fieldErrors.applied_at && (
                    <p className="mt-1 text-[10px] font-bold text-red-400 text-center">{fieldErrors.applied_at}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Status
                  </label>
                  <StatusDropdown
                    value={status}
                    onChange={setStatus}
                  />
                  {fieldErrors.status && (
                    <p className="mt-1 text-[10px] font-bold text-red-400">{fieldErrors.status}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    SOURCE
                  </label>
                  <SourceDropdown
                    value={source}
                    onChange={setSource}
                  />
                  {fieldErrors.source && (
                    <p className="mt-1 text-[10px] font-bold text-red-400">{fieldErrors.source}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-row items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-xs md:text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-white px-8 py-2.5 text-xs md:text-sm font-black text-black shadow-xl transition hover:opacity-90 disabled:opacity-60"
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
