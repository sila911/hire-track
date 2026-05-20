import { motion } from 'framer-motion';
import StatusPieChart from './StatusPieChart';

function formatPct(rate) {
  if (rate == null || Number.isNaN(rate)) return '—';
  return `${(rate * 100).toFixed(1)}%`;
}

function StatCard({ title, value, hint, trend, loading, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, type: 'spring', stiffness: 260, damping: 28 }}
      className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl transition-all duration-300"
    >
      <div className="relative z-10 flex flex-col items-center text-center gap-2">
        <div className="flex flex-col items-center gap-1.5 mb-2">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-black/70 dark:text-white/70">
            {title}
          </p>
          {trend && !loading && (
            <span className="text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              {trend}
            </span>
          )}
        </div>
        
        <div className="mb-2">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-900/10 dark:bg-white/5" />
          ) : (
            <p className="text-3xl md:text-4xl font-black tracking-tighter text-black dark:text-white tabular-nums leading-none">
              {value}
            </p>
          )}
        </div>

        <p className="text-[10px] md:text-xs font-bold text-black/40 dark:text-white/40 tracking-tight max-w-[150px]">
          {hint}
        </p>
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
      className="mb-8 md:mb-12 grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Application statistics"
    >
      <StatCard
        title="Total apps"
        value={total.toLocaleString()}
        hint="All-time pipeline volume"
        trend="+2 this week"
        loading={loading}
        delay={0}
      />
      <StatCard
        title="Interview rate"
        value={formatPct(stats?.interview_rate)}
        hint="Current active pipeline"
        trend="High volume"
        loading={loading}
        delay={0.05}
      />
      <StatCard
        title="Success rate"
        value={formatPct(stats?.success_rate)}
        hint="Completed offer cycles"
        trend="+0.4%"
        loading={loading}
        delay={0.1}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35, type: 'spring', stiffness: 260, damping: 28 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl sm:col-span-2 xl:col-span-1 transition-all duration-300"
      >
        <div className="relative z-10 h-full flex flex-col items-center text-center gap-4">
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-black/70 dark:text-white/70">
              Pipeline mix
            </p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center min-h-[80px]">
            <StatusPieChart byStatus={stats?.by_status} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
