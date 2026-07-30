import React, { useRef, useEffect } from 'react';

export default function Grid({
  board,
  chain,
  onStartChain,
  onExtendChain,
  onEndChain,
  isHammerActive,
  onSmashTile
}) {
  const containerRef = useRef(null);

  // Helper to map touch/mouse coordinates to cell index (0 to 34)
  const getCellIndexFromCoords = (clientX, clientY) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }

    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    const col = Math.floor((relX / rect.width) * 5);
    const row = Math.floor((relY / rect.height) * 7);

    const clampedCol = Math.max(0, Math.min(4, col));
    const clampedRow = Math.max(0, Math.min(6, row));

    return clampedRow * 5 + clampedCol;
  };

  const handlePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const idx = getCellIndexFromCoords(clientX, clientY);

    if (idx !== null && board[idx]) {
      if (isHammerActive) {
        onSmashTile(idx);
      } else {
        onStartChain(idx);
      }
    }
  };

  const handlePointerMove = (e) => {
    if (isHammerActive) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const idx = getCellIndexFromCoords(clientX, clientY);

    if (idx !== null) {
      onExtendChain(idx);
    }
  };

  const handlePointerUp = () => {
    if (!isHammerActive) {
      onEndChain();
    }
  };

  // Calculate SVG line coordinates from chain indices
  const getLineCoordinates = () => {
    if (!containerRef.current || chain.length === 0) return [];
    const points = [];

    chain.forEach((idx) => {
      const row = Math.floor(idx / 5);
      const col = idx % 5;

      // Percentage centers in 5x7 grid
      const xPercent = (col + 0.5) * 20; // 100% / 5 = 20%
      const yPercent = (row + 0.5) * (100 / 7); // 100% / 7 = 14.285%

      points.push(`${xPercent}%,${yPercent}%`);
    });

    return points;
  };

  // Calculate sum / merged value preview
  const getMergedPreview = () => {
    if (chain.length < 2) return null;
    let sum = 0;
    chain.forEach((idx) => {
      if (board[idx]) sum += board[idx].value;
    });

    // Round up to nearest power of 2
    let mergedVal = 2;
    while (mergedVal < sum) {
      mergedVal *= 2;
    }
    return mergedVal;
  };

  const mergedVal = getMergedPreview();

  return (
    <div className="grid-wrapper">
      {mergedVal && (
        <div className="chain-preview-banner">
          Merge to <strong>{mergedVal}</strong>! ({chain.length} connected)
        </div>
      )}

      <div
        className="board-container"
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {/* SVG Glow Connection Overlay */}
        {chain.length > 1 && (
          <svg className="svg-overlay">
            <polyline
              points={getLineCoordinates().join(' ')}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Board Cells & Tiles */}
        {board.map((cell, idx) => {
          const isSelected = chain.includes(idx);
          const chainOrder = chain.indexOf(idx);

          return (
            <div key={cell.id || idx} className="tile-cell">
              {cell && (
                <div
                  className={`tile-inner val-${cell.value} ${isSelected ? 'selected' : ''} ${cell.isNew ? 'pop-anim' : ''}`}
                >
                  {cell.value}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
