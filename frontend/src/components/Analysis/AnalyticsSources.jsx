import { useEffect, useState } from 'react';
import Skeleton from '../ui/Skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../axios';

const COLORS = {
  total: ['#6366f1', '#a855f7'], // Indigo to Purple
  interviews: ['#10b981', '#3b82f6'], // Emerald to Blue
};

export default function AnalyticsSources() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/analytics/sources');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 shadow-xl h-full flex flex-col">
        <Skeleton className="h-6 w-56 mb-8" />
        <div className="flex-1 flex items-end justify-around pt-4 pb-2 min-h-[300px] md:min-h-[400px]">
          {['h-[75%]', 'h-[50%]', 'h-full', 'h-[66%]', 'h-[33%]'].map((h, i) => (
            <div key={i} className="flex gap-1 items-end h-full w-12 justify-center">
              <Skeleton className={`w-4 sm:w-6 ${h} rounded-t-lg`} />
              <Skeleton className={`w-4 sm:w-6 ${h === 'h-full' ? 'h-[75%]' : 'h-[25%]'} rounded-t-lg`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 shadow-xl">
      <h3 className="text-lg md:text-xl font-black mb-6 text-slate-800 dark:text-white">Lead Source Performance</h3>
      <div className="h-[300px] md:h-[400px] w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.total[0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.total[1]} stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.interviews[0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.interviews[1]} stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.1} />
            <XAxis 
              dataKey="source" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'currentColor' }}
              className="text-slate-600 dark:text-slate-400"
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'currentColor' }}
              className="text-slate-600 dark:text-slate-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
              }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{value}</span>}
            />
            <Bar 
              dataKey="total_apps" 
              name="Total Applications" 
              fill="url(#colorTotal)" 
              radius={[6, 6, 0, 0]} 
              barSize={30}
            />
            <Bar 
              dataKey="interviews" 
              name="Interviews Received" 
              fill="url(#colorInterviews)" 
              radius={[6, 6, 0, 0]} 
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
