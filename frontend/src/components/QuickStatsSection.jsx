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
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-white">{title}</p>
          {trend && !loading && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
              {trend}
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="h-10 w-24 animate-pulse rounded-lg bg-white/5" />
        ) : (
          <p className="text-4xl font-black tracking-tighter text-white tabular-nums">{value}</p>
        )}
        
        {hint && !loading && (
          <p className="mt-2 text-xs font-bold text-white tracking-tight">{hint}</p>
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
      className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
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
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:col-span-2 xl:col-span-1"
      >
        <div className="relative z-10 h-full flex flex-col">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-white mb-4">Pipeline mix</p>
          <div className="flex-1 min-h-[60px] flex items-center justify-center">
            <StatusPieChart byStatus={stats?.by_status} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
