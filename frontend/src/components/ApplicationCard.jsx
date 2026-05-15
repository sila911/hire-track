import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEllipsisV, FaEdit, FaTrashAlt, FaClock } from 'react-icons/fa';

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
      className="group rounded-3xl bg-white/[0.04] border border-white/5 p-6 shadow-xl relative overflow-visible hover:bg-white/[0.07] transition-colors"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            {application.logo_url ? (
              <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-lg shrink-0">
                <img src={application.logo_url} alt="" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-black text-white/20">{(application.company || '?')[0]}</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-black tracking-tight text-white leading-tight">{application.company}</h3>
              <p className="text-white/40 font-bold text-xs mt-1 uppercase tracking-wider">{application.role}</p>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-white/20 hover:text-white/60 transition-colors"
            >
              <FaEllipsisV />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-40 rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { onEdit(application); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(application); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <FaClock className="text-xs" />
            <span>Applied {new Date(application.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>

          <div className="relative w-full">
            <select
              value={application.status}
              onChange={(e) => onStatusChange(application.id, e.target.value)}
              className="appearance-none w-full bg-white/5 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] py-3 px-5 rounded-2xl border border-white/5 cursor-pointer outline-none focus:border-white/20 transition-all hover:bg-white/[0.08]"
            >
              <option value="Applied" className="text-black">Applied</option>
              <option value="Interviewing" className="text-black">Interviewing</option>
              <option value="Accepted" className="text-black">Accepted</option>
              <option value="Rejected" className="text-black">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-white/20">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
