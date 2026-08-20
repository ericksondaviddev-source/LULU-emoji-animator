import { LayerItem, KeyframeData, LayerTransform } from '../types';
import { EMOJI_LIBRARY } from '../constants/items';

export type EffectType =
  | 'stars'
  | 'bubbles'
  | 'confetti'
  | 'sparkles'
  | 'hearts'
  | 'fire';

export interface AnimatedEffectPreset {
  id: EffectType;
  name: string;
  shortLabel: string;
  emoji: string;
  description: string;
  badge: string;
  accentColor: string;
  particleCount: number;
}

export const ANIMATED_EFFECT_PRESETS: AnimatedEffectPreset[] = [
  {
    id: 'stars',
    name: 'Lluvia de Estrellas',
    shortLabel: 'Estrellas',
    emoji: '⭐',
    description: 'Estrellas mágicas doradas y brillantes que titilan y flotan en el lienzo.',
    badge: 'Titilante',
    accentColor: '#FACC15',
    particleCount: 5,
  },
  {
    id: 'bubbles',
    name: 'Burbujas Flotantes',
    shortLabel: 'Burbujas',
    emoji: '🫧',
    description: 'Burbujas suaves traslúcidas que flotan en ascenso con balanceo de onda.',
    badge: 'Flotante',
    accentColor: '#38BDF8',
    particleCount: 5,
  },
  {
    id: 'confetti',
    name: 'Lluvia de Confeti',
    shortLabel: 'Confeti',
    emoji: '🎉',
    description: 'Confeti multicolor festivo que cae y gira alegremente por toda la pantalla.',
    badge: 'Fiesta',
    accentColor: '#EC4899',
    particleCount: 6,
  },
  {
    id: 'sparkles',
    name: 'Chispas & Brillos',
    shortLabel: 'Chispas',
    emoji: '✨',
    description: 'Destellos de luz resplandecientes que parpadean alrededor del personaje.',
    badge: 'Mágico',
    accentColor: '#A855F7',
    particleCount: 4,
  },
  {
    id: 'hearts',
    name: 'Corazones Flotantes',
    shortLabel: 'Corazones',
    emoji: '💖',
    description: 'Corazones tiernos que pulsan con latido suave y ascienden flotando.',
    badge: 'Romance',
    accentColor: '#FB7185',
    particleCount: 5,
  },
  {
    id: 'fire',
    name: 'Llamas & Energía',
    shortLabel: 'Fuego',
    emoji: '🔥',
    description: 'Llamas y chispas de energía vibrante que ondean con intensidad.',
    badge: 'Energía',
    accentColor: '#F97316',
    particleCount: 4,
  },
];

interface GeneratedEffectResult {
  layers: LayerItem[];
  layerTransformsByTime: Record<number, Record<string, LayerTransform>>; // time (0..1) -> layerId -> transform
}

/**
 * Generates preconfigured animated effect layers along with their animated keyframes
 */
