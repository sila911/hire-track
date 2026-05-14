const statusColors = {
  Applied: 'border-blue-500 bg-white',
  Interviewing: 'border-amber-500 bg-white',
  Accepted: 'border-green-500 bg-white',
  Rejected: 'border-red-500 bg-white',
};

export default function ApplicationCard({ application, onStatusChange }) {
  return (
    <div className={`p-4 mb-4 border-l-4 rounded shadow-sm ${statusColors[application.status] || 'border-gray-500 bg-white'}`}>
      <h3 className="text-lg font-semibold">{application.company}</h3>
      <p className="text-gray-700 font-medium">{application.role}</p>
      <p className="text-sm text-gray-500 mt-2">Applied: {new Date(application.applied_at).toLocaleDateString()}</p>
      
      <div className="mt-4">
        <select 
          value={application.status} 
          onChange={(e) => onStatusChange(application.id, e.target.value)}
          className="w-full p-2 text-sm border rounded bg-gray-50 cursor-pointer"
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}
