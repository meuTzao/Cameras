
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Plus, Camera as CamIcon, BoxSelect, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { Camera, Area } from '../types';

interface MapViewProps {
  cameras: Camera[];
  areas: Area[];
  mapImage: string | null;
  onMapUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCameraId: string | null;
  selectedAreaId: string | null;
  onSelectCamera: (id: string) => void;
  onSelectArea: (id: string) => void;
  onUpdateCamera: (cam: Camera) => void;
  onAddArea: (area: Area) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onAddCamera: () => void;
  showAreas: boolean;
  onToggleAreas: () => void;
  showFOVs: boolean;
  onToggleFOVs: () => void;
}

const MapView: React.FC<MapViewProps> = ({
  cameras,
  areas,
  mapImage,
  onMapUpload,
  selectedCameraId,
  selectedAreaId,
  onSelectCamera,
  onSelectArea,
  onUpdateCamera,
  onAddArea,
  zoom,
  onZoomChange,
  onAddCamera,
  showAreas,
  onToggleAreas,
  showFOVs,
  onToggleFOVs
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDraggingCam, setIsDraggingCam] = useState(false);
  const [isMappingMode, setIsMappingMode] = useState(false);
  const [mappingStart, setMappingStart] = useState<{ x: number, y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  useEffect(() => {
    if (mapImage) {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
      img.src = mapImage;
    }
  }, [mapImage]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -25 : 25;
      onZoomChange(Math.max(25, Math.min(1000, zoom + delta)));
    }
  }, [zoom, onZoomChange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500 border-emerald-300 ring-emerald-500/30';
      case 'Maintenance': return 'bg-amber-500 border-amber-300 ring-amber-500/30';
      case 'Offline': return 'bg-rose-500 border-rose-300 ring-rose-500/30';
      case 'Suggested': return 'bg-blue-500 border-blue-300 ring-blue-500/30';
      default: return 'bg-slate-500 border-slate-300 ring-slate-500/30';
    }
  };

  const getConeColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Maintenance': return '#f59e0b';
      case 'Offline': return '#f43f5e';
      case 'Suggested': return '#3b82f6';
      default: return '#94a3b8';
    }
  };

  const getCoords = (e: React.MouseEvent) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMappingMode) {
      const { x, y } = getCoords(e);
      setMappingStart({ x, y });
      setCurrentRect({ x, y, w: 0, h: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getCoords(e);

    if (isMappingMode && mappingStart) {
      setCurrentRect({
        x: Math.min(x, mappingStart.x),
        y: Math.min(y, mappingStart.y),
        w: Math.abs(x - mappingStart.x),
        h: Math.abs(y - mappingStart.y)
      });
    }

    if (isDraggingCam && selectedCameraId) {
      const cam = cameras.find(c => c.id === selectedCameraId);
      if (cam) {
        onUpdateCamera({
          ...cam,
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y))
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (isMappingMode && currentRect && currentRect.w > 0.5 && currentRect.h > 0.5) {
      onAddArea({
        id: Math.random().toString(36).substr(2, 9),
        name: `Novo Setor ${areas.length + 1}`,
        x: currentRect.x,
        y: currentRect.y,
        width: currentRect.w,
        height: currentRect.h,
        type: 'custom',
        color: '#3b82f6'
      });
      setIsMappingMode(false);
    }
    setMappingStart(null);
    setCurrentRect(null);
    setIsDraggingCam(false);
  };

  const handleCameraDown = (e: React.MouseEvent, cam: Camera) => {
    e.stopPropagation();
    onSelectCamera(cam.id);
    setIsDraggingCam(true);
  };

  const handleAreaClick = (e: React.MouseEvent, area: Area) => {
    e.stopPropagation();
    onSelectArea(area.id);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isMappingMode, currentRect, areas.length]);

  return (
    <div 
      className="w-full h-full relative overflow-auto bg-[#0a0f1a] flex flex-col items-center p-8"
      onWheel={handleWheel}
      ref={containerRef}
    >
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onMapUpload} />

      {/* Control Toolbar Flutuante */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full flex justify-center">
        <div className="flex items-center gap-2 pointer-events-auto bg-[#111827]/95 backdrop-blur-xl border border-slate-700/50 p-2 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-1 border-r border-slate-700/50 pr-2 mr-1">
            <button onClick={() => onZoomChange(Math.max(25, zoom - 25))} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"><ZoomOut className="w-5 h-5" /></button>
            <span className="px-3 text-[11px] font-black text-slate-100 min-w-[55px] text-center select-none tabular-nums">{zoom}%</span>
            <button onClick={() => onZoomChange(Math.min(1000, zoom + 25))} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"><ZoomIn className="w-5 h-5" /></button>
          </div>
          
          <div className="flex items-center gap-1 border-r border-slate-700/50 pr-2 mr-1">
            <button 
              onClick={onToggleAreas}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${showAreas ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'}`}
              title="Exibir/Ocultar Setores"
            >
              {showAreas ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase hidden lg:inline">Setores</span>
            </button>
            <button 
              onClick={onToggleFOVs}
              className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${showFOVs ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'}`}
              title="Exibir/Ocultar Campo de Visão"
            >
              {showFOVs ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase hidden lg:inline">Visão</span>
            </button>
          </div>

          <button 
            onClick={() => setIsMappingMode(!isMappingMode)} 
            className={`p-2.5 px-4 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${
              isMappingMode ? 'bg-amber-500 text-slate-900 shadow-xl animate-pulse' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BoxSelect className="w-4 h-4" /> {isMappingMode ? 'CANCELAR' : 'MAPEAR'}
          </button>
          <button onClick={onAddCamera} className="p-2.5 px-4 rounded-xl text-[10px] font-black bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition-all shadow-xl">
            <Plus className="w-4 h-4" /> CÂMERA
          </button>
        </div>
      </div>

      {/* Área do Mapa */}
      <div 
        className={`relative min-w-full min-h-full flex items-center justify-center ${isMappingMode ? 'cursor-crosshair' : 'cursor-default'}`}
        onMouseMove={handleMouseMove} 
        onMouseDown={handleMouseDown}
      >
        {mapImage ? (
          <div 
            ref={mapRef} 
            style={{ 
              width: `${zoom}%`,
              backgroundImage: `url(${mapImage})`, 
              backgroundSize: '100% 100%', 
              aspectRatio: `${aspectRatio}`, 
              position: 'relative',
              transition: 'width 0.1s ease-out'
            }} 
            className="shadow-2xl ring-1 ring-white/10 select-none bg-slate-900"
          >
            {showAreas && areas.map(area => (
              <div 
                key={area.id} 
                onClick={(e) => handleAreaClick(e, area)} 
                className={`absolute transition-all cursor-pointer border-dashed flex items-center justify-center ${selectedAreaId === area.id ? 'border-2 z-20 scale-[1.005]' : 'border hover:bg-opacity-40'}`}
                style={{
                  left: `${area.x}%`, 
                  top: `${area.y}%`, 
                  width: `${area.width}%`, 
                  height: `${area.height}%`,
                  backgroundColor: `${area.color}22`,
                  borderColor: area.color,
                  ...(selectedAreaId === area.id ? { boxShadow: `0 0 50px ${area.color}33`, backgroundColor: `${area.color}44` } : {})
                }}
              >
                <span 
                  className={`text-[12px] font-black uppercase pointer-events-none drop-shadow-2xl text-center px-2 transition-all ${selectedAreaId === area.id ? 'scale-110 opacity-100' : 'opacity-70'}`}
                  style={{ color: area.color, textShadow: '0 2px 10px rgba(0,0,0,1)' }}
                >
                  {area.name}
                </span>
              </div>
            ))}

            {currentRect && (
              <div style={{ left: `${currentRect.x}%`, top: `${currentRect.y}%`, width: `${currentRect.w}%`, height: `${currentRect.h}%` }} className="absolute border-2 border-amber-400 bg-amber-400/20 border-dashed z-50 pointer-events-none" />
            )}

            {cameras.map(cam => (
              <div key={cam.id} style={{ left: `${cam.x}%`, top: `${cam.y}%`, transform: 'translate(-50%, -50%)' }} className={`absolute z-30 transition-transform ${selectedCameraId === cam.id ? 'z-40' : ''}`}>
                {showFOVs && (
                  <svg className="absolute pointer-events-none opacity-40 transition-all" style={{ left: '50%', top: '50%', width: cam.reach * 2, height: cam.reach * 2, transform: `translate(-50%, -50%) rotate(${cam.rotation - 90}deg)`, overflow: 'visible' }}>
                    <path d={`M ${cam.reach} ${cam.reach} L ${cam.reach + cam.reach * Math.cos((-cam.fovAngle / 2) * Math.PI / 180)} ${cam.reach + cam.reach * Math.sin((-cam.fovAngle / 2) * Math.PI / 180)} A ${cam.reach} ${cam.reach} 0 0 1 ${cam.reach + cam.reach * Math.cos((cam.fovAngle / 2) * Math.PI / 180)} ${cam.reach + cam.reach * Math.sin((cam.fovAngle / 2) * Math.PI / 180)} Z`} fill={getConeColor(cam.status)} />
                  </svg>
                )}
                <div 
                  onMouseDown={(e) => handleCameraDown(e, cam)} 
                  style={{ width: `${cam.iconSize}px`, height: `${cam.iconSize}px` }} 
                  className={`rounded-full flex items-center justify-center cursor-move transition-all border-2 shadow-2xl ${getStatusColor(cam.status)} ${selectedCameraId === cam.id ? 'ring-4 border-white scale-125' : 'hover:scale-110'}`}
                >
                  <CamIcon className="w-1/2 h-1/2 text-white" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl p-32 text-center max-w-xl bg-[#111827]/30 backdrop-blur-md">
            <div className="bg-slate-800 p-10 rounded-full mb-8 shadow-inner ring-1 ring-white/5"><ImageIcon className="w-16 h-16 text-slate-500" /></div>
            <h3 className="text-3xl font-black text-slate-100 mb-4 tracking-tighter uppercase">Planta não carregada</h3>
            <p className="text-slate-500 text-sm mb-12 leading-relaxed">Selecione o arquivo da planta baixa para iniciar o projeto.</p>
            <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black transition-all flex items-center gap-4 shadow-2xl shadow-blue-600/30 active:scale-95"><Upload className="w-6 h-6" /> CARREGAR MAPA</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
