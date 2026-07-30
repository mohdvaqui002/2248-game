import React from 'react';
import { X, ArrowRight, Zap, Trophy } from 'lucide-react';

export default function HowToPlayModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">How to Play 2248</div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.92rem', lineHeight: '1.5' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', padding: '8px', borderRadius: '10px' }}>
              <ArrowRight size={20} />
            </div>
            <div>
              <strong>Connect Adjacent Numbers:</strong> Drag across tiles horizontally, vertically, or diagonally.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899', padding: '8px', borderRadius: '10px' }}>
              <Zap size={20} />
            </div>
            <div>
              <strong>Chaining Rules:</strong> Start by connecting 2 or more identical numbers (e.g. 2 → 2). Then continue with the same number OR double it (2 → 2 → 4 → 8 → 16)!
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#eab308', padding: '8px', borderRadius: '10px' }}>
              <Trophy size={20} />
            </div>
            <div>
              <strong>Merge & Multiply:</strong> Release to merge all connected tiles into the end tile and score big points!
            </div>
          </div>
        </div>

        <button className="primary-btn" onClick={onClose}>Got It! Let's Play</button>
      </div>
    </div>
  );
}
