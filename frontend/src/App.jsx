import { useState, useEffect } from 'react';
import api from './api/axios';
import KanbanBoard from './components/KanbanBoard';

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Laravel
  useEffect(() => {
    api.get('/applications')
      .then(res => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching apps", err));
  }, []);

  // Update status when dropdown changes
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus });
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading HireTrack...</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-blue-600">HireTrack</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          + Add Application
        </button>
      </header>
      
      <KanbanBoard 
        applications={applications} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
}

export default App;