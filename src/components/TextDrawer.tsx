import React, { useState } from 'react';
import { Type, Sparkles, Plus, Bold, Italic, Palette, Sliders, Check } from 'lucide-react';
import { LayerItem } from '../types';

interface TextDrawerProps {
  onAddTextLayer: (options: {
    textContent: string;
    fontFamily: string;
    fontSize: number;
    textColor: string;
    strokeColor: string;
    strokeWidth: number;
    isBold: boolean;
    isItalic: boolean;
    hasShadow: boolean;
  }) => void;
  activeColor: string;
  theme: 'light' | 'dark';
}

const FONT_OPTIONS = [
  { id: 'Impact, sans-serif', label: 'Impact (Meme)', preview: 'IMPACT' },
  { id: 'Fredoka, cursive, sans-serif', label: 'Fredoka (Bubble)', preview: 'Bubble' },
  { id: 'Bangers, cursive, sans-serif', label: 'Bangers (Cómic)', preview: 'Comic' },
  { id: 'Montserrat, sans-serif', label: 'Montserrat (Moderna)', preview: 'Modern' },
  { id: 'Pacifico, cursive', label: 'Pacifico (Cursiva)', preview: 'Cursiva' },
  { id: '"Press Start 2P", monospace', label: 'Pixel (8-Bit)', preview: 'Pixel' },
  { id: '"Comic Sans MS", cursive, sans-serif', label: 'Comic Sans', preview: 'Comic' },
];

const PRESET_TEXTS = [
  { text: 'LULU ❤️', font: 'Fredoka, cursive, sans-serif', color: '#FF3366', stroke: '#FFFFFF' },
  { text: 'OMG! 😱', font: 'Impact, sans-serif', color: '#FACC15', stroke: '#000000' },
  { text: 'LOL 😂', font: 'Impact, sans-serif', color: '#38BDF8', stroke: '#000000' },
  { text: 'SUS 👀', font: 'Impact, sans-serif', color: '#EF4444', stroke: '#000000' },
  { text: 'QUE PRO 😎', font: 'Bangers, cursive, sans-serif', color: '#10B981', stroke: '#000000' },
  { text: 'WOW! ✨', font: 'Fredoka, cursive, sans-serif', color: '#A855F7', stroke: '#FFFFFF' },
  { text: '¡HOLA! 👋', font: 'Montserrat, sans-serif', color: '#F97316', stroke: '#FFFFFF' },
  { text: 'TOP 🚀', font: 'Impact, sans-serif', color: '#EAB308', stroke: '#1E1B4B' },
];

export const TextDrawer: React.FC<TextDrawerProps> = ({
  onAddTextLayer,
  activeColor,
  theme,
}) => {
  const [textContent, setTextContent] = useState('¡Hola Lulu!');
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].id);
  const [fontSize, setFontSize] = useState(72);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [hasShadow, setHasShadow] = useState(true);

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textContent.trim()) return;

    onAddTextLayer({
      textContent: textContent.trim(),
      fontFamily,
      fontSize,
      textColor,
      strokeColor,
      strokeWidth,
      isBold,
      isItalic,
      hasShadow,
    });
  };

  const handleAddPreset = (preset: typeof PRESET_TEXTS[0]) => {
    onAddTextLayer({
      textContent: preset.text,
      fontFamily: preset.font,
      fontSize: 80,
      textColor: preset.color,
      strokeColor: preset.stroke,
      strokeWidth: 6,
      isBold: true,
      isItalic: false,
      hasShadow: true,
    });
  };

  return (
    <div
      id="text-creator-panel"
      className={`w-full flex flex-col p-3 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
      }`}
    >
      {/* Preset Stickers */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 border-b border-zinc-800/40 no-scrollbar">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex-shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Stickers:
        </span>
        {PRESET_TEXTS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleAddPreset(preset)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl border border-zinc-700/60 bg-zinc-800/60 hover:bg-zinc-700 text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-sm"
            style={{
              fontFamily: preset.font,
              color: preset.color,
              WebkitTextStroke: `1px ${preset.stroke}`,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {preset.text}
          </button>
        ))}
      </div>

      {/* Custom Text Composer Form */}
      <form onSubmit={handleAddCustom} className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Escribe tu texto aquí..."
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              className={`w-full px-3.5 py-2 text-sm rounded-xl border outline-none font-bold shadow-inner ${
                theme === 'dark'
                  ? 'bg-zinc-800/90 border-zinc-700 text-zinc-100 focus:border-amber-400'
                  : 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-400'
              }`}
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Agregar Texto</span>
          </button>
        </div>

        {/* Live Preview of Written Text */}
        <div
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center border overflow-hidden ${
            theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-200/60 border-slate-300'
          }`}
        >
          <span
            style={{
              fontFamily,
              fontSize: `${Math.min(36, fontSize / 2)}px`,
              color: textColor,
              WebkitTextStroke: strokeWidth > 0 ? `${Math.max(1, strokeWidth / 2)}px ${strokeColor}` : 'none',
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              textShadow: hasShadow ? '0 4px 10px rgba(0,0,0,0.7)' : 'none',
            }}
            className="select-none text-center truncate max-w-full"
          >
            {textContent || 'Escribe tu texto'}
          </span>
        </div>

        {/* Typography Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Font Family Selector */}
          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-zinc-400">Tipografía:</span>
            <select
              value={fontFamily}
              onChange={e => setFontFamily(e.target.value)}
              className={`w-full px-2.5 py-1.5 text-xs rounded-xl border outline-none ${
                theme === 'dark'
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                  : 'bg-white border-zinc-300 text-zinc-800'
              }`}
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.id} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Color & Stroke Color */}
          <div className="flex items-center gap-3 col-span-2">
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] font-semibold text-zinc-400">Relleno:</span>
              <input
                type="color"
                value={textColor}
                onChange={e => setTextColor(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] font-semibold text-zinc-400">Borde:</span>
              <input
                type="color"
                value={strokeColor}
                onChange={e => setStrokeColor(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>

            {/* Shadow & Style Toggles */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsBold(!isBold)}
                className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                  isBold ? 'bg-amber-400 text-zinc-950 border-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
                title="Negrita"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsItalic(!isItalic)}
                className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                  isItalic ? 'bg-amber-400 text-zinc-950 border-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
                title="Cursiva"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setHasShadow(!hasShadow)}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                  hasShadow ? 'bg-amber-400 text-zinc-950 border-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
                title="Sombra"
              >
                Sombra
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
