export type ItemCategory = 'bases' | 'eyes' | 'mouths' | 'extras' | 'shapes' | 'text';

export type AspectRatioType = '9:16' | '1:1';

export type ThemeMode = 'light' | 'dark';

export type BackgroundType = 'solid' | 'gradient' | 'pattern' | 'image' | 'comic_rays' | 'neon_glow' | 'grid';

export interface BackgroundConfig {
  id?: string;
  name?: string;
  type: BackgroundType;
  colorA?: string;
  colorB?: string;
  gradient?: string;
  gradientType?: 'linear' | 'radial';
  angle?: number; // 0 to 360
  patternType?: 'dots' | 'grid' | 'stripes' | 'stars' | 'hearts' | 'bubbles';
  imageUrl?: string;
  brightness?: number; // 0.3 to 1.8
  blur?: number; // 0 to 20
  contrast?: number; // 0.5 to 1.5
}

export interface AudioTrack {
  id: string;
  name: string;
  audioUrl: string; // blob url or base64
  blob?: Blob;
  duration: number; // in seconds
  volume?: number; // 0 to 1
  recordedAt: number;
}

export interface EmojiPiece {
  id: string;
  name: string;
  category: ItemCategory;
  type: 'svg' | 'unicode' | 'composite' | 'text';
  content: string; // SVG path or Unicode emoji char or Text content
  viewBox?: string;
  defaultColor?: string;
  defaultScale?: number;
  tags?: string[];
  depth?: number; // 3D extrusion depth
  geometryType?: 'cylinder' | 'sphere' | 'box' | 'extrude' | 'plane';
}

export interface LayerTransform {
  x: number; // 0 to 1 normalized or canvas coordinate
  y: number;
  z?: number; // 3D depth offset
  scaleX: number;
  scaleY: number;
  rotation: number; // in degrees
  opacity: number; // 0 to 1
  color?: string;
}

export interface LayerItem {
  id: string;
  pieceId?: string;
  name: string;
  category: ItemCategory;
  type: 'svg' | 'unicode' | 'composite' | 'text';
  content: string;
  viewBox?: string;
  geometryType?: 'cylinder' | 'sphere' | 'box' | 'extrude' | 'plane';
  depth?: number;
  
  // Text specific properties
  textContent?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  isBold?: boolean;
  isItalic?: boolean;
  hasShadow?: boolean;

  // Current transform & appearance
  x: number; // center x on canvas (e.g. 540 in 1080x1920)
  y: number; // center y on canvas (e.g. 960 in 1080x1920)
  z?: number; // depth offset in 3D (0 to 50)
  scaleX: number; // 1 = normal, -1 = flipped horizontally
  scaleY: number;
  rotation: number; // in degrees (-180 to 180)
  opacity: number; // 0 to 1
  color: string;
  zIndex: number;
  locked?: boolean;
}

export interface KeyframeData {
  time: number; // 0 to 1 (normalized timestamp in timeline)
  transforms: Record<string, LayerTransform>; // layerId -> LayerTransform
}

export interface SavedProject {
  id: string;
  name: string;
  thumbnail?: string;
  updatedAt: number;
  createdAt: number;
  layers: LayerItem[];
  keyframes: KeyframeData[];
  duration: number;
  fps: number;
  aspectRatio: AspectRatioType;
  theme: ThemeMode;
  background?: BackgroundConfig;
  audioTrack?: AudioTrack;
}

export interface AnimationTimeline {
  duration: number; // duration in seconds (e.g. 3s, 5s, 15s)
  fps: number; // 24, 30, 60
  currentTime: number; // 0 to duration
  isPlaying: boolean;
  isLooping: boolean;
  keyframes: KeyframeData[];
}
