import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header.jsx';
import PowerUps from './components/PowerUps.jsx';
import Grid from './components/Grid.jsx';
import HowToPlayModal from './components/HowToPlayModal.jsx';
import StatsModal from './components/StatsModal.jsx';
import { sound } from './audio/sound.js';

const ROWS = 7;
const COLS = 5;

const getRandomInitialValue = () => {
  const rand = Math.random();
  if (rand < 0.3) return 2;
  if (rand < 0.6) return 4;
  if (rand < 0.8) return 8;
  if (rand < 0.9) return 16;
  if (rand < 0.95) return 32;
  return 64;
};

const createInitialBoard = () => {
  const board = [];
  for (let i = 0; i < ROWS * COLS; i++) {
    board.push({
      id: Math.random().toString(36).substr(2, 9),
      value: getRandomInitialValue(),
      isNew: true
    });
  }
  return board;
};

export default function App() {
  const [board, setBoard] = useState(() => createInitialBoard());
  const [chain, setChain] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('2248_highscore') || '0', 10);
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Power-ups state
  const [undoCount, setUndoCount] = useState(3);
  const [shuffleCount, setShuffleCount] = useState(2);
  const [hammerCount, setHammerCount] = useState(2);
  const [isHammerActive, setIsHammerActive] = useState(false);
  const [history, setHistory] = useState([]);

  // Stats tracking
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('2248_stats');
    return saved
      ? JSON.parse(saved)
      : { highestTile: 2, longestChain: 0, totalMerges: 0, gamesPlayed: 1 };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('2248_highscore', highScore.toString());
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem('2248_stats', JSON.stringify(stats));
  }, [stats]);

  // Check if any valid moves remain
  const checkGameOver = (currentBoard) => {
    for (let i = 0; i < currentBoard.length; i++) {
      const r1 = Math.floor(i / COLS);
      const c1 = i % COLS;
      const val1 = currentBoard[i].value;

      for (let j = 0; j < currentBoard.length; j++) {
        if (i === j) continue;
        const r2 = Math.floor(j / COLS);
        const c2 = j % COLS;

        if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
          if (currentBoard[j].value === val1) {
            return false; // Valid move exists!
          }
        }
      }
    }
    return true;
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('amoled');
    else setTheme('dark');
  };

  const toggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  };

  // Start drag chain
  const handleStartChain = (idx) => {
    setChain([idx]);
    sound.playSelect(1);
  };

  // Extend drag chain with 2248 validation rules
  const handleExtendChain = (idx) => {
    if (chain.length === 0) return;
    const lastIdx = chain[chain.length - 1];

    // Backtracking: user moves cursor back to previous cell in chain
    if (chain.length > 1 && chain[chain.length - 2] === idx) {
      setChain(chain.slice(0, chain.length - 1));
      sound.playSelect(chain.length - 1);
      return;
    }

    if (chain.includes(idx)) return; // Already in chain

    // Adjacency check
    const r1 = Math.floor(lastIdx / COLS);
    const c1 = lastIdx % COLS;
    const r2 = Math.floor(idx / COLS);
    const c2 = idx % COLS;

    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;

    // Check tile values
    const lastVal = board[lastIdx].value;
    const nextVal = board[idx].value;

    if (chain.length === 1) {
      if (nextVal === lastVal) {
        setChain([...chain, idx]);
        sound.playSelect(2);
      }
    } else {
      // Find max value in current chain
      const currentMaxInChain = Math.max(...chain.map((i) => board[i].value));

      if ((nextVal === lastVal || nextVal === lastVal * 2) && nextVal >= currentMaxInChain) {
        setChain([...chain, idx]);
        sound.playSelect(chain.length + 1);
      }
    }
  };

  // Release chain & process merge + gravity
  const handleEndChain = () => {
    if (chain.length < 2) {
      setChain([]);
      return;
    }

    // Save history for Undo
    setHistory((prev) => [...prev, { board, score }]);

    // Calculate merged value: next power of 2 above the highest tile in the chain
    const maxValInChain = Math.max(...chain.map((idx) => board[idx].value));
    const mergedVal = maxValInChain * 2;

    // Points calculation with multiplier
    const pointsGained = mergedVal * chain.length;
    const newScore = score + pointsGained;
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);

    sound.playMerge(mergedVal);

    if (mergedVal >= 1024) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }

    // Update Stats
    setStats((prev) => ({
      ...prev,
      highestTile: Math.max(prev.highestTile, mergedVal),
      longestChain: Math.max(prev.longestChain, chain.length),
      totalMerges: prev.totalMerges + 1
    }));

    // Perform gravity drop
    const newBoard = [...board];
    const targetIdx = chain[chain.length - 1];

    // Mark chain cells as null except target
    chain.forEach((idx) => {
      newBoard[idx] = null;
    });
    newBoard[targetIdx] = {
      id: Math.random().toString(36).substr(2, 9),
      value: mergedVal,
      isNew: true
    };

    // Gravity drop per column
    for (let c = 0; c < COLS; c++) {
      const colTiles = [];
      for (let r = ROWS - 1; r >= 0; r--) {
        const index = r * COLS + c;
        if (newBoard[index] !== null) {
          colTiles.push(newBoard[index]);
        }
      }

      // Fill missing top spots with fresh random tiles
      while (colTiles.length < ROWS) {
        colTiles.push({
          id: Math.random().toString(36).substr(2, 9),
          value: getRandomInitialValue(),
          isNew: true
        });
      }

      // Put tiles back bottom-to-top
      for (let r = ROWS - 1; r >= 0; r--) {
        const index = r * COLS + c;
        newBoard[index] = colTiles[ROWS - 1 - r];
      }
    }

    setBoard(newBoard);
    setChain([]);

    if (checkGameOver(newBoard)) {
      setIsGameOver(true);
    }
  };

  // Power-up implementations
  const handleUndo = () => {
    if (history.length === 0 || undoCount <= 0) return;
    const lastState = history[history.length - 1];
    setBoard(lastState.board);
    setScore(lastState.score);
    setHistory((prev) => prev.slice(0, -1));
    setUndoCount((prev) => prev - 1);
    sound.playPowerup();
  };

  const handleShuffle = () => {
    if (shuffleCount <= 0) return;
    const shuffled = [...board].sort(() => Math.random() - 0.5);
    setBoard(shuffled);
    setShuffleCount((prev) => prev - 1);
    sound.playPowerup();
  };

  const handleActivateHammer = () => {
    if (hammerCount <= 0) return;
    setIsHammerActive(!isHammerActive);
  };

  const handleSmashTile = (idx) => {
    const newBoard = [...board];
    newBoard[idx] = {
      id: Math.random().toString(36).substr(2, 9),
      value: getRandomInitialValue(),
      isNew: true
    };
    setBoard(newBoard);
    setHammerCount((prev) => prev - 1);
    setIsHammerActive(false);
    sound.playPowerup();
  };

  const handleRestart = () => {
    setBoard(createInitialBoard());
    setScore(0);
    setChain([]);
    setIsGameOver(false);
    setStats((prev) => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }));
  };

  return (
    <div className="app-wrapper">
      <Header
        score={score}
        highScore={highScore}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        theme={theme}
        onCycleTheme={cycleTheme}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenStats={() => setShowStats(true)}
        onRestart={handleRestart}
      />

      <PowerUps
        undoCount={undoCount}
        shuffleCount={shuffleCount}
        hammerCount={hammerCount}
        onUndo={handleUndo}
        onShuffle={handleShuffle}
        onActivateHammer={handleActivateHammer}
        isHammerActive={isHammerActive}
        canUndo={history.length > 0}
      />

      <Grid
        board={board}
        chain={chain}
        onStartChain={handleStartChain}
        onExtendChain={handleExtendChain}
        onEndChain={handleEndChain}
        isHammerActive={isHammerActive}
        onSmashTile={handleSmashTile}
      />

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="game-over-overlay">
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NO MORE MOVES!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Final Score: {score.toLocaleString()}</p>
          <button className="primary-btn" onClick={handleRestart}>Play Again</button>
        </div>
      )}

      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
    </div>
  );
}
