import React from 'react';

export const ScreenCurve: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 text-center select-none">
      {/* Ambient Screen Glow */}
      <div className="absolute top-0 inset-x-12 h-14 bg-gradient-to-b from-[var(--primary)]/20 via-[var(--primary)]/5 to-transparent blur-xl pointer-events-none" />

      {/* Curved Line SVG */}
      <svg
        viewBox="0 0 600 40"
        className="w-full h-8 text-[var(--primary)] stroke-current fill-none overflow-visible drop-shadow-[0_0_12px_rgba(217,45,32,0.4)]"
      >
        <path
          d="M 20,35 Q 300,5 580,35"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Screen Label */}
      <div className="mt-1 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-sub)]">
        <span>MÀN HÌNH CHIẾU</span>
      </div>
    </div>
  );
};
