
export type CameraStatus = 'Active' | 'Maintenance' | 'Offline' | 'Suggested';

export interface Camera {
  id: string;
  name: string;
  status: CameraStatus;
  x: number; // Porcentagem 0-100
  y: number; // Porcentagem 0-100
  rotation: number; // Graus 0-360
  fovAngle: number; // Graus 10-180
  reach: number; // Alcance visual
  iconSize: number; // Escala 20-100
  observations: string;
  installDate: string;
  lastMaintenance: string | null;
}

export interface Area {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  color: string; // Hex ou classe de cor
}

export interface Stats {
  total: number;
  active: number;
  maintenance: number;
  offline: number;
  suggested: number;
}
