
import React from 'react';
import { Search, Camera as CamIcon, LayoutGrid } from 'lucide-react';
import { Camera, Stats } from '../types';

interface SidebarLeftProps {
  stats: Stats;
  cameras: Camera[];
  selectedCameraId: string | null;
  onSelectCamera: (id: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({
  stats,
  cameras,
  selectedCameraId,
  onSelectCamera,
  searchTerm,
  onSearchChange
}) => {
  return (
    <aside className="w-72 bg-[#111827] border-r border-slate-800 flex flex-col p-4 gap-4 overflow-y-auto z-40">
      <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
        <LayoutGrid className="w-4 h-4" /> Dispositivos
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1e293b] p-2 rounded flex flex-col border-b-2 border-emerald-500/30">
          <span className="text-sm font-bold text-emerald-400">{stats.active}</span>
          <span className="text-[9px] text-slate-500 uppercase">Ativos</span>
        </div>
        <div className="bg-[#1e293b] p-2 rounded flex flex-col border-b-2 border-rose-500/30">
          <span className="text-sm font-bold text-rose-400">{stats.offline}</span>
          <span className="text-[9px] text-slate-500 uppercase">Offline</span>
        </div>
        <div className="bg-[#1e293b] p-2 rounded flex flex-col border-b-2 border-amber-500/30">
          <span className="text-sm font-bold text-amber-400">{stats.maintenance}</span>
          <span className="text-[9px] text-slate-500 uppercase">Manut.</span>
        </div>
        <div className="bg-[#1e293b] p-2 rounded flex flex-col border-b-2 border-blue-500/30">
          <span className="text-sm font-bold text-blue-400">{stats.suggested}</span>
          <span className="text-[9px] text-slate-500 uppercase">Sugeridas</span>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text"
          placeholder="Buscar câmera..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#0a0f1a] border border-slate-700 rounded-md py-2 pl-10 pr-4 text-xs focus:outline-none"
        />
      </div>

      <div className="flex-1 space-y-2">
        {cameras.map(cam => (
          <button
            key={cam.id}
            onClick={() => onSelectCamera(cam.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              selectedCameraId === cam.id 
              ? 'bg-[#1e293b] border-blue-500/50' 
              : 'bg-[#161f32] border-transparent hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${
                cam.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                cam.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-500' : 
                cam.status === 'Offline' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                <CamIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-medium text-slate-200 truncate">{cam.name}</p>
                <p className="text-[10px] text-slate-500 opacity-70 italic truncate">
                  {cam.status === 'Active' ? 'Operacional' : cam.status === 'Maintenance' ? 'Reparo' : cam.status === 'Offline' ? 'Fora de rede' : 'Ponto sugerido'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SidebarLeft;
