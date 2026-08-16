import { KeyframeData, LayerItem, LayerTransform } from '../types';

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpAngle(a: number, b: number, t: number): number {
  // Interpolate shortest path around circle (-180 to 180)
  let diff = (b - a) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return a + diff * t;
}

export function interpolateLayerTransform(
  t1: LayerTransform,
  t2: LayerTransform,
  factor: number
): LayerTransform {
  const eased = easeInOutQuad(Math.max(0, Math.min(1, factor)));
  return {
    x: lerp(t1.x, t2.x, eased),
    y: lerp(t1.y, t2.y, eased),
    z: lerp(t1.z ?? 0, t2.z ?? 0, eased),
    scaleX: lerp(t1.scaleX, t2.scaleX, eased),
    scaleY: lerp(t1.scaleY, t2.scaleY, eased),
    rotation: lerpAngle(t1.rotation, t2.rotation, eased),
    opacity: lerp(t1.opacity, t2.opacity, eased),
    color: t1.color,
  };
}

export function getInterpolatedLayers(
  layers: LayerItem[],
  keyframes: KeyframeData[],
  normalizedTime: number // 0 to 1
): LayerItem[] {
  if (!keyframes || keyframes.length === 0) {
    return layers;
  }

  // Sort keyframes by time
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);

  // If time is before first keyframe
  if (normalizedTime <= sorted[0].time) {
    const firstKf = sorted[0];
    return layers.map(layer => {
      const transform = firstKf.transforms[layer.id];
      if (!transform) return layer;
      return {
        ...layer,
        ...transform,
      };
    });
  }

  // If time is after last keyframe
  if (normalizedTime >= sorted[sorted.length - 1].time) {
    const lastKf = sorted[sorted.length - 1];
    return layers.map(layer => {
      const transform = lastKf.transforms[layer.id];
      if (!transform) return layer;
      return {
        ...layer,
        ...transform,
      };
    });
  }

  // Find surrounding keyframes
  let prevKf = sorted[0];
  let nextKf = sorted[sorted.length - 1];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (normalizedTime >= sorted[i].time && normalizedTime <= sorted[i + 1].time) {
      prevKf = sorted[i];
      nextKf = sorted[i + 1];
      break;
    }
  }

  const duration = nextKf.time - prevKf.time;
  const factor = duration > 0 ? (normalizedTime - prevKf.time) / duration : 0;

  return layers.map(layer => {
    const t1 = prevKf.transforms[layer.id] || {
      x: layer.x,
      y: layer.y,
      z: layer.z || 0,
      scaleX: layer.scaleX,
      scaleY: layer.scaleY,
      rotation: layer.rotation,
      opacity: layer.opacity,
    };
    const t2 = nextKf.transforms[layer.id] || {
      x: layer.x,
      y: layer.y,
      z: layer.z || 0,
      scaleX: layer.scaleX,
      scaleY: layer.scaleY,
      rotation: layer.rotation,
      opacity: layer.opacity,
    };

    const interp = interpolateLayerTransform(t1, t2, factor);
    return {
      ...layer,
      ...interp,
    };
  });
}

