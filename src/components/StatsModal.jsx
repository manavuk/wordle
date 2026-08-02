import React from 'react';
import {
  X,
  Trophy,
  Flame,
  Target,
  BookOpen,
  Award,
  BarChart2,
  Sparkles,
  Zap
} from 'lucide-react';

export const StatsModal = ({ isOpen, onClose, stats, wordDefinition }) => {
  if (!isOpen) return null;

  const winPercentage = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  
  const dist = stats.guessDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const maxGuessCount = Math.max(...Object.values(dist), 1);
  
  // Calculate average guesses for winning games
  const totalWinningGuesses = Object.entries(dist).reduce((acc, [num, count]) => acc + Number(num) * count, 0);
  const totalWins = stats.wins || 0;
  const avgGuesses = totalWins > 0 ? (totalWinningGuesses / totalWins).toFixed(1) : 0;

  // Identify peak guess count
  const peakCount = Math.max(...Object.values(dist));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content stats-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Banner Header */}
        <div className="pref-header">
          <div className="pref-header-top">
            <div className="flex items-center gap-2.5">
              <div className="pref-icon-box">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-sm tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
                  Statistics
                </h2>
                <span
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-widest"
                  style={{ background: 'var(--accent-glow)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)' }}
                >
                  {winPercentage}% Wins
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
        </div>

        {/* Scrollable Modal Content */}
        <div className="pref-body custom-scrollbar">
          
          {/* 4 Stat KPI Cards Grid */}
          <div className="stats-grid-4">
            <div className="stats-kpi-card">
              <Target className="w-3.5 h-3.5 mb-1" style={{ color: 'var(--text-secondary)' }} />
              <div className="stats-kpi-val">{stats.played}</div>
              <div className="stats-kpi-lbl">Played</div>
            </div>

            <div className="stats-kpi-card">
              <Trophy className="w-3.5 h-3.5 mb-1 text-emerald-400" />
              <div className="stats-kpi-val text-emerald-400">{winPercentage}%</div>
              <div className="stats-kpi-lbl">Win %</div>
            </div>

            <div className="stats-kpi-card">
              <Flame className="w-3.5 h-3.5 mb-1 text-amber-400" />
              <div className="stats-kpi-val text-amber-400">{stats.currentStreak}</div>
              <div className="stats-kpi-lbl">Streak</div>
            </div>

            <div className="stats-kpi-card">
              <Award className="w-3.5 h-3.5 mb-1" style={{ color: 'var(--accent-color)' }} />
              <div className="stats-kpi-val" style={{ color: 'var(--accent-color)' }}>{stats.maxStreak}</div>
              <div className="stats-kpi-lbl">Best</div>
            </div>
          </div>

          {/* Average Guesses Efficiency Pill */}
          {totalWins > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg border text-xs" style={{ background: 'var(--bg-primary)', borderColor: 'var(--tile-empty-border)' }}>
              <span className="font-extrabold flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Avg Guesses: <strong style={{ color: 'var(--text-primary)' }}>{avgGuesses}</strong>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider" style={{ background: 'var(--accent-glow)', color: 'var(--accent-color)' }}>
                {avgGuesses <= 3.8 ? '🔥 Fast Solver' : '🎯 Steady'}
              </span>
            </div>
          )}

          <hr style={{ borderColor: 'var(--tile-empty-border)', opacity: 0.4 }} />

          {/* Guess Distribution Bar Chart */}
          <div>
            <div className="pref-section-header">
              <div className="pref-section-title">
                <BarChart2 className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
                <span>Guess Distribution</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const count = dist[num] || 0;
                const pct = Math.max((count / maxGuessCount) * 100, 6);
                const isPeak = count === peakCount && count > 0;

                return (
                  <div key={num} className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded flex items-center justify-center font-mono font-black text-[10px] shrink-0 border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--tile-empty-border)', color: 'var(--text-primary)' }}>
                      {num}
                    </div>

                    <div className="dist-bar-container flex-1">
                      <div
                        className={`dist-bar-fill ${isPeak ? 'is-peak' : ''}`}
                        style={{ width: `${pct}%` }}
                      >
                        <span>{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Word Dictionary & Insights Card */}
          {wordDefinition && (
            <>
              <hr style={{ borderColor: 'var(--tile-empty-border)', opacity: 0.4 }} />
              <div className="p-3 rounded-xl border flex flex-col gap-1.5" style={{ background: 'var(--bg-primary)', borderColor: 'var(--accent-color)', boxShadow: '0 0 12px var(--accent-glow)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs" style={{ color: 'var(--accent-color)' }}>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>DICTIONARY: <strong className="uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{wordDefinition.word}</strong></span>
                  </div>
                  {wordDefinition.partOfSpeech && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      {wordDefinition.partOfSpeech}
                    </span>
                  )}
                </div>
                <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {wordDefinition.definition}
                </p>
                {wordDefinition.example && (
                  <p className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    "{wordDefinition.example}"
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Compact Footer */}
        <div className="px-4 py-2 border-t flex items-center justify-between flex-shrink-0" style={{ background: 'var(--bg-glass)', borderColor: 'var(--tile-empty-border)' }}>
          <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>
            Wordle Statistics
          </span>
          <span className="text-[9px] font-extrabold tracking-wider uppercase flex items-center gap-1" style={{ color: 'var(--accent-color)' }}>
            <Sparkles className="w-2.5 h-2.5" /> Wordle Pro
          </span>
        </div>
      </div>
    </div>
  );
};
