import { motion } from 'framer-motion';

const statusGlows = {
  Applied: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  Interviewing: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  Accepted: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
  Rejected: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
};

export default function ApplicationCard({ application, onStatusChange }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className={`rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-5 shadow-lg relative overflow-hidden cursor-grab active:cursor-grabbing ${statusGlows[application.status] || ''}`}
    >
      {/* Light-catcher edge highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-black tracking-tight text-white mb-1">{application.company}</h3>
        <p className="text-white/70 font-medium text-sm mb-4">{application.role}</p>
        
        <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-4">
          <span className="text-xs font-semibold text-white/50 tracking-wide">
            {new Date(application.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          
          <div className="relative">
            <select 
              value={application.status} 
              onChange={(e) => onStatusChange(application.id, e.target.value)}
              className="appearance-none bg-black/20 text-white/90 text-xs font-bold py-1.5 pl-4 pr-9 rounded-full border border-white/10 backdrop-blur-sm cursor-pointer outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-inner"
            >
              <option value="Applied" className="text-black">Applied</option>
              <option value="Interviewing" className="text-black">Interviewing</option>
              <option value="Accepted" className="text-black">Accepted</option>
              <option value="Rejected" className="text-black">Rejected</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white/60">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}