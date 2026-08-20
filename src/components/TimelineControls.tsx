import React, { useRef, useState } from 'react';
import { Play, Pause, Repeat, Wand2, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { KeyframeData, LayerItem } from '../types';
import { generateAnimationPresets } from '../utils/animation';

interface TimelineControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  currentTime: number; // in seconds
  duration: number; // in seconds
  fps: number;
  keyframes: KeyframeData[];
  onSeek: (time: number) => void;
  onAddKeyframe: () => void;
  onDeleteKeyframe: (index: number) => void;
  onFpsChange: (fps: number) => void;
  onDurationChange: (duration: number) => void;
  aspectRatio: '9:16' | '1:1';
  onAspectRatioChange: (aspect: '9:16' | '1:1') => void;
  layers: LayerItem[];
  onApplyPreset: (keyframes: KeyframeData[]) => void;
  theme: 'light' | 'dark';
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  isPlaying,
  onTogglePlay,
  isLooping,
  onToggleLoop,
  currentTime,
  duration,
  fps,
  keyframes,
  onSeek,
  onAddKeyframe,
  onDeleteKeyframe,
  onFpsChange,
  onDurationChange,
  aspectRatio,
  onAspectRatioChange,
  layers,
  onApplyPreset,
  theme,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleTrackPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const normalized = clickX / rect.width;
    onSeek(normalized * duration);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const moveX = Math.max(0, Math.min(rect.width, moveEvent.clientX - rect.left));
      onSeek((moveX / rect.width) * duration);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const normalizedProgress = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      id="timeline-controls"
      className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 border-t transition-colors flex-shrink-0 relative ${
        theme === 'dark'
          ? 'bg-[#14171E] border-zinc-800/80 text-zinc-200'
          : 'bg-white border-zinc-200 text-zinc-800'
      }`}
    >
      {/* Main Streamlined Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 justify-between">
        {/* Play/Pause Button */}
        <button
          id="btn-play-pause"
          onClick={onTogglePlay}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm flex-shrink-0 ${
            isPlaying
              ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-400/30'
              : theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
          }`}
          title={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Loop Toggle Button */}
        <button
          id="btn-toggle-loop"
          onClick={onToggleLoop}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 flex-shrink-0 ${
            isLooping
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 font-bold'
              : theme === 'dark'
              ? 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              : 'bg-zinc-100 text-zinc-500 hover:text-zinc-800'
          }`}
          title={isLooping ? 'Bucle activado' : 'Bucle desactivado'}
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>

        {/* Timeline Scrub Track (Expands to fill available width) */}
        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          className={`relative flex-1 h-7 sm:h-8 rounded-xl flex items-center px-2 sm:px-3 cursor-pointer select-none border transition-colors min-w-[90px] ${
            theme === 'dark'
              ? 'bg-[#1E232E] border-zinc-800 hover:border-zinc-700'
              : 'bg-zinc-100 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          {/* Track Line */}
          <div
            className={`w-full h-1.5 rounded-full relative ${
              theme === 'dark' ? 'bg-zinc-700/80' : 'bg-zinc-300'
            }`}
          >
            {/* Active progress fill */}
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-75"
              style={{ width: `${normalizedProgress * 100}%` }}
            />

            {/* Keyframe Markers (Diamonds) */}
            {keyframes.map((kf, idx) => {
              const isNearPlayhead = Math.abs(kf.time - normalizedProgress) < 0.03;
              return (
                <div
                  key={idx}
                  onClick={e => {
                    e.stopPropagation();
                    onSeek(kf.time * duration);
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer p-1"
                  style={{ left: `${kf.time * 100}%` }}
                  title={`Keyframe #${idx + 1} (${(kf.time * duration).toFixed(1)}s)`}
                >
                  <div
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 transition-transform hover:scale-125 rounded-xs ${
                      isNearPlayhead
                        ? 'bg-amber-400 ring-2 ring-amber-300 shadow-md scale-110'
                        : 'bg-blue-400 ring-1 ring-blue-500'
                    }`}
                  />
                </div>
              );
            })}

            {/* Current Time Playhead Scrubber */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-5 rounded-full bg-amber-400 shadow-md border-2 border-zinc-950 pointer-events-none transition-all duration-75 flex items-center justify-center"
              style={{ left: `${normalizedProgress * 100}%` }}
            >
              <div className="w-0.5 h-2.5 bg-zinc-950 rounded" />
            </div>
          </div>
        </div>

        {/* Current Time Counter Badge */}
        <div className="font-mono font-bold text-[10px] sm:text-xs text-amber-400 whitespace-nowrap flex-shrink-0 px-1">
          {currentTime.toFixed(1)}s / {duration}s
        </div>

        {/* + Keyframe Button */}
        <button
          id="btn-add-keyframe"
          onClick={onAddKeyframe}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-[#60A5FA] hover:bg-blue-400 active:scale-95 text-zinc-950 font-bold text-[11px] sm:text-xs transition-all shadow-sm flex-shrink-0"
          title="Guardar fotograma clave"
        >
          <span>💎</span>
          <span className="hidden sm:inline">+ Keyframe</span>
        </button>

        {/* Presets Button */}
        <div className="relative flex-shrink-0">
          <button
            id="btn-presets-menu"
            onClick={() => setShowPresets(!showPresets)}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              showPresets
                ? 'bg-amber-400 text-zinc-950'
                : theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
            title="Animaciones prediseñadas"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400 group-hover:text-zinc-950" />
            <span className="hidden md:inline">Presets</span>
          </button>

          {/* Presets Flyout */}
          {showPresets && (
            <div
              className={`absolute bottom-full mb-2 right-0 w-44 py-1.5 rounded-2xl shadow-2xl border text-xs z-50 transition-all backdrop-blur-xl ${
                theme === 'dark'
                  ? 'bg-[#222732] border-zinc-700 text-zinc-200'
                  : 'bg-white border-zinc-200 text-zinc-800'
              }`}
            >
              <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Animación Mágica
              </div>
              {[
                { id: 'bounce', name: '🏀 Rebote (Bounce)' },
                { id: 'float', name: '☁️ Flotar (Floating)' },
                { id: 'spin', name: '🌀 Giro 360° (Spin)' },
                { id: 'heartbeat', name: '💓 Latido (Pulse)' },
                { id: 'wiggle', name: '〰️ Meneíto (Wiggle)' },
              ].map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onApplyPreset(generateAnimationPresets(layers, preset.id as any));
                    setShowPresets(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-400/20 hover:text-amber-300 flex items-center justify-between"
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Aspect Ratio Switch (9:16 Shorts vs 1:1 Square) */}
        <div
          id="aspect-ratio-selector"
          className={`flex items-center p-0.5 rounded-full text-[10px] sm:text-xs font-bold flex-shrink-0 ${
            theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-100 border border-zinc-200'
          }`}
        >
          <button
            onClick={() => onAspectRatioChange('9:16')}
            className={`px-2 sm:px-2.5 py-0.5 rounded-full transition-all ${
              aspectRatio === '9:16'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            9:16
          </button>
          <button
            onClick={() => onAspectRatioChange('1:1')}
            className={`px-2 sm:px-2.5 py-0.5 rounded-full transition-all ${
              aspectRatio === '1:1'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            1:1
          </button>
        </div>

        {/* Speed / Duration Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded-full transition-all flex-shrink-0 ${
            showSettings
              ? 'bg-amber-400 text-zinc-950'
              : theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
          }`}
          title="Ajustar FPS y Duración"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expandable Speed & Duration Drawer */}
      {showSettings && (
        <div
          className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-1 duration-200 ${
            theme === 'dark' ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200 text-zinc-700'
          }`}
        >
          {/* Speed (FPS) */}
          <div className="flex items-center gap-2 flex-1 min-w-[140px]">
            <span className="whitespace-nowrap font-medium text-[11px]">
              FPS: <strong className="text-amber-400">{fps}</strong>
            </span>
            <input
              type="range"
              min="12"
              max="60"
              step="6"
              value={fps}
              onChange={e => onFpsChange(parseInt(e.target.value))}
              className="w-full h-1.5 accent-amber-400 rounded-lg cursor-pointer bg-zinc-700"
            />
          </div>

          {/* Duration (Seconds) */}
          <div className="flex items-center gap-2 flex-1 min-w-[140px] justify-end">
            <span className="whitespace-nowrap font-medium text-[11px]">
              Duración: <strong className="text-amber-400">{duration}s</strong>
            </span>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={duration}
              onChange={e => onDurationChange(parseInt(e.target.value))}
              className="w-full h-1.5 accent-amber-400 rounded-lg cursor-pointer bg-zinc-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};
