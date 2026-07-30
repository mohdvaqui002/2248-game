import React from 'react';
import { RotateCcw, Shuffle, Flame } from 'lucide-react';

export default function PowerUps({
  undoCount,
  shuffleCount,
  hammerCount,
  onUndo,
  onShuffle,
  onActivateHammer,
  isHammerActive,
  canUndo
}) {
  return (
    <div className="powerups-bar">
      <button
        className="powerup-btn"
        onClick={onUndo}
        disabled={!canUndo || undoCount <= 0}
        title="Undo Last Move"
      >
        <div className="powerup-badge">{undoCount}</div>
        <RotateCcw size={20} color="#a855f7" />
        <span className="powerup-name">Undo</span>
      </button>

      <button
        className="powerup-btn"
        onClick={onShuffle}
        disabled={shuffleCount <= 0}
        title="Shuffle Board"
      >
        <div className="powerup-badge">{shuffleCount}</div>
        <Shuffle size={20} color="#3b82f6" />
        <span className="powerup-name">Shuffle</span>
      </button>

      <button
        className={`powerup-btn ${isHammerActive ? 'active' : ''}`}
        onClick={onActivateHammer}
        disabled={hammerCount <= 0}
        style={{ borderColor: isHammerActive ? '#ef4444' : undefined }}
        title="Smash a Tile"
      >
        <div className="powerup-badge">{hammerCount}</div>
        <Flame size={20} color="#ef4444" />
        <span className="powerup-name">{isHammerActive ? 'Tap Tile' : 'Smash'}</span>
      </button>
    </div>
  );
}
