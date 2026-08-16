import React, { useState } from 'react';
import { Smile, Eye, Sparkles, Shapes, Type, Image as ImageIcon, Mic, Search, Plus } from 'lucide-react';
import { ItemCategory, EmojiPiece, BackgroundConfig, AudioTrack } from '../types';
import { EMOJI_LIBRARY, UNICODE_EMOJIS } from '../constants/items';
import { TextDrawer } from './TextDrawer';
import { BackgroundSelector } from './BackgroundSelector';
import { VoiceRecorder } from './VoiceRecorder';

type DrawerTab = ItemCategory | 'backgrounds' | 'voice';

interface BottomDrawerProps {
  onAddPiece: (piece: EmojiPiece | { type: 'unicode'; content: string; name: string; category: ItemCategory }) => void;
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
  background?: BackgroundConfig;
  onSelectBackground: (bg: BackgroundConfig | undefined) => void;
  audioTrack?: AudioTrack;
  onSaveAudioTrack: (track: AudioTrack | undefined) => void;
  timelineDuration: number;
  activeColor: string;
  theme: 'light' | 'dark';
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  onAddPiece,
  onAddTextLayer,
  background,
  onSelectBackground,
  audioTrack,
  onSaveAudioTrack,
  timelineDuration,
  activeColor,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('bases');
  const [searchQuery, setSearchQuery] = useState('');
  const [customEmojiInput, setCustomEmojiInput] = useState('');

  const tabs: { id: DrawerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'bases', label: 'Bases', icon: <Smile className="w-4 h-4" /> },
    { id: 'eyes', label: 'Ojos', icon: <Eye className="w-4 h-4" /> },
    { id: 'mouths', label: 'Bocas', icon: <Smile className="w-4 h-4" /> },
    { id: 'extras', label: 'Extras', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'shapes', label: 'Formas', icon: <Shapes className="w-4 h-4" /> },
    { id: 'text', label: 'Texto', icon: <Type className="w-4 h-4" /> },
    { id: 'backgrounds', label: 'Fondos', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'voice', label: 'Voz', icon: <Mic className="w-4 h-4" /> },
  ];

  // Filter SVG library pieces when activeTab is a standard piece category
  const isEmojiCategory = ['bases', 'eyes', 'mouths', 'extras', 'shapes'].includes(activeTab);

  const svgPieces = isEmojiCategory
    ? EMOJI_LIBRARY.filter(
        item => item.category === activeTab && (!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const unicodePieces = isEmojiCategory
    ? UNICODE_EMOJIS.filter(
        item => item.category === activeTab && (!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleAddCustomEmoji = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmojiInput.trim()) return;
    onAddPiece({
      type: 'unicode',
      content: customEmojiInput.trim(),
      name: 'Custom Emoji',
      category: isEmojiCategory ? (activeTab as ItemCategory) : 'extras',
    });
    setCustomEmojiInput('');
  };

  return (
    <div
      id="bottom-drawer"
      className={`w-full flex flex-col border-t transition-colors ${
        theme === 'dark' ? 'bg-[#14171E] border-zinc-800' : 'bg-white border-zinc-200'
      }`}
    >
      {/* Content Area for Active Category */}
      <div className="w-full px-3 py-2.5 border-b border-zinc-800/40 min-h-[96px]">
        {/* If standard piece categories (Bases, Eyes, Mouths, Extras, Shapes) */}
        {isEmojiCategory && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              {/* Quick Search */}
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs flex-1 max-w-[220px] border ${
                  theme === 'dark'
                    ? 'bg-zinc-900/90 border-zinc-800 text-zinc-300'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder={`Buscar en ${activeTab}...`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-xs"
                />
              </div>

              {/* Quick Custom Emoji Input */}
              <form onSubmit={handleAddCustomEmoji} className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Pega emoji 🤠..."
                  value={customEmojiInput}
                  onChange={e => setCustomEmojiInput(e.target.value)}
                  className={`w-28 px-2.5 py-1 text-xs rounded-full border outline-none text-center ${
                    theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-amber-400'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-800 focus:border-amber-400'
                  }`}
                />
                <button
                  type="submit"
                  className="p-1 rounded-full bg-amber-400 text-zinc-950 hover:scale-105 active:scale-95 transition-transform"
                  title="Añadir emoji"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Piece Items Scroll List */}
            <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar min-h-[72px]">
              {/* SVG Pieces */}
              {svgPieces.map(piece => (
                <button
                  key={piece.id}
                  onClick={() => onAddPiece(piece)}
                  className={`group flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center p-1.5 border transition-all hover:scale-105 active:scale-95 shadow-sm ${
                    theme === 'dark'
                      ? 'bg-zinc-800/70 border-zinc-700/60 hover:border-amber-400 hover:bg-zinc-800'
                      : 'bg-zinc-50 border-zinc-200 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                  title={piece.name}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center pointer-events-none"
                    style={{ color: piece.category === 'bases' ? activeColor : '#1E293B' }}
                    dangerouslySetInnerHTML={{
                      __html: `
                        <svg viewBox="${piece.viewBox || '0 0 300 300'}" class="w-full h-full">
                          ${piece.content}
                        </svg>
                      `,
                    }}
                  />
                </button>
              ))}

              {/* Unicode Pieces */}
              {unicodePieces.map((uPiece, idx) => (
                <button
                  key={`${uPiece.char}-${idx}`}
                  onClick={() =>
                    onAddPiece({
                      type: 'unicode',
                      content: uPiece.char,
                      name: uPiece.name,
                      category: uPiece.category,
                    })
                  }
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border transition-all hover:scale-105 active:scale-95 text-3xl shadow-sm ${
                    theme === 'dark'
                      ? 'bg-zinc-800/70 border-zinc-700/60 hover:border-amber-400 hover:bg-zinc-800'
                      : 'bg-zinc-50 border-zinc-200 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                  title={uPiece.name}
                >
                  <span className="select-none pointer-events-none drop-shadow-sm">{uPiece.char}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Tab Panel */}
        {activeTab === 'text' && (
          <TextDrawer
            onAddTextLayer={onAddTextLayer}
            activeColor={activeColor}
            theme={theme}
          />
        )}

        {/* Backgrounds Tab Panel */}
        {activeTab === 'backgrounds' && (
          <BackgroundSelector
            currentBackground={background}
            onSelectBackground={onSelectBackground}
            theme={theme}
          />
        )}

        {/* Voice Tab Panel */}
        {activeTab === 'voice' && (
          <VoiceRecorder
            audioTrack={audioTrack}
            onSaveAudioTrack={onSaveAudioTrack}
            timelineDuration={timelineDuration}
            theme={theme}
          />
        )}
      </div>

      {/* Bottom Navigation Category Tabs */}
      <div className="flex items-center justify-between px-2 py-1.5 overflow-x-auto no-scrollbar gap-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all flex-1 min-w-[54px] ${
                isActive ? 'scale-105' : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Tab Icon Pill */}
              <div
                className={`w-10 h-8 sm:w-11 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                    : theme === 'dark'
                    ? 'text-zinc-400 bg-zinc-800/40 hover:bg-zinc-800'
                    : 'text-zinc-600 bg-zinc-100 hover:bg-zinc-200'
                }`}
              >
                {tab.icon}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-semibold mt-1 tracking-tight truncate max-w-[60px] ${
                  isActive
                    ? theme === 'dark'
                      ? 'text-amber-400'
                      : 'text-amber-600'
                    : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
