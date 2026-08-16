import React from 'react';
import { BackgroundConfig } from '../types';

export function getBackgroundCssStyle(bg?: BackgroundConfig): React.CSSProperties {
  if (!bg) {
    return { background: 'transparent' };
  }

  if (bg.gradient) {
    return { background: bg.gradient };
  }

  if (bg.type === 'solid' && bg.colorA) {
    return { backgroundColor: bg.colorA };
  }

  if (bg.type === 'gradient') {
    const angle = bg.angle ?? 135;
    const colorA = bg.colorA || '#FF6B6B';
    const colorB = bg.colorB || '#3B82F6';
    if (bg.gradientType === 'radial') {
      return { background: `radial-gradient(circle at 50% 50%, ${colorA} 0%, ${colorB} 100%)` };
    }
    return { background: `linear-gradient(${angle}deg, ${colorA} 0%, ${colorB} 100%)` };
  }

  if (bg.type === 'neon_glow') {
    const colorA = bg.colorA || '#0F172A';
    const colorB = bg.colorB || '#8B5CF6';
    return {
      background: `radial-gradient(circle at 50% 50%, ${colorB}33 0%, ${colorA} 85%)`,
    };
  }

  if (bg.type === 'image' && bg.imageUrl) {
    return {
      backgroundImage: `url(${bg.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: `brightness(${bg.brightness ?? 1}) blur(${bg.blur ?? 0}px)`,
    };
  }

  if (bg.type === 'grid') {
    const colorA = bg.colorA || '#0B0D11';
    const colorB = bg.colorB || '#10B981';
    return {
      backgroundColor: colorA,
      backgroundImage: `
        linear-gradient(to right, ${colorB}26 1px, transparent 1px),
        linear-gradient(to bottom, ${colorB}26 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    };
  }

  if (bg.type === 'pattern') {
    const colorA = bg.colorA || '#0B0D11';
    const colorB = bg.colorB || '#F59E0B';

    if (bg.patternType === 'dots') {
      return {
        backgroundColor: colorA,
        backgroundImage: `radial-gradient(${colorB}55 2px, transparent 2px)`,
        backgroundSize: '24px 24px',
      };
    }
    if (bg.patternType === 'stripes') {
      return {
        backgroundColor: colorA,
        backgroundImage: `repeating-linear-gradient(45deg, ${colorB}22, ${colorB}22 15px, transparent 15px, transparent 30px)`,
      };
    }
    return { backgroundColor: colorA };
  }

  return { backgroundColor: bg.colorA || 'transparent' };
}

/**
 * Draws the background onto a HTML5 Canvas 2D context (for export / video recording)
 */
export function drawBackgroundToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bg?: BackgroundConfig
) {
  if (!bg) {
    return;
  }

  ctx.save();

  if (bg.type === 'solid' && bg.colorA) {
    ctx.fillStyle = bg.colorA;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'gradient' || bg.gradient) {
    const colorA = bg.colorA || '#FF6B6B';
    const colorB = bg.colorB || '#3B82F6';
    if (bg.gradientType === 'radial') {
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) / 1.4);
      grad.addColorStop(0, colorA);
      grad.addColorStop(1, colorB);
      ctx.fillStyle = grad;
    } else {
      const angleRad = ((bg.angle ?? 135) * Math.PI) / 180;
      const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
      const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;
      const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
      const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, colorA);
      grad.addColorStop(1, colorB);
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'comic_rays') {
    const colorA = bg.colorA || '#FEF08A';
    ctx.fillStyle = colorA;
    ctx.fillRect(0, 0, width, height);

    const colorB = bg.colorB || '#EA580C';
    ctx.fillStyle = colorB;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) * 1.2;
    const rays = 24;
    const step = (Math.PI * 2) / rays;

    for (let i = 0; i < rays; i += 2) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, i * step, (i + 1) * step);
      ctx.closePath();
      ctx.fill();
    }
  } else if (bg.type === 'neon_glow') {
    const colorA = bg.colorA || '#0F172A';
    ctx.fillStyle = colorA;
    ctx.fillRect(0, 0, width, height);

    const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7);
    const colorB = bg.colorB || '#8B5CF6';
    grad.addColorStop(0, `${colorB}88`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'grid') {
    const colorA = bg.colorA || '#0B0D11';
    ctx.fillStyle = colorA;
    ctx.fillRect(0, 0, width, height);

    const colorB = bg.colorB || '#10B981';
    ctx.strokeStyle = `${colorB}40`;
    ctx.lineWidth = 3;
    const step = 60;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else if (bg.type === 'pattern') {
    const colorA = bg.colorA || '#0B0D11';
    ctx.fillStyle = colorA;
    ctx.fillRect(0, 0, width, height);

    const colorB = bg.colorB || '#F59E0B';
    if (bg.patternType === 'dots') {
      ctx.fillStyle = `${colorB}80`;
      const step = 48;
      for (let x = 24; x < width; x += step) {
        for (let y = 24; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (bg.patternType === 'stars') {
      ctx.fillStyle = `${colorB}CC`;
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const step = 120;
      for (let x = 60; x < width; x += step) {
        for (let y = 60; y < height; y += step) {
          ctx.fillText('✨', x + ((y % 240 === 0) ? 30 : -30), y);
        }
      }
    } else if (bg.patternType === 'hearts') {
      ctx.fillStyle = `${colorB}CC`;
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const step = 110;
      for (let x = 55; x < width; x += step) {
        for (let y = 55; y < height; y += step) {
          ctx.fillText('💖', x + ((y % 220 === 0) ? 25 : -25), y);
        }
      }
    }
  }

  ctx.restore();
}
