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
            color: 'rgba(248, 250, 252, 0.85)',
            padding: 12,
            font: { size: 11, weight: '600' },
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(255,255,255,0.12)',
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
    [total],
  );

  if (!data || total === 0) {
    return (
      <div className="flex h-[220px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-center">
        <p className="text-sm font-semibold text-white/45">No applications yet</p>
        <p className="mt-1 text-xs text-white/35">Status mix will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[220px] w-full max-w-[260px]">
      <Pie data={data} options={options} />
    </div>
  );
}
