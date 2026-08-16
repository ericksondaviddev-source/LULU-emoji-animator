import { SavedProject, LayerItem, KeyframeData, AspectRatioType, ThemeMode, BackgroundConfig, AudioTrack } from '../types';
import { EMOJI_LIBRARY } from '../constants/items';
import { exportCanvasAsPNG } from './videoRecorder';

const STORAGE_KEY = 'emoji_animator_saved_projects';

// Built-in starter templates for quick creation
export const PROJECT_TEMPLATES: Array<Omit<SavedProject, 'updatedAt' | 'createdAt'>> = [
  {
    id: 'template-classic-smile',
    name: 'Lulu Feliz Clásico',
    duration: 3,
    fps: 24,
    aspectRatio: '9:16',
    theme: 'dark',
    background: {
      id: 'sunset_glow',
      name: 'Atardecer Dorado',
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFA07A 50%, #FFD93D 100%)',
    },
    layers: [
      {
        id: 'layer-base-1',
        pieceId: 'base-classic-circle',
        name: 'Classic Yellow Face',
        category: 'bases',
        type: 'svg',
        content: EMOJI_LIBRARY[0].content,
        viewBox: EMOJI_LIBRARY[0].viewBox,
        geometryType: 'cylinder',
        depth: 22,
        x: 540,
        y: 860,
        z: 0,
        scaleX: 1.35,
        scaleY: 1.35,
        rotation: 0,
        opacity: 1,
        color: '#FACC15',
        zIndex: 1,
      },
      {
        id: 'layer-eyes-1',
        pieceId: 'eyes-capsule-stitch',
        name: 'Capsule Eyes',
        category: 'eyes',
        type: 'svg',
        content: EMOJI_LIBRARY[8].content,
        viewBox: EMOJI_LIBRARY[8].viewBox,
        geometryType: 'extrude',
        depth: 6,
        x: 540,
        y: 810,
        z: 4,
        scaleX: 1.15,
        scaleY: 1.15,
        rotation: 0,
        opacity: 1,
        color: '#1E293B',
        zIndex: 2,
      },
      {
        id: 'layer-mouth-1',
        pieceId: 'mouth-stitch-smile',
        name: 'Curved Smile',
        category: 'mouths',
        type: 'svg',
        content: EMOJI_LIBRARY[17].content,
        viewBox: EMOJI_LIBRARY[17].viewBox,
        geometryType: 'extrude',
        depth: 6,
        x: 540,
        y: 935,
        z: 4,
        scaleX: 1.0,
        scaleY: 1.0,
        rotation: 0,
        opacity: 1,
        color: '#1E293B',
        zIndex: 3,
      },
    ],
    keyframes: [
      {
        time: 0,
        transforms: {
          'layer-base-1': { x: 540, y: 860, z: 0, scaleX: 1.35, scaleY: 1.35, rotation: 0, opacity: 1 },
          'layer-eyes-1': { x: 540, y: 810, z: 4, scaleX: 1.15, scaleY: 1.15, rotation: 0, opacity: 1 },
          'layer-mouth-1': { x: 540, y: 935, z: 4, scaleX: 1.0, scaleY: 1.0, rotation: 0, opacity: 1 },
        },
      },
      {
        time: 0.5,
        transforms: {
          'layer-base-1': { x: 540, y: 810, z: 0, scaleX: 1.4, scaleY: 1.4, rotation: 3, opacity: 1 },
          'layer-eyes-1': { x: 540, y: 760, z: 4, scaleX: 1.15, scaleY: 1.15, rotation: 3, opacity: 1 },
          'layer-mouth-1': { x: 540, y: 885, z: 4, scaleX: 1.05, scaleY: 1.05, rotation: 3, opacity: 1 },
        },
      },
      {
        time: 1.0,
        transforms: {
          'layer-base-1': { x: 540, y: 860, z: 0, scaleX: 1.35, scaleY: 1.35, rotation: 0, opacity: 1 },
          'layer-eyes-1': { x: 540, y: 810, z: 4, scaleX: 1.15, scaleY: 1.15, rotation: 0, opacity: 1 },
          'layer-mouth-1': { x: 540, y: 935, z: 4, scaleX: 1.0, scaleY: 1.0, rotation: 0, opacity: 1 },
        },
      },
    ],
  },
  {
    id: 'template-cool-shades',
    name: 'Lulu Gafas Cool',
    duration: 4,
    fps: 24,
    aspectRatio: '9:16',
    theme: 'dark',
    background: {
      id: 'cyber_grid',
      name: 'Cyberpunk Neon',
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
    },
    layers: [
      {
        id: 'layer-base-cool',
        pieceId: 'base-classic-circle',
        name: 'Classic Face',
        category: 'bases',
        type: 'svg',
        content: EMOJI_LIBRARY[0].content,
        viewBox: EMOJI_LIBRARY[0].viewBox,
        geometryType: 'cylinder',
        depth: 22,
        x: 540,
        y: 860,
        z: 0,
        scaleX: 1.35,
        scaleY: 1.35,
        rotation: 0,
        opacity: 1,
        color: '#FACC15',
        zIndex: 1,
      },
      {
        id: 'layer-glasses',
        pieceId: 'extras-sunglasses',
        name: 'Cool Sunglasses',
        category: 'extras',
        type: 'svg',
        content: EMOJI_LIBRARY[24].content,
        viewBox: EMOJI_LIBRARY[24].viewBox,
        geometryType: 'extrude',
        depth: 8,
        x: 540,
        y: 810,
        z: 6,
        scaleX: 1.3,
        scaleY: 1.3,
        rotation: 0,
        opacity: 1,
        color: '#0F172A',
        zIndex: 2,
      },
      {
        id: 'layer-mouth-smirk',
        pieceId: 'mouth-stitch-cat',
        name: 'Cat Smirk',
        category: 'mouths',
        type: 'svg',
        content: EMOJI_LIBRARY[19].content,
        viewBox: EMOJI_LIBRARY[19].viewBox,
        geometryType: 'extrude',
        depth: 6,
        x: 540,
        y: 935,
        z: 4,
        scaleX: 1.0,
        scaleY: 1.0,
        rotation: 0,
        opacity: 1,
        color: '#1E293B',
        zIndex: 3,
      },
      {
        id: 'layer-text-cool',
        pieceId: 'custom-text',
        name: 'STAY COOL',
        category: 'text',
        type: 'text',
        content: 'STAY COOL 🔥',
        textContent: 'STAY COOL 🔥',
        fontFamily: 'Impact, sans-serif',
        fontSize: 48,
        textColor: '#FACC15',
        strokeColor: '#000000',
        strokeWidth: 4,
        isBold: true,
        x: 540,
        y: 1180,
        z: 10,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1,
        color: '#FACC15',
        zIndex: 4,
      },
    ],
    keyframes: [
      {
        time: 0,
        transforms: {
          'layer-base-cool': { x: 540, y: 860, z: 0, scaleX: 1.35, scaleY: 1.35, rotation: -4, opacity: 1 },
          'layer-glasses': { x: 540, y: 810, z: 6, scaleX: 1.3, scaleY: 1.3, rotation: -4, opacity: 1 },
          'layer-mouth-smirk': { x: 540, y: 935, z: 4, scaleX: 1.0, scaleY: 1.0, rotation: -4, opacity: 1 },
          'layer-text-cool': { x: 540, y: 1180, z: 10, scaleX: 1.0, scaleY: 1.0, rotation: -2, opacity: 1 },
        },
      },
      {
        time: 0.5,
        transforms: {
          'layer-base-cool': { x: 540, y: 860, z: 0, scaleX: 1.35, scaleY: 1.35, rotation: 4, opacity: 1 },
          'layer-glasses': { x: 540, y: 810, z: 6, scaleX: 1.3, scaleY: 1.3, rotation: 4, opacity: 1 },
          'layer-mouth-smirk': { x: 540, y: 935, z: 4, scaleX: 1.0, scaleY: 1.0, rotation: 4, opacity: 1 },
          'layer-text-cool': { x: 540, y: 1180, z: 10, scaleX: 1.15, scaleY: 1.15, rotation: 2, opacity: 1 },
        },
      },
      {
        time: 1.0,
        transforms: {
          'layer-base-cool': { x: 540, y: 860, z: 0, scaleX: 1.35, scaleY: 1.35, rotation: -4, opacity: 1 },
          'layer-glasses': { x: 540, y: 810, z: 6, scaleX: 1.3, scaleY: 1.3, rotation: -4, opacity: 1 },
          'layer-mouth-smirk': { x: 540, y: 935, z: 4, scaleX: 1.0, scaleY: 1.0, rotation: -4, opacity: 1 },
          'layer-text-cool': { x: 540, y: 1180, z: 10, scaleX: 1.0, scaleY: 1.0, rotation: -2, opacity: 1 },
        },
      },
    ],
  },
];

