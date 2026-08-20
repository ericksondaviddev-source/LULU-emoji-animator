import React, { useState } from 'react';
import { Smile, Eye, Sparkles, Shapes, Type, Image as ImageIcon, Mic, Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenAIStudio?: () => void;
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
  isCollapsed: externalIsCollapsed,
  onToggleCollapse: externalOnToggleCollapse,
  onOpenAIStudio,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('bases');
  const [searchQuery, setSearchQuery] = useState('');
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const toggleCollapse = externalOnToggleCollapse || (() => setInternalIsCollapsed(c => !c));

  const tabs: { id: DrawerTab; label: string; icon: React.ReactNode; emoji: string }[] = [
    { id: 'bases', label: 'Bases', icon: <Smile className="w-4 h-4" />, emoji: '🐱' },
    { id: 'eyes', label: 'Ojos', icon: <Eye className="w-4 h-4" />, emoji: '👀' },
    { id: 'mouths', label: 'Bocas', icon: <Smile className="w-4 h-4" />, emoji: '👄' },
    { id: 'extras', label: 'Extras', icon: <Sparkles className="w-4 h-4" />, emoji: '✨' },
    { id: 'shapes', label: 'Formas', icon: <Shapes className="w-4 h-4" />, emoji: '⭐' },
    { id: 'text', label: 'Texto 3D', icon: <Type className="w-4 h-4" />, emoji: '🔤' },
    { id: 'backgrounds', label: 'Fondos', icon: <ImageIcon className="w-4 h-4" />, emoji: '🖼️' },
    { id: 'voice', label: 'Voz', icon: <Mic className="w-4 h-4" />, emoji: '🎙️' },
  ];

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

  const handleTabClick = (tabId: DrawerTab) => {
    setActiveTab(tabId);
    if (isCollapsed) {
      toggleCollapse();
    }
  };

  return (
    <div
      id="bottom-drawer"
      className={`w-full flex flex-col border-t transition-all duration-300 flex-shrink-0 ${
        theme === 'dark' ? 'bg-[#14171E] border-zinc-800' : 'bg-white border-zinc-200'
      }`}
    >
      {/* Header bar with Category Name + Retract/Deploy Toggle */}
      <div className="w-full flex items-center justify-between px-3 py-1 border-b border-zinc-800/40 text-xs select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">
            {tabs.find(t => t.id === activeTab)?.emoji}
          </span>
          <span className="text-xs font-bold tracking-tight text-zinc-200">
            {tabs.find(t => t.id === activeTab)?.label}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
            (Toca para agregar al lienzo)
          </span>
        </div>

        <button
          onClick={toggleCollapse}
          className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all active:scale-95 ${
            isCollapsed
              ? 'bg-amber-400 text-zinc-950 shadow-sm'
              : theme === 'dark'
              ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          }`}
          title={isCollapsed ? 'Desplegar panel de accesorios' : 'Retraer panel para limpiar lienzo'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Desplegar Galería</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Retraer</span>
            </>
          )}
        </button>
      </div>

      {/* Content Area for Active Category (collapsible) */}
      {!isCollapsed && (
        <div className="w-full px-2 sm:px-3 py-1.5 border-b border-zinc-800/40 min-h-[90px] max-h-[35vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Piece Categories: Bases, Eyes, Mouths, Extras, Shapes */}
          {isEmojiCategory && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                {/* Search */}
                <div
                  className={`flex items-center gap-2 px-3 py-0.5 rounded-full text-xs flex-1 max-w-[200px] border ${
                    theme === 'dark'
                      ? 'bg-zinc-900/90 border-zinc-800 text-zinc-300'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={`Buscar en ${activeTab}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-xs"
                  />
                </div>

                {/* Quick Emoji Input */}
                <form onSubmit={handleAddCustomEmoji} className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Pega emoji..."
                    value={customEmojiInput}
                    onChange={e => setCustomEmojiInput(e.target.value)}
                    className={`w-24 px-2 py-0.5 text-xs rounded-full border outline-none text-center ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-amber-400'
                        : 'bg-zinc-100 border-zinc-200 text-zinc-800 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="submit"
                    className="p-1 rounded-full bg-amber-400 text-zinc-950 hover:scale-105 active:scale-95 transition-transform"
                    title="Añadir emoji personalizado"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Items List */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar min-h-[68px]">
                {/* SVG Pieces */}
                {svgPieces.map(piece => (
                  <button
                    key={piece.id}
                    onClick={() => onAddPiece(piece)}
                    className={`group flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center p-1.5 border transition-all hover:scale-105 active:scale-95 shadow-sm ${
                      theme === 'dark'
                        ? 'bg-zinc-800/80 border-zinc-700/60 hover:border-amber-400 hover:bg-zinc-800'
                        : 'bg-zinc-50 border-zinc-200 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                    title={piece.name}
                  >
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center pointer-events-none"
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
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border transition-all hover:scale-105 active:scale-95 text-2xl sm:text-3xl shadow-sm ${
                      theme === 'dark'
                        ? 'bg-zinc-800/80 border-zinc-700/60 hover:border-amber-400 hover:bg-zinc-800'
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

          {/* Text Tab */}
          {activeTab === 'text' && (
            <TextDrawer
              onAddTextLayer={onAddTextLayer}
              activeColor={activeColor}
              theme={theme}
            />
          )}

          {/* Backgrounds Tab */}
          {activeTab === 'backgrounds' && (
            <BackgroundSelector
              currentBackground={background}
              onSelectBackground={onSelectBackground}
              theme={theme}
            />
          )}

          {/* Voice Tab */}
          {activeTab === 'voice' && (
            <VoiceRecorder
              audioTrack={audioTrack}
              onSaveAudioTrack={onSaveAudioTrack}
              timelineDuration={timelineDuration}
              theme={theme}
            />
          )}
        </div>
      )}

      {/* Bottom Category Tabs Navigation */}
      <div className="flex items-center justify-between px-1.5 sm:px-2 py-1 overflow-x-auto no-scrollbar gap-1">
        {onOpenAIStudio && (
          <button
            onClick={onOpenAIStudio}
            className="flex flex-col items-center justify-center py-0.5 px-1 rounded-xl transition-all flex-1 min-w-[48px] hover:scale-105 active:scale-95"
            title="Crear con Inteligencia Artificial"
          >
            <div className="w-8 h-7 sm:w-10 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-400 to-rose-500 text-zinc-950 font-bold shadow-md ring-1 ring-amber-300">
              <Sparkles className="w-4 h-4 fill-zinc-950" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-extrabold mt-0.5 tracking-tight text-amber-400 truncate max-w-[54px]">
              IA Mágica
            </span>
          </button>
        )}

        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-0.5 px-1 rounded-xl transition-all flex-1 min-w-[48px] ${
                isActive ? 'scale-105' : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-8 h-7 sm:w-10 sm:h-8 rounded-full flex items-center justify-center transition-all ${
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
                className={`text-[9px] sm:text-[10px] font-semibold mt-0.5 tracking-tight truncate max-w-[54px] ${
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
