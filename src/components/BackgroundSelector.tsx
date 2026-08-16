import React, { useState, useRef } from 'react';
import { Image, Sparkles, Upload, Palette, Sliders, Check, Trash2, Sun, Eye } from 'lucide-react';
import { BackgroundConfig, BackgroundType } from '../types';
import { PRESET_BACKGROUNDS } from '../constants/backgrounds';
import { getBackgroundCssStyle } from '../utils/backgroundRenderer';

interface BackgroundSelectorProps {
  currentBackground?: BackgroundConfig;
  onSelectBackground: (bg: BackgroundConfig | undefined) => void;
  theme: 'light' | 'dark';
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onSelectBackground,
  theme,
}) => {
  const [subTab, setSubTab] = useState<'presets' | 'gallery' | 'custom'>('presets');
  
  // Custom Background State
  const [customType, setCustomType] = useState<BackgroundType>('gradient');
  const [colorA, setColorA] = useState('#8B5CF6');
  const [colorB, setColorB] = useState('#EC4899');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [patternType, setPatternType] = useState<'dots' | 'grid' | 'stripes' | 'stars' | 'hearts'>('dots');

  // Gallery / Image background state
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    currentBackground?.type === 'image' ? currentBackground.imageUrl || null : null
  );
  const [blur, setBlur] = useState<number>(currentBackground?.blur || 0);
  const [brightness, setBrightness] = useState<number>(currentBackground?.brightness || 1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload from phone or computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target?.result as string;
      setUploadedImage(result);

      const newBg: BackgroundConfig = {
        type: 'image',
        colorA: '#000000',
        imageUrl: result,
        blur,
        brightness,
      };
      onSelectBackground(newBg);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustom = () => {
    const newBg: BackgroundConfig = {
      type: customType,
      colorA,
      colorB,
      gradientType,
      angle,
      patternType,
    };
    onSelectBackground(newBg);
  };

  const handleUpdateImageParams = (newBlur: number, newBrightness: number) => {
    setBlur(newBlur);
    setBrightness(newBrightness);
    if (uploadedImage) {
      onSelectBackground({
        type: 'image',
        colorA: '#000000',
        imageUrl: uploadedImage,
        blur: newBlur,
        brightness: newBrightness,
      });
    }
  };

  const customPreviewConfig: BackgroundConfig = {
    type: customType,
    colorA,
    colorB,
    gradientType,
    angle,
    patternType,
  };

  return (
    <div
      id="background-selector-panel"
      className={`w-full flex flex-col p-3 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
      }`}
    >
      {/* Top Tabs */}
      <div className="flex items-center justify-between gap-1 pb-2.5 mb-2 border-b border-zinc-800/40">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSubTab('presets')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              subTab === 'presets'
                ? 'bg-amber-400 text-zinc-950 shadow-sm font-bold'
                : 'bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fondos Geniales</span>
          </button>

          <button
            onClick={() => setSubTab('gallery')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              subTab === 'gallery'
                ? 'bg-amber-400 text-zinc-950 shadow-sm font-bold'
                : 'bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Galería / Foto</span>
          </button>

          <button
            onClick={() => setSubTab('custom')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              subTab === 'custom'
                ? 'bg-amber-400 text-zinc-950 shadow-sm font-bold'
                : 'bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Crear Fondo</span>
          </button>
        </div>

        {currentBackground && (
          <button
            onClick={() => onSelectBackground(undefined)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 flex items-center gap-1 transition-all"
            title="Quitar fondo"
          >
            <Trash2 className="w-3 h-3" />
            <span>Quitar</span>
          </button>
        )}
      </div>

      {/* Subtab 1: Preset Backgrounds */}
      {subTab === 'presets' && (
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar min-h-[90px]">
          {/* None / Transparent option */}
          <button
            onClick={() => onSelectBackground(undefined)}
            className={`flex-shrink-0 w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95 ${
              !currentBackground
                ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                : 'border-zinc-700/60 bg-zinc-800/60 text-zinc-400 hover:border-zinc-500'
            }`}
          >
            <span className="text-xl">🏁</span>
            <span className="text-[10px]">Sin Fondo</span>
          </button>

          {PRESET_BACKGROUNDS.map(preset => {
            const isSelected =
              currentBackground?.type === preset.config.type &&
              currentBackground?.colorA === preset.config.colorA;

            return (
              <button
                key={preset.id}
                onClick={() => onSelectBackground(preset.config)}
                className={`group flex-shrink-0 w-20 h-20 rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-end p-1.5 transition-all hover:scale-105 active:scale-95 relative shadow-md ${
                  isSelected ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-zinc-700/60 hover:border-zinc-500'
                }`}
                style={getBackgroundCssStyle(preset.config)}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-full bg-zinc-950/70 backdrop-blur-sm rounded-lg px-1 py-0.5 text-center">
                  <span className="text-[9px] font-bold text-zinc-100 truncate block">
                    {preset.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Subtab 2: Gallery / Upload Phone Image */}
      {subTab === 'gallery' && (
        <div className="flex flex-col gap-3 py-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 px-4 rounded-2xl border-2 border-dashed border-amber-400/60 hover:border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow"
            >
              <Upload className="w-4 h-4" />
              <span>{uploadedImage ? 'Cambiar Foto de Galería' : 'Elegir Foto del Teléfono / Galería'}</span>
            </button>
          </div>

          {uploadedImage && (
            <div className="flex items-center gap-3 bg-zinc-800/70 p-2.5 rounded-xl border border-zinc-700">
              <div
                className="w-14 h-14 rounded-xl border border-zinc-600 bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: `url(${uploadedImage})`,
                  filter: `brightness(${brightness}) blur(${blur}px)`,
                }}
              />

              <div className="flex-1 flex flex-col gap-1.5">
                {/* Blur Slider */}
                <div className="flex items-center justify-between text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-zinc-400" /> Desenfoque
                  </span>
                  <span className="font-mono text-zinc-400">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={blur}
                  onChange={e => handleUpdateImageParams(parseInt(e.target.value), brightness)}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />

                {/* Brightness Slider */}
                <div className="flex items-center justify-between text-[11px] text-zinc-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3 h-3 text-zinc-400" /> Brillo
                  </span>
                  <span className="font-mono text-zinc-400">{Math.round(brightness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.6"
                  step="0.05"
                  value={brightness}
                  onChange={e => handleUpdateImageParams(blur, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: Create Custom Background */}
      {subTab === 'custom' && (
        <div className="flex flex-col gap-2.5 py-1">
          {/* Style Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'gradient', label: 'Degradado' },
                { id: 'comic_rays', label: 'Rayos Cómic' },
                { id: 'neon_glow', label: 'Glow Neón' },
                { id: 'pattern', label: 'Patrón' },
                { id: 'grid', label: 'Cuadrícula' },
                { id: 'solid', label: 'Sólido' },
              ] as const
            ).map(opt => (
              <button
                key={opt.id}
                onClick={() => setCustomType(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  customType === opt.id
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Live Mini Preview */}
            <div
              className="w-20 h-20 rounded-2xl border border-zinc-700 shadow-inner flex-shrink-0 flex items-center justify-center"
              style={getBackgroundCssStyle(customPreviewConfig)}
            >
              <span className="text-xl drop-shadow-md">🎨</span>
            </div>

            {/* Colors Pickers */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Color 1:</span>
                  <input
                    type="color"
                    value={colorA}
                    onChange={e => setColorA(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                </div>

                {customType !== 'solid' && (
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[11px] font-semibold text-zinc-400">Color 2:</span>
                    <input
                      type="color"
                      value={colorB}
                      onChange={e => setColorB(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                )}
              </div>

              {/* Gradient specific options */}
              {customType === 'gradient' && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400">Ángulo:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={angle}
                    onChange={e => setAngle(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <span className="text-[10px] font-mono text-zinc-400 w-7">{angle}°</span>
                </div>
              )}

              {/* Pattern specific options */}
              {customType === 'pattern' && (
                <div className="flex items-center gap-1">
                  {(['dots', 'stars', 'hearts', 'stripes'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPatternType(p)}
                      className={`px-2 py-0.5 rounded text-[10px] capitalize ${
                        patternType === p ? 'bg-amber-400 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleApplyCustom}
            className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Aplicar Fondo Creado</span>
          </button>
        </div>
      )}
    </div>
  );
};
