import { motion } from 'framer-motion';
import StatusPieChart from './StatusPieChart';

function formatPct(rate) {
  if (rate == null || Number.isNaN(rate)) return '—';
  return `${(rate * 100).toFixed(1)}%`;
}

function StatCard({ title, value, hint, loading, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, type: 'spring', stiffness: 260, damping: 28 }}
      className="relative overflow-hidden rounded-2xl border border-white/20 bg-slate-900/40 p-5 shadow-xl backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-wider text-white/45">{title}</p>
        {loading ? (
          <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-white/10" />
        ) : (
          <p className="mt-2 text-3xl font-black tracking-tight text-white tabular-nums">{value}</p>
        )}
        {hint && !loading && <p className="mt-1.5 text-xs font-medium text-white/40">{hint}</p>}
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
      className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Application statistics"
    >
      <StatCard
        title="Total applications"
        value={total.toLocaleString()}
        hint="Across all pipeline stages"
        loading={loading}
        delay={0}
      />
      <StatCard
        title="Interview rate"
        value={formatPct(stats?.interview_rate)}
        hint="Share currently interviewing"
        loading={loading}
        delay={0.05}
      />
      <StatCard
        title="Success rate"
        value={formatPct(stats?.success_rate)}
        hint="Share accepted offers"
        loading={loading}
        delay={0.1}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35, type: 'spring', stiffness: 260, damping: 28 }}
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-slate-900/40 p-5 shadow-xl backdrop-blur-xl sm:col-span-2 xl:col-span-1"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-white/45">Status mix</p>
          <p className="mt-0.5 text-sm text-white/50">Pipeline distribution</p>
          <div className="mt-2">
            <StatusPieChart byStatus={stats?.by_status} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
