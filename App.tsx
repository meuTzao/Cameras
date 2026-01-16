
import React, { useState, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import MapView from './components/MapView';
import SidebarRight from './components/SidebarRight';
import WelcomeScreen from './components/WelcomeScreen';
import { Camera, Area } from './types';

const App: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(100);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showAreas, setShowAreas] = useState(true);
  const [showFOVs, setShowFOVs] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [mapImage, setMapImage] = useState<string | null>(localStorage.getItem('security_map_image'));
  const [isStarted, setIsStarted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCamera = useMemo(() => 
    cameras.find(c => c.id === selectedCameraId) || null,
    [cameras, selectedCameraId]
  );

  const selectedArea = useMemo(() => 
    areas.find(a => a.id === selectedAreaId) || null,
    [areas, selectedAreaId]
  );

  const stats = useMemo(() => ({
    total: cameras.length,
    active: cameras.filter(c => c.status === 'Active').length,
    maintenance: cameras.filter(c => c.status === 'Maintenance').length,
    offline: cameras.filter(c => c.status === 'Offline').length,
    suggested: cameras.filter(c => c.status === 'Suggested').length,
  }), [cameras]);

  const filteredCameras = useMemo(() => 
    cameras.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [cameras, searchTerm]
  );

  const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setMapImage(base64String);
        localStorage.setItem('security_map_image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCamera = useCallback((updatedCamera: Camera) => {
    if (isLocked) return;
    setCameras(prev => prev.map(c => c.id === updatedCamera.id ? updatedCamera : c));
  }, [isLocked]);

  const deleteCamera = useCallback((id: string) => {
    if (isLocked) return;
    setSelectedCameraId(null);
    setCameras(prev => prev.filter(c => c.id !== id));
  }, [isLocked]);

  const updateArea = useCallback((updatedArea: Area) => {
    if (isLocked) return;
    setAreas(prev => prev.map(a => a.id === updatedArea.id ? updatedArea : a));
  }, [isLocked]);

  const deleteArea = useCallback((id: string) => {
    if (isLocked) return;
    setSelectedAreaId(null);
    setAreas(prev => prev.filter(a => a.id !== id));
  }, [isLocked]);

  const addCameraAt = useCallback((x: number, y: number) => {
    if (isLocked) return;
    const newId = Math.random().toString(36).substr(2, 9);
    const newCam: Camera = {
      id: newId,
      name: `Câmera ${newId.toUpperCase().slice(0, 4)}`,
      status: 'Active',
      x,
      y,
      rotation: 0,
      fovAngle: 60,
      reach: 150,
      iconSize: 40,
      observations: '',
      installDate: new Date().toLocaleDateString('pt-BR'),
      lastMaintenance: null,
    };
    setCameras(prev => [...prev, newCam]);
    setSelectedAreaId(null);
    setSelectedCameraId(newId);
    setIsPlacementMode(false);
  }, [isLocked]);

  const onAddArea = useCallback((newArea: Area) => {
    if (isLocked) return;
    setAreas(prev => [...prev, { ...newArea, color: '#3b82f6' }]);
    setSelectedCameraId(null);
    setSelectedAreaId(newArea.id);
  }, [isLocked]);

  const handleExport = () => {
    const data = {
      cameras,
      areas,
      mapImage,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-project-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);
          if (data.cameras) setCameras(data.cameras);
          if (data.areas) setAreas(data.areas);
          if (data.mapImage) {
            setMapImage(data.mapImage);
            localStorage.setItem('security_map_image', data.mapImage);
          }
          setIsStarted(true);
        } catch (error) {
          alert('Erro ao carregar arquivo. Certifique-se de que é um JSON válido do SecurityCam.');
        }
      };
      reader.readAsText(file);
    }
  };

  const startNewMapping = () => {
    setCameras([]);
    setAreas([]);
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <WelcomeScreen 
        onNew={startNewMapping} 
        onOpen={() => fileInputRef.current?.click()} 
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".json" 
          onChange={handleImport} 
        />
      </WelcomeScreen>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0f1a] text-slate-300">
      <Header 
        onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} 
        onExport={handleExport}
        onReset={() => setIsStarted(false)}
      />
      
      <main className="flex flex-1 overflow-hidden relative">
        <div 
          className={`transition-all duration-300 ease-in-out h-full overflow-hidden ${isSidebarVisible ? 'w-72 border-r border-slate-800' : 'w-0'}`}
        >
          <SidebarLeft 
            stats={stats}
            cameras={filteredCameras}
            selectedCameraId={selectedCameraId}
            onSelectCamera={(id) => { setSelectedAreaId(null); setSelectedCameraId(id); }}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="flex-1 relative bg-[#0d1424] overflow-hidden">
          <MapView 
            cameras={cameras}
            areas={areas}
            mapImage={mapImage}
            onMapUpload={handleMapUpload}
            selectedCameraId={selectedCameraId}
            selectedAreaId={selectedAreaId}
            onSelectCamera={(id) => { setSelectedAreaId(null); setSelectedCameraId(id); }}
            onSelectArea={(id) => { setSelectedCameraId(null); setSelectedAreaId(id); }}
            onUpdateCamera={updateCamera}
            onAddArea={onAddArea}
            zoom={zoom}
            onZoomChange={setZoom}
            onAddCameraAt={addCameraAt}
            showAreas={showAreas}
            onToggleAreas={() => setShowAreas(!showAreas)}
            showFOVs={showFOVs}
            onToggleFOVs={() => setShowFOVs(!showFOVs)}
            isLocked={isLocked}
            onToggleLock={() => setIsLocked(!isLocked)}
            isPlacementMode={isPlacementMode}
            onTogglePlacementMode={() => setIsPlacementMode(!isPlacementMode)}
          />
        </div>

        {(selectedCamera || selectedArea) && (
          <SidebarRight 
            key={selectedCameraId || selectedAreaId || 'sidebar'}
            camera={selectedCamera}
            area={selectedArea}
            onUpdateCamera={updateCamera}
            onDeleteCamera={deleteCamera}
            onUpdateArea={updateArea}
            onDeleteArea={deleteArea}
            onClose={() => {
              setSelectedCameraId(null);
              setSelectedAreaId(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;
