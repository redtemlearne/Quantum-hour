/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar.tsx';
import { NebulaBackground } from './components/NebulaBackground.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { GeneratingScreen } from './components/GeneratingScreen.tsx';
import { PlayerScreen } from './components/PlayerScreen.tsx';
import { LibraryScreen } from './components/LibraryScreen.tsx';
import { FormatType, LevelType, LengthType, MoodType, ScriptOutput } from './data.ts';

export type ScreenState = 'home' | 'generating' | 'player' | 'library';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [prompt, setPrompt] = useState<string>('');
  const [format, setFormat] = useState<FormatType>('Interpretation debate');
  const [level, setLevel] = useState<LevelType>('Curious');
  const [length, setLength] = useState<LengthType>('3 min');
  const [mood, setMood] = useState<MoodType>('Curious');

  // Script generation and off-topic redirect state
  const [generatedScript, setGeneratedScript] = useState<ScriptOutput | null>(null);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  // Verify server health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .catch((err) => {
        console.error('Server health check error:', err);
      });
  }, []);

  const handleStartGenerating = () => {
    if (prompt.trim().length > 0) {
      setRedirectMessage(null);
      setCurrentScreen('generating');
    }
  };

  const handleCancelGenerating = () => {
    setCurrentScreen('home');
  };

  const handleScriptOffTopic = (msg: string) => {
    setRedirectMessage(msg);
    setCurrentScreen('home');
  };

  const handleScriptSuccess = (script: ScriptOutput) => {
    setGeneratedScript(script);
    setCurrentScreen('player');
  };

  const handleNavigate = (screen: 'home' | 'library') => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen text-[#e8ecff] flex flex-col relative selection:bg-[#8b7cf6]/30 selection:text-white">
      {/* Background with Cosmic Starfield and Violet/Teal Nebulae */}
      <NebulaBackground />

      {/* Top Bar with Brand, Pulsing ON AIR Dot, and Navigation */}
      <TopBar currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {currentScreen === 'home' && (
          <HomeScreen
            prompt={prompt}
            setPrompt={setPrompt}
            format={format}
            setFormat={setFormat}
            level={level}
            setLevel={setLevel}
            length={length}
            setLength={setLength}
            mood={mood}
            setMood={setMood}
            onGenerate={handleStartGenerating}
            redirectMessage={redirectMessage}
            onDismissRedirect={() => setRedirectMessage(null)}
          />
        )}

        {currentScreen === 'generating' && (
          <GeneratingScreen
            prompt={prompt}
            format={format}
            level={level}
            length={length}
            mood={mood}
            onCancel={handleCancelGenerating}
            onOffTopic={handleScriptOffTopic}
            onSuccess={handleScriptSuccess}
          />
        )}

        {currentScreen === 'player' && (
          <PlayerScreen
            prompt={prompt}
            script={generatedScript}
            onBackToStudio={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'library' && (
          <LibraryScreen
            onGoToStudio={() => setCurrentScreen('home')}
          />
        )}
      </main>
    </div>
  );
}
