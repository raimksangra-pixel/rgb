import React from 'react';
import { KeyboardLayoutType } from '../types/keyboard';
import { Power, Volume2, VolumeX, Laptop, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'profiles' | 'typing' | 'bridge';
  onTabChange: (tab: 'studio' | 'profiles' | 'typing' | 'bridge') => void;
  powerOn: boolean;
  onTogglePower: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  layout: KeyboardLayoutType;
  onToggleLayout: (layout: KeyboardLayoutType) => void;
  activeProfileName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  powerOn,
  onTogglePower,
  soundEnabled,
  onToggleSound,
  layout,
  onToggleLayout,
  activeProfileName,
}) => {
  return (
    <header className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${powerOn ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-neutral-600'}`} />
            <span className="text-base font-bold tracking-wider text-neutral-100 uppercase">
              TERRA Mobile 1551
            </span>
          </div>
          <span className="hidden sm:inline-block text-neutral-600">/</span>
          <span className="hidden sm:inline-block text-xs text-neutral-400 font-mono tracking-tight truncate max-w-[160px]">
            {activeProfileName}
          </span>
        </div>

        {/* Zone 2: Navigation tabs */}
        <nav className="flex items-center p-1 bg-neutral-950/70 border border-neutral-800 rounded-lg">
          <button
            onClick={() => onTabChange('studio')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Lighting Studio
          </button>
          <button
            onClick={() => onTabChange('profiles')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'profiles'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Profile Manager
          </button>
          <button
            onClick={() => onTabChange('typing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'typing'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Typing Test
          </button>
          <button
            onClick={() => onTabChange('bridge')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'bridge'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Hardware Bridge
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ISO / ANSI Layout toggle */}
          <div className="flex items-center p-0.5 bg-neutral-950/60 border border-neutral-800 rounded-md">
            <button
              onClick={() => onToggleLayout('iso_de')}
              title="German ISO-DE Layout"
              className={`px-2 py-1 text-[11px] font-mono font-medium rounded transition-colors ${
                layout === 'iso_de' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              ISO-DE
            </button>
            <button
              onClick={() => onToggleLayout('ansi_us')}
              title="US ANSI Layout"
              className={`px-2 py-1 text-[11px] font-mono font-medium rounded transition-colors ${
                layout === 'ansi_us' ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              ANSI-US
            </button>
          </div>

          {/* Sound click feedback toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Disable key click audio' : 'Enable key click audio'}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-neutral-800 border-neutral-700 text-cyan-400'
                : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Master Backlight Power */}
          <button
            onClick={onTogglePower}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              powerOn
                ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{powerOn ? 'Backlight ON' : 'Backlight OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
