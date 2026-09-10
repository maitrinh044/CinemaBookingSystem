import React from 'react';

export interface BarcodeViewProps {
  code: string;
}

export const BarcodeView: React.FC<BarcodeViewProps> = ({ code }) => {
  // Deterministic bar widths pattern
  const barPattern = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 4,
    1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-1 select-none">
      <div className="flex items-center justify-center h-10 gap-[2px] overflow-hidden">
        {barPattern.map((width, idx) => (
          <div
            key={idx}
            style={{ width: `${width}px` }}
            className={`h-full ${idx % 2 === 0 ? 'bg-[var(--text-main)]' : 'bg-transparent'}`}
          />
        ))}
      </div>
      <span className="font-mono text-xs font-black tracking-[0.25em] text-[var(--text-main)]">
        {code}
      </span>
    </div>
  );
};
