import { BackgroundConfig } from '../types';

export const PRESET_BACKGROUNDS: { id: string; name: string; thumbnail: string; config: BackgroundConfig }[] = [
  {
    id: 'comic-rays',
    name: 'Rayos Cómic 💥',
    thumbnail: '⚡',
    config: {
      type: 'comic_rays',
      colorA: '#FBBF24', // Amber/Yellow
      colorB: '#EA580C', // Orange
      gradientType: 'radial',
    },
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neón 🌌',
    thumbnail: '🔮',
    config: {
      type: 'neon_glow',
      colorA: '#0F172A',
      colorB: '#8B5CF6',
    },
  },
  {
    id: 'sunset-burst',
    name: 'Atardecer Sunset 🌅',
    thumbnail: '🌆',
    config: {
      type: 'gradient',
      gradientType: 'linear',
      colorA: '#FF5E62',
      colorB: '#FF9966',
      angle: 135,
    },
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Kawaii 🌸',
    thumbnail: '🎀',
    config: {
      type: 'gradient',
      gradientType: 'linear',
      colorA: '#FDE2E4',
      colorB: '#C5DFF8',
      angle: 160,
    },
  },
  {
    id: 'stars-galaxy',
    name: 'Noche Estrellada ✨',
    thumbnail: '🌌',
    config: {
      type: 'pattern',
      patternType: 'stars',
      colorA: '#0B0F19',
      colorB: '#38BDF8',
    },
  },
  {
    id: 'hearts-love',
    name: 'Corazones Amor 💕',
    thumbnail: '💖',
    config: {
      type: 'pattern',
      patternType: 'hearts',
      colorA: '#FFF0F5',
      colorB: '#FB7185',
    },
  },
  {
    id: 'retro-grid',
    name: 'Cuadrícula Retro 👾',
    thumbnail: '📐',
    config: {
      type: 'grid',
      colorA: '#111827',
      colorB: '#10B981',
    },
  },
  {
    id: 'dots-pop',
    name: 'Puntos Pop Art 🟡',
    thumbnail: '🔘',
    config: {
      type: 'pattern',
      patternType: 'dots',
      colorA: '#FEF3C7',
      colorB: '#D97706',
    },
  },
  {
    id: 'minimal-studio',
    name: 'Estudio Gris Minimal 📸',
    thumbnail: '⚪',
    config: {
      type: 'gradient',
      gradientType: 'radial',
      colorA: '#334155',
      colorB: '#0F172A',
    },
  },
  {
    id: 'solid-pure-white',
    name: 'Blanco Estudio 🤍',
    thumbnail: '⬜',
    config: {
      type: 'solid',
      colorA: '#F8FAFC',
    },
  },
];
