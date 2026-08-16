import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { AudioTrack } from '../types';

interface VoiceRecorderProps {
  audioTrack?: AudioTrack;
  onSaveAudioTrack: (track: AudioTrack | undefined) => void;
  timelineDuration: number;
  theme: 'light' | 'dark';
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  audioTrack,
  onSaveAudioTrack,
  timelineDuration,
  theme,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Audio visualizer analyzer
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      // Setup MediaRecorder
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Calculate recorded duration
        const duration = recordingTime > 0 ? recordingTime : timelineDuration;

        const newTrack: AudioTrack = {
          id: `voice-${Date.now()}`,
          name: `Voz grabada (${duration.toFixed(1)}s)`,
          audioUrl,
          blob: audioBlob,
          duration,
          volume: 1.0,
          recordedAt: Date.now(),
        };

        onSaveAudioTrack(newTrack);
        setIsRecording(false);
        setAudioLevel(0);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };

      recorder.start(100);
      setIsRecording(true);

      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setRecordingTime(elapsed);
      }, 100);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setErrorMsg('No se pudo acceder al micrófono. Por favor permite el acceso.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePlayPreview = () => {
    if (!audioTrack) return;

    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(audioTrack.audioUrl);
      previewAudioRef.current.onended = () => setIsPlayingPreview(false);
    }

    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.volume = audioTrack.volume ?? 1;
      previewAudioRef.current.play().catch(e => console.error('Audio play error:', e));
      setIsPlayingPreview(true);
    }
  };

  const handleVolumeChange = (vol: number) => {
    if (!audioTrack) return;
    onSaveAudioTrack({
      ...audioTrack,
      volume: vol,
    });
    if (previewAudioRef.current) {
      previewAudioRef.current.volume = vol;
    }
  };

  const handleDeleteAudio = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
    onSaveAudioTrack(undefined);
  };

  return (
    <div
      id="voice-recorder-panel"
      className={`w-full p-4 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
          : 'bg-zinc-50 border-zinc-200 text-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold">Grabadora de Voz</h4>
            <p className="text-[10px] text-zinc-400">
              Graba tu voz para sincronizarla con el emoji y exportarla en el video
            </p>
          </div>
        </div>

        {audioTrack && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Audio Activo
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
          {errorMsg}
        </div>
      )}

      {/* Recording in progress state */}
      {isRecording && (
        <div className="flex flex-col items-center justify-center py-4 gap-3 bg-red-950/20 rounded-2xl border border-red-500/30 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-sm font-bold text-red-400 tracking-wider">
              GRABANDO: {recordingTime.toFixed(1)}s
            </span>
          </div>

          {/* Real-time audio waveform / visualizer bars */}
          <div className="flex items-end justify-center gap-1 h-10 w-full px-6">
            {[...Array(16)].map((_, i) => {
              const heightMultiplier = Math.max(0.15, Math.sin((i / 16) * Math.PI) * (audioLevel / 100));
              const heightPx = Math.max(6, Math.round(heightMultiplier * 36));
              return (
                <div
                  key={i}
                  className="w-2 rounded-full bg-gradient-to-t from-red-500 to-amber-400 transition-all duration-75"
                  style={{ height: `${heightPx}px` }}
                />
              );
            })}
          </div>

          <button
            onClick={stopRecording}
            className="mt-2 py-2 px-5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Detener y Guardar Voz</span>
          </button>
        </div>
      )}

      {/* Idle / Ready to Record State */}
      {!isRecording && !audioTrack && (
        <div className="flex flex-col items-center justify-center py-4 gap-3">
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
            title="Toca para Grabar Voz"
          >
            <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
          <span className="text-xs font-semibold text-zinc-400">
            Toca el micrófono para comenzar a grabar
          </span>
        </div>
      )}

      {/* Recorded Audio Track Controls */}
      {!isRecording && audioTrack && (
        <div className="flex flex-col gap-3 pt-1">
          <div
            className={`flex items-center justify-between p-2.5 rounded-xl border ${
              theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <button
                onClick={togglePlayPreview}
                className="w-9 h-9 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center hover:bg-amber-300 active:scale-95 transition-all shadow"
                title={isPlayingPreview ? 'Pausar' : 'Escuchar audio'}
              >
                {isPlayingPreview ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-bold">{audioTrack.name}</span>
                <span className="text-[10px] text-zinc-400">
                  Duración: {audioTrack.duration.toFixed(1)}s
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startRecording}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-700/60 hover:bg-zinc-700 text-zinc-300 transition-all"
                title="Regrabar voz"
              >
                Regrabar
              </button>
              <button
                onClick={handleDeleteAudio}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                title="Eliminar audio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 px-1">
            <Volume2 className="w-4 h-4 text-zinc-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioTrack.volume ?? 1}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-[11px] font-mono text-zinc-400 w-8 text-right">
              {Math.round((audioTrack.volume ?? 1) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
