import React, { useState } from 'react';
import { Sparkles, Wand2, Play, RefreshCw, X, Lightbulb, MessageSquareQuote, Check, AlertCircle } from 'lucide-react';
import { LayerItem, KeyframeData, LayerTransform } from '../types';
import { EMOJI_LIBRARY } from '../constants/items';

interface AIStudioModalProps {
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

const CHARACTER_PROMPT_PRESETS = [
  { label: '🐱 Gatito Pirata', prompt: 'Un gatito pirata con sombrero de capitán pirata, parche en el ojo y sonrisa pícara' },
  { label: '👽 Alien Espacial', prompt: 'Un alienígena verde feliz con tres ojos grandes brillantes y antenas' },
  { label: '🤖 Robot Gamer', prompt: 'Un robot cibernético moderno con audífonos gamer y ojos láser' },
  { label: '😈 Diablito Kawaii', prompt: 'Un diablito simpático color coral con cuernos, mejillas sonrojadas y guiño' },
  { label: '👑 Princesa Mágica', prompt: 'Una princesa tierna con corona de oro brillante, ojos de estrellas y labios de beso' },
  { label: '🤠 Vaquero Sonriente', prompt: 'Un vaquero del oeste con sombrero texano, bigote gracioso y guiño' },
  { label: '🎃 Calabaza de Fiesta', prompt: 'Una calabaza animada con sombrero de fiesta, dientes divertidos y estrellas' },
  { label: '👻 Fantasmita Tierno', prompt: 'Un fantasmita blanco suave con boca de asombro y brillo mágico' },
];

const ANIMATION_PRESETS = [
  { label: '🕺 Baile Divertido', prompt: 'Baile rítmico alegre con rebote hacia arriba y abajo, inclinaciones a los lados y guiño' },
  { label: '😂 Ataque de Risa', prompt: 'Carcajada cómica con temblor rápido, boca expandiéndose y ojos achinados' },
  { label: '😱 Susto Cómico', prompt: 'Reacción de sorpresa cómica saltando hacia atrás, ojos agrandados y caída suave' },
  { label: '❤️ Latido Amoroso', prompt: 'Efecto de corazón latiendo con pulso de escala suave y balanceo tierno' },
  { label: '🚀 Despegue Espacial', prompt: 'Vibración de motor previa y salto hacia arriba con rotación rápida' },
  { label: '🌀 Mareo Giratorio', prompt: 'Giro circular tambaleante con ojos desorientados y desaceleración' },
];

export const AIStudioModal: React.FC<AIStudioModalProps> = ({
  isOpen,
  onClose,
  aspectRatio,
  currentLayers,
  duration,
  fps,
  onApplyCharacter,
  onApplyKeyframes,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'character' | 'animation' | 'dialogue'>('character');
  const [characterPrompt, setCharacterPrompt] = useState('');
  const [animationPrompt, setAnimationPrompt] = useState('');
  const [dialoguePrompt, setDialoguePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [suggestedDialogues, setSuggestedDialogues] = useState<Array<{ phrase: string; tone: string }>>([]);

  if (!isOpen) return null;

  const handleGenerateCharacter = async (promptToUse?: string) => {
    const text = promptToUse || characterPrompt;
    if (!text.trim()) {
      setError('Por favor escribe o selecciona una idea para el personaje.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/gemini/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          aspectRatio,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Error al conectar con la IA de Gemini');
      }

      const { data } = json;
      const constructedLayers: LayerItem[] = [];

      data.layers.forEach((aiLayer: any, index: number) => {
        const matchedPiece = EMOJI_LIBRARY.find(p => p.id === aiLayer.pieceId) || EMOJI_LIBRARY.find(p => p.id.startsWith(aiLayer.pieceId.split('-')[0])) || EMOJI_LIBRARY[0];

        constructedLayers.push({
          id: `layer-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
          pieceId: matchedPiece.id,
          name: aiLayer.name || matchedPiece.name,
          category: matchedPiece.category,
          x: aiLayer.x || 540,
          y: aiLayer.y || (aspectRatio === '9:16' ? 960 : 540),
          scaleX: aiLayer.scale || 1.0,
          scaleY: aiLayer.scale || 1.0,
          rotation: aiLayer.rotation || 0,
          color: aiLayer.color || matchedPiece.defaultColor || '#FACC15',
          opacity: 1,
          depth: aiLayer.depth || matchedPiece.depth || 16,
          geometryType: matchedPiece.geometryType || 'extrude',
          type: matchedPiece.type,
          content: matchedPiece.content,
          viewBox: matchedPiece.viewBox,
          zIndex: index,
          locked: false,
        });
      });

      onApplyCharacter({
        projectName: data.projectName || 'Personaje IA',
        backgroundColor: data.backgroundColor || '#1E293B',
        layers: constructedLayers,
        suggestedCaption: data.suggestedCaption,
      });

      setSuccessMessage(data.explanation || '¡Personaje generado con éxito!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo generar el personaje.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAnimation = async (promptToUse?: string) => {
    const text = promptToUse || animationPrompt;
    if (!text.trim()) {
      setError('Por favor escribe o selecciona un estilo de animación.');
      return;
    }

    if (currentLayers.length === 0) {
      setError('Primero añade al menos una figura en el lienzo para poder animarla.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/gemini/generate-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          layers: currentLayers,
          duration,
          fps,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Error al generar animación con Gemini');
      }

      const { data } = json;
      const formattedKeyframes: KeyframeData[] = (data.keyframes || []).map((kf: any) => {
        const transforms: Record<string, LayerTransform> = {};
        (kf.layerTransforms || []).forEach((lt: any) => {
          transforms[lt.layerId] = {
            x: lt.x ?? 540,
            y: lt.y ?? (aspectRatio === '9:16' ? 960 : 540),
            scaleX: lt.scaleX ?? 1,
            scaleY: lt.scaleY ?? 1,
            rotation: lt.rotation ?? 0,
            opacity: lt.opacity ?? 1,
          };
        });
        const normalizedTime = Math.max(0, Math.min(1, kf.time / (duration || 5)));
        return {
          time: Number(normalizedTime.toFixed(3)),
          transforms,
        };
      });

      onApplyKeyframes(formattedKeyframes, data.animationTitle || 'Animación IA');
      setSuccessMessage(data.explanation || '¡Animación generada y aplicada a la línea de tiempo!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo generar la animación.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDialogues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/suggest-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterDescription: dialoguePrompt || 'Personaje animado para video corto de YouTube Shorts',
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Error al generar frases');
      }

      setSuggestedDialogues(json.data.dialogues || []);
    } catch (err: any) {
      setError(err.message || 'Error al obtener sugerencias de voz');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ai-studio-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="ai-studio-modal-container"
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
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
                <h2 className="text-base font-extrabold tracking-tight">Estudio Mágico con IA</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gemini Free
                </span>
              </div>
              <p className="text-xs text-zinc-400">Crea personajes, animaciones y frases con Inteligencia Artificial</p>
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
            onClick={() => { setActiveTab('character'); setError(null); setSuccessMessage(null); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'character'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>1. Crear Personaje</span>
          </button>

          <button
            onClick={() => { setActiveTab('animation'); setError(null); setSuccessMessage(null); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'animation'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>2. Coreografiar Animación</span>
          </button>

          <button
            onClick={() => { setActiveTab('dialogue'); setError(null); setSuccessMessage(null); }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'dialogue'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>3. Frases de Voz</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Feedback Banners */}
          {error && (
            <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Aviso: </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* TAB 1: Character Generator */}
          {activeTab === 'character' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Describe el personaje que imaginas:</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={characterPrompt}
                    onChange={e => setCharacterPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !isLoading && handleGenerateCharacter()}
                    placeholder="Ej. Un oso polar feliz con bufanda roja y gafas de sol..."
                    className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-800 placeholder-zinc-400'
                    }`}
                  />
                  <button
                    onClick={() => handleGenerateCharacter()}
                    disabled={isLoading || !characterPrompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-zinc-950 font-extrabold text-xs shadow-md disabled:opacity-50 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    <span>{isLoading ? 'Creando...' : 'Crear'}</span>
                  </button>
                </div>
              </div>

              {/* Suggestions Grid */}
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  O toca una idea rápida lista para usar:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CHARACTER_PROMPT_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      disabled={isLoading}
                      onClick={() => {
                        setCharacterPrompt(preset.prompt);
                        handleGenerateCharacter(preset.prompt);
                      }}
                      className={`p-2.5 rounded-2xl border text-left text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between ${
                        theme === 'dark'
                          ? 'bg-zinc-900/80 border-zinc-800 hover:border-amber-400/60 hover:bg-zinc-800/80 text-zinc-200'
                          : 'bg-zinc-50 border-zinc-200 hover:border-amber-400 hover:bg-amber-50/50 text-zinc-700'
                      }`}
                    >
                      <span className="font-bold text-xs">{preset.label}</span>
                      <span className="text-[10px] text-zinc-400 line-clamp-1 mt-1">
                        {preset.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Animation Choreographer */}
          {activeTab === 'animation' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span>¿Qué acción o emoción debe realizar tu personaje?</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={animationPrompt}
                    onChange={e => setAnimationPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !isLoading && handleGenerateAnimation()}
                    placeholder="Ej. Salto de alegría con rebote y guiño al final..."
                    className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-800 placeholder-zinc-400'
                    }`}
                  />
                  <button
                    onClick={() => handleGenerateAnimation()}
                    disabled={isLoading || !animationPrompt.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-zinc-950 font-extrabold text-xs shadow-md disabled:opacity-50 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isLoading ? 'Animando...' : 'Animar'}</span>
                  </button>
                </div>
              </div>

              {/* Animation Suggestions Grid */}
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  Movimientos y coreografías inteligentes:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ANIMATION_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      disabled={isLoading}
                      onClick={() => {
                        setAnimationPrompt(preset.prompt);
                        handleGenerateAnimation(preset.prompt);
                      }}
                      className={`p-2.5 rounded-2xl border text-left text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between ${
                        theme === 'dark'
                          ? 'bg-zinc-900/80 border-zinc-800 hover:border-amber-400/60 hover:bg-zinc-800/80 text-zinc-200'
                          : 'bg-zinc-50 border-zinc-200 hover:border-amber-400 hover:bg-amber-50/50 text-zinc-700'
                      }`}
                    >
                      <span className="font-bold text-xs">{preset.label}</span>
                      <span className="text-[10px] text-zinc-400 line-clamp-1 mt-1">
                        {preset.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Voice Dialogue Suggestions */}
          {activeTab === 'dialogue' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Generador de frases y diálogos cómicos para grabar tu voz:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dialoguePrompt}
                    onChange={e => setDialoguePrompt(e.target.value)}
                    placeholder="Ej. Un pirata presumido que busca su tesoro..."
                    className={`flex-1 px-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-800 placeholder-zinc-400'
                    }`}
                  />
                  <button
                    onClick={handleGenerateDialogues}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Sugerir Frases</span>
                  </button>
                </div>
              </div>

              {suggestedDialogues.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Ideas de frases para grabar:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedDialogues.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border ${
                          theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400 uppercase block w-fit mb-1">
                          {item.tone}
                        </span>
                        <p className="text-xs font-semibold italic text-zinc-200">"{item.phrase}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 bg-zinc-900/20">
          <span>Impulsado por Google Gemini 3.7 Flash</span>
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
