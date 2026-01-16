
import React from 'react';
import { Shield, FilePlus, FolderOpen, ChevronRight, Eye } from 'lucide-react';

interface WelcomeScreenProps {
  onNew: () => void;
  onOpen: () => void;
  onViewOnly: () => void;
  children?: React.ReactNode;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNew, onOpen, onViewOnly, children }) => {
  return (
    <div className="fixed inset-0 bg-[#0a0f1a] flex flex-col items-center justify-center p-6 z-[100] overflow-hidden">
      {children}
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />

      <div className="relative flex flex-col items-center max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl mb-4">
            <Shield className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            SecurityCam <span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-md mx-auto">
            Plataforma avançada para planejamento e gestão de sistemas de videomonitoramento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <button 
            onClick={onNew}
            className="group flex flex-col items-start p-8 bg-[#111827] border border-slate-800 rounded-[2rem] text-left hover:border-blue-500/50 hover:bg-[#161f32] transition-all duration-500 shadow-xl"
          >
            <div className="p-4 bg-blue-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <FilePlus className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              Novo Projeto <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Inicie do zero e posicione os dispositivos no mapa.
            </p>
          </button>

          <button 
            onClick={onOpen}
            className="group flex flex-col items-start p-8 bg-[#111827] border border-slate-800 rounded-[2rem] text-left hover:border-emerald-500/50 hover:bg-[#161f32] transition-all duration-500 shadow-xl"
          >
            <div className="p-4 bg-emerald-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              Abrir Edição <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Carregue um arquivo para continuar alterando.
            </p>
          </button>

          <button 
            onClick={onViewOnly}
            className="group flex flex-col items-start p-8 bg-[#111827] border border-slate-800 rounded-[2rem] text-left hover:border-amber-500/50 hover:bg-[#161f32] transition-all duration-500 shadow-xl"
          >
            <div className="p-4 bg-amber-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              Apenas Visualizar <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Explore o mapa e informações sem risco de alterações.
            </p>
          </button>
        </div>

        <div className="pt-8 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          v2.5 Enterprise Edition
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
