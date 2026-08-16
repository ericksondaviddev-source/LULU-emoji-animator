import React from 'react';
import {
  RotateCcw,
  Download,
  Sun,
  Moon,
  Sparkles,
  Folder,
  Plus,
  Save,
  Check,
  Edit2,
  Mic,
  Video,
  BookOpen
} from 'lucide-react';
import { AudioTrack } from '../types';

interface HeaderProps {
  mode: '2D' | '3D';
  onToggleMode: (mode: '2D' | '3D') => void;
  onReset: () => void;
  onOpenExport: () => void;
  onOpenProjects: () => void;
  onNewEmptyProject: () => void;
  onQuickSave: () => void;
  isQuickSaved: boolean;
  projectName: string;
  onRenameProject: (name: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  autoRotate3D: boolean;
  onToggleAutoRotate3D: () => void;
  audioTrack?: AudioTrack;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleMode,
  onReset,
  onOpenExport,
  onOpenProjects,
  onNewEmptyProject,
  onQuickSave,
  isQuickSaved,
  projectName,
  onRenameProject,
  theme,
  onToggleTheme,
  autoRotate3D,
  onToggleAutoRotate3D,
  audioTrack,
  onOpenGuide,
}) => {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState(projectName);

  React.useEffect(() => {
    setTitleInput(projectName);
  }, [projectName]);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = titleInput.trim() || 'Proyecto Sin Título';
    onRenameProject(trimmed);
    setIsEditingTitle(false);
  };

  return (
    <header
      id="app-header"
      className={`w-full px-2.5 sm:px-4 py-2 flex items-center justify-between z-30 transition-colors ${
        theme === 'dark' ? 'bg-[#12151C]/95 border-b border-zinc-800/80' : 'bg-white/95 border-b border-zinc-200'
      } backdrop-blur-md gap-2`}
    >
      {/* Left Section: Brand Logo + Project Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Brand Logo Badge */}
        <div className="flex items-center gap-1.5 mr-1 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 flex items-center justify-center text-lg shadow-sm border border-amber-300/50">
            🐱
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-xs font-black tracking-tight text-amber-400 leading-none">
              Lulu Emoji
            </span>
            <span className="text-[9px] font-semibold text-zinc-400 leading-none mt-0.5">
              Animator 2D/3D
            </span>
          </div>
        </div>

        {/* New Empty Project */}
        <button
          id="btn-new-project"
          onClick={onNewEmptyProject}
          className={`h-8 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
          }`}
          title="Crear un nuevo proyecto vacío"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>

        {/* Projects Manager Modal Button */}
        <button
          id="btn-open-projects"
          onClick={onOpenProjects}
          className={`h-8 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
          }`}
          title="Abrir o administrar proyectos guardados"
        >
          <Folder className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Proyectos</span>
        </button>

        {/* Quick Save Button */}
        <button
          id="btn-quick-save"
          onClick={onQuickSave}
          className={`h-8 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm ${
            isQuickSaved
              ? 'bg-emerald-500 text-zinc-950'
              : theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
          }`}
          title="Guardar cambios rápidamente"
        >
          {isQuickSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-amber-400" />}
          <span className="hidden lg:inline">{isQuickSaved ? '¡Guardado!' : 'Guardar'}</span>
        </button>

        {/* Project Name (Editable) */}
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex items-center">
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={e => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              className={`h-7 text-xs font-semibold px-2 rounded-lg border outline-none max-w-[130px] sm:max-w-[180px] ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-amber-400 text-zinc-100'
                  : 'bg-white border-amber-500 text-zinc-900'
              }`}
            />
          </form>
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className={`hidden md:flex items-center gap-1.5 h-7 px-2 rounded-lg text-xs font-medium max-w-[150px] truncate transition-colors ${
              theme === 'dark'
                ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title="Haz click para renombrar el proyecto"
          >
            <span className="truncate">{projectName}</span>
            <Edit2 className="w-3 h-3 text-zinc-500 opacity-60 flex-shrink-0" />
          </button>
        )}

        {/* Audio badge if voice is recorded */}
        {audioTrack && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
            <Mic className="w-3 h-3 animate-pulse" />
            <span>Voz ({audioTrack.duration.toFixed(1)}s)</span>
          </div>
        )}

        {/* User Guide Button */}
        {onOpenGuide && (
          <button
            id="btn-open-guide-header"
            onClick={onOpenGuide}
            className="h-8 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/30"
            title="Ver Guía de Uso paso a paso"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guía</span>
          </button>
        )}
      </div>

      {/* Center 2D / 3D Segmented Switch */}
      <div
        id="mode-segmented-switch"
        className={`flex items-center p-0.5 sm:p-1 rounded-full text-xs font-bold border transition-colors shadow-inner ${
          theme === 'dark' ? 'bg-[#0A0C10] border-zinc-800' : 'bg-zinc-100 border-zinc-200'
        }`}
      >
        <button
          id="btn-mode-2d"
          onClick={() => onToggleMode('2D')}
          className={`px-3.5 sm:px-5 py-1 rounded-full transition-all duration-200 font-bold ${
            mode === '2D'
              ? 'bg-amber-400 text-zinc-950 shadow-md scale-100'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          2D
        </button>
        <button
          id="btn-mode-3d"
          onClick={() => onToggleMode('3D')}
          className={`px-3.5 sm:px-5 py-1 rounded-full transition-all duration-200 font-bold ${
            mode === '3D'
              ? 'bg-amber-400 text-zinc-950 shadow-md scale-100'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          3D
        </button>
      </div>

      {/* Right Section: 3D Spin, Theme, Reset, Guardar Video & Export */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 3D Auto Spin Toggle (visible in 3D mode) */}
        {mode === '3D' && (
          <button
            onClick={onToggleAutoRotate3D}
            className={`h-8 px-2.5 sm:px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              autoRotate3D
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : theme === 'dark'
                ? 'bg-zinc-800 text-zinc-400'
                : 'bg-zinc-100 text-zinc-600'
            }`}
            title="Auto-rotación 360°"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Giro 360°</span>
          </button>
        )}

        {/* Reset / Clear Button */}
        <button
          id="btn-reset-canvas"
          onClick={onReset}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
          }`}
          title="Limpiar o reiniciar lienzo"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle (Sun/Moon) */}
        <button
          id="btn-toggle-theme"
          onClick={onToggleTheme}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-400'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
          }`}
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Guardar Video Button (High Priority User Request) */}
        <button
          id="btn-save-video"
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 active:scale-95 text-white font-bold text-xs sm:text-xs shadow-md transition-all ring-2 ring-red-500/20"
          title="Guardar Video para YouTube Shorts / TikTok"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Guardar Video</span>
        </button>

        {/* Export Modal Button */}
        <button
          id="btn-export-modal"
          onClick={onOpenExport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-bold text-xs shadow-md transition-all"
          title="Exportar como PNG transparente o Video Shorts con Voz"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
