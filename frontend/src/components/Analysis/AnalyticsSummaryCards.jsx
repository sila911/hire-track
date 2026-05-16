import { useEffect, useState } from 'react';
import api from '../../axios';

export default function AnalyticsSummaryCards() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/analytics/summary');
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Applied Total', value: summary.total_applied, color: 'border-blue-500', glow: 'bg-blue-500/10' },
    { label: 'Interviewing', value: summary.total_interviewing, color: 'border-purple-500', glow: 'bg-purple-500/10' },
    { label: 'Accepted (Offers)', value: summary.total_accepted, color: 'border-emerald-500', glow: 'bg-emerald-500/10' },
    { label: 'Rejected Total', value: summary.total_rejected, color: 'border-red-500', glow: 'bg-red-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl rounded-2xl p-5 shadow-sm overflow-hidden"
        >
          {/* Left accent border */}
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${card.color.replace('border-', 'bg-')}`} />
          
          {/* Subtle glow circle */}
          <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl ${card.glow}`} />

          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">
            {card.label}
          </p>
          <p className="text-slate-950 dark:text-white text-3xl font-black mt-1">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
