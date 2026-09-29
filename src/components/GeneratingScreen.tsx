import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Circle,
  XCircle,
  PlayCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GENERATION_STEPS } from '../data.ts';

interface GeneratingScreenProps {
  prompt: string;
  onCancel: () => void;
  onOpenPlayer: () => void;
}

export const GeneratingScreen: React.FC<GeneratingScreenProps> = ({
  prompt,
  onCancel,
  onOpenPlayer,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Step advancement timer (one step completes every 1.2 seconds)
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1;
        } else {
          setIsFinished(true);
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(stepInterval);
  }, []);

  // Elapsed real-time clock counter
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 0.1);
    }, 100);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    const tenths = Math.floor((totalSec * 10) % 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round(((currentStepIndex + (isFinished ? 1 : 0.5)) / GENERATION_STEPS.length) * 100)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-violet-950/30 border border-[#8b7cf6]/20">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#5eead4] shrink-0" aria-hidden="true" />
          <span
            className="text-sm font-semibold tracking-wide text-[#5eead4] uppercase"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Mock run (no AI connected yet)
          </span>
        </div>

        {/* Elapsed Timer in IBM Plex Mono */}
        <div className="flex items-center gap-2 text-base text-[#e8ecff]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          <Clock className="w-4 h-4 text-[#98a2c8]" aria-hidden="true" />
          <span className="text-xs uppercase text-[#98a2c8]">Elapsed:</span>
          <span className="text-lg font-bold tabular-nums text-[#e8ecff]">
            {formatTimer(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Generating Card Container */}
      <div
        className="rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        {/* Prompt Header */}
        <div className="space-y-2 pb-4 border-b border-white/10">
          <span
            className="text-xs text-[#98a2c8] uppercase tracking-wider block"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            BROADCAST INQUIRY
          </span>
          <p
            className="text-lg sm:text-2xl font-normal text-[#e8ecff] leading-relaxed"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            &ldquo;{prompt}&rdquo;
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm text-[#98a2c8]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <span>Synthesizing episode pipeline</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8b7cf6] to-[#5eead4] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Six Steps Log */}
        <div className="space-y-3 pt-2" role="log" aria-label="Generation progress steps">
          <div
            className="text-xs text-[#98a2c8] uppercase tracking-wider mb-3"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            STUDIO STAGES
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {GENERATION_STEPS.map((stepName, idx) => {
              const isDone = isFinished || idx < currentStepIndex;
              const isCurrent = !isFinished && idx === currentStepIndex;
              const isPending = !isFinished && idx > currentStepIndex;

              return (
                <div
                  key={stepName}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-white/10 border-[#5eead4]/40 text-[#e8ecff]'
                      : isCurrent
                      ? 'bg-[#8b7cf6]/15 border-[#8b7cf6] text-white shadow-sm'
                      : 'bg-black/20 border-white/5 text-[#98a2c8]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#5eead4] shrink-0" aria-hidden="true" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#8b7cf6] animate-spin shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/20 shrink-0" aria-hidden="true" />
                    )}

                    <span className="text-base font-medium">
                      {idx + 1}. {stepName}
                    </span>
                  </div>

                  <span
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {isDone ? (
                      <span className="text-[#5eead4]">Completed</span>
                    ) : isCurrent ? (
                      <span className="text-[#8b7cf6]">In progress...</span>
                    ) : (
                      <span className="text-white/30">Queued</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl text-base font-medium text-[#98a2c8] bg-white/5 border border-white/10 hover:text-[#e8ecff] active:bg-white/10 transition-colors flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98]"
          >
            <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
            <span>Cancel</span>
          </button>

          {isFinished && (
            <button
              type="button"
              onClick={onOpenPlayer}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#8b7cf6] to-[#5eead4] text-slate-950 font-bold shadow-lg shadow-[#5eead4]/20 transition-all flex items-center justify-center gap-2.5 touch-manipulation active:scale-[0.98] animate-in fade-in zoom-in-95 duration-200"
            >
              <PlayCircle className="w-5 h-5 text-slate-950" aria-hidden="true" />
              <span>Open player</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
