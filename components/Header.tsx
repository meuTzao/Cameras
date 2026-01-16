
import React from 'react';
import { Shield, Settings, Circle, Menu, Download, Home, Eye } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onExport: () => void;
  onReset: () => void;
  isViewOnly?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onExport, onReset, isViewOnly }) => {
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
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">SecurityCam Manager</h1>
            <p className="text-[10px] text-slate-500 font-medium">Gestão Inteligente de CFTV</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {isViewOnly && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Modo de Leitura</span>
          </div>
        )}

        <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
          <button 
            onClick={onReset}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2"
            title="Início"
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase hidden md:inline">Início</span>
          </button>
          
          <button 
            onClick={onExport}
            className="p-2 bg-blue-600/10 hover:bg-blue-600 rounded-xl text-blue-500 hover:text-white transition-all flex items-center gap-2 border border-blue-500/20"
            title="Exportar Projeto"
          >
            <Download className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase hidden md:inline">Exportar</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase hidden lg:inline">Online</span>
        </div>
        
        <button className="text-slate-500 hover:text-slate-300 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