export function generateAnimatedEffectLayers(
  effectType: EffectType,
  aspectRatio: '9:16' | '1:1',
  existingLayersCount: number = 0
): GeneratedEffectResult {
  const is916 = aspectRatio === '9:16';
  const width = 1080;
  const height = is916 ? 1920 : 1080;
  const centerX = width / 2;
  const centerY = height / 2;

  const times = [0, 0.25, 0.5, 0.75, 1.0];
  const createdLayers: LayerItem[] = [];
  const layerTransformsByTime: Record<number, Record<string, LayerTransform>> = {
    0: {},
    0.25: {},
    0.5: {},
    0.75: {},
    1.0: {},
  };

  const getEmojiPiece = (id: string) => {
    return EMOJI_LIBRARY.find(item => item.id === id) || EMOJI_LIBRARY[0];
  };

  switch (effectType) {
    case 'stars': {
      const starConfigs = [
        { pieceId: 'shape-star-5', x: centerX - 320, y: centerY - 450, color: '#FACC15', scale: 0.85, phase: 0 },
        { pieceId: 'shape-four-point-star', x: centerX + 340, y: centerY - 380, color: '#FEF08A', scale: 1.1, phase: 0.25 },
        { pieceId: 'extra-sparkle-stars', x: centerX - 280, y: centerY + 360, color: '#F472B6', scale: 0.95, phase: 0.5 },
        { pieceId: 'shape-star-5', x: centerX + 300, y: centerY + 420, color: '#38BDF8', scale: 0.9, phase: 0.75 },
        { pieceId: 'shape-four-point-star', x: centerX, y: centerY - 520, color: '#FBBF24', scale: 1.2, phase: 0.1 },
      ];

      starConfigs.forEach((cfg, idx) => {
        const piece = getEmojiPiece(cfg.pieceId);
        const layerId = `effect-star-${Date.now()}-${idx}`;
        const newLayer: LayerItem = {
          id: layerId,
          pieceId: piece.id,
          name: `Estrella Mágica ${idx + 1}`,
          category: 'extras',
          type: piece.type,
          content: piece.content,
          viewBox: piece.viewBox,
          geometryType: 'extrude',
          depth: 10,
          x: cfg.x,
          y: cfg.y,
          z: 25,
          scaleX: cfg.scale,
          scaleY: cfg.scale,
          rotation: 0,
          opacity: 1,
          color: cfg.color,
          zIndex: existingLayersCount + idx + 10,
        };
        createdLayers.push(newLayer);

        times.forEach(t => {
          // Twinkle pulse + floating wiggle + rotation
          const cycle = (t + cfg.phase) % 1.0;
          const pulse = 0.75 + 0.45 * Math.sin(cycle * Math.PI * 2);
          const yDrift = 18 * Math.cos(cycle * Math.PI * 2);
          const rot = t * 360;
          const opac = 0.55 + 0.45 * Math.sin(cycle * Math.PI * 2);

          layerTransformsByTime[t][layerId] = {
            x: cfg.x,
            y: cfg.y + yDrift,
            z: 25,
            scaleX: Number((cfg.scale * pulse).toFixed(2)),
            scaleY: Number((cfg.scale * pulse).toFixed(2)),
            rotation: Number(rot.toFixed(1)),
            opacity: Number(Math.max(0.3, Math.min(1, opac)).toFixed(2)),
          };
        });
      });
      break;
    }

    case 'bubbles': {
      const bubbleColors = ['#38BDF8', '#818CF8', '#A78BFA', '#2DD4BF', '#67E8F9'];
      const bubbleOffsets = [
        { xOffset: -320, baseY: centerY + 450, scale: 0.9, speed: 1.0, color: bubbleColors[0] },
        { xOffset: 280, baseY: centerY + 380, scale: 1.15, speed: 0.8, color: bubbleColors[1] },
        { xOffset: -180, baseY: centerY + 520, scale: 0.65, speed: 1.2, color: bubbleColors[2] },
        { xOffset: 340, baseY: centerY + 500, scale: 0.8, speed: 0.9, color: bubbleColors[3] },
        { xOffset: 80, baseY: centerY + 620, scale: 1.3, speed: 1.1, color: bubbleColors[4] },
      ];

      bubbleOffsets.forEach((cfg, idx) => {
        const piece = getEmojiPiece('base-smooth-circle');
        const layerId = `effect-bubble-${Date.now()}-${idx}`;
        const newLayer: LayerItem = {
          id: layerId,
          pieceId: piece.id,
          name: `Burbuja Flotante ${idx + 1}`,
          category: 'extras',
          type: piece.type,
          content: piece.content,
          viewBox: piece.viewBox,
          geometryType: 'sphere',
          depth: 16,
          x: centerX + cfg.xOffset,
          y: cfg.baseY,
          z: 30,
          scaleX: cfg.scale,
          scaleY: cfg.scale,
          rotation: 0,
          opacity: 0.75,
          color: cfg.color,
          zIndex: existingLayersCount + idx + 10,
        };
        createdLayers.push(newLayer);

        times.forEach(t => {
          // Ascending motion + wave side drift
          const waveX = 25 * Math.sin(t * Math.PI * 4 + idx);
          const riseY = -120 * t * cfg.speed;
          const squash = 1 + 0.08 * Math.sin(t * Math.PI * 4);

          layerTransformsByTime[t][layerId] = {
            x: centerX + cfg.xOffset + waveX,
            y: cfg.baseY + riseY,
            z: 30,
            scaleX: Number((cfg.scale * squash).toFixed(2)),
            scaleY: Number((cfg.scale / squash).toFixed(2)),
            rotation: Number((waveX * 0.8).toFixed(1)),
            opacity: Number((0.85 - 0.25 * t).toFixed(2)),
          };
        });
      });
      break;
    }

    case 'confetti': {
      const confettiPieces = [
        { pieceId: 'shape-star-5', color: '#EF4444', x: centerX - 360, y: centerY - 480, scale: 0.75, rotSpeed: 360 },
        { pieceId: 'shape-diamond-gem', color: '#FACC15', x: centerX - 160, y: centerY - 540, scale: 0.9, rotSpeed: -280 },
        { pieceId: 'shape-heart-solid', color: '#EC4899', x: centerX + 180, y: centerY - 500, scale: 0.8, rotSpeed: 320 },
        { pieceId: 'shape-music-note', color: '#3B82F6', x: centerX + 350, y: centerY - 460, scale: 0.85, rotSpeed: -360 },
        { pieceId: 'shape-four-point-star', color: '#10B981', x: centerX - 80, y: centerY - 420, scale: 0.95, rotSpeed: 420 },
        { pieceId: 'shape-star-5', color: '#F97316', x: centerX + 260, y: centerY - 560, scale: 0.7, rotSpeed: -300 },
      ];

      confettiPieces.forEach((cfg, idx) => {
        const piece = getEmojiPiece(cfg.pieceId);
        const layerId = `effect-confetti-${Date.now()}-${idx}`;
        const newLayer: LayerItem = {
          id: layerId,
          pieceId: piece.id,
          name: `Confeti Fiesta ${idx + 1}`,
          category: 'extras',
          type: piece.type,
          content: piece.content,
          viewBox: piece.viewBox,
          geometryType: 'extrude',
          depth: 8,
          x: cfg.x,
          y: cfg.y,
          z: 22,
          scaleX: cfg.scale,
          scaleY: cfg.scale,
          rotation: 0,
          opacity: 1,
          color: cfg.color,
          zIndex: existingLayersCount + idx + 10,
        };
        createdLayers.push(newLayer);

        times.forEach(t => {
          // Falling cascade + swaying wobble + continuous spin
          const fallDistance = 450 * t;
          const swayX = 35 * Math.sin(t * Math.PI * 3 + idx * 1.5);
          const spin = cfg.rotSpeed * t;

          layerTransformsByTime[t][layerId] = {
            x: cfg.x + swayX,
            y: cfg.y + fallDistance,
            z: 22,
            scaleX: cfg.scale,
            scaleY: cfg.scale,
            rotation: Number(spin.toFixed(1)),
            opacity: 1,
          };
        });
      });
      break;
    }

    case 'sparkles': {
      const sparkleConfigs = [
        { x: centerX - 260, y: centerY - 320, color: '#C084FC', scale: 1.1, phase: 0 },
        { x: centerX + 280, y: centerY - 280, color: '#FDE047', scale: 1.3, phase: 0.33 },
        { x: centerX - 240, y: centerY + 240, color: '#38BDF8', scale: 0.9, phase: 0.66 },
        { x: centerX + 260, y: centerY + 280, color: '#F472B6', scale: 1.2, phase: 0.15 },
      ];

      sparkleConfigs.forEach((cfg, idx) => {
        const piece = getEmojiPiece('extra-sparkle-stars');
        const layerId = `effect-sparkle-${Date.now()}-${idx}`;
        const newLayer: LayerItem = {
          id: layerId,
          pieceId: piece.id,
          name: `Brillo Mágico ${idx + 1}`,
          category: 'extras',
          type: piece.type,
          content: piece.content,
          viewBox: piece.viewBox,
          geometryType: 'extrude',
          depth: 12,
          x: cfg.x,
          y: cfg.y,
          z: 28,
          scaleX: cfg.scale,
          scaleY: cfg.scale,
          rotation: 0,
          opacity: 1,
          color: cfg.color,
          zIndex: existingLayersCount + idx + 10,
        };
        createdLayers.push(newLayer);

        times.forEach(t => {
          const cycle = (t + cfg.phase) % 1.0;
          const burst = Math.abs(Math.sin(cycle * Math.PI));
          const scaleMult = 0.4 + 0.9 * burst;
          const rot = 180 * cycle;

          layerTransformsByTime[t][layerId] = {
            x: cfg.x,
            y: cfg.y,
            z: 28,
            scaleX: Number((cfg.scale * scaleMult).toFixed(2)),
            scaleY: Number((cfg.scale * scaleMult).toFixed(2)),
            rotation: Number(rot.toFixed(1)),
            opacity: Number(burst.toFixed(2)),
          };
        });
      });
      break;
    }

    case 'hearts': {
      const heartConfigs = [
        { x: centerX - 290, y: centerY + 250, color: '#FB7185', scale: 0.85, rise: -160, delay: 0 },
        { x: centerX + 310, y: centerY + 200, color: '#F43F5E', scale: 1.1, rise: -190, delay: 0.2 },
        { x: centerX - 190, y: centerY + 380, color: '#FDA4AF', scale: 0.7, rise: -140, delay: 0.4 },
        { x: centerX + 220, y: centerY + 360, color: '#FB7185', scale: 0.95, rise: -170, delay: 0.6 },
        { x: centerX, y: centerY + 460, color: '#E11D48', scale: 1.2, rise: -210, delay: 0.1 },
      ];

      heartConfigs.forEach((cfg, idx) => {
        const piece = getEmojiPiece('base-heart');
        const layerId = `effect-heart-${Date.now()}-${idx}`;
        const newLayer: LayerItem = {
          id: layerId,
          pieceId: piece.id,
          name: `Corazón Flotante ${idx + 1}`,
          category: 'extras',
          type: piece.type,
          content: piece.content,
          viewBox: piece.viewBox,
          geometryType: 'extrude',
          depth: 14,
          x: cfg.x,
          y: cfg.y,
          z: 26,
          scaleX: cfg.scale,
          scaleY: cfg.scale,
          rotation: 0,
          opacity: 1,
          color: cfg.color,
          zIndex: existingLayersCount + idx + 10,
        };
        createdLayers.push(newLayer);

        times.forEach(t => {
          const beat = 1 + 0.22 * Math.sin(t * Math.PI * 6);
          const floatY = cfg.rise * t;
          const tilt = 12 * Math.sin(t * Math.PI * 4);

          layerTransformsByTime[t][layerId] = {
            x: cfg.x + tilt,
            y: cfg.y + floatY,
            z: 26,
            scaleX: Number((cfg.scale * beat).toFixed(2)),
            scaleY: Number((cfg.scale * beat).toFixed(2)),
            rotation: Number(tilt.toFixed(1)),
            opacity: Number((1 - 0.2 * t).toFixed(2)),
          };
        });
      });
      break;
    }

    case 'fire': {
      const fireConfigs = [
        { pieceId: 'shape-fire-flame', x: centerX - 260, y: centerY + 180, color: '#EF4444', scale: 1.1, rot: -15 },
        { pieceId: 'shape-fire-flame', x: centerX + 260, y: centerY + 180, color: '#F97316', scale: 1.1, rot: 15 },
        { pieceId: 'shape-lightning-bolt', x: centerX - 330, y: centerY - 240, color: '#FACC15', scale: 0.9, rot: 25 },
        { pieceId: 'shape-lightning-bolt', x: centerX + 330, y: centerY - 240, color: '#FACC15', scale: 0.9, rot: -25 },
      ];

      fireConfigs.forEach((cfg, idx) => {
        const piece = getEmojiPiece(cfg.pieceId);
        const layerId = `effect-fire-${Date.now()}-${idx}`;
        const newLayer: LayerItem = {
          id: layerId,
          pieceId: piece.id,
          name: `Energía Fuego ${idx + 1}`,
          category: 'extras',
          type: piece.type,
          content: piece.content,
          viewBox: piece.viewBox,
          geometryType: 'extrude',
          depth: 14,
          x: cfg.x,
          y: cfg.y,
          z: 24,
          scaleX: cfg.scale,
          scaleY: cfg.scale,
          rotation: cfg.rot,
          opacity: 1,
          color: cfg.color,
          zIndex: existingLayersCount + idx + 10,
        };
        createdLayers.push(newLayer);

        times.forEach(t => {
          const flickerY = 1 + 0.25 * Math.sin(t * Math.PI * 8 + idx);
          const flickerX = 1 + 0.12 * Math.cos(t * Math.PI * 6 + idx);
          const rotJitter = cfg.rot + 8 * Math.sin(t * Math.PI * 10);

          layerTransformsByTime[t][layerId] = {
            x: cfg.x,
            y: cfg.y,
            z: 24,
            scaleX: Number((cfg.scale * flickerX).toFixed(2)),
            scaleY: Number((cfg.scale * flickerY).toFixed(2)),
            rotation: Number(rotJitter.toFixed(1)),
            opacity: 1,
          };
        });
      });
      break;
    }
  }

  return {
    layers: createdLayers,
    layerTransformsByTime,
  };
}

