import { useEffect, useState } from 'react';
import api from '../axios';
import ApplicationCard from './ApplicationCard';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];
  
  const statusColors = {
    Applied: 'bg-blue-50',
    Interviewing: 'bg-amber-50',
    Accepted: 'bg-green-50',
    Rejected: 'bg-red-50',
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
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
    return <div className="p-8 text-center text-gray-600">Loading applications...</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Job Applications Kanban Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map(status => (
          <div key={status} className={`p-4 rounded-lg shadow-sm min-h-[600px] border border-gray-200 ${statusColors[status]}`}>
            <h2 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">{status}</h2>
            <div className="space-y-4">
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
                <p className="text-gray-400 text-sm italic">No applications in this column.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
