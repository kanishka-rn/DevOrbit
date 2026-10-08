import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layers, Cuboid, Wand2, BarChart2, Download, Settings } from 'lucide-react';
import { useWorldStore } from '../stores/useWorldStore';

export const AppLayout = () => {
  const { activePanel, setActivePanel, status } = useWorldStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isWorkspace = status === 'ready' || status === 'processing';
  const isEvaluation = location.pathname === '/evaluation';

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-6 shrink-0 bg-neutral-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <Cuboid className="w-6 h-6 text-emerald-500" />
          <h1 className="text-sm font-bold tracking-widest text-neutral-200 cursor-pointer" onClick={() => navigate('/')}>SPACEMIND</h1>
        </div>
        
        {isWorkspace && !isEvaluation && (
          <nav className="flex items-center gap-1">
            <NavButton 
              icon={<Layers size={16} />} 
              label="Reconstruction" 
              active={activePanel === 'reconstruction'} 
              onClick={() => setActivePanel('reconstruction')} 
            />
            <NavButton 
              icon={<Wand2 size={16} />} 
              label="Completion" 
              active={activePanel === 'completion'} 
              onClick={() => setActivePanel('completion')} 
            />
            <NavButton 
              icon={<Settings size={16} />} 
              label="Appearance" 
              active={activePanel === 'appearance'} 
              onClick={() => setActivePanel('appearance')} 
            />
            <NavButton 
              icon={<Download size={16} />} 
              label="Export" 
              active={activePanel === 'export'} 
              onClick={() => setActivePanel('export')} 
            />
            <button 
              onClick={() => navigate('/evaluation')}
              className="ml-4 px-3 py-1.5 text-xs font-bold bg-neutral-800 border border-neutral-700 text-emerald-400 hover:bg-neutral-700 hover:text-emerald-300 rounded-md transition-colors flex items-center gap-2"
            >
              <BarChart2 size={16} />
              BENCHMARK
            </button>
          </nav>
        )}
      </header>
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${active ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'}`}
  >
    {icon}
    {label}
  </button>
);
