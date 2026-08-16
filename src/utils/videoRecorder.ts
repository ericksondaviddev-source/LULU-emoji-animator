import { KeyframeData, LayerItem, BackgroundConfig, AudioTrack } from '../types';
import { getInterpolatedLayers } from './animation';
import { drawBackgroundToCanvas } from './backgroundRenderer';

export function getSupportedMimeType(): string {
  const types = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=h264,aac',
    'video/mp4',
    'video/webm;codecs=h264,opus',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];

  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'video/webm';
}

export interface ExportVideoOptions {
  width: number;
  height: number;
  fps: number;
  duration: number; // in seconds
  layers: LayerItem[];
  keyframes: KeyframeData[];
  background?: BackgroundConfig;
  audioTrack?: AudioTrack;
  onProgress?: (percent: number) => void;
}

export async function renderAndExportVideo(
  options: ExportVideoOptions
): Promise<{ blob: Blob; url: string; mimeType: string }> {
  const {
    width,
    height,
    fps,
    duration,
    layers,
    keyframes,
    background,
    audioTrack,
    onProgress,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true });

  if (!ctx) {
    throw new Error('Canvas 2D context could not be created.');
  }

  // Pre-load all SVG images
  const svgImageCache = new Map<string, HTMLImageElement>();
  for (const layer of layers) {
    if (layer.type === 'svg') {
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="${layer.viewBox || '0 0 300 300'}" width="300" height="300">
          <style>* { color: ${layer.color}; fill: ${layer.color}; stroke: ${layer.color}; }</style>
          ${layer.content}
        </svg>
      `;
      const img = new Image();
      await new Promise<void>(resolve => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
      });
      svgImageCache.set(`${layer.id}_${layer.color}`, img);
    }
  }

  const canvasStream = canvas.captureStream(fps);
  let audioContext: AudioContext | null = null;
  let audioSourceNode: AudioBufferSourceNode | null = null;

  // Handle Audio track if voice recording exists
  if (audioTrack && audioTrack.audioUrl) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioCtx();
      const response = await fetch(audioTrack.audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const destNode = audioContext.createMediaStreamDestination();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = audioTrack.volume ?? 1.0;

      audioSourceNode = audioContext.createBufferSource();
      audioSourceNode.buffer = audioBuffer;
      audioSourceNode.loop = true; // loop if animation duration > voice duration

      audioSourceNode.connect(gainNode);
      gainNode.connect(destNode);

      // Add audio tracks to media stream
      destNode.stream.getAudioTracks().forEach(track => {
        canvasStream.addTrack(track);
      });

      audioSourceNode.start(0);
    } catch (err) {
      console.warn('Could not initialize audio mixing for export:', err);
    }
  }

  const mimeType = getSupportedMimeType();
  const recorderOptions: MediaRecorderOptions = {
    mimeType,
    videoBitsPerSecond: 8000000, // 8 Mbps
    audioBitsPerSecond: 128000,
  };

  const recorder = new MediaRecorder(canvasStream, recorderOptions);
  const chunks: Blob[] = [];

  recorder.ondataavailable = e => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const totalFrames = Math.max(1, Math.round(duration * fps));
  const frameInterval = 1000 / fps;

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      if (audioSourceNode) {
        try {
          audioSourceNode.stop();
        } catch (_) {}
      }
      if (audioContext) {
        audioContext.close().catch(() => {});
      }

      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      resolve({ blob, url, mimeType });
    };

    recorder.onerror = e => {
      reject(e);
    };

    recorder.start();

    let currentFrame = 0;

    const renderNextFrame = () => {
      if (currentFrame >= totalFrames) {
        recorder.stop();
        return;
      }

      const normalizedTime = currentFrame / totalFrames;
      const currentLayers = getInterpolatedLayers(layers, keyframes, normalizedTime);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Background
      if (background) {
        drawBackgroundToCanvas(ctx, width, height, background);
      } else {
        // Default clean slate studio background
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 2;
        const gridSize = 80;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // 2. Draw Layers
      const sortedLayers = [...currentLayers].sort((a, b) => a.zIndex - b.zIndex);

      sortedLayers.forEach(layer => {
        if (layer.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));

        ctx.translate(layer.x, layer.y);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.scale(layer.scaleX, layer.scaleY);

        if (layer.type === 'text') {
          // Custom Text Layer
          const text = layer.textContent || layer.content || 'Texto';
          const fontSize = (layer.fontSize || 48) * 1.6;
          ctx.font = `${layer.isBold ? 'bold' : ''} ${layer.isItalic ? 'italic' : ''} ${fontSize}px ${
            layer.fontFamily || 'Impact, sans-serif'
          }`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (layer.hasShadow !== false) {
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 16;
            ctx.shadowOffsetY = 6;
          }

          const strokeW = (layer.strokeWidth ?? 4) * 2;
          if (strokeW > 0) {
            ctx.strokeStyle = layer.strokeColor || '#000000';
            ctx.lineWidth = strokeW;
            ctx.lineJoin = 'round';
            ctx.strokeText(text, 0, 0);
          }

          ctx.fillStyle = layer.textColor || '#FFFFFF';
          ctx.fillText(text, 0, 0);
        } else if (layer.type === 'unicode') {
          // Unicode emoji
          ctx.font = '220px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(layer.content, 0, 10);
        } else if (layer.type === 'svg') {
          // Pre-cached SVG Image
          const img = svgImageCache.get(`${layer.id}_${layer.color}`);
          if (img) {
            ctx.drawImage(img, -150, -150, 300, 300);
          }
        }

        ctx.restore();
      });

      if (onProgress) {
        onProgress(Math.round((currentFrame / totalFrames) * 100));
      }

      currentFrame++;
      setTimeout(renderNextFrame, frameInterval / 2);
    };

    renderNextFrame();
  });
}

export function exportCanvasAsPNG(
  layers: LayerItem[],
  width: number,
  height: number,
  transparent: boolean = true,
  background?: BackgroundConfig
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  ctx.clearRect(0, 0, width, height);

  if (!transparent && background) {
    drawBackgroundToCanvas(ctx, width, height, background);
  } else if (!transparent) {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);
  }

  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  sortedLayers.forEach(layer => {
    if (layer.opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
    ctx.translate(layer.x, layer.y);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.scale(layer.scaleX, layer.scaleY);

    if (layer.type === 'text') {
      const text = layer.textContent || layer.content || 'Texto';
      const fontSize = (layer.fontSize || 48) * 1.6;
      ctx.font = `${layer.isBold ? 'bold' : ''} ${layer.isItalic ? 'italic' : ''} ${fontSize}px ${
        layer.fontFamily || 'Impact, sans-serif'
      }`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (layer.hasShadow !== false) {
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
      }

      const strokeW = (layer.strokeWidth ?? 4) * 2;
      if (strokeW > 0) {
        ctx.strokeStyle = layer.strokeColor || '#000000';
        ctx.lineWidth = strokeW;
        ctx.lineJoin = 'round';
        ctx.strokeText(text, 0, 0);
      }

      ctx.fillStyle = layer.textColor || '#FFFFFF';
      ctx.fillText(text, 0, 0);
    } else if (layer.type === 'unicode') {
      ctx.font = '220px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(layer.content, 0, 10);
    } else {
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="${layer.viewBox || '0 0 300 300'}" width="300" height="300">
          <style>* { color: ${layer.color}; fill: ${layer.color}; stroke: ${layer.color}; }</style>
          ${layer.content}
        </svg>
      `;
      const img = new Image();
      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
      ctx.drawImage(img, -150, -150, 300, 300);
    }
    ctx.restore();
  });

  return canvas.toDataURL('image/png');
}
