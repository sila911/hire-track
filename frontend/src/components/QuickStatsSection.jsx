import { motion } from 'framer-motion';
import { DocumentText, Messages2, Award } from 'iconsax-react';
import Skeleton from './ui/Skeleton';

function formatPct(rate) {
  if (rate == null || Number.isNaN(rate)) return '—';
  return `${(rate * 100).toFixed(1)}%`;
}

function StatCard({ title, value, hint, icon: Icon, loading, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, type: 'spring', stiffness: 260, damping: 28 }}
      className="flex-none w-[65%] sm:w-[45%] md:w-auto snap-center relative overflow-hidden rounded-xl md:rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-4 md:p-5 shadow-lg md:shadow-xl backdrop-blur-xl transition-all duration-300 group"
    >
      <div className="absolute -right-4 -bottom-4 opacity-10 dark:opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        {Icon && <Icon size={80} variant="Bulk" color="currentColor" />}
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4 h-full">
        <div className="flex flex-col justify-center h-full">
          {loading ? (
            <Skeleton className="h-2 w-16 mb-2" />
          ) : (
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1">
              {title}
            </p>
          )}
          
          <div className="flex items-baseline gap-2">
            {loading ? (
              <Skeleton className="h-6 md:h-8 w-16" />
            ) : (
              <p className="text-3xl md:text-4xl font-black tracking-tighter text-black dark:text-white tabular-nums leading-none">
                {value}
              </p>
            )}
            
            {!loading && hint && (
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-tight uppercase">
                {hint}
              </span>
            )}
          </div>
        </div>
        
        {Icon && (
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
            <Icon size={20} className="text-indigo-600 dark:text-indigo-400" variant="Bulk" color="currentColor" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * @param {{
 *   stats: { total: number; interview_rate: number; success_rate: number; by_status: Record<string, number> } | null;
 *   loading: boolean;
 * }} props
 */
export default function QuickStatsSection({ stats, loading }) {
  const total = stats?.total ?? 0;

  return (
    <section
      className="mb-4 md:mb-12 flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-6 md:grid md:grid-cols-3 custom-scrollbar pb-2"
      aria-label="Application statistics"
    >
      <StatCard
        title="Total"
        value={total.toLocaleString()}
        hint="Apps"
        icon={DocumentText}
        loading={loading}
        delay={0}
      />
      <StatCard
        title="Interviews"
        value={formatPct(stats?.interview_rate)}
        hint="Active"
        icon={Messages2}
        loading={loading}
        delay={0.05}
      />
      <StatCard
        title="Success"
        value={formatPct(stats?.success_rate)}
        hint="Offers"
        icon={Award}
        loading={loading}
        delay={0.1}
      />
    </section>
  );
}
