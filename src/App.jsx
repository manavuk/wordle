import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { PowerUps } from './components/PowerUps';
import { LocalMultiplayer } from './components/LocalMultiplayer';
import { RemoteMultiplayer } from './components/RemoteMultiplayer';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';

import { getRandomTargetWord, isValidWord, fetchWordDefinition } from './utils/words';
import {
  playKeypressSound,
  playFlipSound,
  playCorrectSound,
  playInvalidSound,
  playPowerUpSound,
  isMuted,
  setMuted
} from './utils/sound';

import confetti from 'canvas-confetti';
import { Shield, AlertCircle } from 'lucide-react';

const INITIAL_STATS = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
};

export function App() {
  const [gameMode, setGameMode] = useState('solo');
  
  // Persistent Word Length (4, 5, or 6)
  const [wordLength, setWordLengthState] = useState(() => {
    const saved = localStorage.getItem('wordle_wordlength');
    return saved ? Number(saved) : 5;
  });

  const setWordLength = (len) => {
    const newLen = Number(len);
    setWordLengthState(newLen);
    localStorage.setItem('wordle_wordlength', String(newLen));
  };

  const maxGuesses = 6;

  // Persistent Hard Mode
  const [hardMode, setHardModeState] = useState(() => {
    return localStorage.getItem('wordle_hardmode') === 'true';
  });

  const setHardMode = (val) => {
    setHardModeState(val);
    localStorage.setItem('wordle_hardmode', val ? 'true' : 'false');
  };

  // Persistent Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('wordle_theme') || 'synthwave');

  // Persistent Sound State
  const [mutedState, setMutedState] = useState(() => isMuted());

  const toggleSound = () => {
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
  };

  // Persistent High Contrast Mode
  const [highContrast, setHighContrastState] = useState(() => {
    return localStorage.getItem('wordle_highcontrast') === 'true';
  });

  const setHighContrast = (val) => {
    setHighContrastState(val);
    localStorage.setItem('wordle_highcontrast', val ? 'true' : 'false');
  };

  // Solo Game State
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [keyStatuses, setKeyStatuses] = useState({});
  const [isShaking, setIsShaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Power-Ups state
  const [revealedPositions, setRevealedPositions] = useState({});
  const [disabledKeys, setDisabledKeys] = useState(new Set());
  const [revealsLeft, setRevealsLeft] = useState(2);
  const [vaporizesLeft, setVaporizesLeft] = useState(2);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [hintMessage, setHintMessage] = useState('');

  // Definition state
  const [wordDef, setWordDef] = useState(null);

  // Modals
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('wordle_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch (e) {
      return INITIAL_STATS;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wordle_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-highcontrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-highcontrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('wordle_stats', JSON.stringify(stats));
  }, [stats]);

  const startNewSoloGame = () => {
    const word = getRandomTargetWord(wordLength);
    setTargetWord(word);
    setGuesses([]);
    setCurrentGuess('');
    setEvaluations([]);
    setGameStatus('playing');
    setKeyStatuses({});
    setRevealedPositions({});
    setDisabledKeys(new Set());
    setRevealsLeft(2);
    setVaporizesLeft(2);
    setHintsLeft(2);
    setHintMessage('');
    setStatusMessage('');
    setWordDef(null);
  };

  useEffect(() => {
    startNewSoloGame();
  }, [wordLength]);

  const evaluateGuess = (guess, target) => {
    const res = Array(wordLength).fill('absent');
    const targetArr = target.split('');
    const guessArr = guess.split('');

    guessArr.forEach((char, i) => {
      if (char === targetArr[i]) {
        res[i] = 'correct';
        targetArr[i] = null;
      }
    });

    guessArr.forEach((char, i) => {
      if (res[i] !== 'correct' && targetArr.includes(char)) {
        res[i] = 'present';
        targetArr[targetArr.indexOf(char)] = null;
      }
    });

    return res;
  };

  const handleKeyPress = (key) => {
    if (gameStatus !== 'playing' || gameMode !== 'solo') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLength) {
        setIsShaking(true);
        playInvalidSound();
        setStatusMessage(`Requires ${wordLength} letters!`);
        setTimeout(() => setIsShaking(false), 500);
        return;
      }

      if (!isValidWord(currentGuess, wordLength)) {
        setIsShaking(true);
        playInvalidSound();
        setStatusMessage('Not in word list!');
        setTimeout(() => setIsShaking(false), 500);
        return;
      }

      // Hard Mode Rule Enforcement
      if (hardMode) {
        // Check powerup revealed positions
        for (const pos in revealedPositions) {
          const idx = Number(pos);
          if (currentGuess[idx] !== revealedPositions[pos]) {
            setIsShaking(true);
            playInvalidSound();
            setStatusMessage(`Hard Mode: Tile ${idx + 1} must be '${revealedPositions[pos]}'!`);
            setTimeout(() => setIsShaking(false), 500);
            return;
          }
        }

        // Check previous green letters
        for (let r = 0; r < evaluations.length; r++) {
          const pastGuess = guesses[r];
          const pastEval = evaluations[r];
          for (let c = 0; c < wordLength; c++) {
            if (pastEval[c] === 'correct' && currentGuess[c] !== pastGuess[c]) {
              setIsShaking(true);
              playInvalidSound();
              setStatusMessage(`Hard Mode: Position ${c + 1} must be '${pastGuess[c]}'!`);
              setTimeout(() => setIsShaking(false), 500);
              return;
            }
            if (pastEval[c] === 'present' && !currentGuess.includes(pastGuess[c])) {
              setIsShaking(true);
              playInvalidSound();
              setStatusMessage(`Hard Mode: Guess must contain '${pastGuess[c]}'!`);
              setTimeout(() => setIsShaking(false), 500);
              return;
            }
          }
        }
      }

      const evaluation = evaluateGuess(currentGuess, targetWord);
      playFlipSound();

      const newGuesses = [...guesses, currentGuess];
      const newEvals = [...evaluations, evaluation];

      setGuesses(newGuesses);
      setEvaluations(newEvals);
      setCurrentGuess('');
      setStatusMessage('');

      setKeyStatuses((prev) => {
        const updated = { ...prev };
        currentGuess.split('').forEach((char, i) => {
          const status = evaluation[i];
          if (status === 'correct') updated[char] = 'correct';
          else if (status === 'present' && updated[char] !== 'correct') updated[char] = 'present';
          else if (!updated[char]) updated[char] = 'absent';
        });
        return updated;
      });

      if (currentGuess === targetWord) {
        setGameStatus('won');
        playCorrectSound();
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

        setStats((prev) => {
          const newStreak = prev.currentStreak + 1;
          const guessNum = newGuesses.length;
          return {
            ...prev,
            played: prev.played + 1,
            wins: prev.wins + 1,
            currentStreak: newStreak,
            maxStreak: Math.max(prev.maxStreak, newStreak),
            guessDistribution: {
              ...prev.guessDistribution,
              [guessNum]: (prev.guessDistribution[guessNum] || 0) + 1
            }
          };
        });

        fetchWordDefinition(targetWord).then(setWordDef);
      } else if (newGuesses.length >= maxGuesses) {
        setGameStatus('lost');
        playInvalidSound();
        setStats((prev) => ({
          ...prev,
          played: prev.played + 1,
          currentStreak: 0
        }));
        fetchWordDefinition(targetWord).then(setWordDef);
      }
    } else if (key === 'BACKSPACE') {
      playKeypressSound();
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
      playKeypressSound();
      setCurrentGuess((prev) => prev + key);
    }
  };

  const handleUseReveal = () => {
    if (revealsLeft <= 0 || gameStatus !== 'playing') return;
    const targetArr = targetWord.split('');
    const unrevealed = targetArr
      .map((char, idx) => (revealedPositions[idx] ? null : { char, idx }))
      .filter(Boolean);

    if (unrevealed.length > 0) {
      const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      setRevealedPositions((prev) => ({ ...prev, [pick.idx]: pick.char }));
      setRevealsLeft((prev) => prev - 1);
      playPowerUpSound();
      setStatusMessage(`Revealed '${pick.char}' at tile ${pick.idx + 1}!`);
    }
  };

  const handleUseVaporize = () => {
    if (vaporizesLeft <= 0 || gameStatus !== 'playing') return;
    const allLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    const targetSet = new Set(targetWord.split(''));
    const candidateWrongKeys = allLetters.filter(
      (l) => !targetSet.has(l) && !disabledKeys.has(l) && keyStatuses[l] !== 'absent'
    );

    if (candidateWrongKeys.length > 0) {
      const shuffle = [...candidateWrongKeys].sort(() => 0.5 - Math.random());
      const toRemove = shuffle.slice(0, 3);
      setDisabledKeys((prev) => {
        const next = new Set(prev);
        toRemove.forEach((k) => next.add(k));
        return next;
      });
      setVaporizesLeft((prev) => prev - 1);
      playPowerUpSound();
      setStatusMessage(`Vaporized wrong keys: ${toRemove.join(', ')}!`);
    }
  };

  const handleUseHint = () => {
    if (hintsLeft <= 0 || gameStatus !== 'playing') return;
    setHintsLeft((prev) => prev - 1);
    playPowerUpSound();
    fetchWordDefinition(targetWord).then((data) => {
      setHintMessage(`HINT (${data.partOfSpeech}): ${data.definition}`);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        gameMode={gameMode}
        setGameMode={setGameMode}
        muted={mutedState}
        toggleSound={toggleSound}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewGame={startNewSoloGame}
        streak={stats.currentStreak}
      />

      <main className="app-container">
        {gameMode === 'solo' && (
          <div className="game-layout">
            {/* Hard Mode Badge */}
            {hardMode && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" /> Hard Mode Active
              </div>
            )}

            {/* Status & Hint Banners */}
            {statusMessage && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-extrabold rounded-xl animate-bounce">
                <AlertCircle className="w-4 h-4" /> {statusMessage}
              </div>
            )}

            {hintMessage && (
              <div className="px-4 py-2 bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-semibold rounded-xl text-center max-w-md">
                💡 {hintMessage}
              </div>
            )}

            <GameBoard
              guesses={guesses}
              currentGuess={currentGuess}
              maxGuesses={maxGuesses}
              wordLength={wordLength}
              evaluations={evaluations}
              isShaking={isShaking}
              targetWord={targetWord}
              revealedPositions={revealedPositions}
            />

            {/* Game Over Modal / Banner */}
            {gameStatus !== 'playing' && (
              <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/90 border border-purple-500/50 rounded-2xl w-full text-center shadow-xl">
                <div className="text-xl font-black text-emerald-400">
                  {gameStatus === 'won' ? '🎉 Splendid victory!' : '❌ Round Over!'}
                </div>
                <div className="text-sm text-slate-300 font-semibold">
                  Target Word: <span className="text-purple-400 font-mono font-extrabold text-lg uppercase tracking-widest">{targetWord}</span>
                </div>
                <button onClick={startNewSoloGame} className="btn-primary mt-2">
                  Next Word Round →
                </button>
              </div>
            )}

            <PowerUps
              onUseReveal={handleUseReveal}
              onUseVaporize={handleUseVaporize}
              onUseHint={handleUseHint}
              revealsLeft={revealsLeft}
              vaporizesLeft={vaporizesLeft}
              hintsLeft={hintsLeft}
            />

            <Keyboard
              onKeyPress={handleKeyPress}
              keyStatuses={keyStatuses}
              disabledKeys={disabledKeys}
            />
          </div>
        )}

        {gameMode === 'local' && <LocalMultiplayer wordLength={wordLength} maxGuesses={maxGuesses} />}

        {gameMode === 'remote' && <RemoteMultiplayer wordLength={wordLength} maxGuesses={maxGuesses} />}
      </main>

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        wordDefinition={wordDef}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        wordLength={wordLength}
        setWordLength={setWordLength}
        theme={theme}
        setTheme={setTheme}
        hardMode={hardMode}
        setHardMode={setHardMode}
        muted={mutedState}
        toggleSound={toggleSound}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onResetStats={() => setStats(INITIAL_STATS)}
      />
    </div>
  );
}
