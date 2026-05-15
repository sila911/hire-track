const KanbanBoard = ({ applications, onStatusChange }) => {
  const statuses = ['Applied', 'Interviewing', 'Accepted', 'Rejected'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'border-blue-500';
      case 'Interviewing': return 'border-amber-500';
      case 'Accepted': return 'border-green-500';
      case 'Rejected': return 'border-red-500';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50 min-h-screen">
      {statuses.map((status) => (
        <div key={status} className="bg-gray-100 rounded-xl p-4 shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-gray-700">{status}</h2>
          
          <div className="space-y-4">
            {applications
              .filter((app) => app.status === status)
              .map((app) => (
                <div key={app.id} className={`bg-white p-4 rounded-lg shadow border-l-4 ${getStatusColor(status)}`}>
                  <h3 className="font-bold text-gray-900">{app.company}</h3>
                  <p className="text-sm text-gray-600 mb-3">{app.role}</p>
                  
                  <select 
                    value={app.status}
                    onChange={(e) => onStatusChange(app.id, e.target.value)}
                    className="w-full text-xs border rounded p-1 bg-gray-50"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;