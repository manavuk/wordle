import React from 'react';
import { Volume2, VolumeX, BarChart2, Settings, Users, Radio, Sparkles, RefreshCw, User, Swords } from 'lucide-react';

export const Header = ({
  gameMode,
  setGameMode,
  muted,
  toggleSound,
  onOpenStats,
  onOpenSettings,
  onNewGame,
  streak = 0
}) => {
  const modes = [
    { id: 'solo', label: 'Solo', icon: User, badge: null },
    { id: 'local', label: 'Local 2P', icon: Swords, badge: 'Battle' },
    { id: 'remote', label: 'Remote P2P', icon: Radio, badge: 'Live' }
  ];

  return (
    <header className="app-header">
      {/* Brand Logo */}
      <div className="logo-container">
        <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
        <span className="font-black tracking-tight text-white">WORDLE</span>
        <span className="mode-badge">UNLIMITED</span>
      </div>

      {/* Premium Segmented Mode Selector */}
      <div className="mode-switcher-container">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = gameMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setGameMode(mode.id)}
              className={`mode-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{mode.label}</span>
              {mode.badge && (
                <span className={`tab-badge ${isActive ? 'active-badge' : ''}`}>
                  {mode.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {gameMode === 'solo' && (
          <div className="streak-pill" title="Current Winning Streak">
            <span className="text-amber-400">🔥</span>
            <span>{streak}</span>
          </div>
        )}

        <button className="icon-btn" onClick={onNewGame} title="New Word Round">
          <RefreshCw className="w-4 h-4" />
        </button>

        <button className="icon-btn" onClick={toggleSound} title={muted ? "Unmute Sound" : "Mute Sound"}>
          {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button className="icon-btn" onClick={onOpenStats} title="View Statistics">
          <BarChart2 className="w-4 h-4" />
        </button>

        <button className="icon-btn" onClick={onOpenSettings} title="Game Options & Themes">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
