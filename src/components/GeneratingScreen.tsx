import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  Loader2,
  Circle,
  XCircle,
  PlayCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  GENERATION_STEPS,
  FormatType,
  LevelType,
  LengthType,
  MoodType,
  ScriptOutput,
  parseLengthToMinutes,
} from '../data.ts';

interface GeneratingScreenProps {
  prompt: string;
  format: FormatType;
  level: LevelType;
  length: LengthType;
  mood: MoodType;
  onCancel: () => void;
  onOffTopic: (redirectMessage: string) => void;
  onSuccess: (script: ScriptOutput) => void;
}

export const GeneratingScreen: React.FC<GeneratingScreenProps> = ({
  prompt,
  format,
  level,
  length,
  mood,
  onCancel,
  onOffTopic,
  onSuccess,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isScriptDone, setIsScriptDone] = useState(false);
  const [scriptResult, setScriptResult] = useState<ScriptOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Stop timer condition
  const isStopped = isScriptDone || !!errorMessage;

  const runGeneration = useCallback(() => {
    setErrorMessage(null);
    setIsScriptDone(false);
    setScriptResult(null);

    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const minutesNum = parseLengthToMinutes(length);

    fetch('/api/script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        format,
        level,
        minutes: minutesNum,
        mood,
      }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Server responded with status ${res.status}`);
        }
        return data as ScriptOutput;
      })
      .then((data) => {
        if (!data.onTopic) {
          // If off-topic, return to Home and display redirect card
          onOffTopic(data.redirectMessage || 'Please ask questions related to physics, astronomy, or cosmology.');
          return;
        }

        setIsScriptDone(true);
        setScriptResult(data);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        const msg = err instanceof Error ? err.message : 'Failed to write script';
        setErrorMessage(msg);
      });
  }, [prompt, format, level, length, mood, onOffTopic]);

  useEffect(() => {
    runGeneration();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [runGeneration]);

  // Elapsed real-time clock counter: stops when script finishes or fails
  useEffect(() => {
    if (isStopped) return;

    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 0.1);
    }, 100);

    return () => clearInterval(timerInterval);
  }, [isStopped]);

  const handleCancelClick = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onCancel();
  };

  const handleOpenPlayerClick = () => {
    if (scriptResult) {
      onSuccess(scriptResult);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    const tenths = Math.floor((totalSec * 10) % 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
  };

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
            Script Generation Pipeline
          </span>
        </div>

        {/* Elapsed Timer in IBM Plex Mono (stops when script finishes or fails) */}
        <div
          className="flex items-center gap-2 text-base text-[#e8ecff]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <Clock className="w-4 h-4 text-[#98a2c8]" aria-hidden="true" />
          <span className="text-xs uppercase text-[#98a2c8]">Elapsed:</span>
          <span
            className={`text-lg font-bold tabular-nums ${
              errorMessage ? 'text-red-400' : isScriptDone ? 'text-[#5eead4]' : 'text-[#e8ecff]'
            }`}
          >
            {formatTimer(elapsedSeconds)}
          </span>
          {isStopped && (
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/10 text-[#98a2c8]">
              {errorMessage ? 'Stopped' : 'Ready'}
            </span>
          )}
        </div>
      </div>

      {/* Error state notification if script fails */}
      {errorMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-start gap-3.5 text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1.5 flex-1">
            <div className="text-base font-semibold text-red-200">
              Script Writing Interrupted
            </div>
            <div className="text-sm sm:text-base text-red-300/90 leading-relaxed">
              {errorMessage}
            </div>
          </div>
        </div>
      )}

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
          <div
            className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#98a2c8]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>Format: {format}</span>
            <span>·</span>
            <span>Duration: {parseLengthToMinutes(length)} min</span>
            <span>·</span>
            <span>Tone: {mood}</span>
          </div>
        </div>

        {/* Six Steps Log */}
        <div className="space-y-3 pt-2" role="log" aria-label="Generation progress steps">
          <div
            className="text-xs text-[#98a2c8] uppercase tracking-wider mb-3 flex items-center justify-between"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>STUDIO STAGES</span>
            {scriptResult?.modelUsed && (
              <span className="text-[#5eead4]">Model: {scriptResult.modelUsed}</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {GENERATION_STEPS.map((stepName, idx) => {
              // Writing script is step index 1
              const isWritingScriptStep = idx === 1;

              if (isWritingScriptStep) {
                const isDone = isScriptDone;
                const isFailed = !!errorMessage;
                const isRunning = !isScriptDone && !errorMessage;

                return (
                  <div
                    key={stepName}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-white/10 border-[#5eead4]/40 text-[#e8ecff]'
                        : isFailed
                        ? 'bg-red-950/30 border-red-500/50 text-red-200'
                        : 'bg-[#8b7cf6]/15 border-[#8b7cf6] text-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#5eead4] shrink-0" aria-hidden="true" />
                      ) : isFailed ? (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-[#8b7cf6] animate-spin shrink-0" aria-hidden="true" />
                      )}

                      <span className="text-base font-semibold">
                        {idx + 1}. {stepName}
                      </span>
                    </div>

                    <span
                      className="text-xs font-mono uppercase tracking-wider"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {isDone ? (
                        <span className="text-[#5eead4] font-semibold">Complete</span>
                      ) : isFailed ? (
                        <span className="text-red-400">Failed</span>
                      ) : (
                        <span className="text-[#8b7cf6]">Generating script...</span>
                      )}
                    </span>
                  </div>
                );
              }

              // The other five steps show "coming in a later stage" in muted text
              return (
                <div
                  key={stepName}
                  className="flex items-center justify-between p-3.5 rounded-xl border bg-black/20 border-white/5 text-[#98a2c8]/60"
                >
                  <div className="flex items-center gap-3">
                    <Circle className="w-5 h-5 text-white/15 shrink-0" aria-hidden="true" />
                    <span className="text-base font-normal">
                      {idx + 1}. {stepName}
                    </span>
                  </div>

                  <span
                    className="text-xs italic text-[#98a2c8]/60"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    coming in a later stage
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
            onClick={handleCancelClick}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl text-base font-medium text-[#98a2c8] bg-white/5 border border-white/10 hover:text-[#e8ecff] active:bg-white/10 transition-colors flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98]"
          >
            <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
            <span>Cancel</span>
          </button>

          {errorMessage && (
            <button
              type="button"
              onClick={runGeneration}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl text-base font-semibold text-white bg-[#8b7cf6] hover:bg-[#7c66dc] border border-[#8b7cf6] transition-all flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Try again</span>
            </button>
          )}

          {isScriptDone && !errorMessage && (
            <button
              type="button"
              onClick={handleOpenPlayerClick}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl text-base font-semibold text-slate-950 bg-gradient-to-r from-[#8b7cf6] to-[#5eead4] shadow-lg shadow-[#5eead4]/20 transition-all flex items-center justify-center gap-2.5 touch-manipulation active:scale-[0.98] animate-in fade-in zoom-in-95 duration-200"
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
