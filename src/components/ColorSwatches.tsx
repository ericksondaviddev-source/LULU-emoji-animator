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
      className={`w-full py-2.5 px-4 flex items-center gap-3 overflow-x-auto no-scrollbar transition-colors ${
        theme === 'dark' ? 'bg-[#14171E]' : 'bg-zinc-50'
      }`}
    >
      {COLOR_PALETTE.map(item => {
        const isSelected = selectedColor.toLowerCase() === item.hex.toLowerCase();

        return (
          <button
            key={item.hex}
            onClick={() => onSelectColor(item.hex)}
            className="group relative flex-shrink-0 flex items-center justify-center p-1 rounded-full transition-transform active:scale-95"
            title={item.name}
          >
            {/* Outer Ring when selected */}
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? 'ring-3 ring-amber-400 ring-offset-2 ring-offset-zinc-950/20 scale-105'
                  : 'hover:scale-105'
              }`}
            >
              {/* Inner Color Disc */}
              <div
                className="w-8 h-8 rounded-full shadow-inner transition-transform"
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
        className="flex-shrink-0 relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border border-dashed border-zinc-500 hover:border-amber-400 transition-colors p-1"
        title="Elegir color personalizado"
      >
        <Pipette className="w-4 h-4 text-zinc-400 hover:text-amber-400" />
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
