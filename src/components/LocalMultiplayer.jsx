import React, { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { Keyboard } from './Keyboard';
import { PowerUps } from './PowerUps';
import { getRandomTargetWord, isValidWord } from '../utils/words';
import { playKeypressSound, playFlipSound, playCorrectSound, playInvalidSound, playSabotageSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Trophy, Zap, AlertTriangle } from 'lucide-react';

export const LocalMultiplayer = ({ wordLength = 5, maxGuesses = 6, allowInvalidWords = false }) => {
  const [targetWord, setTargetWord] = useState('');
  const [battleMode, setBattleMode] = useState('turn-based'); // 'turn-based' or 'simultaneous'

  // Player 1 state
  const [p1Guesses, setP1Guesses] = useState([]);
  const [p1Current, setP1Current] = useState('');
  const [p1Eval, setP1Eval] = useState([]);
  const [p1Status, setP1Status] = useState('playing');
  const [p1KeyStatuses, setP1KeyStatuses] = useState({});
  const [p1Shaking, setP1Shaking] = useState(false);
  const [p1Reveals, setP1Reveals] = useState({});
  const [p1Vaporized, setP1Vaporized] = useState(new Set());
  const [p1SabotagedInk, setP1SabotagedInk] = useState(false);
  const [p1SabotagedScramble, setP1SabotagedScramble] = useState(false);
  const [p1PowerUpsLeft, setP1PowerUpsLeft] = useState(2);

  // Player 2 state
  const [p2Guesses, setP2Guesses] = useState([]);
  const [p2Current, setP2Current] = useState('');
  const [p2Eval, setP2Eval] = useState([]);
  const [p2Status, setP2Status] = useState('playing');
  const [p2KeyStatuses, setP2KeyStatuses] = useState({});
  const [p2Shaking, setP2Shaking] = useState(false);
  const [p2Reveals, setP2Reveals] = useState({});
  const [p2Vaporized, setP2Vaporized] = useState(new Set());
  const [p2SabotagedInk, setP2SabotagedInk] = useState(false);
  const [p2SabotagedScramble, setP2SabotagedScramble] = useState(false);
  const [p2PowerUpsLeft, setP2PowerUpsLeft] = useState(2);

  const [activeTurn, setActiveTurn] = useState(1);
  const [winner, setWinner] = useState(null);

  const startNewMatch = () => {
    const word = getRandomTargetWord(wordLength);
    setTargetWord(word);

    setP1Guesses([]);
    setP1Current('');
    setP1Eval([]);
    setP1Status('playing');
    setP1KeyStatuses({});
    setP1Reveals({});
    setP1Vaporized(new Set());
    setP1SabotagedInk(false);
    setP1SabotagedScramble(false);
    setP1PowerUpsLeft(2);

    setP2Guesses([]);
    setP2Current('');
    setP2Eval([]);
    setP2Status('playing');
    setP2KeyStatuses({});
    setP2Reveals({});
    setP2Vaporized(new Set());
    setP2SabotagedInk(false);
    setP2SabotagedScramble(false);
    setP2PowerUpsLeft(2);

    setActiveTurn(1);
    setWinner(null);
  };

  useEffect(() => {
    startNewMatch();
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

  const updateKeyStatuses = (guess, evalArr, setKeyStatuses) => {
    setKeyStatuses((prev) => {
      const updated = { ...prev };
      guess.split('').forEach((char, i) => {
        const current = updated[char];
        const status = evalArr[i];
        if (status === 'correct') {
          updated[char] = 'correct';
        } else if (status === 'present' && current !== 'correct') {
          updated[char] = 'present';
        } else if (!current) {
          updated[char] = 'absent';
        }
      });
      return updated;
    });
  };

  const handleKeyPressForPlayer = (playerNum, key) => {
    if (winner) return;

    if (battleMode === 'turn-based' && activeTurn !== playerNum) return;

    if (playerNum === 1) {
      if (p1Status !== 'playing') return;
      if (key === 'ENTER') {
        if (p1Current.length !== wordLength || !isValidWord(p1Current, wordLength, allowInvalidWords)) {
          setP1Shaking(true);
          playInvalidSound();
          setP1Current('');
          setTimeout(() => setP1Shaking(false), 500);
          return;
        }

        const evaluation = evaluateGuess(p1Current, targetWord);
        playFlipSound();

        const newGuesses = [...p1Guesses, p1Current];
        const newEvals = [...p1Eval, evaluation];
        setP1Guesses(newGuesses);
        setP1Eval(newEvals);
        updateKeyStatuses(p1Current, evaluation, setP1KeyStatuses);
        setP1Current('');
        setP1SabotagedScramble(false);

        if (p1Current === targetWord) {
          setP1Status('won');
          setWinner('Player 1');
          playCorrectSound();
          confetti({ particleCount: 120, spread: 70, origin: { x: 0.3 } });
        } else if (newGuesses.length >= maxGuesses) {
          setP1Status('lost');
          if (p2Status === 'lost') setWinner('Draw');
        }

        if (p2Status === 'playing') setActiveTurn(2);
      } else if (key === 'BACKSPACE') {
        playKeypressSound();
        setP1Current((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && p1Current.length < wordLength) {
        playKeypressSound();
        setP1Current((prev) => prev + key);
      }
    } else {
      if (p2Status !== 'playing') return;
      if (key === 'ENTER') {
        if (p2Current.length !== wordLength || !isValidWord(p2Current, wordLength, allowInvalidWords)) {
          setP2Shaking(true);
          playInvalidSound();
          setP2Current('');
          setTimeout(() => setP2Shaking(false), 500);
          return;
        }

        const evaluation = evaluateGuess(p2Current, targetWord);
        playFlipSound();

        const newGuesses = [...p2Guesses, p2Current];
        const newEvals = [...p2Eval, evaluation];
        setP2Guesses(newGuesses);
        setP2Eval(newEvals);
        updateKeyStatuses(p2Current, evaluation, setP2KeyStatuses);
        setP2Current('');
        setP2SabotagedScramble(false);

        if (p2Current === targetWord) {
          setP2Status('won');
          setWinner('Player 2');
          playCorrectSound();
          confetti({ particleCount: 120, spread: 70, origin: { x: 0.7 } });
        } else if (newGuesses.length >= maxGuesses) {
          setP2Status('lost');
          if (p1Status === 'lost') setWinner('Draw');
        }

        if (p1Status === 'playing') setActiveTurn(1);
      } else if (key === 'BACKSPACE') {
        playKeypressSound();
        setP2Current((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && p2Current.length < wordLength) {
        playKeypressSound();
        setP2Current((prev) => prev + key);
      }
    }
  };

  const handleSabotageInk = (attackerNum) => {
    playSabotageSound();
    if (attackerNum === 1) {
      if (p1PowerUpsLeft <= 0) return;
      setP1PowerUpsLeft((prev) => prev - 1);
      setP2SabotagedInk(true);
      setTimeout(() => setP2SabotagedInk(false), 5000);
    } else {
      if (p2PowerUpsLeft <= 0) return;
      setP2PowerUpsLeft((prev) => prev - 1);
      setP1SabotagedInk(true);
      setTimeout(() => setP1SabotagedInk(false), 5000);
    }
  };

  const handleSabotageScramble = (attackerNum) => {
    playSabotageSound();
    if (attackerNum === 1) {
      if (p1PowerUpsLeft <= 0) return;
      setP1PowerUpsLeft((prev) => prev - 1);
      setP2SabotagedScramble(true);
    } else {
      if (p2PowerUpsLeft <= 0) return;
      setP2PowerUpsLeft((prev) => prev - 1);
      setP1SabotagedScramble(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex flex-wrap items-center justify-between w-full max-w-5xl px-4 py-3 bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="font-extrabold text-sm tracking-wider text-white">LOCAL BATTLE ARENA</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setBattleMode('turn-based')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              battleMode === 'turn-based' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Turn-by-Turn
          </button>
          <button
            onClick={() => setBattleMode('simultaneous')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              battleMode === 'simultaneous' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Speed Race
          </button>
        </div>

        {winner && (
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm animate-bounce">
            <Trophy className="w-5 h-5" /> WINNER: {winner}!
          </div>
        )}

        <button
          onClick={startNewMatch}
          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl text-xs text-white shadow-md transition-all whitespace-nowrap"
        >
          Reset Match
        </button>
      </div>

      <div className="multiplayer-layout">
        {/* Player 1 Card */}
        <div className={`player-card ${battleMode === 'turn-based' && activeTurn === 1 ? 'active-turn' : ''}`}>
          {p1SabotagedInk && (
            <div className="ink-splatter-overlay">
              <AlertTriangle className="w-12 h-12 text-amber-400 animate-pulse" />
              <span className="text-lg font-extrabold text-red-400">INK BLINDNESS ATTACK!</span>
            </div>
          )}

          <div className="player-header">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-500/50 flex items-center justify-center font-black text-xs text-purple-300">
                P1
              </div>
              <span className="font-extrabold text-sm text-purple-400">PLAYER 1</span>
            </div>

            <span className={`text-xs px-2.5 py-1 rounded-lg font-extrabold uppercase ${
              p1Status === 'won'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : p1Status === 'lost'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : activeTurn === 1 || battleMode === 'simultaneous'
                ? 'bg-purple-600 text-white shadow-md animate-pulse'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {p1Status === 'won' ? '🎉 WINNER' : p1Status === 'lost' ? '❌ OUT' : activeTurn === 1 || battleMode === 'simultaneous' ? '👉 YOUR TURN' : 'WAITING'}
            </span>
          </div>

          <GameBoard
            guesses={p1Guesses}
            currentGuess={p1Current}
            maxGuesses={maxGuesses}
            wordLength={wordLength}
            evaluations={p1Eval}
            isShaking={p1Shaking}
            targetWord={targetWord}
            revealedPositions={p1Reveals}
          />

          <PowerUps
            isMultiplayer={true}
            sabotagesLeft={p1PowerUpsLeft}
            revealsLeft={0}
            vaporizesLeft={0}
            hintsLeft={0}
            onSabotageInk={() => handleSabotageInk(1)}
            onSabotageScramble={() => handleSabotageScramble(1)}
          />

          <Keyboard
            onKeyPress={(k) => handleKeyPressForPlayer(1, k)}
            keyStatuses={p1KeyStatuses}
            disabledKeys={p1Vaporized}
            isScrambled={p1SabotagedScramble}
            isActive={battleMode === 'simultaneous' || activeTurn === 1}
            playerLabel="PLAYER 2"
          />
        </div>

        {/* Player 2 Card */}
        <div className={`player-card ${battleMode === 'turn-based' && activeTurn === 2 ? 'active-turn' : ''}`}>
          {p2SabotagedInk && (
            <div className="ink-splatter-overlay">
              <AlertTriangle className="w-12 h-12 text-amber-400 animate-pulse" />
              <span className="text-lg font-extrabold text-red-400">INK BLINDNESS ATTACK!</span>
            </div>
          )}

          <div className="player-header">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-900/60 border border-pink-500/50 flex items-center justify-center font-black text-xs text-pink-300">
                P2
              </div>
              <span className="font-extrabold text-sm text-pink-400">PLAYER 2</span>
            </div>

            <span className={`text-xs px-2.5 py-1 rounded-lg font-extrabold uppercase ${
              p2Status === 'won'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : p2Status === 'lost'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : activeTurn === 2 || battleMode === 'simultaneous'
                ? 'bg-pink-600 text-white shadow-md animate-pulse'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {p2Status === 'won' ? '🎉 WINNER' : p2Status === 'lost' ? '❌ OUT' : activeTurn === 2 || battleMode === 'simultaneous' ? '👉 YOUR TURN' : 'WAITING'}
            </span>
          </div>

          <GameBoard
            guesses={p2Guesses}
            currentGuess={p2Current}
            maxGuesses={maxGuesses}
            wordLength={wordLength}
            evaluations={p2Eval}
            isShaking={p2Shaking}
            targetWord={targetWord}
            revealedPositions={p2Reveals}
          />

          <PowerUps
            isMultiplayer={true}
            sabotagesLeft={p2PowerUpsLeft}
            revealsLeft={0}
            vaporizesLeft={0}
            hintsLeft={0}
            onSabotageInk={() => handleSabotageInk(2)}
            onSabotageScramble={() => handleSabotageScramble(2)}
          />

          <Keyboard
            onKeyPress={(k) => handleKeyPressForPlayer(2, k)}
            keyStatuses={p2KeyStatuses}
            disabledKeys={p2Vaporized}
            isScrambled={p2SabotagedScramble}
            isActive={battleMode === 'simultaneous' || activeTurn === 2}
            playerLabel="PLAYER 1"
          />
        </div>
      </div>
    </div>
  );
};
