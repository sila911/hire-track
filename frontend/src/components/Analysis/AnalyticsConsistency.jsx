import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../axios';

export default function AnalyticsConsistency() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/analytics/consistency');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch consistency analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-xl h-full">
      <h3 className="text-xl font-black mb-6 text-slate-800 dark:text-white">Weekly Application Habits</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-bold">
        Consistency is key. Your submission output over the last 12 weeks.
      </p>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.1} />
            <XAxis 
              dataKey="week" 
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
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
              }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              name="Applications"
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHabits)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
