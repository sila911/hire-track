import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

export const STATUS_CONFIG = {
  Applied: {
    icon: Send,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    border: 'border-blue-200 dark:border-blue-500/30',
  },
  Interviewing: {
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    border: 'border-purple-200 dark:border-purple-500/30',
  },
  Accepted: {
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    border: 'border-emerald-200 dark:border-emerald-500/30',
  },
  Rejected: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    border: 'border-red-200 dark:border-red-500/30',
  },
};

const STATUSES = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];

export default function StatusDropdown({ value, onChange, className = '' }) {
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

  const currentConfig = STATUS_CONFIG[value] || STATUS_CONFIG.Applied;
  const CurrentIcon = currentConfig.icon;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`w-full flex items-center justify-between gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl border ${currentConfig.border} ${currentConfig.bg} ${currentConfig.color} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none shadow-sm`}
      >
        <div className="flex items-center gap-2">
          <CurrentIcon size={14} strokeWidth={3} className="shrink-0" />
          <span className="text-[11px] md:text-xs font-black uppercase tracking-widest">{value}</span>
        </div>
        <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 py-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden"
          >
            {STATUSES.map((status) => {
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;
              const isSelected = value === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(status);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-200
                    ${isSelected ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}
                  `}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full ${config.bg} ${config.color}`}>
                    <Icon size={12} strokeWidth={3} />
                  </div>
                  <span className={`text-[11px] md:text-xs font-black uppercase tracking-widest ${isSelected ? config.color : 'text-slate-600 dark:text-slate-300'}`}>
                    {status}
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
