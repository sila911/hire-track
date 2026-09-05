import { useEffect, useState } from 'react';
import Skeleton from '../ui/Skeleton';
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
      <div className="flex items-center gap-3 w-full overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory pb-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-[140px] md:flex-1 snap-center p-3.5 bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-xl relative overflow-hidden flex flex-col justify-center gap-3 h-[82px]">
            <Skeleton className="h-2 w-20" />
            <Skeleton className="h-6 w-12" />
          </div>
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
    <div className="flex items-center gap-3 w-full overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory pb-4 mb-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="min-w-[140px] md:flex-1 snap-center p-3.5 bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-xl relative overflow-hidden flex flex-col"
        >
          {/* Top accent border */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${card.color.replace('border-', 'bg-')}`} />
          
          {/* Subtle glow circle */}
          <div className={`absolute -right-4 -top-4 w-12 h-12 rounded-full blur-xl ${card.glow}`} />

          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 relative z-10">
            {card.label}
          </p>
          <p className="text-slate-950 dark:text-white text-xl font-black relative z-10">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