// Load all saved projects from localStorage
export function getSavedProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return [];
  } catch (err) {
    console.error('Failed to load saved projects:', err);
    return [];
  }
}

// Save or Update a project
export function saveProject(
  projectData: {
    id?: string;
    name: string;
    layers: LayerItem[];
    keyframes: KeyframeData[];
    duration: number;
    fps: number;
    aspectRatio: AspectRatioType;
    theme: ThemeMode;
    background?: BackgroundConfig;
    audioTrack?: AudioTrack;
    thumbnail?: string;
  }
): SavedProject {
  const currentProjects = getSavedProjects();
  const id = projectData.id || `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const now = Date.now();

  const existingIdx = currentProjects.findIndex(p => p.id === id);

  // Generate thumbnail snapshot if not provided and layers exist
  let thumbnail = projectData.thumbnail;
  if (!thumbnail && projectData.layers.length > 0) {
    const width = 270;
    const height = projectData.aspectRatio === '9:16' ? 480 : 270;
    thumbnail = exportCanvasAsPNG(
      projectData.layers,
      width,
      height,
      false,
      projectData.background
    );
  }

  const savedItem: SavedProject = {
    id,
    name: projectData.name.trim() || 'Proyecto Sin Título',
    layers: projectData.layers,
    keyframes: projectData.keyframes,
    duration: projectData.duration,
    fps: projectData.fps,
    aspectRatio: projectData.aspectRatio,
    theme: projectData.theme,
    background: projectData.background,
    audioTrack: projectData.audioTrack,
    thumbnail,
    updatedAt: now,
    createdAt: existingIdx >= 0 ? currentProjects[existingIdx].createdAt : now,
  };

  if (existingIdx >= 0) {
    currentProjects[existingIdx] = savedItem;
  } else {
    currentProjects.unshift(savedItem);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProjects));
  } catch (err) {
    console.error('Error saving project to localStorage:', err);
  }

  return savedItem;
}

// Delete a project
export function deleteProject(id: string): void {
  try {
    const current = getSavedProjects();
    const filtered = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete project:', err);
  }
}

// Duplicate a project
export function duplicateProject(id: string): SavedProject | null {
  const current = getSavedProjects();
  const found = current.find(p => p.id === id);
  if (!found) return null;

  return saveProject({
    ...found,
    id: undefined,
    name: `${found.name} (Copia)`,
  });
}

// Export Project as JSON file
export function exportProjectFile(project: SavedProject): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement('a');
  const safeName = project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${safeName}-lulu-animation.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import Project from JSON string
export function importProjectFile(jsonContent: string): SavedProject {
  const parsed = JSON.parse(jsonContent);
  if (!parsed || !Array.isArray(parsed.layers)) {
    throw new Error('El archivo no tiene el formato de proyecto válido.');
  }

  return saveProject({
    id: undefined,
    name: parsed.name ? `${parsed.name} (Importado)` : 'Proyecto Importado',
    layers: parsed.layers || [],
    keyframes: parsed.keyframes || [],
    duration: parsed.duration || 5,
    fps: parsed.fps || 24,
    aspectRatio: parsed.aspectRatio || '9:16',
    theme: parsed.theme || 'dark',
    background: parsed.background,
    audioTrack: parsed.audioTrack,
    thumbnail: parsed.thumbnail,
  });
}
