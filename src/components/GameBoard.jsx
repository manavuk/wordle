import React from 'react';

export const GameBoard = ({
  guesses = [],
  currentGuess = '',
  maxGuesses = 6,
  wordLength = 5,
  evaluations = [],
  isShaking = false,
  targetWord = '',
  revealedPositions = {}
}) => {
  const rows = [];

  for (let r = 0; r < maxGuesses; r++) {
    const isCurrentRow = r === guesses.length;
    const isPastRow = r < guesses.length;
    const guessText = isPastRow
      ? guesses[r]
      : isCurrentRow
      ? currentGuess
      : '';

    const rowEvaluation = isPastRow ? evaluations[r] || [] : [];
    const tiles = [];

    for (let c = 0; c < wordLength; c++) {
      const letter = guessText[c] || (isCurrentRow && revealedPositions[c] ? revealedPositions[c] : '');
      const status = isPastRow ? rowEvaluation[c] : '';
      const isRevealedHint = isCurrentRow && revealedPositions[c] && !guessText[c];

      tiles.push(
        <div
          key={c}
          className={`tile ${letter ? 'filled' : ''} ${status ? `${status} flip` : ''} ${
            isRevealedHint ? 'border-dashed border-emerald-400 bg-emerald-950/40 text-emerald-300' : ''
          }`}
          style={{ animationDelay: isPastRow ? `${c * 100}ms` : '0ms' }}
        >
          {letter}
        </div>
      );
    }

    rows.push(
      <div
        key={r}
        className={`tile-row ${isCurrentRow && isShaking ? 'shake' : ''}`}
        style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
      >
        {tiles}
      </div>
    );
  }

  return (
    <div className="board-grid flex flex-col items-center justify-center my-2">
      {rows}
    </div>
  );
};
