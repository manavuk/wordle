import React from 'react';
import { Lightbulb, Flame, HelpCircle, EyeOff, Shuffle } from 'lucide-react';

export const PowerUps = ({
  onUseReveal,
  onUseVaporize,
  onUseHint,
  onSabotageInk,
  onSabotageScramble,
  revealsLeft = 2,
  vaporizesLeft = 2,
  hintsLeft = 2,
  sabotagesLeft = 2,
  isMultiplayer = false
}) => {
  return (
    <div className="powerups-panel">
      <button
        className="powerup-btn"
        onClick={onUseReveal}
        disabled={revealsLeft <= 0}
        title="Reveal 1 green target letter in correct tile"
      >
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <span>Reveal ({revealsLeft})</span>
      </button>

      <button
        className="powerup-btn"
        onClick={onUseVaporize}
        disabled={vaporizesLeft <= 0}
        title="Vaporize 3 unused wrong letters from keyboard"
      >
        <Flame className="w-4 h-4 text-red-400" />
        <span>Vaporize ({vaporizesLeft})</span>
      </button>

      <button
        className="powerup-btn"
        onClick={onUseHint}
        disabled={hintsLeft <= 0}
        title="Show word definition & hint"
      >
        <HelpCircle className="w-4 h-4 text-blue-400" />
        <span>Hint ({hintsLeft})</span>
      </button>

      {isMultiplayer && (
        <>
          <button
            className="powerup-btn border-purple-500/40 text-purple-300 hover:bg-purple-900/60"
            onClick={onSabotageInk}
            disabled={sabotagesLeft <= 0}
            title="Ink Splatter: Blind opponent for 5s!"
          >
            <EyeOff className="w-4 h-4 text-purple-400" />
            <span>Ink Attack ({sabotagesLeft})</span>
          </button>

          <button
            className="powerup-btn border-pink-500/40 text-pink-300 hover:bg-pink-900/60"
            onClick={onSabotageScramble}
            disabled={sabotagesLeft <= 0}
            title="Scramble: Shuffle opponent's keyboard layout!"
          >
            <Shuffle className="w-4 h-4 text-pink-400" />
            <span>Scramble ({sabotagesLeft})</span>
          </button>
        </>
      )}
    </div>
  );
};
