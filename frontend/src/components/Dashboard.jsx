import { useEffect, useState } from 'react';
import api from '../axios';
import ApplicationCard from './ApplicationCard';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await api.get('/applications');
        if (!cancelled) setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus });
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/80"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
      {statuses.map((status, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
          key={status} 
          className="flex flex-col rounded-[2rem] backdrop-blur-xl bg-slate-900/40 border border-white/20 p-5 shadow-2xl relative overflow-hidden min-h-[65vh]"
        >
          {/* Subtle light refraction base */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
          {/* Light-catcher top edge */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          <div className="mb-6 relative z-10 flex items-center justify-between px-1">
            <h2 className="text-2xl font-black tracking-tight text-white/95">{status}</h2>
            <div className="bg-white/10 text-white/90 text-sm font-bold px-3 py-1 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
              {applications.filter(app => app.status === status).length}
            </div>
          </div>
          
          <div className="flex-1 space-y-4 relative z-10 overflow-y-auto pb-4 pr-1 custom-scrollbar">
            {applications
              .filter(app => app.status === status)
              .map(app => (
                <ApplicationCard 
                  key={app.id} 
                  application={app} 
                  onStatusChange={handleStatusChange} 
                />
              ))
            }
            {applications.filter(app => app.status === status).length === 0 && (
              <div className="flex items-center justify-center h-32 rounded-2xl border border-dashed border-white/20 bg-white/5">
                <p className="text-white/40 text-sm font-semibold tracking-wide">No applications</p>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}