import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-blue-600">HireTrack</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          + Add Application
        </button>
      </header>
      
      <Dashboard />
    </div>
  );
}

export default App;