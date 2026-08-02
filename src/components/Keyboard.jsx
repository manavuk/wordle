import React, { useEffect } from 'react';
import { Delete, CornerDownLeft, Lock } from 'lucide-react';

export const Keyboard = ({
  onKeyPress,
  keyStatuses = {},
  disabledKeys = new Set(),
  isScrambled = false,
  isActive = true,
  playerLabel = ''
}) => {
  const defaultRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  let rows = defaultRows;
  if (isScrambled) {
    const letters = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    const shuffled = [...letters].sort(() => 0.5 - Math.random());
    rows = [
      shuffled.slice(0, 10),
      shuffled.slice(10, 19),
      ['ENTER', ...shuffled.slice(19, 26), 'BACKSPACE']
    ];
  }

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

      if (e.key === 'Enter') {
        onKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        onKeyPress('BACKSPACE');
      } else {
        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
          onKeyPress(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, isActive]);

  return (
    <div className={`keyboard relative ${!isActive ? 'opacity-40 pointer-events-none filter grayscale-[30%]' : ''}`}>
      {!isActive && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-20 rounded-xl flex items-center justify-center gap-2 text-slate-300 font-extrabold text-xs uppercase tracking-wider border border-slate-700/50">
          <Lock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{playerLabel ? `${playerLabel}'S TURN TO GUESS` : 'WAITING FOR TURN'}</span>
        </div>
      )}

      {rows.map((row, rIdx) => (
        <div key={rIdx} className="keyboard-row">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === 'BACKSPACE';
            const status = keyStatuses[key] || '';
            const isDisabled = disabledKeys.has(key) || !isActive;

            return (
              <button
                key={key}
                disabled={isDisabled}
                className={`key-btn ${isWide ? 'wide' : ''} ${status} ${
                  isDisabled ? 'opacity-20 cursor-not-allowed bg-slate-800' : ''
                }`}
                onClick={() => onKeyPress(key)}
              >
                {key === 'BACKSPACE' ? (
                  <Delete className="w-4 h-4" />
                ) : key === 'ENTER' ? (
                  <span className="flex items-center justify-center gap-0.5 font-bold whitespace-nowrap text-[11px] tracking-tight">
                    <CornerDownLeft className="w-3 h-3 flex-shrink-0" /> SUBMIT
                  </span>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
