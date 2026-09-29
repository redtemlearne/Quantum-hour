import React from 'react';
import { Library as LibraryIcon, Radio, Sparkles } from 'lucide-react';

interface LibraryScreenProps {
  onGoToStudio: () => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ onGoToStudio }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-8">
      <div className="space-y-2">
        <h1
          className="text-3xl sm:text-4xl font-normal text-[#e8ecff]"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Broadcast Archive
        </h1>
        <p className="text-base text-[#98a2c8]">
          Your generated discussions, audio masters, and research papers will be preserved here.
        </p>
      </div>

      {/* Empty State Card */}
      <div
        className="rounded-2xl p-10 sm:p-16 text-center space-y-6 shadow-xl border"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.10)',
        }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-inner">
          <LibraryIcon className="w-8 h-8 text-[#5eead4]" aria-hidden="true" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          {/* Exact required text */}
          <h2
            className="text-xl sm:text-2xl font-normal text-[#e8ecff]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            No episodes yet. Your shows will appear here.
          </h2>
          <p className="text-base text-[#98a2c8] leading-relaxed">
            Head to the studio to ask the universe out loud and generate your first custom quantum physics talk radio broadcast.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onGoToStudio}
            className="min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b7cf6] to-[#7c66dc] text-white font-medium text-base shadow-lg shadow-[#8b7cf6]/20 border border-[#8b7cf6]/50 flex items-center justify-center gap-2 mx-auto touch-manipulation active:scale-[0.98] transition-all"
          >
            <Radio className="w-5 h-5 text-[#5eead4]" aria-hidden="true" />
            <span>Go to Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