/**
 * Merges new effect transforms into existing keyframes or creates a full loop
 */
export function mergeEffectKeyframes(
  existingKeyframes: KeyframeData[],
  existingLayers: LayerItem[],
  newLayers: LayerItem[],
  transformsByTime: Record<number, Record<string, LayerTransform>>
): KeyframeData[] {
  const times = [0, 0.25, 0.5, 0.75, 1.0];

  // If there are no keyframes yet, generate a baseline keyframe set for existing layers so they stay intact
  if (!existingKeyframes || existingKeyframes.length === 0) {
    return times.map(t => {
      const transforms: Record<string, LayerTransform> = {};

      // Keep existing layers in their current base pose
      existingLayers.forEach(l => {
        transforms[l.id] = {
          x: l.x,
          y: l.y,
          z: l.z || 0,
          scaleX: l.scaleX,
          scaleY: l.scaleY,
          rotation: l.rotation,
          opacity: l.opacity,
        };
      });

      // Add new effect layer transforms
      if (transformsByTime[t]) {
        Object.entries(transformsByTime[t]).forEach(([layerId, tf]) => {
          transforms[layerId] = tf;
        });
      }

      return {
        time: t,
        transforms,
      };
    });
  }

  // If keyframes already exist, merge effect transforms into each keyframe
  return existingKeyframes.map(kf => {
    const updatedTransforms = { ...kf.transforms };

    // Find nearest time in transformsByTime
    let closestTime = times[0];
    let minDiff = Math.abs(kf.time - closestTime);
    times.forEach(t => {
      const diff = Math.abs(kf.time - t);
      if (diff < minDiff) {
        minDiff = diff;
        closestTime = t;
      }
    });

    const effectTfs = transformsByTime[closestTime];
    if (effectTfs) {
      Object.entries(effectTfs).forEach(([layerId, tf]) => {
        updatedTransforms[layerId] = tf;
      });
    }

    return {
      ...kf,
      transforms: updatedTransforms,
    };
  });
}
