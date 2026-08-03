import React, { useState, useEffect } from 'react';
import { P2PManager } from '../utils/p2p';
import { GameBoard } from './GameBoard';
import { Keyboard } from './Keyboard';
import { PowerUps } from './PowerUps';
import { getRandomTargetWord, isValidWord } from '../utils/words';
import { playKeypressSound, playFlipSound, playCorrectSound, playInvalidSound, playSabotageSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Radio, Copy, Check, AlertCircle, ShieldAlert, ExternalLink, RefreshCw } from 'lucide-react';

export const RemoteMultiplayer = ({ wordLength = 5, maxGuesses = 6, allowInvalidWords = false }) => {
  const [p2p] = useState(() => new P2PManager());
  const [connectionState, setConnectionState] = useState('idle');
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [targetWord, setTargetWord] = useState('');
  const [activeWordLength, setActiveWordLength] = useState(wordLength);

  // Local Player State
  const [myGuesses, setMyGuesses] = useState([]);
  const [myCurrent, setMyCurrent] = useState('');
  const [myEval, setMyEval] = useState([]);
  const [myStatus, setMyStatus] = useState('playing');
  const [myKeyStatuses, setMyKeyStatuses] = useState({});
  const [myShaking, setMyShaking] = useState(false);
  const [mySabotagedInk, setMySabotagedInk] = useState(false);
  const [mySabotagedScramble, setMySabotagedScramble] = useState(false);
  const [sabotagesLeft, setSabotagesLeft] = useState(2);

  // Opponent State
  const [oppGuesses, setOppGuesses] = useState([]);
  const [oppEval, setOppEval] = useState([]);
  const [oppStatus, setOppStatus] = useState('playing');
  const [oppEmote, setOppEmote] = useState(null);

  const [matchWinner, setMatchWinner] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      const cleanRoom = roomParam.trim().toUpperCase();
      setInputRoomId(cleanRoom);
      handleJoinRoom(cleanRoom);
    }
  }, []);

  const handleMessage = (data) => {
    if (!data) return;

    if (data.type === 'GUEST_JOIN' && p2p.isHost) {
      setConnectionState('connected');
      setTargetWord((currentWord) => {
        const wordToUse = currentWord || getRandomTargetWord(wordLength);
        const lenToUse = data.wordLength || wordToUse.length;
        setActiveWordLength(lenToUse);
        p2p.send({ type: 'START_GAME', word: wordToUse, wordLength: lenToUse });
        return wordToUse;
      });
    } else if (data.type === 'START_GAME') {
      setTargetWord(data.word);
      const matchedLength = data.wordLength || (data.word ? data.word.length : wordLength);
      setActiveWordLength(matchedLength);
      setConnectionState('connected');
      resetLocalState();
    } else if (data.type === 'BOARD_UPDATE') {
      setOppGuesses(data.guesses || []);
      setOppEval(data.evaluations || []);
      setOppStatus(data.status || 'playing');
      if (data.status === 'won') {
        setMatchWinner('Opponent');
      }
    } else if (data.type === 'SABOTAGE_INK') {
      playSabotageSound();
      setMySabotagedInk(true);
      setTimeout(() => setMySabotagedInk(false), 5000);
    } else if (data.type === 'SABOTAGE_SCRAMBLE') {
      playSabotageSound();
      setMySabotagedScramble(true);
    } else if (data.type === 'EMOTE') {
      setOppEmote(data.emote);
      setTimeout(() => setOppEmote(null), 3000);
    }
  };

  const resetLocalState = () => {
    setMyGuesses([]);
    setMyCurrent('');
    setMyEval([]);
    setMyStatus('playing');
    setMyKeyStatuses({});
    setMySabotagedInk(false);
    setMySabotagedScramble(false);
    setSabotagesLeft(2);
    setOppGuesses([]);
    setOppEval([]);
    setOppStatus('playing');
    setMatchWinner(null);
  };

  const handleCreateRoom = () => {
    setConnectionState('creating');
    setErrorMsg('');

    p2p.createRoom(
      (id) => {
        setRoomId(id);
        setConnectionState('waiting');
      },
      () => {
        setConnectionState('connected');
        const newWord = getRandomTargetWord(wordLength);
        setTargetWord(newWord);
        setActiveWordLength(newWord.length);
        p2p.send({ type: 'START_GAME', word: newWord, wordLength: newWord.length });
      },
      handleMessage,
      (err) => {
        setConnectionState('error');
        setErrorMsg(err?.message || 'Connection error. Please try again.');
      }
    );
  };

  const handleJoinRoom = (targetId = inputRoomId) => {
    const cleanId = (targetId || '').trim().toUpperCase();
    if (!cleanId) {
      setErrorMsg('Please enter a valid room code.');
      return;
    }
    setConnectionState('joining');
    setErrorMsg('');

    p2p.joinRoom(
      cleanId,
      () => {
        setConnectionState('connected');
      },
      handleMessage,
      (err) => {
        setConnectionState('error');
        setErrorMsg(err?.message || 'Could not connect to room code. Ensure host room is active.');
      }
    );
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openSecondPlayerTab = () => {
    const link = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    window.open(link, '_blank');
  };

  const evaluateGuess = (guess, target) => {
    const len = target ? target.length : activeWordLength;
    const res = Array(len).fill('absent');
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
    if (myStatus !== 'playing' || connectionState !== 'connected') return;

    if (key === 'ENTER') {
      if (myCurrent.length !== activeWordLength || !isValidWord(myCurrent, activeWordLength, allowInvalidWords)) {
        setMyShaking(true);
        playInvalidSound();
        setMyCurrent('');
        setTimeout(() => setMyShaking(false), 500);
        return;
      }

      const evaluation = evaluateGuess(myCurrent, targetWord);
      playFlipSound();

      const newGuesses = [...myGuesses, myCurrent];
      const newEvals = [...myEval, evaluation];

      setMyGuesses(newGuesses);
      setMyEval(newEvals);
      setMyCurrent('');
      setMySabotagedScramble(false);

      setMyKeyStatuses((prev) => {
        const updated = { ...prev };
        myCurrent.split('').forEach((char, i) => {
          const status = evaluation[i];
          if (status === 'correct') updated[char] = 'correct';
          else if (status === 'present' && updated[char] !== 'correct') updated[char] = 'present';
          else if (!updated[char]) updated[char] = 'absent';
        });
        return updated;
      });

      let status = 'playing';
      if (myCurrent === targetWord) {
        status = 'won';
        setMyStatus('won');
        setMatchWinner('You');
        playCorrectSound();
        confetti({ particleCount: 150, spread: 80 });
      } else if (newGuesses.length >= maxGuesses) {
        status = 'lost';
        setMyStatus('lost');
      }

      p2p.send({
        type: 'BOARD_UPDATE',
        guesses: newGuesses,
        evaluations: newEvals,
        status
      });
    } else if (key === 'BACKSPACE') {
      playKeypressSound();
      setMyCurrent((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && myCurrent.length < activeWordLength) {
      playKeypressSound();
      setMyCurrent((prev) => prev + key);
    }
  };

  const handleSabotageInk = () => {
    if (sabotagesLeft <= 0) return;
    setSabotagesLeft((prev) => prev - 1);
    p2p.send({ type: 'SABOTAGE_INK' });
  };

  const handleSabotageScramble = () => {
    if (sabotagesLeft <= 0) return;
    setSabotagesLeft((prev) => prev - 1);
    p2p.send({ type: 'SABOTAGE_SCRAMBLE' });
  };

  const sendEmote = (emote) => {
    p2p.send({ type: 'EMOTE', emote });
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {connectionState !== 'connected' && (
        <div className="flex flex-col items-center gap-6 p-8 bg-slate-800/90 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl text-center">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-2xl">
            <Radio className="w-7 h-7 text-emerald-400 animate-pulse" /> REMOTE P2P LOBBY
          </div>
          <p className="text-slate-300 text-sm">
            Play real-time Wordle battle side-by-side with a remote friend. Zero server lag!
          </p>

          {connectionState === 'idle' && (
            <div className="flex flex-col gap-4 w-full">
              <button onClick={handleCreateRoom} className="btn-primary py-3 text-lg font-bold">
                Create Battle Room
              </button>

              <div className="flex items-center gap-2 my-1">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span className="text-xs text-slate-500 uppercase font-bold">Or Join Room</span>
                <div className="h-px bg-slate-700 flex-1"></div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-char Room Code"
                  value={inputRoomId}
                  onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono uppercase text-center font-bold"
                />
                <button
                  onClick={() => handleJoinRoom()}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  Join
                </button>
              </div>
            </div>
          )}

          {connectionState === 'waiting' && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="text-slate-300 text-sm font-semibold">Share this Room Code with your opponent:</div>
              <div className="text-3xl font-extrabold font-mono text-purple-400 bg-slate-900 px-6 py-3 rounded-xl border border-purple-500/40">
                {roomId}
              </div>
              <div className="flex gap-2 w-full justify-center">
                <button
                  onClick={copyRoomLink}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold text-white cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Link!' : 'Copy Battle Link'}
                </button>
                <button
                  onClick={openSecondPlayerTab}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-bold text-white cursor-pointer"
                  title="Open a 2nd browser tab to test local peer connection"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Test in 2nd Tab</span>
                </button>
              </div>
              <div className="text-xs text-amber-400 animate-pulse mt-2 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Waiting for opponent to connect...</span>
              </div>
            </div>
          )}

          {(connectionState === 'creating' || connectionState === 'joining') && (
            <div className="text-purple-400 font-bold animate-pulse flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Establishing peer-to-peer WebRTC signal...</span>
            </div>
          )}

          {connectionState === 'error' && (
            <div className="flex flex-col items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-6 h-6" />
              <span>{errorMsg}</span>
              <button
                onClick={() => {
                  p2p.disconnect();
                  setConnectionState('idle');
                }}
                className="mt-2 text-xs underline text-slate-400 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {connectionState === 'connected' && (
        <div className="flex flex-col items-center w-full gap-4">
          <div className="flex items-center justify-between w-full max-w-4xl px-4 py-2 bg-slate-800/90 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Radio className="w-4 h-4 animate-pulse" /> LIVE P2P MATCH CONNECTED
            </div>
            {matchWinner && (
              <div className="text-emerald-400 font-extrabold animate-bounce">
                🏆 MATCH RESULT: {matchWinner} Won!
              </div>
            )}
            <div className="flex gap-2">
              {['🔥', '💩', '🤡', '🚀', '👑'].map((e) => (
                <button
                  key={e}
                  onClick={() => sendEmote(e)}
                  className="hover:scale-125 transition-transform text-lg"
                  title="Send Emote"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="multiplayer-layout">
            <div className="player-card active-turn">
              {mySabotagedInk && (
                <div className="ink-splatter-overlay">
                  <ShieldAlert className="w-12 h-12 text-amber-400 animate-pulse" />
                  <span className="text-xl font-extrabold text-red-400">BLIND INK ATTACK!</span>
                </div>
              )}

              <div className="player-header">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-500/50 flex items-center justify-center font-black text-xs text-purple-300">
                    YOU
                  </div>
                  <span className="font-extrabold text-purple-400 text-sm">YOU</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold">
                  {myStatus === 'won' ? '🎉 WON' : myStatus === 'lost' ? '❌ LOST' : 'GUESSING'}
                </span>
              </div>

              <GameBoard
                guesses={myGuesses}
                currentGuess={myCurrent}
                maxGuesses={maxGuesses}
                wordLength={activeWordLength}
                evaluations={myEval}
                isShaking={myShaking}
                targetWord={targetWord}
              />

              <PowerUps
                isMultiplayer={true}
                sabotagesLeft={sabotagesLeft}
                revealsLeft={0}
                vaporizesLeft={0}
                hintsLeft={0}
                onSabotageInk={handleSabotageInk}
                onSabotageScramble={handleSabotageScramble}
              />

              <Keyboard
                onKeyPress={handleKeyPress}
                keyStatuses={myKeyStatuses}
                isScrambled={mySabotagedScramble}
                isActive={true}
              />
            </div>

            <div className="player-card">
              {oppEmote && (
                <div className="absolute top-4 right-4 text-4xl animate-bounce z-30">{oppEmote}</div>
              )}

              <div className="player-header">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-900/60 border border-pink-500/50 flex items-center justify-center font-black text-xs text-pink-300">
                    OPP
                  </div>
                  <span className="font-extrabold text-pink-400 text-sm">OPPONENT</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold">
                  {oppStatus === 'won' ? '🎉 WON' : oppStatus === 'lost' ? '❌ LOST' : 'GUESSING'}
                </span>
              </div>

              <GameBoard
                guesses={oppGuesses}
                currentGuess=""
                maxGuesses={maxGuesses}
                wordLength={activeWordLength}
                evaluations={oppEval}
                targetWord={targetWord}
              />

              <div className="mt-auto py-4 text-slate-400 text-sm font-semibold flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400 animate-spin" /> Watching live opponent telemetry...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
