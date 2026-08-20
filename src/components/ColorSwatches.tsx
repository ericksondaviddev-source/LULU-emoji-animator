import React from 'react';
import { COLOR_PALETTE } from '../constants/items';
import { Pipette } from 'lucide-react';

interface ColorSwatchesProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  theme: 'light' | 'dark';
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  selectedColor,
  onSelectColor,
  theme,
}) => {
  return (
    <div
      id="color-palette-bar"
      className={`w-full py-1 px-3 sm:px-4 flex items-center gap-2 overflow-x-auto no-scrollbar transition-colors flex-shrink-0 ${
        theme === 'dark' ? 'bg-[#12141A] border-t border-zinc-800/60' : 'bg-zinc-100/80 border-t border-zinc-200'
      }`}
    >
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight flex-shrink-0 hidden xs:inline">
        Color:
      </span>

      {COLOR_PALETTE.map(item => {
        const isSelected = selectedColor.toLowerCase() === item.hex.toLowerCase();

        return (
          <button
            key={item.hex}
            onClick={() => onSelectColor(item.hex)}
            className="group relative flex-shrink-0 flex items-center justify-center p-0.5 rounded-full transition-transform active:scale-95"
            title={item.name}
          >
            {/* Outer Ring when selected */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-zinc-950/20 scale-105'
                  : 'hover:scale-105'
              }`}
            >
              {/* Inner Color Disc */}
              <div
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-inner transition-transform"
                style={{
                  backgroundColor: item.hex,
                  border: item.hex === '#FFFFFF' ? '1px solid #CBD5E1' : undefined,
                }}
              />
            </div>
          </button>
        );
      })}

      {/* Custom Color Pipette Picker */}
      <label
        className="flex-shrink-0 relative w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer border border-dashed border-zinc-500 hover:border-amber-400 transition-colors p-0.5"
        title="Elegir color personalizado"
      >
        <Pipette className="w-3 h-3 text-zinc-400 hover:text-amber-400" />
        <input
          type="color"
          value={selectedColor}
          onChange={e => onSelectColor(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
    </div>
  );
};
