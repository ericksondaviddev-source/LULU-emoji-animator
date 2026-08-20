import React, { useState } from 'react';
import { Sparkles, Wand2, Play, RefreshCw, X, Lightbulb, MessageSquareQuote, Check, Dices } from 'lucide-react';
import { LayerItem, KeyframeData } from '../types';
import {
  CHARACTER_THEMES,
  ANIMATION_STYLES,
  DIALOGUE_COLLECTION,
  generateSmartCharacterByText,
  generateRandomCharacter,
  buildCharacterFromPreset,
  generateSmartKeyframes,
} from '../utils/magicGenerator';

interface MagicStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: '9:16' | '1:1';
  currentLayers: LayerItem[];
  duration: number;
  fps: number;
  onApplyCharacter: (data: {
    projectName: string;
    backgroundColor: string;
    layers: LayerItem[];
    suggestedCaption?: string;
  }) => void;
  onApplyKeyframes: (keyframes: KeyframeData[], title: string) => void;
  theme: 'light' | 'dark';
}

export const MagicStudioModal: React.FC<MagicStudioModalProps> = ({
  isOpen,
  onClose,
  aspectRatio,
  currentLayers,
  duration,
  onApplyCharacter,
  onApplyKeyframes,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'character' | 'animation' | 'dialogue'>('character');
  const [characterSearch, setCharacterSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dialogueQuery, setDialogueQuery] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof CHARACTER_THEMES[0]) => {
    const result = buildCharacterFromPreset(preset, aspectRatio);
    onApplyCharacter(result);
    setSuccessMessage(`¡Personaje "${result.projectName}" aplicado con éxito!`);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleSearchCharacter = () => {
    if (!characterSearch.trim()) return;
    const result = generateSmartCharacterByText(characterSearch, aspectRatio);
    onApplyCharacter(result);
    setSuccessMessage(`¡Personaje "${result.projectName}" listo!`);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleGenerateRandom = () => {
    const result = generateRandomCharacter(aspectRatio);
    onApplyCharacter(result);
    setSuccessMessage('¡Personaje sorpresa aleatorio generado!');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleApplyAnimationStyle = (styleId: string) => {
    if (currentLayers.length === 0) {
      alert('Primero añade o selecciona un personaje antes de animar.');
      return;
    }
    const anim = generateSmartKeyframes(styleId, currentLayers, duration);
    onApplyKeyframes(anim.keyframes, anim.animationTitle);
    setSuccessMessage(`¡Animación "${anim.animationTitle}" aplicada a la línea de tiempo!`);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const filteredThemes = CHARACTER_THEMES.filter(
    p =>
      p.name.toLowerCase().includes(characterSearch.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(characterSearch.toLowerCase()))
  );

  const filteredDialogues = DIALOGUE_COLLECTION.filter(d =>
    d.phrase.toLowerCase().includes(dialogueQuery.toLowerCase()) ||
    d.tone.toLowerCase().includes(dialogueQuery.toLowerCase())
  );

  return (
    <div
      id="magic-studio-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="magic-studio-modal-container"
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          theme === 'dark'
            ? 'bg-[#14171F] border-zinc-700/80 text-zinc-100 shadow-black/80'
            : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-400/60'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-zinc-950 shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">Estudio Mágico Instantáneo</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Offline & Rápido
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Genera personajes listos, bailes y coreografías sin servidores ni demoras
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-zinc-800 px-4 pt-2 gap-2 bg-zinc-900/40">
          <button
            onClick={() => { setActiveTab('character'); setSuccessMessage(null); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'character'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>1. Personajes Listos</span>
          </button>

          <button
            onClick={() => { setActiveTab('animation'); setSuccessMessage(null); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'animation'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>2. Coreografías de Movimiento</span>
          </button>

          <button
            onClick={() => { setActiveTab('dialogue'); setSuccessMessage(null); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'dialogue'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>3. Ideas de Voces</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* TAB 1: Characters */}
          {activeTab === 'character' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={characterSearch}
                    onChange={e => setCharacterSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearchCharacter()}
                    placeholder="Buscar o inventar tema (ej. pirata, robot, alien, princesa)..."
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-800 placeholder-zinc-400'
                    }`}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSearchCharacter}
                    className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Crear</span>
                  </button>

                  <button
                    onClick={handleGenerateRandom}
                    className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 border border-zinc-700"
                    title="Crear combinación aleatoria"
                  >
                    <Dices className="w-4 h-4 text-amber-400" />
                    <span>Aleatorio</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  Elige un personaje temático completo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {filteredThemes.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between group ${
                        theme === 'dark'
                          ? 'bg-zinc-900/80 border-zinc-800 hover:border-amber-400/60 hover:bg-zinc-800/80 text-zinc-200'
                          : 'bg-zinc-50 border-zinc-200 hover:border-amber-400 hover:bg-amber-50/50 text-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xl">{preset.emoji}</span>
                        <span className="font-bold text-xs text-zinc-100 group-hover:text-amber-400 transition-colors">
                          {preset.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Animation Coreographies */}
          {activeTab === 'animation' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Selecciona una coreografía para aplicar física de rebote, giros y movimientos automáticos a tu personaje.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ANIMATION_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => handleApplyAnimationStyle(style.id)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 flex items-start gap-3 group ${
                      theme === 'dark'
                        ? 'bg-zinc-900/80 border-zinc-800 hover:border-amber-400/60 hover:bg-zinc-800/80 text-zinc-200'
                        : 'bg-zinc-50 border-zinc-200 hover:border-amber-400 hover:bg-amber-50/50 text-zinc-700'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{style.emoji}</span>
                    <div>
                      <span className="font-bold text-xs text-zinc-100 group-hover:text-amber-400 transition-colors block mb-1">
                        {style.name}
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {style.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Voice Dialogue Ideas */}
          {activeTab === 'dialogue' && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={dialogueQuery}
                  onChange={e => setDialogueQuery(e.target.value)}
                  placeholder="Filtrar por palabra clave (ej. pirata, robot, divertido)..."
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                    theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-800 placeholder-zinc-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredDialogues.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border ${
                      theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400 uppercase block w-fit mb-1.5">
                      {item.tone}
                    </span>
                    <p className="text-xs font-semibold italic text-zinc-200">"{item.phrase}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 bg-zinc-900/20">
          <span>Diseño Instantáneo 100% Autónomo</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
