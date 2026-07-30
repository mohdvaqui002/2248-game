import React from 'react';
import { X, Award, Flame, Zap, Hash } from 'lucide-react';

export default function StatsModal({ stats, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Game Statistics</div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="score-box">
            <Award size={20} color="#8b5cf6" style={{ margin: '0 auto 4px auto' }} />
            <div className="score-label">Max Tile Reached</div>
            <div className="score-value" style={{ color: '#8b5cf6' }}>{stats.highestTile || 2}</div>
          </div>

          <div className="score-box">
            <Flame size={20} color="#ec4899" style={{ margin: '0 auto 4px auto' }} />
            <div className="score-label">Longest Chain</div>
            <div className="score-value" style={{ color: '#ec4899' }}>{stats.longestChain || 0} tiles</div>
          </div>

          <div className="score-box">
            <Zap size={20} color="#eab308" style={{ margin: '0 auto 4px auto' }} />
            <div className="score-label">Total Merges</div>
            <div className="score-value" style={{ color: '#eab308' }}>{stats.totalMerges || 0}</div>
          </div>

          <div className="score-box">
            <Hash size={20} color="#3b82f6" style={{ margin: '0 auto 4px auto' }} />
            <div className="score-label">Games Played</div>
            <div className="score-value" style={{ color: '#3b82f6' }}>{stats.gamesPlayed || 1}</div>
          </div>
        </div>

        <button className="primary-btn" onClick={onClose}>Close Stats</button>
      </div>
    </div>
  );
}
