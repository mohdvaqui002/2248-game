import React from 'react';
import { Volume2, VolumeX, Moon, Sun, HelpCircle, BarChart2, RefreshCw } from 'lucide-react';

export default function Header({
  score,
  highScore,
  soundEnabled,
  onToggleSound,
  theme,
  onCycleTheme,
  onOpenHowToPlay,
  onOpenStats,
  onRestart
}) {
  return (
    <div className="header-card">
      <div className="top-bar">
        <div className="logo-container">
          <div className="logo-badge">DuploGrid</div>
          <div className="title-text">Match & Merge</div>
        </div>
        <div className="icon-actions">
          <button className="icon-btn" onClick={onToggleSound} title="Toggle Sound">
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="icon-btn" onClick={onCycleTheme} title="Change Theme">
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-btn" onClick={onOpenHowToPlay} title="How to Play">
            <HelpCircle size={18} />
          </button>
          <button className="icon-btn" onClick={onOpenStats} title="Statistics">
            <BarChart2 size={18} />
          </button>
          <button className="icon-btn" onClick={onRestart} title="New Game">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="scores-row">
        <div className="score-box">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score.toLocaleString()}</div>
        </div>
        <div className="score-box">
          <div className="score-label">BEST</div>
          <div className="score-value">{highScore.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
