import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Copy, X, BookOpen } from 'lucide-react';
import { LayerItem, BackgroundConfig } from '../types';
import { getBackgroundCssStyle } from '../utils/backgroundRenderer';

interface Canvas2DProps {
  layers: LayerItem[];
  background?: BackgroundConfig;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<LayerItem>) => void;
  onDeleteLayer?: (id: string) => void;
  onDuplicateLayer?: (id: string) => void;
  onOpenGuide?: () => void;
  aspectRatio: '9:16' | '1:1';
  theme: 'light' | 'dark';
  isPlaying?: boolean;
  onAddDefaultBase?: () => void;
  onOpenProjects?: () => void;
}

export const Canvas2D: React.FC<Canvas2DProps> = ({
  layers,
  background,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onOpenGuide,
  aspectRatio,
  theme,
  isPlaying = false,
  onAddDefaultBase,
  onOpenProjects,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [scaleCorner, setScaleCorner] = useState<string | null>(null);

  // Keyboard shortcut listener: Delete or Backspace to delete selected layer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId && onDeleteLayer) {
        e.preventDefault();
        onDeleteLayer(selectedLayerId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, onDeleteLayer]);

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialLayerX: number;
    initialLayerY: number;
    initialRotation: number;
    initialScaleX: number;
    initialScaleY: number;
    centerScreenX: number;
    centerScreenY: number;
  }>({
    startX: 0,
    startY: 0,
    initialLayerX: 0,
    initialLayerY: 0,
    initialRotation: 0,
    initialScaleX: 1,
    initialScaleY: 1,
    centerScreenX: 0,
    centerScreenY: 0,
  });

  // Reference canvas dimension (1080x1920 for 9:16 or 1080x1080 for 1:1)
  const baseWidth = 1080;
  const baseHeight = aspectRatio === '9:16' ? 1920 : 1080;

  // Selected layer
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  // Handle Drag Start
  const handlePointerDownLayer = (
    e: React.PointerEvent,
    layer: LayerItem,
    action: 'move' | 'rotate' | 'scale',
    corner?: string
  ) => {
    if (isPlaying) return;
    e.stopPropagation();
    onSelectLayer(layer.id);

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const layerScreenX = rect.left + (layer.x / baseWidth) * rect.width;
    const layerScreenY = rect.top + (layer.y / baseHeight) * rect.height;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialRotation: layer.rotation,
      initialScaleX: layer.scaleX,
      initialScaleY: layer.scaleY,
      centerScreenX: layerScreenX,
      centerScreenY: layerScreenY,
    };

    if (action === 'move') setIsDragging(true);
    if (action === 'rotate') setIsRotating(true);
    if (action === 'scale') {
      setIsScaling(true);
      setScaleCorner(corner || 'se');
    }
  };

  // Handle Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!selectedLayer || isPlaying) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const scaleFactor = rect.width / baseWidth;

    if (isDragging) {
      const deltaX = (e.clientX - dragStartRef.current.startX) / scaleFactor;
      const deltaY = (e.clientY - dragStartRef.current.startY) / scaleFactor;

      onUpdateLayer(selectedLayer.id, {
        x: Math.round(dragStartRef.current.initialLayerX + deltaX),
        y: Math.round(dragStartRef.current.initialLayerY + deltaY),
      });
    } else if (isRotating) {
      const currentAngle = Math.atan2(
        e.clientY - dragStartRef.current.centerScreenY,
        e.clientX - dragStartRef.current.centerScreenX
      );
      const startAngle = Math.atan2(
        dragStartRef.current.startY - dragStartRef.current.centerScreenY,
        dragStartRef.current.startX - dragStartRef.current.centerScreenX
      );
      const angleDiff = ((currentAngle - startAngle) * 180) / Math.PI;

      onUpdateLayer(selectedLayer.id, {
        rotation: Math.round((dragStartRef.current.initialRotation + angleDiff) % 360),
      });
    } else if (isScaling) {
      const distStart = Math.hypot(
        dragStartRef.current.startX - dragStartRef.current.centerScreenX,
        dragStartRef.current.startY - dragStartRef.current.centerScreenY
      );
      const distCurrent = Math.hypot(
        e.clientX - dragStartRef.current.centerScreenX,
        e.clientY - dragStartRef.current.centerScreenY
      );

      const ratio = distStart > 0 ? distCurrent / distStart : 1;
      const signX = Math.sign(dragStartRef.current.initialScaleX) || 1;
      const signY = Math.sign(dragStartRef.current.initialScaleY) || 1;

      const newScale = Math.max(0.1, Math.min(3.5, Math.abs(dragStartRef.current.initialScaleX) * ratio));

      onUpdateLayer(selectedLayer.id, {
        scaleX: Number((newScale * signX).toFixed(3)),
        scaleY: Number((newScale * signY).toFixed(3)),
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsRotating(false);
    setIsScaling(false);
    setScaleCorner(null);
  };

  // Deselect on background click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).dataset.bgCanvas === 'true') {
      onSelectLayer(null);
    }
  };

  // Sort layers by Z-Index
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      data-bg-canvas="true"
      onClick={handleCanvasClick}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full h-full overflow-hidden select-none touch-none flex items-center justify-center transition-colors duration-300 ${
        !background ? (theme === 'dark' ? 'bg-[#121418]' : 'bg-[#F8FAFC]') : ''
      }`}
      style={{
        aspectRatio: aspectRatio === '9:16' ? '9/16' : '1/1',
        ...getBackgroundCssStyle(background),
      }}
    >
      {/* Grid Pattern Background if no custom background is applied */}
      {!background && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`grid-pattern-${theme}`}
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke={theme === 'dark' ? '#252932' : '#E2E8F0'}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-pattern-${theme})`} />
        </svg>
      )}

      {/* Empty Canvas Initial State */}
      {layers.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
          <div className="pointer-events-auto max-w-xs p-6 rounded-3xl bg-zinc-900/85 border border-zinc-800/80 shadow-2xl backdrop-blur-md flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-2xl mb-3 border border-amber-400/30 shadow-inner">
              🎨
            </div>
            <h3 className="text-base font-bold text-zinc-100 mb-1">Lulu Emoji Animator</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Agrega una <strong>Base</strong>, <strong>Texto</strong>, <strong>Fondos</strong> o <strong>Graba tu Voz</strong> para animar tu personaje.
            </p>
            <div className="flex flex-col w-full gap-2">
              {onAddDefaultBase && (
                <button
                  onClick={onAddDefaultBase}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>+ Agregar Emoji Base</span>
                </button>
              )}
              {onOpenProjects && (
                <button
                  onClick={onOpenProjects}
                  className="w-full py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs border border-zinc-700/60 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>📂 Cargar Proyecto o Plantilla</span>
                </button>
              )}
              {onOpenGuide && (
                <button
                  onClick={onOpenGuide}
                  className="w-full py-2 px-4 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-semibold text-xs border border-amber-400/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>📖 Ver Guía de Uso</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Shape HUD Indicator (Top-Left) */}
      {selectedLayer && !isPlaying && (
        <div className="absolute top-3 left-3 z-40 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-zinc-950/90 text-zinc-100 border border-zinc-700/80 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5 max-w-[130px] sm:max-w-[170px] truncate">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-400 uppercase tracking-tight">
              {selectedLayer.category}
            </span>
            <span className="text-xs font-semibold truncate text-zinc-200" title={selectedLayer.name}>
              {selectedLayer.name}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-zinc-700 mx-0.5" />

          {onDuplicateLayer && (
            <button
              onClick={() => onDuplicateLayer(selectedLayer.id)}
              className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Duplicar forma"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {onDeleteLayer && (
            <button
              onClick={() => onDeleteLayer(selectedLayer.id)}
              className="px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1 shadow-md transition-all"
              title="Borrar esta forma (o presiona Supr)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar</span>
            </button>
          )}

          <button
            onClick={() => onSelectLayer(null)}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Deseleccionar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Layers Container (1080x1920 or 1080x1080 viewport mapping) */}
      <div
        className="relative w-full h-full pointer-events-auto"
      >
        {sortedLayers.map(layer => {
          const isSelected = selectedLayerId === layer.id;
          const leftPercent = (layer.x / baseWidth) * 100;
          const topPercent = (layer.y / baseHeight) * 100;

          return (
            <div
              key={layer.id}
              id={`layer-item-${layer.id}`}
              onPointerDown={e => handlePointerDownLayer(e, layer, 'move')}
              className={`absolute cursor-move transition-transform duration-75 group ${
                isSelected ? 'z-50' : ''
              }`}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scaleX}, ${layer.scaleY})`,
                opacity: layer.opacity,
                zIndex: isSelected ? 999 : layer.zIndex,
              }}
            >
              {/* Piece Visual (Unicode / SVG / Custom Text) */}
              <div className="relative flex items-center justify-center p-2">
                {layer.type === 'text' ? (
                  <span
                    className="select-none pointer-events-none whitespace-nowrap leading-tight text-center block"
                    style={{
                      fontFamily: layer.fontFamily || 'Impact, sans-serif',
                      fontSize: `${layer.fontSize || 48}px`,
                      color: layer.textColor || '#FFFFFF',
                      WebkitTextStroke:
                        (layer.strokeWidth ?? 4) > 0
                          ? `${layer.strokeWidth ?? 4}px ${layer.strokeColor || '#000000'}`
                          : 'none',
                      fontWeight: layer.isBold ? 'bold' : 'normal',
                      fontStyle: layer.isItalic ? 'italic' : 'normal',
                      textShadow: layer.hasShadow !== false ? '0 4px 12px rgba(0,0,0,0.6)' : 'none',
                    }}
                  >
                    {layer.textContent || layer.content || 'Texto'}
                  </span>
                ) : layer.type === 'unicode' ? (
                  <span
                    className="text-[90px] md:text-[110px] leading-none select-none pointer-events-none drop-shadow-md"
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
                    }}
                  >
                    {layer.content}
                  </span>
                ) : (
                  <div
                    className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center pointer-events-none"
                    style={{
                      color: layer.color,
                      filter:
                        layer.category === 'bases'
                          ? theme === 'dark'
                            ? 'drop-shadow(0 8px 24px rgba(250, 204, 21, 0.15))'
                            : 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))'
                          : undefined,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `
                        <svg viewBox="${layer.viewBox || '0 0 300 300'}" class="w-full h-full">
                          ${layer.content}
                        </svg>
                      `,
                    }}
                  />
                )}
              </div>

              {/* Selection Bounding Box & Handles */}
              {isSelected && !isPlaying && (
                <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-amber-400 rounded-2xl shadow-lg ring-4 ring-amber-400/20">
                  {/* Rotate Handle on Top */}
                  <div
                    onPointerDown={e => handlePointerDownLayer(e, layer, 'rotate')}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing pointer-events-auto hover:scale-110 transition-transform z-30"
                    title="Arrastra para rotar"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8" />
                      <polyline points="21 3 21 8 16 8" />
                    </svg>
                  </div>

                  {/* Direct Delete Button in Top-Right Corner of Selection */}
                  {onDeleteLayer && (
                    <button
                      onPointerDown={e => e.stopPropagation()}
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteLayer(layer.id);
                      }}
                      className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 active:scale-90 text-white flex items-center justify-center shadow-xl cursor-pointer pointer-events-auto border-2 border-white dark:border-zinc-900 transition-transform hover:scale-110 z-40"
                      title="Borrar esta forma (o presiona Supr)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Duplicate Button in Top-Left Corner */}
                  {onDuplicateLayer && (
                    <button
                      onPointerDown={e => e.stopPropagation()}
                      onClick={e => {
                        e.stopPropagation();
                        onDuplicateLayer(layer.id);
                      }}
                      className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-90 text-white flex items-center justify-center shadow-xl cursor-pointer pointer-events-auto border-2 border-white dark:border-zinc-900 transition-transform hover:scale-110 z-40"
                      title="Duplicar esta forma"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}

                  {/* Corner Resize Handles */}
                  <div
                    onPointerDown={e => handlePointerDownLayer(e, layer, 'scale', 'sw')}
                    className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-white border-2 border-amber-500 shadow cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
                  />
                  <div
                    onPointerDown={e => handlePointerDownLayer(e, layer, 'scale', 'se')}
                    className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border-2 border-amber-500 shadow cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
