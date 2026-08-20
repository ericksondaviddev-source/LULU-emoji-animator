import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Trash2,
  Video,
  Play,
  Sparkles,
  Mic,
  Palette,
  Layers,
  Move,
  RotateCw,
  Maximize2,
  Box,
  Download,
  Keyboard,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Folder
} from 'lucide-react';
import { ThemeMode } from '../types';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose, theme }) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'delete' | 'video' | 'animation' | 'voice' | 'shortcuts'>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-[#16181E] border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-800'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight">Guía de Uso Completa</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  Lulu Animator
                </span>
              </div>
              <p className="text-xs text-zinc-400">Aprende a crear, animar, borrar formas y guardar videos fácilmente</p>
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-zinc-800/40 overflow-x-auto no-scrollbar bg-zinc-900/10">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quickstart'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Inicio Rápido</span>
          </button>

          <button
            onClick={() => setActiveTab('delete')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'delete'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>2. Borrar Formas</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>3. Guardar Video</span>
          </button>

          <button
            onClick={() => setActiveTab('animation')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'animation'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>4. Animación</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>5. Voz & Fondos</span>
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'shortcuts'
                ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Atajos</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold flex-shrink-0">
                  ✨
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-400">¿Cómo crear tu primera animación en 4 pasos?</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Lulu Emoji Animator te permite armar caras personalizadas, animarlas con fotogramas clave, agregarles voz y guardarlas como video para YouTube Shorts o TikTok.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center mb-2">
                      1
                    </div>
                    <h5 className="font-bold text-xs text-zinc-100">Agrega Formas, Piezas y Efectos</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      Usa el panel inferior para elegir <strong>Bases</strong>, <strong>Ojos</strong>, <strong>Bocas</strong>, <strong>Texto</strong> o la pestaña <strong>Extras</strong> para añadir <strong>Efectos Visuales Animados</strong> (Estrellas, Burbujas, Confeti, Chispas, Corazones).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 font-black text-xs flex items-center justify-center mb-2">
                      2
                    </div>
                    <h5 className="font-bold text-xs text-zinc-100">Edita o Borra Cualquier Forma</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      Toca cualquier elemento en el lienzo para moverlo, agrandarlo, girarlo o <strong>eliminarlo con el botón rojo 🗑️</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center mb-2">
                      3
                    </div>
                    <h5 className="font-bold text-xs text-zinc-100">Anima con Keyframes o Presets</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      Mueve la barra de tiempo y pulsa <strong>+ Keyframe</strong> para guardar poses, o pulsa <strong>Presets</strong> para animaciones instantáneas (Baile, Saludo, Bote).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center mb-2">
                      4
                    </div>
                    <h5 className="font-bold text-xs text-zinc-100">Guarda el Video con Voz y Fondo</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      Haz click en el botón <strong>"Guardar Video"</strong> arriba a la derecha para descargar tu video en formato vertical 9:16 de alta calidad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DELETE SHAPES */}
          {activeTab === 'delete' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-red-400">Cómo borrar cualquier forma que elijas</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Puedes eliminar fácilmente cualquier pieza, base, accesorio, emoji o texto del lienzo usando cualquiera de estos 4 métodos:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Method 1 */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-xs text-zinc-200">1. Botón Rojo en la Forma Seleccionada</h5>
                    <p className="text-[11px] text-zinc-400">
                      Al tocar cualquier forma en el lienzo aparece un marco con un <strong>botón rojo 🗑️ en la esquina superior derecha</strong>. Haz click sobre él para borrarla inmediatamente.
                    </p>
                  </div>
                </div>

                {/* Method 2 */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-amber-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 shadow">
                    Supr
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-xs text-zinc-200">2. Tecla Supr / Backspace</h5>
                    <p className="text-[11px] text-zinc-400">
                      Selecciona la forma que quieras eliminar y presiona la tecla <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono text-[10px]">Supr</kbd> (Delete) o <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono text-[10px]">Backspace</kbd> en tu teclado.
                    </p>
                  </div>
                </div>

                {/* Method 3 */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-red-400 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow">
                    <Move className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-xs text-zinc-200">3. Barra de Controles Flotante Lateral</h5>
                    <p className="text-[11px] text-zinc-400">
                      En el menú vertical de la derecha, presiona el icono de la papelera roja en la parte inferior para borrar la capa activa.
                    </p>
                  </div>
                </div>

                {/* Method 4 */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    HUD
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-xs text-zinc-200">4. Indicador Superior de Forma Activa</h5>
                    <p className="text-[11px] text-zinc-400">
                      En la parte superior izquierda del lienzo verás el nombre de la forma seleccionada con un botón directo <strong>"Borrar Forma"</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAVE VIDEO */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-blue-400">Cómo Guardar y Descargar tu Video</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Lulu Animator renderiza videos de alta resolución (1080x1920) optimizados para <strong>YouTube Shorts</strong>, <strong>TikTok</strong> e <strong>Instagram Reels</strong>, incluyendo tu grabación de voz y fondos personalizados.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-zinc-200 flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center text-[10px]">1</span>
                    Presiona el botón "Guardar Video"
                  </h5>
                  <p className="text-xs text-zinc-400">
                    En la barra superior encontrarás el botón <strong>"Guardar Video"</strong> con icono de cámara. También puedes presionar <strong>"Export"</strong> en cualquier momento.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-zinc-200 flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center text-[10px]">2</span>
                    Elige Formato y Renderiza
                  </h5>
                  <p className="text-xs text-zinc-400">
                    En la ventana de exportación puedes verificar la duración, los FPS (24 o 30), el estado del audio de voz y el fondo seleccionado. Haz click en <strong>"Generar Video Shorts"</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-zinc-200 flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center text-[10px]">3</span>
                    Descarga a tu Dispositivo
                  </h5>
                  <p className="text-xs text-zinc-400">
                    Una vez completado el procesamiento verás una vista previa del video y el botón <strong>"Descargar Video (MP4/WebM)"</strong> listo para compartir en tus redes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANIMATION */}
          {activeTab === 'animation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-purple-400">Cómo Animar con Keyframes</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Un <strong>Keyframe</strong> (fotograma clave) guarda la posición, tamaño y rotación de todas las partes de tu personaje en un instante de tiempo. El sistema interpola suavemente los movimientos intermedios.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-amber-400 mb-1">Paso A: Mover el cabezal de tiempo</h5>
                  <p className="text-[11px] text-zinc-400">
                    Haz click o arrastra en la barra de tiempo inferior hacia el segundo donde deseas que ocurra un movimiento (ej. a la mitad de la animación).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-amber-400 mb-1">Paso B: Ajustar las piezas</h5>
                  <p className="text-[11px] text-zinc-400">
                    Mueve los ojos, rota la cabeza, escala la boca o cambia de lugar cualquier accesorio.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-amber-400 mb-1">Paso C: Pulsar + Keyframe</h5>
                  <p className="text-[11px] text-zinc-400">
                    Haz click en el botón azul <strong>"+ Keyframe"</strong>. Verás aparecer un diamante 💎 en la línea de tiempo.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-amber-400 mb-1">Paso D: Usar Presets Automáticos</h5>
                  <p className="text-[11px] text-zinc-400">
                    Si deseas animaciones prefabricadas, pulsa <strong>"Presets"</strong> y elige <em>Bote Feliz</em>, <em>Saludo Alegre</em>, <em>Ojos Locos</em> o <em>Baile Emoji</em>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VOICE & BACKGROUNDS */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-400">Grabación de Voz y Fondos de Galería</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Dale vida a tu personaje con tu propia voz y fondos vibrantes para tus videos cortos.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-zinc-200 flex items-center gap-2 mb-1">
                    <Mic className="w-4 h-4 text-red-400" /> Grabar Voz con Micrófono
                  </h5>
                  <p className="text-xs text-zinc-400">
                    Ve a la pestaña <strong>"Voz"</strong> en el cajón inferior. Pulsa <strong>"Iniciar Grabación"</strong>, habla o haz sonidos divertidos y pulsa <strong>"Detener y Guardar"</strong>. La voz se sincronizará automáticamente durante la reproducción y la exportación.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-zinc-200 flex items-center gap-2 mb-1">
                    <Palette className="w-4 h-4 text-purple-400" /> Fondos y Fotos de tu Dispositivo
                  </h5>
                  <p className="text-xs text-zinc-400">
                    En la pestaña <strong>"Fondos"</strong> puedes elegir degradados, rayos estilo cómic, efectos neón o subir cualquier foto de tu galería con ajustes de brillo y desenfoque (blur).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                  <h5 className="font-bold text-xs text-zinc-200 flex items-center gap-2 mb-1">
                    <Box className="w-4 h-4 text-amber-400" /> Vista 3D en Tiempo Real
                  </h5>
                  <p className="text-xs text-zinc-400">
                    Cambia el interruptor superior de <strong>2D</strong> a <strong>3D</strong> para ver tu personaje renderizado en volumen 3D con Three.js y activar el modo <strong>"Giro 360°"</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-zinc-200">Atajos de Teclado Útiles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">Borrar forma seleccionada</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono text-xs shadow-sm">
                      Supr
                    </kbd>
                    <span className="text-zinc-500 text-xs">o</span>
                    <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono text-xs shadow-sm">
                      Backspace
                    </kbd>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">Reproducir / Pausar</span>
                  <kbd className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono text-xs shadow-sm">
                    Espacio
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">Mover posición fina</span>
                  <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono text-xs shadow-sm">
                    ↑ ↓ ← →
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">Guardar Proyecto</span>
                  <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono text-xs shadow-sm">
                    Ctrl + S
                  </kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800/60 flex items-center justify-between bg-zinc-900/40">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ¡Listo para crear tu video!
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>¡Entendido, a crear!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