// Generate preset animation keyframes
export function generateAnimationPresets(
  layers: LayerItem[],
  presetType: 'bounce' | 'float' | 'spin' | 'heartbeat' | 'wiggle'
): KeyframeData[] {
  if (layers.length === 0) return [];

  const baseTransforms: Record<string, LayerTransform> = {};
  layers.forEach(l => {
    baseTransforms[l.id] = {
      x: l.x,
      y: l.y,
      z: l.z || 0,
      scaleX: l.scaleX,
      scaleY: l.scaleY,
      rotation: l.rotation,
      opacity: l.opacity,
    };
  });

  const cloneTransforms = (modifier?: (layer: LayerItem, t: LayerTransform) => Partial<LayerTransform>) => {
    const res: Record<string, LayerTransform> = {};
    layers.forEach(l => {
      const orig = baseTransforms[l.id];
      const mods = modifier ? modifier(l, orig) : {};
      res[l.id] = { ...orig, ...mods };
    });
    return res;
  };

  switch (presetType) {
    case 'bounce':
      return [
        { time: 0, transforms: cloneTransforms() },
        {
          time: 0.25,
          transforms: cloneTransforms((_, orig) => ({
            y: orig.y - 60,
            scaleX: orig.scaleX * 0.95,
            scaleY: orig.scaleY * 1.1,
            rotation: orig.rotation - 5,
          })),
        },
        {
          time: 0.5,
          transforms: cloneTransforms((_, orig) => ({
            y: orig.y + 20,
            scaleX: orig.scaleX * 1.12,
            scaleY: orig.scaleY * 0.88,
            rotation: orig.rotation + 4,
          })),
        },
        {
          time: 0.75,
          transforms: cloneTransforms((_, orig) => ({
            y: orig.y - 30,
            scaleX: orig.scaleX * 0.98,
            scaleY: orig.scaleY * 1.05,
            rotation: orig.rotation - 2,
          })),
        },
        { time: 1.0, transforms: cloneTransforms() },
      ];

    case 'float':
      return [
        { time: 0, transforms: cloneTransforms() },
        {
          time: 0.5,
          transforms: cloneTransforms((_, orig) => ({
            y: orig.y - 45,
            rotation: orig.rotation + 6,
            scaleX: orig.scaleX * 1.04,
            scaleY: orig.scaleY * 1.04,
          })),
        },
        { time: 1.0, transforms: cloneTransforms() },
      ];

    case 'spin':
      return [
        { time: 0, transforms: cloneTransforms() },
        {
          time: 0.25,
          transforms: cloneTransforms((_, orig) => ({
            y: orig.y - 40,
            rotation: orig.rotation + 90,
            scaleX: orig.scaleX * 1.1,
          })),
        },
        {
          time: 0.5,
          transforms: cloneTransforms((_, orig) => ({
            y: orig.y - 70,
            rotation: orig.rotation + 180,
            scaleX: orig.scaleX * 0.9,
          })),
        },
        {
          time: 0.75,
          transforms: cloneTransforms((_, orig) => ({
            y: orig.y - 40,
            rotation: orig.rotation + 270,
            scaleX: orig.scaleX * 1.1,
          })),
        },
        {
          time: 1.0,
          transforms: cloneTransforms((_, orig) => ({
            rotation: orig.rotation + 360,
          })),
        },
      ];

    case 'heartbeat':
      return [
        { time: 0, transforms: cloneTransforms() },
        {
          time: 0.15,
          transforms: cloneTransforms((_, orig) => ({
            scaleX: orig.scaleX * 1.18,
            scaleY: orig.scaleY * 1.18,
          })),
        },
        {
          time: 0.3,
          transforms: cloneTransforms((_, orig) => ({
            scaleX: orig.scaleX * 1.02,
            scaleY: orig.scaleY * 1.02,
          })),
        },
        {
          time: 0.45,
          transforms: cloneTransforms((_, orig) => ({
            scaleX: orig.scaleX * 1.25,
            scaleY: orig.scaleY * 1.25,
          })),
        },
        { time: 0.7, transforms: cloneTransforms() },
        { time: 1.0, transforms: cloneTransforms() },
      ];

    case 'wiggle':
      return [
        { time: 0, transforms: cloneTransforms() },
        {
          time: 0.2,
          transforms: cloneTransforms((_, orig) => ({
            rotation: orig.rotation - 12,
            x: orig.x - 20,
          })),
        },
        {
          time: 0.4,
          transforms: cloneTransforms((_, orig) => ({
            rotation: orig.rotation + 12,
            x: orig.x + 20,
          })),
        },
        {
          time: 0.6,
          transforms: cloneTransforms((_, orig) => ({
            rotation: orig.rotation - 8,
            x: orig.x - 12,
          })),
        },
        {
          time: 0.8,
          transforms: cloneTransforms((_, orig) => ({
            rotation: orig.rotation + 8,
            x: orig.x + 12,
          })),
        },
        { time: 1.0, transforms: cloneTransforms() },
      ];

    default:
      return [];
  }
}
