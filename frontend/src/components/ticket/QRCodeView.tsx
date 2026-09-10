import React from 'react';

export interface QRCodeViewProps {
  value: string;
  size?: number;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({ value, size = 150 }) => {
  // Generate deterministic binary QR pattern from value string
  const gridSize = 21; // standard version 1 QR matrix 21x21
  const hash = value.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);

  // Position detection patterns (corner 7x7 squares)
  const isCornerFinder = (r: number, c: number) => {
    // Top-left
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-right
    if (r < 7 && c >= gridSize - 7) {
      const c2 = c - (gridSize - 7);
      if (r === 0 || r === 6 || c2 === 0 || c2 === 6) return true;
      if (r >= 2 && r <= 4 && c2 >= 2 && c2 <= 4) return true;
      return false;
    }
    // Bottom-left
    if (r >= gridSize - 7 && c < 7) {
      const r2 = r - (gridSize - 7);
      if (r2 === 0 || r2 === 6 || c === 0 || c === 6) return true;
      if (r2 >= 2 && r2 <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    return null;
  };

  const cells: boolean[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const corner = isCornerFinder(r, c);
      if (corner !== null) {
        cells.push(corner);
      } else if (r === 6 || c === 6) {
        // Timing pattern
        cells.push((r + c) % 2 === 0);
      } else {
        // Deterministic pseudorandom pseudo-data bits
        const bit = ((hash * (r + 1) * 31 + (c + 1) * 17) % 7) < 3;
        cells.push(bit);
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div 
      className="p-2.5 bg-white rounded-xl shadow-inner inline-flex items-center justify-center border border-slate-200"
      title={`QR Code: ${value}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shape-rendering-crispEdges select-none"
      >
        {cells.map((isFilled, idx) => {
          if (!isFilled) return null;
          const r = Math.floor(idx / gridSize);
          const c = idx % gridSize;
          return (
            <rect
              key={idx}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.1}
              height={cellSize + 0.1}
              fill="#18181B"
            />
          );
        })}
        {/* Center CineGlow brand dot */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.08}
          fill="#D92D20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.03}
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
