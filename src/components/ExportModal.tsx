import React, { useState } from 'react';
import { X, Download, Video, Image as ImageIcon, CheckCircle, Loader2, Sparkles, Youtube, Mic, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LayerItem, KeyframeData, BackgroundConfig, AudioTrack } from '../types';
import { exportCanvasAsPNG, renderAndExportVideo } from '../utils/videoRecorder';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerItem[];
  keyframes: KeyframeData[];
  fps: number;
  duration: number;
  aspectRatio: '9:16' | '1:1';
  theme: 'light' | 'dark';
  background?: BackgroundConfig;
  audioTrack?: AudioTrack;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  layers,
  keyframes,
  fps,
  duration,
  aspectRatio,
  theme,
  background,
  audioTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'png'>('video');
  const [pngTransparent, setPngTransparent] = useState(background ? false : true);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoResult, setVideoResult] = useState<{ url: string; mimeType: string } | null>(null);

  if (!isOpen) return null;

  const width = 1080;
  const height = aspectRatio === '9:16' ? 1920 : 1080;

  // Handle PNG Download
  const handleDownloadPNG = () => {
    const dataUrl = exportCanvasAsPNG(
      layers,
      width,
      height,
      pngTransparent,
      background
    );
    if (!dataUrl) return;

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `lulu-emoji-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Handle Video Generation & Export
  const handleRecordVideo = async () => {
    try {
      setIsRecording(true);
      setProgress(0);
      setVideoResult(null);

      const result = await renderAndExportVideo({
        width,
        height,
        fps,
        duration,
        layers,
        keyframes,
        background,
        audioTrack,
        onProgress: p => setProgress(p),
      });

      setVideoResult(result);
      setIsRecording(false);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch (err) {
      console.error('Error rendering video:', err);
      setIsRecording(false);
      alert('Hubo un problema al exportar el video. Por favor intenta con una duración menor.');
    }
  };

  const handleDownloadVideo = () => {
    if (!videoResult) return;
    const isMp4 = videoResult.mimeType.includes('mp4');
    const filename = `lulu-emoji-shorts-${Date.now()}.${isMp4 ? 'mp4' : 'webm'}`;
    const a = document.createElement('a');
    a.href = videoResult.url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-3xl shadow-2xl border p-6 overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-[#181B22] border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Exportar Creación Lulu</h3>
              <p className="text-xs text-zinc-400">
                {aspectRatio === '9:16' ? 'Formato Vertical YouTube Shorts (1080x1920)' : 'Formato Cuadrado (1080x1080)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection (Video Shorts vs PNG) */}
        <div className="flex items-center gap-2 my-5 p-1 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              activeTab === 'video'
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Shorts (MP4 / WebM)</span>
          </button>

          <button
            onClick={() => setActiveTab('png')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              activeTab === 'png'
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Imagen PNG</span>
          </button>
        </div>

        {/* Tab 1: Video Shorts Export */}
        {activeTab === 'video' && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl border ${
                theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold uppercase tracking-wide">YouTube Shorts Ready</span>
              </div>
              <ul className="text-xs space-y-1 text-zinc-400">
                <li>• Resolución: <strong>1080 x 1920 (9:16)</strong></li>
                <li>• Duración: <strong>{duration} segundos</strong> a <strong>{fps} FPS</strong></li>
                <li>• Códec: <strong>H.264 / WebM AVC1</strong> con aceleración por hardware</li>
                <li>• Capas y Animación: <strong>{layers.length} capas</strong> con {keyframes.length} keyframes</li>
                {audioTrack && (
                  <li className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
                    <Mic className="w-3.5 h-3.5" /> Incluye pista de voz sincronizada ({audioTrack.duration.toFixed(1)}s)
                  </li>
                )}
                {background && (
                  <li className="text-amber-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <Palette className="w-3.5 h-3.5" /> Fondo personalizado incluido ({background.type})
                  </li>
                )}
              </ul>
            </div>

            {/* Video Generation Progress */}
            {isRecording && (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-amber-400 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" /> Renderizando fotogramas y audio...
                  </span>
                  <span className="font-mono font-bold text-amber-400">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Video Result Preview & Direct Download */}
            {videoResult && (
              <div className="space-y-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>¡Video con audio generado exitosamente!</span>
                </div>
                <div className="w-full max-h-48 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                  <video
                    src={videoResult.url}
                    controls
                    autoPlay
                    loop
                    className="max-h-48 rounded-lg shadow"
                  />
                </div>
                <button
                  onClick={handleDownloadVideo}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Video ({videoResult.mimeType.includes('mp4') ? 'MP4' : 'WebM'})</span>
                </button>
              </div>
            )}

            {/* Render Button */}
            {!videoResult && (
              <button
                onClick={handleRecordVideo}
                disabled={isRecording}
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-zinc-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isRecording ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generando Video ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Renderizar Video para YouTube Shorts</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Tab 2: PNG Export */}
        {activeTab === 'png' && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl border ${
                theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <h4 className="text-xs font-bold mb-3">Opciones de Imagen</h4>
              <label className="flex items-center gap-3 cursor-pointer select-none text-xs">
                <input
                  type="checkbox"
                  checked={pngTransparent}
                  onChange={e => setPngTransparent(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
                <span>Fondo Transparente (Sticker recortado sin fondo)</span>
              </label>
              {!pngTransparent && background && (
                <p className="text-[11px] text-amber-400 mt-2">
                  ✓ Se exportará con el fondo actual ({background.type}).
                </p>
              )}
            </div>

            <button
              onClick={handleDownloadPNG}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              <span>Descargar PNG en Alta Definición</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
