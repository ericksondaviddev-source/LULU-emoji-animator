import React, { useRef } from 'react';
import { Play, Pause, Repeat, Plus, Sparkles, Trash2, Wand2 } from 'lucide-react';
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
      className={`w-full px-4 py-3 border-t transition-colors ${
        theme === 'dark'
          ? 'bg-[#181B22] border-zinc-800/80 text-zinc-200'
          : 'bg-white border-zinc-200 text-zinc-800'
      }`}
    >
      {/* Upper Control Row: Play, Loop, +Keyframe, Aspect Ratio */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          {/* Play/Pause Button */}
          <button
            id="btn-play-pause"
            onClick={onTogglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm ${
              isPlaying
                ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-400/30'
                : theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
            }`}
            title={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Loop / Record Button */}
          <button
            id="btn-toggle-loop"
            onClick={onToggleLoop}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              isLooping
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                : theme === 'dark'
                ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                : 'bg-zinc-100 text-zinc-500 hover:text-zinc-800'
            }`}
            title={isLooping ? 'Bucle activado' : 'Bucle desactivado'}
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* + Keyframe Button */}
          <button
            id="btn-add-keyframe"
            onClick={onAddKeyframe}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#60A5FA] hover:bg-blue-400 active:scale-95 text-zinc-950 font-semibold text-xs transition-all shadow-sm"
            title="Guardar fotograma clave en este punto"
          >
            <span className="text-sm">💎</span>
            <span>+ Keyframe</span>
          </button>

          {/* Presets Button */}
          <div className="relative group">
            <button
              id="btn-presets-menu"
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
              title="Animaciones mágicas prediseñadas"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Presets</span>
            </button>

            {/* Presets Flyout */}
            <div
              className={`absolute bottom-full mb-2 left-0 w-44 py-1.5 rounded-xl shadow-2xl border text-xs z-50 hidden group-hover:block transition-all backdrop-blur-xl ${
                theme === 'dark'
                  ? 'bg-[#222732] border-zinc-700 text-zinc-200'
                  : 'bg-white border-zinc-200 text-zinc-800'
              }`}
            >
              <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Animación Mágica
              </div>
              <button
                onClick={() => onApplyPreset(generateAnimationPresets(layers, 'bounce'))}
                className="w-full text-left px-3 py-1.5 hover:bg-amber-400/20 hover:text-amber-300 flex items-center justify-between"
              >
                <span>🏀 Rebote (Bounce)</span>
              </button>
              <button
                onClick={() => onApplyPreset(generateAnimationPresets(layers, 'float'))}
                className="w-full text-left px-3 py-1.5 hover:bg-amber-400/20 hover:text-amber-300 flex items-center justify-between"
              >
                <span>☁️ Flotar (Floating)</span>
              </button>
              <button
                onClick={() => onApplyPreset(generateAnimationPresets(layers, 'spin'))}
                className="w-full text-left px-3 py-1.5 hover:bg-amber-400/20 hover:text-amber-300 flex items-center justify-between"
              >
                <span>🌀 Giro 360° (Spin)</span>
              </button>
              <button
                onClick={() => onApplyPreset(generateAnimationPresets(layers, 'heartbeat'))}
                className="w-full text-left px-3 py-1.5 hover:bg-amber-400/20 hover:text-amber-300 flex items-center justify-between"
              >
                <span>💓 Latido (Pulse)</span>
              </button>
              <button
                onClick={() => onApplyPreset(generateAnimationPresets(layers, 'wiggle'))}
                className="w-full text-left px-3 py-1.5 hover:bg-amber-400/20 hover:text-amber-300 flex items-center justify-between"
              >
                <span>〰️ Meneíto (Wiggle)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Aspect Ratio Switch (9:16 Shorts vs 1:1 Square) */}
        <div
          id="aspect-ratio-selector"
          className={`flex items-center p-1 rounded-full text-xs font-semibold ${
            theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-100 border border-zinc-200'
          }`}
        >
          <button
            onClick={() => onAspectRatioChange('9:16')}
            className={`px-3 py-1 rounded-full transition-all ${
              aspectRatio === '9:16'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            9:16
          </button>
          <button
            onClick={() => onAspectRatioChange('1:1')}
            className={`px-3 py-1 rounded-full transition-all ${
              aspectRatio === '1:1'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            1:1
          </button>
        </div>
      </div>

      {/* Timeline Scrub Track */}
      <div
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
        className={`relative w-full h-10 rounded-2xl flex items-center px-4 cursor-pointer select-none mb-2 border transition-colors ${
          theme === 'dark'
            ? 'bg-[#222732] border-zinc-800 hover:border-zinc-700'
            : 'bg-zinc-100 border-zinc-200 hover:border-zinc-300'
        }`}
      >
        {/* Track Line */}
        <div
          className={`w-full h-1 rounded-full relative ${
            theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300'
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
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group/kf cursor-pointer p-1"
                style={{ left: `${kf.time * 100}%` }}
                title={`Keyframe #${idx + 1} (${(kf.time * duration).toFixed(1)}s) - Clic para ir`}
              >
                <div
                  className={`w-3.5 h-3.5 rotate-45 transition-transform hover:scale-125 rounded-xs ${
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
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-6 rounded-full bg-amber-400 shadow-md border-2 border-zinc-950 pointer-events-none transition-all duration-75 flex items-center justify-center"
            style={{ left: `${normalizedProgress * 100}%` }}
          >
            <div className="w-0.5 h-3 bg-zinc-950 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom Sliders Row: Speed (FPS) & Duration */}
      <div className="flex items-center justify-between text-xs text-zinc-400 gap-4">
        {/* Speed (FPS) */}
        <div className="flex items-center gap-2 flex-1 max-w-[200px]">
          <span className="whitespace-nowrap font-medium text-[11px]">
            Speed (FPS) <strong className="text-zinc-200">{fps}</strong>
          </span>
          <input
            type="range"
            min="12"
            max="60"
            step="6"
            value={fps}
            onChange={e => onFpsChange(parseInt(e.target.value))}
            className="w-full h-1.5 accent-amber-400 rounded-lg cursor-pointer bg-zinc-300 dark:bg-zinc-700"
          />
        </div>

        {/* Current Time Indicator */}
        <div className="text-center font-mono font-bold text-xs text-amber-400">
          {currentTime.toFixed(1)}s / {duration}s
        </div>

        {/* Duration (Seconds) */}
        <div className="flex items-center gap-2 flex-1 max-w-[200px] justify-end">
          <span className="whitespace-nowrap font-medium text-[11px]">
            Duration <strong className="text-zinc-200">{duration}s</strong>
          </span>
          <input
            type="range"
            min="2"
            max="30"
            step="1"
            value={duration}
            onChange={e => onDurationChange(parseInt(e.target.value))}
            className="w-full h-1.5 accent-amber-400 rounded-lg cursor-pointer bg-zinc-300 dark:bg-zinc-700"
          />
        </div>
      </div>
    </div>
  );
};
