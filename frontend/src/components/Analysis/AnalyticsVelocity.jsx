import { useEffect, useState } from 'react';
import Skeleton from '../ui/Skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../axios';

const COLORS = ['#06b6d4', '#8b5cf6']; // Cyan to Purple

export default function AnalyticsVelocity() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/analytics/velocity');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch velocity analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 shadow-xl h-full flex flex-col">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="flex-1 flex flex-col justify-between pt-4 pb-2 min-h-[250px]">
          {['w-full', 'w-4/5', 'w-2/3', 'w-1/2', 'w-1/3'].map((w, i) => (
            <Skeleton key={i} className={`h-8 ${w} rounded-r-lg`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 shadow-xl h-full">
      <h3 className="text-lg md:text-xl font-black mb-2 text-slate-800 dark:text-white">Response Velocity</h3>
      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 font-bold">
        Average days until status update per platform.
      </p>
      <div className="h-[250px] w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorVelocity" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={COLORS[0]} stopOpacity={0.9} />
                <stop offset="100%" stopColor={COLORS[1]} stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#888888" strokeOpacity={0.1} />
            <XAxis 
              type="number"
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'currentColor' }}
              className="text-slate-600 dark:text-slate-400"
            />
            <YAxis 
              dataKey="source" 
              type="category"
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'currentColor' }}
              className="text-slate-600 dark:text-slate-400"
              width={80}
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
              formatter={(value) => [`${value} days`, 'Avg. Velocity']}
            />
            <Bar 
              dataKey="avg_days" 
              fill="url(#colorVelocity)" 
              radius={[0, 6, 6, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
