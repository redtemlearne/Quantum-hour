import React from 'react';
import {
  Play,
  Volume2,
  Moon,
  Gauge,
  ArrowLeft,
  FileText,
  Radio,
  Sparkles,
  User,
  Mic,
} from 'lucide-react';
import { ScriptOutput } from '../data.ts';

interface PlayerScreenProps {
  prompt?: string;
  script?: ScriptOutput | null;
  onBackToStudio: () => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  prompt,
  script,
  onBackToStudio,
}) => {
  const displayTitle = script?.title || (prompt && prompt.trim().length > 0
    ? `Quantum Hour: ${prompt}`
    : 'Title placeholder: The Quantum Horizon');

  const displaySummary = script?.summary ||
    'Summary placeholder: Deep exploration of quantum foundations, observational paradigms, and astrophysical perspectives prepared for radio transmission.';

  const lines = script?.lines || [];

  const totalWords = lines.reduce((acc, line) => {
    if (!line.text) return acc;
    const count = line.text.trim().split(/\s+/).filter(Boolean).length;
    return acc + count;
  }, 0);

  const totalMinutes = Math.max(1, Math.round(totalWords / 125));
  const modelName = script?.modelUsed || 'gemini-3.8-flash';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToStudio}
          className="min-h-[48px] px-4 py-2.5 rounded-xl text-base font-medium text-[#98a2c8] hover:text-[#e8ecff] bg-white/5 border border-white/10 flex items-center gap-2 touch-manipulation active:scale-[0.98] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#8b7cf6]" aria-hidden="true" />
          <span>Back to Studio</span>
        </button>

        <span
          className="text-xs uppercase tracking-wider text-[#5eead4] px-3 py-1.5 rounded-full bg-[#5eead4]/10 border border-[#5eead4]/20"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Player Stage · Script Master
        </span>
      </div>

      {/* Main Split Layout:
          Landscape (lg+): Cover & controls on Left, Transcript on Right
          Portrait: Stacked vertically
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Cover & Audio Controls */}
        <div
          className="lg:col-span-5 xl:col-span-5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          {/* Cover Placeholder (Square, drawn with CSS starfield) */}
          <div className="w-full aspect-square max-w-[340px] mx-auto rounded-2xl cover-starfield border border-white/20 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            {/* Ambient quantum ring decoration */}
            <div
              className="absolute w-48 h-48 rounded-full border border-[#8b7cf6]/30 animate-pulse pointer-events-none"
              style={{ animationDuration: '4s' }}
            />
            <div
              className="absolute w-64 h-64 rounded-full border border-[#5eead4]/20 pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-black/40 border border-white/15 backdrop-blur-sm">
                <Radio className="w-10 h-10 text-[#8b7cf6]" aria-hidden="true" />
              </div>
              <span
                className="text-sm tracking-widest text-[#5eead4] uppercase font-semibold"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Quantum Hour
              </span>
              <span className="text-xs text-[#98a2c8]/80 max-w-[200px]">
                CSS Cosmic Starfield Canvas
              </span>
            </div>

            <div className="absolute bottom-3 right-3 text-[10px] text-white/40 uppercase font-mono">
              Radio Script Edition
            </div>
          </div>

          {/* Title & Summary */}
          <div className="space-y-3 text-left">
            <h1
              className="text-2xl sm:text-3xl font-normal text-[#e8ecff] leading-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {displayTitle}
            </h1>
            <p className="text-base text-[#98a2c8] leading-relaxed">
              {displaySummary}
            </p>
          </div>

          {/* Disabled Audio Controls Section */}
          <div className="space-y-5 pt-3 border-t border-white/10">
            {/* Seek Bar & Timers */}
            <div className="space-y-2">
              <div
                className="w-full h-3 rounded-full bg-white/10 relative overflow-hidden opacity-50 cursor-not-allowed"
                aria-label="Seek bar (disabled)"
              >
                <div className="h-full w-0 bg-[#8b7cf6] rounded-full" />
              </div>
              <div
                className="flex items-center justify-between text-xs sm:text-sm text-[#98a2c8] tabular-nums"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                <span>0:00</span>
                <span>0:00</span>
              </div>
            </div>

            {/* Play/Pause and Secondary Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Play / Pause button */}
              <button
                type="button"
                disabled
                className="min-h-[52px] min-w-[52px] px-6 py-3 rounded-xl bg-white/10 text-white/40 border border-white/10 flex items-center justify-center gap-2 cursor-not-allowed font-medium text-base touch-manipulation"
                aria-label="Play or Pause (disabled)"
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>Play</span>
              </button>

              {/* Auxiliary Chips & Controls */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Speed Chip 1x */}
                <button
                  type="button"
                  disabled
                  className="min-h-[48px] px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[#98a2c8]/60 cursor-not-allowed text-sm font-medium flex items-center gap-1.5 touch-manipulation"
                  aria-label="Playback speed 1x (disabled)"
                >
                  <Gauge className="w-4 h-4" aria-hidden="true" />
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>1x</span>
                </button>

                {/* Sleep Timer Chip */}
                <button
                  type="button"
                  disabled
                  className="min-h-[48px] px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[#98a2c8]/60 cursor-not-allowed text-sm font-medium flex items-center gap-1.5 touch-manipulation"
                  aria-label="Sleep timer (disabled)"
                >
                  <Moon className="w-4 h-4" aria-hidden="true" />
                  <span>Sleep</span>
                </button>

                {/* Volume Control */}
                <div
                  className="min-h-[48px] px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[#98a2c8]/60 flex items-center gap-2 opacity-60 cursor-not-allowed"
                  aria-label="Volume control (disabled)"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <div className="w-16 h-1.5 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transcript Panel */}
        <div
          className="lg:col-span-7 xl:col-span-7 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl min-h-[500px]"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <div className="space-y-5">
            {/* Header with Title and Mono Stats Label */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#8b7cf6]" aria-hidden="true" />
                <h2
                  className="text-xl font-normal text-[#e8ecff]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Broadcast Transcript
                </h2>
              </div>

              {/* Exact required mono label: "about N words, about M min, model: X" */}
              {lines.length > 0 && (
                <div
                  className="text-xs text-[#5eead4] px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 tracking-tight"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  about {totalWords} words, about {totalMinutes} min, model: {modelName}
                </div>
              )}
            </div>

            {/* Empty State vs Full Script Lines */}
            {lines.length === 0 ? (
              <div className="py-20 sm:py-28 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#98a2c8]">
                  <Sparkles className="w-6 h-6 text-[#8b7cf6]" aria-hidden="true" />
                </div>
                <p className="text-base sm:text-lg text-[#e8ecff] font-medium">
                  The transcript will appear here.
                </p>
                <p className="text-sm text-[#98a2c8] max-w-xs mx-auto">
                  Once script synthesis runs, interactive multi-speaker lines and timestamps will stream into this view.
                </p>
              </div>
            ) : (
              <div
                className="space-y-4 max-h-[650px] overflow-y-auto pr-1.5 select-text"
                tabIndex={0}
                aria-label="Transcript content"
              >
                {lines.map((line, idx) => {
                  const isHost = line.role === 'host' || line.speaker.toLowerCase() === 'paul';

                  return (
                    <article
                      key={idx}
                      className={`p-4 sm:p-5 rounded-xl border transition-all ${
                        isHost
                          ? 'bg-[#8b7cf6]/10 border-[#8b7cf6]/35 border-l-4 border-l-[#8b7cf6]'
                          : 'bg-white/[0.04] border-white/10 border-l-4 border-l-[#5eead4]/60'
                      }`}
                    >
                      {/* Speaker Name and City above the text */}
                      <div className="flex items-center justify-between gap-2 pb-2">
                        <div className="flex items-center gap-2">
                          {isHost ? (
                            <Mic className="w-4 h-4 text-[#8b7cf6]" aria-hidden="true" />
                          ) : (
                            <User className="w-4 h-4 text-[#5eead4]" aria-hidden="true" />
                          )}
                          <span
                            className={`text-sm font-semibold tracking-wide ${
                              isHost ? 'text-[#8b7cf6]' : 'text-[#5eead4]'
                            }`}
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                          >
                            {line.speaker}
                          </span>
                          <span className="text-xs text-[#98a2c8]">·</span>
                          <span
                            className="text-xs text-[#98a2c8]"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                          >
                            {line.city || (isHost ? 'London' : 'Caller')}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                            isHost
                              ? 'bg-[#8b7cf6]/20 text-[#e8ecff]'
                              : 'bg-white/5 text-[#98a2c8]'
                          }`}
                        >
                          {isHost ? 'Host' : 'Caller'}
                        </span>
                      </div>

                      {/* Line dialogue turn */}
                      <p className="text-base sm:text-[17px] text-[#e8ecff] leading-relaxed font-normal">
                        {line.text}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer status notice */}
          <div
            className="text-xs text-[#98a2c8]/60 text-center pt-4 border-t border-white/5"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            QUANTUM HOUR ARCHIVE · BROADCAST SCRIPT LOADED
          </div>
        </div>
      </div>
    </div>
  );
};
