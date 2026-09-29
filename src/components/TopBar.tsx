import React from 'react';
import { Radio, Library as LibraryIcon } from 'lucide-react';

interface TopBarProps {
  currentScreen: 'home' | 'generating' | 'player' | 'library';
  onNavigate: (screen: 'home' | 'library') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#05060f]/80 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Zone: App Name with Pulsing Red-Orange ON AIR dot */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b7cf6] rounded-xl p-1.5 transition-opacity"
            aria-label="Quantum Hour Home"
          >
            <span
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#e8ecff]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Quantum Hour
            </span>

            {/* ON AIR indicator with red-orange pulsing dot */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-500/20">
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#f97316] on-air-pulse inline-block"
                aria-hidden="true"
              />
              <span className="text-[11px] font-semibold tracking-wider text-red-300 uppercase select-none" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                ON AIR
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Buttons: Home & Library */}
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main Navigation">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`min-h-[48px] px-5 py-2.5 rounded-xl text-base font-medium transition-colors flex items-center gap-2 touch-manipulation active:scale-[0.98] ${
              currentScreen === 'home' || currentScreen === 'generating' || currentScreen === 'player'
                ? 'bg-white/10 text-[#e8ecff] border border-white/20 shadow-sm'
                : 'text-[#98a2c8] hover:text-[#e8ecff] active:bg-white/5'
            }`}
            aria-current={currentScreen === 'home' ? 'page' : undefined}
          >
            <Radio className="w-5 h-5 text-[#8b7cf6]" aria-hidden="true" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('library')}
            className={`min-h-[48px] px-5 py-2.5 rounded-xl text-base font-medium transition-colors flex items-center gap-2 touch-manipulation active:scale-[0.98] ${
              currentScreen === 'library'
                ? 'bg-white/10 text-[#e8ecff] border border-white/20 shadow-sm'
                : 'text-[#98a2c8] hover:text-[#e8ecff] active:bg-white/5'
            }`}
            aria-current={currentScreen === 'library' ? 'page' : undefined}
          >
            <LibraryIcon className="w-5 h-5 text-[#5eead4]" aria-hidden="true" />
            <span>Library</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
