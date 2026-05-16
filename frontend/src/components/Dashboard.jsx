import ApplicationCard from './ApplicationCard';
import { motion } from 'framer-motion';

const STATUSES = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];

export default function Dashboard({
  applications = [],
  loading,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const safeApps = Array.isArray(applications) ? applications : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white/80"></div>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:snap-none custom-scrollbar">
      {STATUSES.map((status, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
          key={status}
          className="flex-none w-[85%] sm:w-[450px] md:w-full snap-center flex flex-col rounded-[2.5rem] bg-white/70 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 p-6 shadow-2xl backdrop-blur-xl relative min-h-[600px] transition-colors duration-300"
        >
          <div className="mb-8 flex items-center justify-between px-2">
            <h2 className="text-xl font-black tracking-tight text-black dark:text-white transition-colors duration-300">{status}</h2>
            <div className="bg-black/5 dark:bg-white/10 text-black dark:text-white text-xs font-black px-3 py-1 rounded-full border border-slate-200/50 dark:border-white/10 backdrop-blur-md transition-colors duration-300">
              {safeApps.filter((app) => app.status === status).length}
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pb-4 pr-1 custom-scrollbar-slim">
            {safeApps
              .filter((app) => app.status === status)
              .map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            {safeApps.filter((app) => app.status === status).length === 0 && (
              <div className="flex items-center justify-center h-32 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
                <p className="text-black/50 dark:text-white/40 text-xs font-black tracking-widest uppercase transition-colors duration-300">Empty</p>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
