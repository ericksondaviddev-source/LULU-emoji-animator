import React from 'react';
import { RotateCw, Maximize2, FlipHorizontal, ChevronUp, ChevronDown, Trash2, Copy, Box } from 'lucide-react';
import { LayerItem } from '../types';

interface FloatingControlsProps {
  selectedLayer: LayerItem | null;
  onUpdateLayer: (id: string, updates: Partial<LayerItem>) => void;
  onMoveLayerOrder: (id: string, direction: 'up' | 'down') => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  theme: 'light' | 'dark';
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  selectedLayer,
  onUpdateLayer,
  onMoveLayerOrder,
  onDuplicateLayer,
  onDeleteLayer,
  theme,
}) => {
  if (!selectedLayer) return null;

  const handleRotateStep = () => {
    const nextRot = (selectedLayer.rotation + 45) % 360;
    onUpdateLayer(selectedLayer.id, { rotation: nextRot });
  };

  const handleScaleStep = () => {
    const currentScale = Math.abs(selectedLayer.scaleX);
    const nextScale = currentScale >= 1.6 ? 0.7 : Number((currentScale + 0.25).toFixed(2));
    const sign = Math.sign(selectedLayer.scaleX) || 1;
    onUpdateLayer(selectedLayer.id, {
      scaleX: nextScale * sign,
      scaleY: nextScale,
    });
  };

  const handleFlipHorizontal = () => {
    onUpdateLayer(selectedLayer.id, {
      scaleX: selectedLayer.scaleX * -1,
    });
  };

  const handleDepthStep = () => {
    const currentDepth = selectedLayer.depth || 14;
    const nextDepth = currentDepth >= 36 ? 8 : currentDepth + 10;
    onUpdateLayer(selectedLayer.id, { depth: nextDepth });
  };

  return (
    <div
      id="floating-control-panel"
      className={`flex flex-col items-center py-2 sm:py-3 px-1 sm:px-1.5 rounded-2xl sm:rounded-full shadow-2xl border transition-all backdrop-blur-xl max-h-[85vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-right-2 duration-200 ${
        theme === 'dark'
          ? 'bg-[#181C24]/95 border-zinc-700/80 text-zinc-200 shadow-black/80 ring-1 ring-white/5'
          : 'bg-white/95 border-zinc-300 text-zinc-700 shadow-zinc-400/50'
      }`}
    >
      {/* 1. Rotar */}
      <button
        id="btn-rotate"
        onClick={handleRotateStep}
        className="group flex flex-col items-center justify-center p-1 rounded-full hover:scale-105 active:scale-95 transition-all"
        title="Rotar +45°"
      >
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'bg-[#262C38] group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-400'
              : 'bg-blue-50 group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-600'
          }`}
        >
          <RotateCw className="w-4 h-4 transition-transform group-hover:rotate-45" />
        </div>
        <span className="text-[8px] sm:text-[9px] font-semibold mt-0.5 tracking-tight">Rotar</span>
      </button>

      {/* 2. Escalar */}
      <button
        id="btn-scale"
        onClick={handleScaleStep}
        className="group flex flex-col items-center justify-center p-1 rounded-full hover:scale-105 active:scale-95 transition-all mt-0.5"
        title="Cambiar tamaño"
      >
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'bg-[#262C38] group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-400'
              : 'bg-blue-50 group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-600'
          }`}
        >
          <Maximize2 className="w-4 h-4" />
        </div>
        <span className="text-[8px] sm:text-[9px] font-semibold mt-0.5 tracking-tight">Tamaño</span>
      </button>

      {/* 3. Grosor 3D */}
      <button
        id="btn-depth-3d"
        onClick={handleDepthStep}
        className="group flex flex-col items-center justify-center p-1 rounded-full hover:scale-105 active:scale-95 transition-all mt-0.5"
        title={`Grosor 3D: ${selectedLayer.depth || 14}px`}
      >
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'bg-[#262C38] group-hover:bg-amber-400 group-hover:text-zinc-950 text-amber-400'
              : 'bg-amber-50 group-hover:bg-amber-400 group-hover:text-zinc-950 text-amber-600'
          }`}
        >
          <Box className="w-4 h-4" />
        </div>
        <span className="text-[8px] sm:text-[9px] font-semibold mt-0.5 tracking-tight">3D</span>
      </button>

      {/* 4. Voltear */}
      <button
        id="btn-flip"
        onClick={handleFlipHorizontal}
        className="group flex flex-col items-center justify-center p-1 rounded-full hover:scale-105 active:scale-95 transition-all mt-0.5"
        title="Voltear horizontal"
      >
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'bg-[#262C38] group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-400'
              : 'bg-blue-50 group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-600'
          }`}
        >
          <FlipHorizontal className="w-4 h-4" />
        </div>
        <span className="text-[8px] sm:text-[9px] font-semibold mt-0.5 tracking-tight">Voltear</span>
      </button>

      {/* Divider */}
      <div className={`w-5 h-[1px] my-1 ${theme === 'dark' ? 'bg-zinc-700/60' : 'bg-zinc-200'}`} />

      {/* 5. Capas */}
      <div className="flex flex-col items-center gap-0.5">
        <button
          id="btn-layer-up"
          onClick={() => onMoveLayerOrder(selectedLayer.id, 'up')}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
          }`}
          title="Traer al frente"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        <span className="text-[7px] sm:text-[8px] font-bold tracking-tight text-zinc-400">Capas</span>

        <button
          id="btn-layer-down"
          onClick={() => onMoveLayerOrder(selectedLayer.id, 'down')}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
          }`}
          title="Enviar atrás"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Divider */}
      <div className={`w-5 h-[1px] my-1 ${theme === 'dark' ? 'bg-zinc-700/60' : 'bg-zinc-200'}`} />

      {/* 6. Duplicar & Borrar */}
      <div className="flex flex-col gap-1 items-center">
        <button
          id="btn-duplicate-layer"
          onClick={() => onDuplicateLayer(selectedLayer.id)}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors hover:scale-105 active:scale-95 shadow-sm ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-emerald-950 hover:text-emerald-400 text-zinc-300'
              : 'bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-600 text-zinc-700'
          }`}
          title="Duplicar forma"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-delete-layer"
          onClick={() => onDeleteLayer(selectedLayer.id)}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-red-500 hover:bg-red-600 text-white shadow-md ring-2 ring-red-500/20"
          title="Borrar forma"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
