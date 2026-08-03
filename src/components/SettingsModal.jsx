import React, { useState } from 'react';
import {
  X,
  Shield,
  Volume2,
  VolumeX,
  RotateCcw,
  Palette,
  Layers,
  Gamepad2,
  Sparkles,
  Eye,
  Music,
  ArrowRight,
  Zap,
  Play,
  CheckCircle2,
  Check,
  BookOpen
} from 'lucide-react';
import {
  playKeypressSound,
  playFlipSound,
  playCorrectSound,
  playPowerUpSound
} from '../utils/sound';

export const SettingsModal = ({
  isOpen,
  onClose,
  wordLength = 5,
  setWordLength = () => {},
  theme = 'synthwave',
  setTheme = () => {},
  hardMode = false,
  setHardMode = () => {},
  muted = false,
  toggleSound = () => {},
  highContrast = false,
  setHighContrast = () => {},
  allowInvalidWords = false,
  setAllowInvalidWords = () => {},
  onResetStats = () => {}
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [lastTestedSound, setLastTestedSound] = useState(null);

  if (!isOpen) return null;

  const themes = [
    {
      id: 'synthwave',
      name: 'Synthwave',
      accent: '#8b5cf6',
      correct: '#10b981',
      present: '#f59e0b',
      absent: '#334155',
      bg: '#0f172a',
      rows: [
        [ { char: 'W', state: 'correct' }, { char: 'I', state: 'present' }, { char: 'N', state: 'absent' } ],
        [ { char: 'P', state: 'absent' }, { char: 'L', state: 'correct' }, { char: 'Y', state: 'present' } ]
      ]
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      accent: '#ff0055',
      correct: '#00ffcc',
      present: '#ffcc00',
      absent: '#27272a',
      bg: '#09090b',
      rows: [
        [ { char: 'N', state: 'correct' }, { char: 'E', state: 'present' }, { char: 'O', state: 'absent' } ],
        [ { char: 'C', state: 'absent' }, { char: 'Y', state: 'correct' }, { char: 'B', state: 'present' } ]
      ]
    },
    {
      id: 'pastel',
      name: 'Pastel',
      accent: '#ec4899',
      correct: '#34d399',
      present: '#fbbf24',
      absent: '#cbd5e1',
      bg: '#fdf4ff',
      rows: [
        [ { char: 'C', state: 'correct' }, { char: 'U', state: 'present' }, { char: 'T', state: 'absent' } ],
        [ { char: 'M', state: 'absent' }, { char: 'I', state: 'correct' }, { char: 'N', state: 'present' } ]
      ]
    },
    {
      id: 'classic',
      name: 'Classic',
      accent: '#538d4e',
      correct: '#538d4e',
      present: '#b59f3b',
      absent: '#3a3a3c',
      bg: '#121213',
      rows: [
        [ { char: 'G', state: 'correct' }, { char: 'O', state: 'present' }, { char: 'L', state: 'absent' } ],
        [ { char: 'D', state: 'absent' }, { char: 'A', state: 'correct' }, { char: 'Y', state: 'present' } ]
      ]
    },
    {
      id: 'emerald',
      name: 'Emerald',
      accent: '#10b981',
      correct: '#10b981',
      present: '#f59e0b',
      absent: '#134e4a',
      bg: '#062c24',
      rows: [
        [ { char: 'G', state: 'correct' }, { char: 'E', state: 'present' }, { char: 'M', state: 'absent' } ],
        [ { char: 'O', state: 'absent' }, { char: 'A', state: 'correct' }, { char: 'K', state: 'present' } ]
      ]
    }
  ];

  const wordLengthOptions = [
    { len: 4, label: '4 Letters', letters: ['W', 'O', 'R', 'D'] },
    { len: 5, label: '5 Letters', letters: ['S', 'M', 'A', 'R', 'T'] },
    { len: 6, label: '6 Letters', letters: ['B', 'A', 'T', 'T', 'L', 'E'] }
  ];

  const handleTestSound = (soundType, soundFn) => {
    soundFn();
    setLastTestedSound(soundType);
    setTimeout(() => setLastTestedSound(null), 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content preferences-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Banner Header */}
        <div className="pref-header">
          <div className="pref-header-top">
            <div className="flex items-center gap-2.5">
              <div className="pref-icon-box">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-sm tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
                  Preferences
                </h2>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-widest" style={{ background: 'var(--accent-glow)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)' }}>
                  PRO
                </span>
              </div>
            </div>
            <button
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--tile-empty-border)', color: 'var(--text-secondary)' }}
              onClick={onClose}
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compact Active Summary Pills */}
          <div className="pref-pills-row">
            <span className="pref-pill">
              <Layers className="w-3 h-3" style={{ color: 'var(--accent-color)' }} />
              {wordLength}L Grid
            </span>
            <span className="pref-pill" style={{ opacity: hardMode ? 1 : 0.6 }}>
              <Shield className="w-3 h-3 text-amber-400" />
              Hard Mode
            </span>
            <span className="pref-pill" style={{ opacity: allowInvalidWords ? 1 : 0.6 }}>
              <BookOpen className="w-3 h-3 text-pink-400" />
              {allowInvalidWords ? 'Any Word' : 'Strict Words'}
            </span>
            <span className="pref-pill capitalize">
              <Palette className="w-3 h-3" style={{ color: 'var(--accent-color)' }} />
              {theme}
            </span>
            <span className="pref-pill" style={{ opacity: !muted ? 1 : 0.6 }}>
              {!muted ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-red-400" />}
              Audio
            </span>
          </div>
        </div>

        {/* Compact Scrollable Body */}
        <div className="pref-body custom-scrollbar">
          
          {/* SECTION 1: WORD GRID SELECTION */}
          <div>
            <div className="pref-section-header">
              <div className="pref-section-title">
                <Layers className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
                <span>Word Grid</span>
              </div>
            </div>

            {/* Word Length Cards */}
            <div className="pref-grid-3">
              {wordLengthOptions.map((opt) => {
                const isSelected = wordLength === opt.len;
                return (
                  <button
                    key={opt.len}
                    type="button"
                    onClick={() => setWordLength(opt.len)}
                    className={`pref-card ${isSelected ? 'active' : ''}`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1" style={{ color: 'var(--accent-color)' }}>
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}

                    <div className="tile-row-mini">
                      {opt.letters.map((char, idx) => (
                        <div
                          key={idx}
                          className={`tile-mini ${isSelected ? 'active-theme-tile' : 'inactive-theme-tile'}`}
                        >
                          {char}
                        </div>
                      ))}
                    </div>

                    <div className="font-black text-[11px]">
                      {opt.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={{ borderColor: 'var(--tile-empty-border)', opacity: 0.4 }} />

          {/* SECTION 2: THEME SKINS */}
          <div>
            <div className="pref-section-header">
              <div className="pref-section-title">
                <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
                <span>Theme Skins</span>
              </div>
            </div>

            <div className="pref-grid-2">
              {themes.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`pref-card ${isSelected ? 'active' : ''}`}
                    style={{ textAlign: 'left', alignItems: 'stretch' }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-[11px] flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: t.accent }}
                        />
                        {t.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: 'var(--accent-color)' }}>
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* 2x3 Mini Wordle Board Skin Preview */}
                    <div
                      className="mini-board-preview"
                      style={{ backgroundColor: t.bg }}
                    >
                      {t.rows.map((row, rIdx) => (
                        <div key={rIdx} className="mini-board-row">
                          {row.map((tile, cIdx) => {
                            const tileBg =
                              tile.state === 'correct'
                                ? t.correct
                                : tile.state === 'present'
                                ? t.present
                                : t.absent;
                            return (
                              <div
                                key={cIdx}
                                className="tile-mini text-white"
                                style={{ backgroundColor: tileBg, borderColor: 'rgba(0,0,0,0.3)' }}
                              >
                                {tile.char}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={{ borderColor: 'var(--tile-empty-border)', opacity: 0.4 }} />

          {/* SECTION 3: RULES & FEEDBACK TOGGLES (Visual Switch Knobs Without Redundant ON/OFF Text) */}
          <div>
            <div className="pref-section-header">
              <div className="pref-section-title">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Rules & Feedback</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Hard Mode Toggle */}
              <div
                onClick={() => setHardMode(!hardMode)}
                className={`pref-switch-card ${hardMode ? 'active-switch' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors" style={{ background: hardMode ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-secondary)', borderColor: hardMode ? 'rgba(245, 158, 11, 0.4)' : 'var(--tile-empty-border)', color: hardMode ? '#f59e0b' : 'var(--text-secondary)' }}>
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-xs">Hard Mode</span>
                  </div>

                  {/* Knob Knob Switch Only (No text) */}
                  <div className={`switch-toggle ${hardMode ? 'active-switch' : ''}`}>
                    <div className="switch-knob" />
                  </div>
                </div>

                {/* Compact Visual Hint Rule Diagram */}
                <div className="mt-2 pt-1.5 border-t flex items-center justify-between" style={{ borderColor: 'var(--tile-empty-border)' }}>
                  <div className="tile-row-mini" style={{ width: 'auto', margin: 0 }}>
                    <div className="tile-mini bg-emerald-600 text-white border-emerald-400">S</div>
                    <div className="tile-mini bg-amber-500 text-black border-amber-400">T</div>
                    <div className="tile-mini text-slate-400" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--tile-empty-border)' }}>A</div>
                    <div className="tile-mini text-slate-400" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--tile-empty-border)' }}>R</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-extrabold">
                    <ArrowRight className="w-3 h-3" />
                    <span>Strict Hints</span>
                  </div>
                </div>
              </div>

              {/* Audio FX Toggle & Sound Test Bench */}
              <div
                onClick={toggleSound}
                className={`pref-switch-card ${!muted ? 'active-switch' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors" style={{ background: !muted ? 'var(--accent-glow)' : 'var(--bg-secondary)', borderColor: !muted ? 'var(--accent-color)' : 'var(--tile-empty-border)', color: !muted ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                      {!muted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs">Audio FX</span>
                      {!muted && (
                        <div className="audio-equalizer">
                          <div className="eq-bar" />
                          <div className="eq-bar" />
                          <div className="eq-bar" />
                          <div className="eq-bar" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Knob Switch Only (No text) */}
                  <div className={`switch-toggle ${!muted ? 'active-switch' : ''}`}>
                    <div className="switch-knob" />
                  </div>
                </div>

                {/* Compact Interactive Audio Chips */}
                {!muted && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 pt-1.5 border-t flex items-center justify-between" style={{ borderColor: 'var(--tile-empty-border)' }}
                  >
                    <span className="text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <Music className="w-2.5 h-2.5 text-emerald-400" /> Test:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTestSound('Click', playKeypressSound)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5 cursor-pointer transition-all border"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--tile-empty-border)', color: 'var(--text-primary)' }}
                      >
                        <Play className="w-2 h-2 text-emerald-400" /> Click
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTestSound('Flip', () => playFlipSound(0))}
                        className="px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5 cursor-pointer transition-all border"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--tile-empty-border)', color: 'var(--text-primary)' }}
                      >
                        <Play className="w-2 h-2 text-emerald-400" /> Flip
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTestSound('Win', playCorrectSound)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5 cursor-pointer transition-all border"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--tile-empty-border)', color: 'var(--text-primary)' }}
                      >
                        <Sparkles className="w-2 h-2 text-amber-400" /> Win
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* High Contrast Toggle */}
              <div
                onClick={() => setHighContrast(!highContrast)}
                className={`pref-switch-card ${highContrast ? 'active-switch' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors" style={{ background: highContrast ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-secondary)', borderColor: highContrast ? 'rgba(6, 182, 212, 0.4)' : 'var(--tile-empty-border)', color: highContrast ? '#06b6d4' : 'var(--text-secondary)' }}>
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-xs">High Contrast</span>
                  </div>

                  {/* Knob Switch Only (No text) */}
                  <div className={`switch-toggle ${highContrast ? 'active-switch' : ''}`}>
                    <div className="switch-knob" />
                  </div>
                </div>

                {/* Swatch Chips */}
                <div className="mt-2 pt-1.5 border-t flex items-center justify-end gap-1.5 text-xs" style={{ borderColor: 'var(--tile-empty-border)' }}>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--tile-empty-border)' }}>
                    <div className="w-2 h-2 rounded-full bg-[#f5793a]" />
                    <span className="text-[9px] font-bold">Orange</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--tile-empty-border)' }}>
                    <div className="w-2 h-2 rounded-full bg-[#85c0f9]" />
                    <span className="text-[9px] font-bold">Blue</span>
                  </div>
                </div>
              </div>

              {/* Allow Invalid Words Toggle Card */}
              <div
                onClick={() => setAllowInvalidWords(!allowInvalidWords)}
                className={`pref-switch-card ${allowInvalidWords ? 'active-switch' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors"
                      style={{
                        background: allowInvalidWords ? 'rgba(236, 72, 153, 0.2)' : 'var(--bg-secondary)',
                        borderColor: allowInvalidWords ? 'rgba(236, 72, 153, 0.4)' : 'var(--tile-empty-border)',
                        color: allowInvalidWords ? '#ec4899' : 'var(--text-secondary)'
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs">Allow Invalid Words</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        {allowInvalidWords ? 'Any letter combo accepted' : 'Strict real dictionary only (Default)'}
                      </span>
                    </div>
                  </div>

                  {/* Knob Switch Only */}
                  <div className={`switch-toggle ${allowInvalidWords ? 'active-switch' : ''}`}>
                    <div className="switch-knob" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Modal Footer */}
        <div className="px-4 py-2.5 border-t flex items-center justify-between flex-shrink-0" style={{ background: 'var(--bg-glass)', borderColor: 'var(--tile-empty-border)' }}>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-[11px] font-extrabold hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Stats</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full p-1 px-2 rounded-lg border bg-red-950/40 border-red-500/40">
              <span className="text-[11px] font-bold text-red-300">Reset stats?</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onResetStats();
                    setShowResetConfirm(false);
                  }}
                  className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded text-[10px] cursor-pointer transition-all"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded text-[10px] cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showResetConfirm && (
            <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>
              Wordle Pro
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
