import React from 'react';
import { RotateCw, Maximize2, FlipHorizontal, ChevronUp, ChevronDown, Droplet, Trash2, Copy } from 'lucide-react';
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

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateLayer(selectedLayer.id, { opacity: val });
  };

  return (
    <div
      id="floating-control-panel"
      className={`absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center py-4 px-2.5 rounded-full shadow-2xl border transition-all backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-[#1C2028]/90 border-zinc-800 text-zinc-200'
          : 'bg-white/95 border-zinc-200 text-zinc-700 shadow-zinc-200/80'
      }`}
      style={{
        boxShadow:
          theme === 'dark'
            ? '0 20px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* 1. Rotar Button */}
      <button
        id="btn-rotate"
        onClick={handleRotateStep}
        className="group flex flex-col items-center justify-center p-2 rounded-full hover:scale-105 active:scale-95 transition-all"
        title="Rotar +45°"
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'bg-[#2A303C] group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-400'
              : 'bg-blue-50 group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-600'
          }`}
        >
          <RotateCw className="w-5 h-5 transition-transform group-hover:rotate-45" />
        </div>
        <span className="text-[10px] font-medium mt-1 tracking-tight">Rotar</span>
      </button>

      {/* 2. Escalar Button */}
      <button
        id="btn-scale"
        onClick={handleScaleStep}
        className="group flex flex-col items-center justify-center p-2 rounded-full hover:scale-105 active:scale-95 transition-all mt-1"
        title="Escalar tamaño"
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'bg-[#2A303C] group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-400'
              : 'bg-blue-50 group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-600'
          }`}
        >
          <Maximize2 className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-medium mt-1 tracking-tight">Escalar</span>
      </button>

      {/* 3. Voltear Button */}
      <button
        id="btn-flip"
        onClick={handleFlipHorizontal}
        className="group flex flex-col items-center justify-center p-2 rounded-full hover:scale-105 active:scale-95 transition-all mt-1"
        title="Voltear horizontal"
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'bg-[#2A303C] group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-400'
              : 'bg-blue-50 group-hover:bg-amber-400 group-hover:text-zinc-950 text-blue-600'
          }`}
        >
          <FlipHorizontal className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-medium mt-1 tracking-tight">Voltear</span>
      </button>

      {/* Divider */}
      <div className={`w-8 h-[1px] my-2 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

      {/* 4. Capas (Up / Down) */}
      <div className="flex flex-col items-center gap-1 my-0.5">
        <button
          id="btn-layer-up"
          onClick={() => onMoveLayerOrder(selectedLayer.id, 'up')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
            theme === 'dark'
              ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
          }`}
          title="Traer al frente"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <span className="text-[9px] font-semibold tracking-tight text-zinc-400">Capas</span>

        <button
          id="btn-layer-down"
          onClick={() => onMoveLayerOrder(selectedLayer.id, 'down')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
            theme === 'dark'
              ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
          }`}
          title="Enviar atrás"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className={`w-8 h-[1px] my-2 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

      {/* 5. Opacity Slider with Droplet Icon */}
      <div className="flex flex-col items-center gap-2 py-1">
        <Droplet className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`} />

        {/* Custom styled vertical-like opacity range */}
        <div className="h-20 flex items-center justify-center relative">
          <input
            id="slider-opacity"
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={selectedLayer.opacity}
            onChange={handleOpacityChange}
            className="w-16 h-1.5 accent-blue-500 -rotate-90 cursor-pointer rounded-lg bg-zinc-300 dark:bg-zinc-700"
            title={`Opacidad: ${Math.round(selectedLayer.opacity * 100)}%`}
          />
        </div>
      </div>

      {/* Quick Action Badges (Duplicate / Delete) */}
      <div className={`w-8 h-[1px] my-1 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`} />

      <div className="flex flex-col gap-1.5 mt-1 items-center">
        <button
          id="btn-duplicate-layer"
          onClick={() => onDuplicateLayer(selectedLayer.id)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:scale-105 active:scale-95 shadow-sm ${
            theme === 'dark'
              ? 'bg-zinc-800/80 hover:bg-emerald-950 hover:text-emerald-400 text-zinc-300'
              : 'bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-600 text-zinc-700'
          }`}
          title="Duplicar capa"
        >
          <Copy className="w-4 h-4" />
        </button>

        <button
          id="btn-delete-layer"
          onClick={() => onDeleteLayer(selectedLayer.id)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-red-500 hover:bg-red-600 text-white shadow-md ring-2 ring-red-500/20"
          title="Borrar forma seleccionada (Supr)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <span className="text-[8px] font-bold text-red-400 tracking-tight">Borrar</span>
      </div>
    </div>
  );
};
