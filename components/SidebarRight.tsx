
import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Maximize, Compass, Zap, Trash2, Box, Palette, AlertTriangle } from 'lucide-react';
import { Camera, Area, CameraStatus } from '../types';

interface SidebarRightProps {
  camera: Camera | null;
  area: Area | null;
  onUpdateCamera: (cam: Camera) => void;
  onDeleteCamera: (id: string) => void;
  onUpdateArea: (area: Area) => void;
  onDeleteArea: (id: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Amarelo', value: '#f59e0b' },
  { name: 'Vermelho', value: '#f43f5e' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Ciano', value: '#06b6d4' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Cinza', value: '#64748b' },
];

const SidebarRight: React.FC<SidebarRightProps> = ({
  camera,
  area,
  onUpdateCamera,
  onDeleteCamera,
  onUpdateArea,
  onDeleteArea,
  onClose
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Resetar o estado de confirmação se mudar o item selecionado
  useEffect(() => {
    setShowConfirm(false);
  }, [camera?.id, area?.id]);

  // Resetar o estado de confirmação após 3 segundos por segurança
  useEffect(() => {
    if (showConfirm) {
      const timer = setTimeout(() => setShowConfirm(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfirm]);

  if (!camera && !area) return null;

  const isCamera = !!camera;
  const currentItem = isCamera ? camera : area;
  const title = isCamera ? 'Configurar Câmera' : 'Configurar Setor';

  const handleExcluirClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    // Executa a exclusão real usando o ID capturado do item atual
    if (isCamera && camera) {
      onDeleteCamera(camera.id);
    } else if (!isCamera && area) {
      onDeleteArea(area.id);
    }
  };

  const statusColors: Record<string, string> = {
    Active: 'bg-emerald-500',
    Maintenance: 'bg-amber-500',
    Offline: 'bg-rose-500',
    Suggested: 'bg-blue-500'
  };

  return (
    <aside className="w-80 bg-[#111827] border-l border-slate-800 flex flex-col p-6 gap-6 overflow-y-auto z-40 animate-in slide-in-from-right duration-300 shadow-[-20px_0_60px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-black text-slate-100 flex items-center gap-2 uppercase tracking-[0.2em]">
          {isCamera && camera ? (
            <div className={`w-2.5 h-2.5 rounded-full ${statusColors[camera.status]} shadow-lg`} /> 
          ) : (
            <Box className="w-4 h-4 text-blue-400" />
          )}
          {title}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-200 transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome Identificador</label>
          <input 
            type="text"
            value={currentItem?.name || ''}
            onChange={(e) => {
              if (isCamera && camera) onUpdateCamera({ ...camera, name: e.target.value });
              else if (!isCamera && area) onUpdateArea({ ...area, name: e.target.value });
            }}
            className="w-full bg-[#0a0f1a] border border-slate-700/50 rounded-xl p-3.5 text-xs text-slate-100 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-600 font-medium"
            placeholder="Digite o nome..."
          />
        </div>

        {isCamera && camera && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status de Conexão</label>
            <select 
              value={camera.status}
              onChange={(e) => onUpdateCamera({ ...camera, status: e.target.value as CameraStatus })}
              className="w-full bg-[#0a0f1a] border border-slate-700/50 rounded-xl p-3.5 text-xs text-slate-100 outline-none cursor-pointer hover:border-slate-600 transition-colors appearance-none font-medium"
            >
              <option value="Active">Ativo / Transmitindo</option>
              <option value="Maintenance">Sob Manutenção</option>
              <option value="Offline">Offline / Sem Sinal</option>
              <option value="Suggested">Sugestão de Instalação</option>
            </select>
          </div>
        )}

        {!isCamera && area && (
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" /> Paleta do Setor
            </label>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() => onUpdateArea({ ...area, color: color.value })}
                  style={{ backgroundColor: color.value }}
                  className={`h-10 rounded-xl transition-all border-2 ${area.color === color.value ? 'border-white scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isCamera && camera && (
        <div className="space-y-6 pt-4 border-t border-slate-800/50">
          <SliderField label="Tamanho" icon={<Maximize className="w-3.5 h-3.5" />} value={camera.iconSize} min={20} max={100} unit="px" onChange={(v) => onUpdateCamera({...camera, iconSize: v})} />
          <SliderField label="Rotação" icon={<RotateCcw className="w-3.5 h-3.5" />} value={camera.rotation} min={0} max={360} unit="°" onChange={(v) => onUpdateCamera({...camera, rotation: v})} />
          <SliderField label="Lente" icon={<Compass className="w-3.5 h-3.5" />} value={camera.fovAngle} min={10} max={180} unit="°" onChange={(v) => onUpdateCamera({...camera, fovAngle: v})} />
          <SliderField label="Alcance" icon={<Zap className="w-3.5 h-3.5" />} value={camera.reach} min={10} max={500} unit="px" onChange={(v) => onUpdateCamera({...camera, reach: v})} />
        </div>
      )}

      <div className="mt-auto pt-8 flex flex-col gap-3">
        <button 
          type="button"
          onClick={handleExcluirClick}
          className={`w-full py-4 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 transition-all border active:scale-95 uppercase tracking-widest ${
            showConfirm 
              ? 'bg-rose-600 border-white text-white shadow-lg animate-pulse' 
              : 'bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border-rose-500/30'
          }`}
        >
          {showConfirm ? <AlertTriangle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
          {showConfirm ? 'CONFIRMAR EXCLUSÃO?' : 'EXCLUIR ITEM'}
        </button>
        <button 
          type="button"
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95 uppercase tracking-widest"
        >
          <Save className="w-4 h-4" /> CONFIRMAR
        </button>
      </div>
    </aside>
  );
};

interface SliderFieldProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (val: number) => void;
}

const SliderField: React.FC<SliderFieldProps> = ({ label, icon, value, min, max, unit, onChange }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="text-slate-500">{icon}</div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[10px] font-black text-slate-100 bg-slate-800 px-2.5 py-1 rounded-lg tabular-nums border border-slate-700/50">{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
    />
  </div>
);

export default SidebarRight;
