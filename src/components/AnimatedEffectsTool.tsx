import React, { useState } from 'react';
import { Sparkles, Plus, Play, Check } from 'lucide-react';
import {
  ANIMATED_EFFECT_PRESETS,
  AnimatedEffectPreset,
  EffectType,
} from '../utils/effectsGenerator';

interface AnimatedEffectsToolProps {
  onApplyEffect: (effectType: EffectType) => void;
  theme: 'light' | 'dark';
}

export const AnimatedEffectsTool: React.FC<AnimatedEffectsToolProps> = ({
  onApplyEffect,
  theme,
}) => {
  const [selectedEffect, setSelectedEffect] = useState<EffectType>('stars');
  const [justAddedId, setJustAddedId] = useState<EffectType | null>(null);

  const handleAdd = (effectType: EffectType) => {
    setSelectedEffect(effectType);
    onApplyEffect(effectType);
    setJustAddedId(effectType);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1800);
  };

  const activePreset = ANIMATED_EFFECT_PRESETS.find(p => p.id === selectedEffect) || ANIMATED_EFFECT_PRESETS[0];

  return (
    <div
      id="animated-effects-tool"
      className={`w-full rounded-2xl border p-2.5 sm:p-3 mb-2 transition-all ${
        theme === 'dark'
          ? 'bg-zinc-900/90 border-zinc-800/90 shadow-md'
          : 'bg-amber-50/40 border-amber-200/70 shadow-sm'
      }`}
    >
      {/* Tool Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 flex items-center justify-center text-zinc-950 shadow-xs">
            <Sparkles className="w-3 h-3 fill-zinc-950" />
          </div>
          <div>
            <h4 className="text-xs font-black tracking-tight flex items-center gap-1.5 text-zinc-100 dark:text-zinc-100">
              <span className={theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}>
                Efectos Visuales Animados
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
                Preconfigurados
              </span>
            </h4>
          </div>
        </div>

        <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
          (Añade capas con movimiento automático)
        </span>
      </div>

      {/* Preset Cards Carousel / Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2.5">
        {ANIMATED_EFFECT_PRESETS.map((preset: AnimatedEffectPreset) => {
          const isSelected = selectedEffect === preset.id;
          const wasJustAdded = justAddedId === preset.id;

          return (
            <button
              key={preset.id}
              id={`btn-effect-preset-${preset.id}`}
              onClick={() => handleAdd(preset.id)}
              className={`group relative flex flex-col items-center justify-between p-2 rounded-xl border transition-all hover:scale-[1.03] active:scale-95 text-left ${
                isSelected
                  ? 'border-amber-400 bg-amber-400/10 shadow-sm ring-1 ring-amber-400/50'
                  : theme === 'dark'
                  ? 'bg-zinc-800/80 border-zinc-700/60 hover:border-zinc-500'
                  : 'bg-white border-zinc-200 hover:border-amber-300'
              }`}
              title={preset.description}
            >
              {/* Emoji Icon & Badge */}
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xl sm:text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                  {preset.emoji}
                </span>
                <span
                  className="text-[9px] font-extrabold px-1 rounded-sm"
                  style={{
                    backgroundColor: `${preset.accentColor}20`,
                    color: preset.accentColor,
                  }}
                >
                  {preset.badge}
                </span>
              </div>

              {/* Title & Particle Count */}
              <div className="w-full">
                <div
                  className={`text-[11px] font-bold truncate ${
                    theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
                  }`}
                >
                  {preset.shortLabel}
                </div>
                <div className="text-[9px] text-zinc-400 font-medium flex items-center justify-between">
                  <span>{preset.particleCount} capas</span>
                  {wasJustAdded ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Plus className="w-2.5 h-2.5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Strip for Selected Effect */}
      <div
        className={`flex items-center justify-between gap-2 p-2 rounded-xl border ${
          theme === 'dark'
            ? 'bg-zinc-800/50 border-zinc-700/50'
            : 'bg-white/80 border-zinc-200/80'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xl flex-shrink-0">{activePreset.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-black truncate ${
                  theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
                }`}
              >
                {activePreset.name}
              </span>
              <span className="text-[10px] font-semibold text-amber-400">
                ({activePreset.particleCount} capas animadas)
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate">
              {activePreset.description}
            </p>
          </div>
        </div>

        <button
          id="btn-apply-animated-effect-pack"
          onClick={() => handleAdd(activePreset.id)}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950"
        >
          {justAddedId === activePreset.id ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>¡Añadido al Lienzo!</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Añadir Efecto</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
