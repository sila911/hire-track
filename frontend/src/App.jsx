import Dashboard from './components/Dashboard';
import AuthGate from './components/AuthGate';
import { useAuth } from './auth-context';

function AppShell() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 font-sans tracking-tight selection:bg-white/30">
      <header className="mb-8 rounded-[2rem] p-6 backdrop-blur-xl bg-slate-900/40 border border-white/20 flex flex-col md:flex-row justify-between items-center shadow-2xl relative z-10 overflow-hidden">
        {/* Soft inner glow refraction */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        {/* Light-catcher top edge */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-sm relative z-10">
          HireTrack
        </h1>

        <div className="mt-4 md:mt-0 relative z-10 flex flex-col md:flex-row gap-3 items-center">
          <button
            type="button"
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md px-5 py-3 rounded-2xl font-bold tracking-tight transition-all text-sm"
          >
            Log out
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md px-6 py-3 rounded-2xl font-bold tracking-tight transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-95 active:scale-90">
            + New Application
          </button>
        </div>
      </header>

      <Dashboard />
    </div>
  );
}

function App() {
  return (
    <AuthGate>
      <AppShell />
    </AuthGate>
  );
}

export default App;