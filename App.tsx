
import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import MapView from './components/MapView';
import SidebarRight from './components/SidebarRight';
import { Camera, Area } from './types';

const INITIAL_CAMERAS: Camera[] = [
  {
    id: '1768562750683',
    name: 'Câmera Entrada Sul',
    status: 'Active',
    x: 25,
    y: 90,
    rotation: 0,
    fovAngle: 60,
    reach: 150,
    iconSize: 40,
    observations: '',
    installDate: '15/01/2026',
    lastMaintenance: null,
  }
];

const App: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(100);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showAreas, setShowAreas] = useState(true);
  const [showFOVs, setShowFOVs] = useState(true);
  const [mapImage, setMapImage] = useState<string | null>(localStorage.getItem('security_map_image'));

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
    setCameras(prev => prev.map(c => c.id === updatedCamera.id ? updatedCamera : c));
  }, []);

  const deleteCamera = useCallback((id: string) => {
    setSelectedCameraId(null);
    setCameras(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateArea = useCallback((updatedArea: Area) => {
    setAreas(prev => prev.map(a => a.id === updatedArea.id ? updatedArea : a));
  }, []);

  const deleteArea = useCallback((id: string) => {
    // Primeiro limpamos a seleção para o painel lateral desmontar imediatamente
    setSelectedAreaId(null);
    // Depois removemos do estado
    setAreas(prev => prev.filter(a => a.id !== id));
  }, []);

  const addCamera = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newCam: Camera = {
      id: newId,
      name: `Nova Câmera ${newId}`,
      status: 'Active',
      x: 50,
      y: 50,
      rotation: 0,
      fovAngle: 45,
      reach: 100,
      iconSize: 40,
      observations: '',
      installDate: new Date().toLocaleDateString('pt-BR'),
      lastMaintenance: null,
    };
    setCameras(prev => [...prev, newCam]);
    setSelectedAreaId(null);
    setSelectedCameraId(newId);
  }, []);

  const onAddArea = useCallback((newArea: Area) => {
    setAreas(prev => [...prev, { ...newArea, color: '#3b82f6' }]);
    setSelectedCameraId(null);
    setSelectedAreaId(newArea.id);
  }, []);

  const handleSelectCamera = (id: string) => {
    setSelectedAreaId(null);
    setSelectedCameraId(id);
  };

  const handleSelectArea = (id: string) => {
    setSelectedCameraId(null);
    setSelectedAreaId(id);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0f1a] text-slate-300">
      <Header onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      
      <main className="flex flex-1 overflow-hidden relative">
        <div 
          className={`transition-all duration-300 ease-in-out h-full overflow-hidden ${isSidebarVisible ? 'w-72 border-r border-slate-800' : 'w-0'}`}
        >
          <SidebarLeft 
            stats={stats}
            cameras={filteredCameras}
            selectedCameraId={selectedCameraId}
            onSelectCamera={handleSelectCamera}
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
            onSelectCamera={handleSelectCamera}
            onSelectArea={handleSelectArea}
            onUpdateCamera={updateCamera}
            onAddArea={onAddArea}
            zoom={zoom}
            onZoomChange={setZoom}
            onAddCamera={addCamera}
            showAreas={showAreas}
            onToggleAreas={() => setShowAreas(!showAreas)}
            showFOVs={showFOVs}
            onToggleFOVs={() => setShowFOVs(!showFOVs)}
          />
        </div>

        {(selectedCamera || selectedArea) && (
          <SidebarRight 
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
