import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const STATUS_ORDER = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];

const STATUS_COLORS = {
  Applied: 'rgba(59, 130, 246, 0.85)',
  Interviewing: 'rgba(245, 158, 11, 0.9)',
  Accepted: 'rgba(34, 197, 94, 0.9)',
  Rejected: 'rgba(239, 68, 68, 0.9)',
};

const STATUS_BORDERS = {
  Applied: 'rgba(147, 197, 253, 0.6)',
  Interviewing: 'rgba(253, 230, 138, 0.55)',
  Accepted: 'rgba(134, 239, 172, 0.55)',
  Rejected: 'rgba(252, 165, 165, 0.55)',
};

/**
 * @param {{ byStatus: Record<string, number> | null | undefined }} props
 */
export default function StatusPieChart({ byStatus }) {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const { data, total } = useMemo(() => {
    if (!byStatus) {
      return { data: null, total: 0 };
    }
    const labels = STATUS_ORDER;
    const values = labels.map((s) => byStatus[s] ?? 0);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      total: sum,
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map((s) => STATUS_COLORS[s]),
            borderColor: labels.map((s) => STATUS_BORDERS[s]),
            borderWidth: 1.5,
            hoverOffset: 8,
          },
        ],
      },
    };
  }, [byStatus]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: isDark ? 'rgba(248, 250, 252, 0.85)' : 'rgba(0, 0, 0, 0.85)',
            padding: 12,
            font: { size: 11, weight: '600' },
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
          titleColor: isDark ? '#f8fafc' : '#000000',
          bodyColor: isDark ? '#e2e8f0' : '#334155',
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0, 0, 0, 0.12)',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label(ctx) {
              const v = ctx.parsed;
              const t = total || 1;
              const pct = ((v / t) * 100).toFixed(1);
              return ` ${v} (${pct}%)`;
            },
          },
        },
      },
    }),
    [total, isDark],
  );

  if (!data || total === 0) {
    return (
      <div className="flex h-[220px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-white/15 bg-slate-900/[0.03] dark:bg-white/[0.03] text-center transition-colors duration-300">
        <p className="text-sm font-semibold text-black/50 dark:text-white/45">No applications yet</p>
        <p className="mt-1 text-xs text-black/40 dark:text-white/35">Status mix will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[220px] w-full max-w-[260px]">
      <Pie data={data} options={options} />
    </div>
  );
}
