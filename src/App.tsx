import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Canvas2D } from './components/Canvas2D';
import { Canvas3D } from './components/Canvas3D';
import { FloatingControls } from './components/FloatingControls';
import { TimelineControls } from './components/TimelineControls';
import { ColorSwatches } from './components/ColorSwatches';
import { BottomDrawer } from './components/BottomDrawer';
import { ExportModal } from './components/ExportModal';
import { ProjectsModal } from './components/ProjectsModal';
import { UserGuideModal } from './components/UserGuideModal';
import {
  LayerItem,
  KeyframeData,
  EmojiPiece,
  ItemCategory,
  ThemeMode,
  AspectRatioType,
  SavedProject,
  BackgroundConfig,
  AudioTrack
} from './types';
import { EMOJI_LIBRARY } from './constants/items';
import { getInterpolatedLayers } from './utils/animation';
import { saveProject } from './utils/projectStorage';
import confetti from 'canvas-confetti';

export default function App() {
  // App Appearance & Mode
  const [mode, setMode] = useState<'2D' | '3D'>('2D');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [autoRotate3D, setAutoRotate3D] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isQuickSaved, setIsQuickSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Project Identity State (Starts with a brand new, empty project)
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [projectName, setProjectName] = useState('Nuevo Personaje Lulu');

  // Selected Color for base/palette
  const [activeColor, setActiveColor] = useState('#FACC15');

  // Layers State: Start empty as requested ("quiero que todo comience con un proyecto nuevo y vacio")
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Background State
  const [background, setBackground] = useState<BackgroundConfig | undefined>(undefined);

  // Voice Recording Audio State
  const [audioTrack, setAudioTrack] = useState<AudioTrack | undefined>(undefined);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Animation & Timeline State
  const [fps, setFps] = useState(24);
  const [duration, setDuration] = useState(5); // 5 seconds default
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);

  // Keyframes State
  const [keyframes, setKeyframes] = useState<KeyframeData[]>([]);

  const lastAnimFrameTimeRef = useRef<number | null>(null);

  // Synchronize Audio with Timeline Playback
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio || !audioTrack?.audioUrl) return;

    if (isPlaying) {
      audio.currentTime = currentTime % (audioTrack.duration || duration);
      audio.volume = audioTrack.volume ?? 1.0;
      audio.play().catch(err => console.log('Audio autoplay prevented:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying, audioTrack]);

  // Handle seeking / looping audio update
  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    const audio = audioElementRef.current;
    if (audio && audioTrack?.audioUrl) {
      audio.currentTime = newTime % (audioTrack.duration || duration);
    }
  };

  // Animation Playback Loop
  useEffect(() => {
    let animId: number;

    const animateLoop = (now: number) => {
      if (lastAnimFrameTimeRef.current === null) {
        lastAnimFrameTimeRef.current = now;
      }
      const deltaSec = (now - lastAnimFrameTimeRef.current) / 1000;
      lastAnimFrameTimeRef.current = now;

      setCurrentTime(prevTime => {
        let nextTime = prevTime + deltaSec;
        if (nextTime >= duration) {
          if (isLooping) {
            nextTime = 0;
            const audio = audioElementRef.current;
            if (audio && audioTrack?.audioUrl) {
              audio.currentTime = 0;
            }
          } else {
            setIsPlaying(false);
            return duration;
          }
        }
        return nextTime;
      });

      if (isPlaying) {
        animId = requestAnimationFrame(animateLoop);
      }
    };

    if (isPlaying) {
      lastAnimFrameTimeRef.current = performance.now();
      animId = requestAnimationFrame(animateLoop);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, duration, isLooping, audioTrack]);

  // Compute interpolated layers when playing or scrubbing timeline
  const activeDisplayLayers =
    (isPlaying || keyframes.length > 0) && layers.length > 0
      ? getInterpolatedLayers(layers, keyframes, duration > 0 ? currentTime / duration : 0)
      : layers;

  // Layer Modification Handlers
  const handleUpdateLayer = (id: string, updates: Partial<LayerItem>) => {
    setLayers(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
  };

  const handleSelectColor = (color: string) => {
    setActiveColor(color);
    if (selectedLayerId) {
      handleUpdateLayer(selectedLayerId, { color });
    }
  };

  const handleMoveLayerOrder = (id: string, direction: 'up' | 'down') => {
    setLayers(prev => {
      const idx = prev.findIndex(l => l.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const newLayers = [...prev];
      const temp = newLayers[idx];
      newLayers[idx] = newLayers[targetIdx];
      newLayers[targetIdx] = temp;

      return newLayers.map((l, i) => ({ ...l, zIndex: i + 1 }));
    });
  };

  const handleDuplicateLayer = (id: string) => {
    const layer = layers.find(l => l.id === id);
    if (!layer) return;

    const newLayer: LayerItem = {
      ...layer,
      id: `layer-${Date.now()}`,
      name: `${layer.name} (Copia)`,
      x: layer.x + 40,
      y: layer.y + 40,
      zIndex: layers.length + 1,
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleDeleteLayer = (id: string) => {
    const layer = layers.find(l => l.id === id);
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
    if (layer) {
      setToastMessage(`Forma "${layer.name}" eliminada`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Add piece from bottom drawer (SVG or Unicode)
  const handleAddPiece = (
    piece: EmojiPiece | { type: 'unicode'; content: string; name: string; category: ItemCategory }
  ) => {
    const isBase = piece.category === 'bases';

    const newLayer: LayerItem = {
      id: `layer-${Date.now()}`,
      pieceId: 'id' in piece ? piece.id : `unicode-${piece.content}`,
      name: piece.name,
      category: piece.category,
      type: piece.type,
      content: piece.content,
      viewBox: 'viewBox' in piece ? piece.viewBox : undefined,
      geometryType: 'geometryType' in piece ? piece.geometryType : isBase ? 'cylinder' : 'extrude',
      depth: 'depth' in piece ? piece.depth : isBase ? 22 : 6,
      x: 540,
      y:
        piece.category === 'eyes'
          ? 810
          : piece.category === 'mouths'
          ? 935
          : piece.category === 'extras'
          ? 730
          : 860,
      z: piece.category === 'bases' ? 0 : 5,
      scaleX: isBase ? 1.35 : 1.0,
      scaleY: isBase ? 1.35 : 1.0,
      rotation: 0,
      opacity: 1,
      color: isBase ? activeColor : (piece as EmojiPiece).defaultColor || '#1E293B',
      zIndex: layers.length + 1,
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  // Add custom text layer
  const handleAddTextLayer = (options: {
    textContent: string;
    fontFamily: string;
    fontSize: number;
    textColor: string;
    strokeColor: string;
    strokeWidth: number;
    isBold: boolean;
    isItalic: boolean;
    hasShadow: boolean;
  }) => {
    const newLayer: LayerItem = {
      id: `layer-text-${Date.now()}`,
      pieceId: 'custom-text',
      name: options.textContent.slice(0, 16) || 'Texto',
      category: 'text',
      type: 'text',
      content: options.textContent,
      textContent: options.textContent,
      fontFamily: options.fontFamily,
      fontSize: options.fontSize,
      textColor: options.textColor,
      strokeColor: options.strokeColor,
      strokeWidth: options.strokeWidth,
      isBold: options.isBold,
      isItalic: options.isItalic,
      hasShadow: options.hasShadow,
      x: 540,
      y: 1100,
      z: 10,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      opacity: 1,
      color: options.textColor,
      zIndex: layers.length + 1,
    };

    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  // Helper to add default classic yellow face on empty canvas
  const handleAddDefaultBase = () => {
    handleAddPiece(EMOJI_LIBRARY[0]);
  };

  // Create New Empty Project
  const handleNewEmptyProject = () => {
    setLayers([]);
    setKeyframes([]);
    setBackground(undefined);
    setAudioTrack(undefined);
    setSelectedLayerId(null);
    setCurrentTime(0);
    setIsPlaying(false);
    setProjectId(undefined);
    setProjectName('Nuevo Personaje Lulu');
  };

  // Load a Saved Project or Template
  const handleLoadProject = (project: SavedProject) => {
    setLayers(project.layers || []);
    setKeyframes(project.keyframes || []);
    setDuration(project.duration || 5);
    setFps(project.fps || 24);
    setAspectRatio(project.aspectRatio || '9:16');
    setTheme(project.theme || 'dark');
    setBackground(project.background);
    setAudioTrack(project.audioTrack);
    setProjectId(project.id);
    setProjectName(project.name || 'Proyecto Guardado');
    setCurrentTime(0);
    setIsPlaying(false);
    setSelectedLayerId(project.layers.length > 0 ? project.layers[0].id : null);
  };

  // Quick Save current project
  const handleQuickSave = () => {
    const saved = saveProject({
      id: projectId,
      name: projectName,
      layers,
      keyframes,
      duration,
      fps,
      aspectRatio,
      theme,
      background,
      audioTrack,
    });
    setProjectId(saved.id);
    setIsQuickSaved(true);
    setTimeout(() => setIsQuickSaved(false), 2500);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.1 },
    });
  };

  // Keyframes management
  const handleAddKeyframe = () => {
    if (layers.length === 0) return;
    const normTime = Number((duration > 0 ? currentTime / duration : 0).toFixed(3));
    const currentTransforms: Record<string, any> = {};

    layers.forEach(l => {
      currentTransforms[l.id] = {
        x: l.x,
        y: l.y,
        z: l.z || 0,
        scaleX: l.scaleX,
        scaleY: l.scaleY,
        rotation: l.rotation,
        opacity: l.opacity,
      };
    });

    setKeyframes(prev => {
      const filtered = prev.filter(k => Math.abs(k.time - normTime) > 0.02);
      const newKf: KeyframeData = {
        time: normTime,
        transforms: currentTransforms,
      };
      return [...filtered, newKf].sort((a, b) => a.time - b.time);
    });
  };

  const handleDeleteKeyframe = (index: number) => {
    setKeyframes(prev => prev.filter((_, i) => i !== index));
  };

  const handleApplyPreset = (newKeyframes: KeyframeData[]) => {
    setKeyframes(newKeyframes);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;

  return (
    <div
      id="app-root-container"
      className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#0B0D11] text-zinc-100' : 'bg-slate-100 text-zinc-900'
      }`}
    >
      {/* Hidden audio element for synchronous preview playback */}
      {audioTrack?.audioUrl && (
        <audio
          ref={audioElementRef}
          src={audioTrack.audioUrl}
          preload="auto"
          loop={isLooping}
        />
      )}

      {/* Top Header */}
      <Header
        mode={mode}
        onToggleMode={setMode}
        onReset={handleNewEmptyProject}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onNewEmptyProject={handleNewEmptyProject}
        onQuickSave={handleQuickSave}
        isQuickSaved={isQuickSaved}
        projectName={projectName}
        onRenameProject={setProjectName}
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        autoRotate3D={autoRotate3D}
        onToggleAutoRotate3D={() => setAutoRotate3D(r => !r)}
        audioTrack={audioTrack}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-zinc-900/95 border border-zinc-700 text-zinc-100 font-semibold text-xs shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Viewport (Center Stage) */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Aspect Frame Container */}
        <div
          id="canvas-stage-wrapper"
          className="relative max-h-[60vh] sm:max-h-[65vh] w-full max-w-md h-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-800/40 flex items-center justify-center"
          style={{
            aspectRatio: aspectRatio === '9:16' ? '9/16' : '1/1',
          }}
        >
          {/* 2D Canvas Engine */}
          {mode === '2D' && (
            <Canvas2D
              layers={activeDisplayLayers}
              background={background}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateLayer={handleUpdateLayer}
              onDeleteLayer={handleDeleteLayer}
              onDuplicateLayer={handleDuplicateLayer}
              onOpenGuide={() => setIsGuideOpen(true)}
              aspectRatio={aspectRatio}
              theme={theme}
              isPlaying={isPlaying}
              onAddDefaultBase={handleAddDefaultBase}
              onOpenProjects={() => setIsProjectsOpen(true)}
            />
          )}

          {/* 3D Three.js Studio Engine */}
          {mode === '3D' && (
            <Canvas3D
              layers={activeDisplayLayers}
              background={background}
              aspectRatio={aspectRatio}
              theme={theme}
              autoRotate={autoRotate3D}
            />
          )}

          {/* Floating Right Controls (Rotar, Escalar, Voltear, Capas, Opacity) */}
          {mode === '2D' && selectedLayer && (
            <FloatingControls
              selectedLayer={selectedLayer}
              onUpdateLayer={handleUpdateLayer}
              onMoveLayerOrder={handleMoveLayerOrder}
              onDuplicateLayer={handleDuplicateLayer}
              onDeleteLayer={handleDeleteLayer}
              theme={theme}
            />
          )}
        </div>
      </main>

      {/* Keyframe Timeline Bar */}
      <TimelineControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(p => !p)}
        isLooping={isLooping}
        onToggleLoop={() => setIsLooping(l => !l)}
        currentTime={currentTime}
        duration={duration}
        fps={fps}
        keyframes={keyframes}
        onSeek={handleSeek}
        onAddKeyframe={handleAddKeyframe}
        onDeleteKeyframe={handleDeleteKeyframe}
        onFpsChange={setFps}
        onDurationChange={setDuration}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        layers={layers}
        onApplyPreset={handleApplyPreset}
        theme={theme}
      />

      {/* Color Swatches Palette */}
      <ColorSwatches
        selectedColor={activeColor}
        onSelectColor={handleSelectColor}
        theme={theme}
      />

      {/* Bottom Category Drawer (Bases, Ojos, Bocas, Extras, Formas, Texto, Fondos, Voz) */}
      <BottomDrawer
        onAddPiece={handleAddPiece}
        onAddTextLayer={handleAddTextLayer}
        background={background}
        onSelectBackground={setBackground}
        audioTrack={audioTrack}
        onSaveAudioTrack={setAudioTrack}
        timelineDuration={duration}
        activeColor={activeColor}
        theme={theme}
      />

      {/* Projects Modal (Save, Load, Templates, Import/Export) */}
      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        currentProject={{
          id: projectId,
          name: projectName,
          layers,
          keyframes,
          duration,
          fps,
          aspectRatio,
          theme,
          background,
          audioTrack,
        }}
        onLoadProject={handleLoadProject}
        onNewEmptyProject={handleNewEmptyProject}
        onUpdateProjectName={setProjectName}
        theme={theme}
      />

      {/* Export Modal (PNG Transparent & YouTube Shorts MP4/WebM with Voice & Custom Background) */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        layers={activeDisplayLayers}
        keyframes={keyframes}
        fps={fps}
        duration={duration}
        aspectRatio={aspectRatio}
        theme={theme}
        background={background}
        audioTrack={audioTrack}
      />

      {/* User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        theme={theme}
      />
    </div>
  );
}
