import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEllipsisV, FaEdit, FaTrashAlt, FaClock } from 'react-icons/fa';
import StatusDropdown from './StatusDropdown';

export default function ApplicationCard({ application, onStatusChange, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group rounded-3xl bg-white/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 p-6 shadow-xl relative overflow-visible hover:bg-white dark:hover:bg-white/[0.07] transition-all duration-300 z-10 hover:z-50 focus-within:z-50"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            {application.logo_url ? (
              <div className="w-12 h-12 rounded-full bg-white shadow-lg shrink-0 border border-slate-200 dark:border-transparent transition-colors duration-300 overflow-hidden">
                <img src={application.logo_url} alt="" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center shrink-0 transition-colors duration-300 overflow-hidden">
                <span className="text-2xl font-black text-black dark:text-white">{(application.company || '?')[0]}</span>
              </div>
            )}
            <div>
              <h3 className="text-sm md:text-base font-bold tracking-tight text-black dark:text-white leading-tight transition-colors duration-300">{application.company}</h3>
              <p className="text-slate-500 dark:text-white/60 font-bold text-[11px] md:text-xs mt-0.5 uppercase tracking-wider transition-colors duration-300">{application.role}</p>
            </div>
          </div>


          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 md:p-2 text-slate-400 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-300"
            >
              <FaEllipsisV size={14} className="md:w-4 md:h-4" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden transition-colors duration-300"
                >
                  <button
                    onClick={() => { onEdit(application); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-black dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-300"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(application); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-500/10 dark:hover:bg-red-500/10 transition-colors duration-300"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest transition-colors duration-300">
            <FaClock className="text-[10px]" />
            <span>Applied {new Date(application.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>

          <div className="relative w-full overflow-visible">
            <StatusDropdown
              value={application.status}
              onChange={(newStatus) => onStatusChange(application.id, newStatus)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
