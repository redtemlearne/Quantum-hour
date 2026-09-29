import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Sliders,
  Clock,
  Compass,
  ArrowRight,
} from 'lucide-react';
import {
  FORMAT_OPTIONS,
  LEVEL_OPTIONS,
  LENGTH_OPTIONS,
  MOOD_OPTIONS,
  PRESET_TABS,
  PRESET_CARDS,
  FormatType,
  LevelType,
  LengthType,
  MoodType,
  PresetTab,
  PresetCard,
} from '../data.ts';

interface HomeScreenProps {
  prompt: string;
  setPrompt: (value: string) => void;
  format: FormatType;
  setFormat: (value: FormatType) => void;
  level: LevelType;
  setLevel: (value: LevelType) => void;
  length: LengthType;
  setLength: (value: LengthType) => void;
  mood: MoodType;
  setMood: (value: MoodType) => void;
  onGenerate: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  prompt,
  setPrompt,
  format,
  setFormat,
  level,
  setLevel,
  length,
  setLength,
  mood,
  setMood,
  onGenerate,
}) => {
  const [activeTab, setActiveTab] = useState<PresetTab>('Quantum');

  const handleSelectPreset = (preset: PresetCard) => {
    setPrompt(preset.prompt);
    setFormat(preset.format);
  };

  const isPromptEmpty = prompt.trim().length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      {/* Hero Headline Section */}
      <section className="text-center space-y-3">
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#e8ecff]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Ask the universe out loud
        </h1>
        <p className="text-base sm:text-lg text-[#98a2c8] max-w-2xl mx-auto">
          Broadcast-grade talk radio exploring deep astrophysics, quantum anomalies, and the architecture of reality.
        </p>
      </section>

      {/* Main Studio Prompt & Controls Console */}
      <section
        className="rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        {/* Large Multi-line Prompt Input Box */}
        <div className="space-y-2">
          <label
            htmlFor="broadcast-prompt"
            className="block text-sm font-medium text-[#98a2c8]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            TOPIC & INQUIRY
          </label>
          <div className="relative">
            <textarea
              id="broadcast-prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Is the Moon there when nobody looks?"
              className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3.5 text-base sm:text-lg text-[#e8ecff] placeholder:text-[#98a2c8]/50 focus:outline-none focus:ring-2 focus:ring-[#8b7cf6] focus:border-transparent transition-all resize-y min-h-[120px]"
            />
          </div>
        </div>

        {/* Studio Broadcast Options */}
        <div className="space-y-5 pt-1">
          {/* Format Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#98a2c8] uppercase tracking-wider" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <Layers className="w-4 h-4 text-[#8b7cf6]" aria-hidden="true" />
              <span>Format</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FORMAT_OPTIONS.map((opt) => {
                const isSelected = format === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormat(opt)}
                    className={`min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all text-center flex items-center justify-center touch-manipulation active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#8b7cf6] text-white font-semibold shadow-md shadow-[#8b7cf6]/20 border border-[#8b7cf6]'
                        : 'bg-white/5 text-[#98a2c8] border border-white/10 active:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level, Length, Mood Segmented Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Level */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#98a2c8] uppercase tracking-wider" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <Sliders className="w-4 h-4 text-[#5eead4]" aria-hidden="true" />
                <span>Level</span>
              </div>
              <div className="flex p-1 rounded-xl bg-black/40 border border-white/10 gap-1">
                {LEVEL_OPTIONS.map((lvl) => {
                  const isSelected = level === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`flex-1 min-h-[48px] px-2 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center touch-manipulation active:scale-[0.97] ${
                        isSelected
                          ? 'bg-white/15 text-[#e8ecff] shadow-sm font-semibold border border-white/20'
                          : 'text-[#98a2c8] active:bg-white/5'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Length */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#98a2c8] uppercase tracking-wider" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <Clock className="w-4 h-4 text-[#8b7cf6]" aria-hidden="true" />
                <span>Length</span>
              </div>
              <div className="flex p-1 rounded-xl bg-black/40 border border-white/10 gap-1">
                {LENGTH_OPTIONS.map((len) => {
                  const isSelected = length === len;
                  return (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setLength(len)}
                      className={`flex-1 min-h-[48px] px-2 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center touch-manipulation active:scale-[0.97] ${
                        isSelected
                          ? 'bg-white/15 text-[#e8ecff] shadow-sm font-semibold border border-white/20'
                          : 'text-[#98a2c8] active:bg-white/5'
                      }`}
                    >
                      {len}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#98a2c8] uppercase tracking-wider" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <Compass className="w-4 h-4 text-[#5eead4]" aria-hidden="true" />
                <span>Mood</span>
              </div>
              <div className="flex p-1 rounded-xl bg-black/40 border border-white/10 gap-1">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = mood === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`flex-1 min-h-[48px] px-2 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center justify-center touch-manipulation active:scale-[0.97] ${
                        isSelected
                          ? 'bg-white/15 text-[#e8ecff] shadow-sm font-semibold border border-white/20'
                          : 'text-[#98a2c8] active:bg-white/5'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isPromptEmpty}
            className={`w-full min-h-[52px] px-6 py-3.5 rounded-xl text-base sm:text-lg font-semibold flex items-center justify-center gap-3 transition-all touch-manipulation ${
              isPromptEmpty
                ? 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#8b7cf6] to-[#7c66dc] text-white shadow-lg shadow-[#8b7cf6]/25 border border-[#8b7cf6]/50 active:scale-[0.99] active:brightness-95'
            }`}
          >
            <Sparkles className="w-5 h-5 text-[#5eead4]" aria-hidden="true" />
            <span>Generate Broadcast</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Preset Topics & Archives */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2
              className="text-xl sm:text-2xl font-normal text-[#e8ecff]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Curated Cosmic Inquiries
            </h2>
            <p className="text-sm text-[#98a2c8]">
              Tap any inquiry to load its topic and format into the studio
            </p>
          </div>

          {/* Preset Tabs */}
          <div className="flex p-1 rounded-xl bg-black/40 border border-white/10 self-start sm:self-auto">
            {PRESET_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`min-h-[48px] px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all touch-manipulation active:scale-[0.97] ${
                    isActive
                      ? 'bg-white/15 text-[#e8ecff] font-semibold border border-white/20 shadow-sm'
                      : 'text-[#98a2c8] active:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_CARDS[activeTab].map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleSelectPreset(card)}
              className="text-left p-5 rounded-2xl transition-all touch-manipulation active:scale-[0.99] group border flex flex-col justify-between space-y-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.10)',
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-medium text-[#5eead4] tracking-wide"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {card.format}
                  </span>
                  <span className="text-xs text-[#98a2c8] opacity-75">
                    Tap to use
                  </span>
                </div>
                <h3
                  className="text-lg sm:text-xl font-normal text-[#e8ecff] leading-snug"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-[#98a2c8] leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs sm:text-sm font-medium text-[#8b7cf6] gap-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <span>Load into console</span>
                <span aria-hidden="true">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
