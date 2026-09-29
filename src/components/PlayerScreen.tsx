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
} from 'lucide-react';

interface PlayerScreenProps {
  prompt?: string;
  onBackToStudio: () => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  prompt,
  onBackToStudio,
}) => {
  const displayTitle = prompt && prompt.trim().length > 0
    ? prompt
    : "Title placeholder: The Quantum Horizon";

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
          Player Stage · Ready
        </span>
      </div>

      {/* Main Split Layout:
          Landscape (lg+): Cover & controls on Left (approx 55%), Transcript on Right (approx 45%)
          Portrait: Stacked vertically
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Cover & Audio Controls */}
        <div
          className="lg:col-span-7 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          {/* Cover Placeholder (Square, drawn with CSS starfield) */}
          <div className="w-full aspect-square max-w-[380px] mx-auto rounded-2xl cover-starfield border border-white/20 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
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
              Hi-Fi Audio Master
            </div>
          </div>

          {/* Title & Summary Placeholders */}
          <div className="space-y-2 text-center sm:text-left">
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#e8ecff] leading-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {displayTitle}
            </h2>
            <p className="text-base text-[#98a2c8] leading-relaxed">
              Summary placeholder: Deep exploration of quantum foundations, observational paradigms, and astrophysical perspectives prepared for radio transmission.
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
          className="lg:col-span-5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[380px] shadow-xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8b7cf6]" aria-hidden="true" />
                <h3
                  className="text-lg font-normal text-[#e8ecff]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Transcript
                </h3>
              </div>
              <span
                className="text-xs text-[#98a2c8]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                LIVE FEED
              </span>
            </div>

            {/* Empty State requirement */}
            <div className="py-16 sm:py-24 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#98a2c8]">
                <Sparkles className="w-6 h-6 text-[#8b7cf6]" aria-hidden="true" />
              </div>
              <p className="text-base sm:text-lg text-[#e8ecff] font-medium">
                The transcript will appear here.
              </p>
              <p className="text-sm text-[#98a2c8] max-w-xs mx-auto">
                Once speech synthesis runs, interactive multi-speaker lines and timestamps will stream into this view.
              </p>
            </div>
          </div>

          <div
            className="text-xs text-[#98a2c8]/60 text-center pt-4 border-t border-white/5"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            AWAITING REAL-TIME AUDIO BUS
          </div>
        </div>
      </div>
    </div>
  );
};
