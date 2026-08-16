import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Folder,
  Plus,
  Save,
  Download,
  Upload,
  Copy,
  Trash2,
  Check,
  Sparkles,
  Layers,
  Clock,
  Film,
  Calendar,
  Mic,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavedProject, LayerItem, KeyframeData, AspectRatioType, ThemeMode, BackgroundConfig, AudioTrack } from '../types';
import {
  getSavedProjects,
  saveProject,
  deleteProject,
  duplicateProject,
  exportProjectFile,
  importProjectFile,
  PROJECT_TEMPLATES
} from '../utils/projectStorage';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: {
    id?: string;
    name: string;
    layers: LayerItem[];
    keyframes: KeyframeData[];
    duration: number;
    fps: number;
    aspectRatio: AspectRatioType;
    theme: ThemeMode;
    background?: BackgroundConfig;
    audioTrack?: AudioTrack;
  };
  onLoadProject: (project: SavedProject) => void;
  onNewEmptyProject: () => void;
  onUpdateProjectName: (name: string) => void;
  theme: ThemeMode;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onLoadProject,
  onNewEmptyProject,
  onUpdateProjectName,
  theme,
}) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [activeTab, setActiveTab] = useState<'saved' | 'templates'>('saved');
  const [projectNameInput, setProjectNameInput] = useState(currentProject.name);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync project name input when opened
  useEffect(() => {
    if (isOpen) {
      setProjects(getSavedProjects());
      setProjectNameInput(currentProject.name);
      setSaveSuccess(false);
      setConfirmDeleteId(null);
    }
  }, [isOpen, currentProject.name]);

  if (!isOpen) return null;

  // Handle Save Current Project
  const handleSaveCurrent = () => {
    const trimmed = projectNameInput.trim() || 'Proyecto Sin Título';
    onUpdateProjectName(trimmed);
    saveProject({
      ...currentProject,
      name: trimmed,
    });
    setProjects(getSavedProjects());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  // Handle Load
  const handleLoad = (p: SavedProject) => {
    onLoadProject(p);
    onClose();
  };

  // Handle Load Template
  const handleLoadTemplate = (tpl: typeof PROJECT_TEMPLATES[0]) => {
    const now = Date.now();
    const newProj: SavedProject = {
      ...tpl,
      id: `proj-${now}`,
      updatedAt: now,
      createdAt: now,
    };
    onLoadProject(newProj);
    onClose();
  };

  // Handle Duplicate
  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateProject(id);
    setProjects(getSavedProjects());
  };

  // Handle Delete
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDeleteId === id) {
      deleteProject(id);
      setProjects(getSavedProjects());
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  // Handle Export File (.json)
  const handleExportFile = (p: SavedProject, e: React.MouseEvent) => {
    e.stopPropagation();
    exportProjectFile(p);
  };

  // Handle Import JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const imported = importProjectFile(content);
        setProjects(getSavedProjects());
        onLoadProject(imported);
        onClose();
      } catch (err: any) {
        alert(err.message || 'Error al importar archivo');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-[#181B22] border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shadow-md">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Gestor de Proyectos Lulu</h3>
              <p className="text-xs text-zinc-400">Guarda, carga y administra tus animaciones con voz y fondos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Save Current Workspace Banner */}
        <div
          className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
            theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-slate-50 border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap">Nombre:</span>
            <input
              type="text"
              value={projectNameInput}
              onChange={e => setProjectNameInput(e.target.value)}
              placeholder="Nombre del proyecto..."
              className={`w-full text-xs font-semibold px-3 py-1.5 rounded-xl border outline-none transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-amber-400'
                  : 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrent}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                saveSuccess
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
              }`}
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? '¡Guardado!' : 'Guardar Actual'}</span>
            </button>

            <button
              onClick={() => {
                onNewEmptyProject();
                onClose();
              }}
              className={`px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 border transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-700'
              }`}
              title="Crear un lienzo totalmente nuevo y vacío"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Nuevo Vacío</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                activeTab === 'saved'
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Mis Proyectos ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plantillas ({PROJECT_TEMPLATES.length})</span>
            </button>
          </div>

          {/* Import JSON File Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar (.json)</span>
            </button>
          </div>
        </div>

        {/* Projects List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {activeTab === 'saved' && (
            <>
              {projects.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-3 border border-zinc-700/50">
                    <Folder className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-300 mb-1">No hay proyectos guardados todavía</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mb-4">
                    Usa el botón "Guardar Actual" para almacenar tu creación o explora las plantillas prediseñadas.
                  </p>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all"
                  >
                    Ver Plantillas
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map(p => {
                    const isCurrent = p.id === currentProject.id;
                    const dateStr = new Date(p.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleLoad(p)}
                        className={`group relative p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between ${
                          isCurrent
                            ? 'border-amber-400 bg-amber-400/10'
                            : theme === 'dark'
                            ? 'bg-zinc-900/70 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700'
                            : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        {/* Top Info & Badges */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-bold text-xs truncate">{p.name}</h4>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-zinc-950 uppercase">
                                  Activo
                                </span>
                              )}
                              {p.audioTrack && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 flex items-center gap-1 border border-red-500/30">
                                  <Mic className="w-2.5 h-2.5" /> Voz
                                </span>
                              )}
                              {p.background && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-400 flex items-center gap-1 border border-purple-500/30">
                                  <Palette className="w-2.5 h-2.5" /> Fondo
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" /> {dateStr}
                            </span>
                          </div>

                          {/* Thumbnail preview or icon */}
                          {p.thumbnail ? (
                            <img
                              src={p.thumbnail}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-contain bg-black/40 border border-zinc-700/60 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-400/30 flex-shrink-0">
                              🎭
                            </div>
                          )}
                        </div>

                        {/* Specs & Stats */}
                        <div className="flex items-center gap-3 text-[10px] text-zinc-400 border-t border-zinc-800/40 pt-2 my-1">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-amber-400" /> {p.layers.length} capas
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-400" /> {p.duration}s ({p.fps} fps)
                          </span>
                          <span className="flex items-center gap-1">
                            <Film className="w-3 h-3 text-purple-400" /> {p.keyframes.length} kf
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-1.5 mt-2 pt-1">
                          {/* Export JSON */}
                          <button
                            onClick={e => handleExportFile(p, e)}
                            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            title="Descargar archivo .json"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={e => handleDuplicate(p.id, e)}
                            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            title="Duplicar proyecto"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={e => handleDelete(p.id, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              confirmDeleteId === p.id
                                ? 'bg-red-500 text-white font-bold text-[10px] px-2'
                                : 'bg-zinc-800/60 hover:bg-red-500/20 text-red-400'
                            }`}
                            title={confirmDeleteId === p.id ? 'Click para confirmar eliminación' : 'Eliminar proyecto'}
                          >
                            {confirmDeleteId === p.id ? '¿Borrar?' : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TEMPLATES.map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => handleLoadTemplate(tpl)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'bg-zinc-900/70 hover:bg-zinc-800/80 border-zinc-800 hover:border-amber-400/50'
                      : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 hover:border-amber-400/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-bold text-xs">{tpl.name}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Plantilla lista con fondo y keyframes</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-400/30 flex-shrink-0">
                      ✨
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40">
                    <span className="text-[10px] text-zinc-400">
                      {tpl.layers.length} capas • {tpl.duration}s duración
                    </span>
                    <button className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-sm transition-all">
                      Usar Plantilla
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
