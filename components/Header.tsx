
import React from 'react';
import { Shield, Settings, Circle, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-14 bg-[#111827] border-b border-slate-800 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 transition-colors"
          title="Alternar Barra Lateral"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
          <div className="bg-[#1e293b] p-1.5 rounded-md border border-slate-700">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">SecurityCam Manager</h1>
            <p className="text-[10px] text-slate-500 font-medium">Gestão Inteligente de CFTV</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sistema Operacional</span>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
