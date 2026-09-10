import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3 px-4 rounded-xl glass-panel border border-[var(--border-color)] text-xs text-[var(--text-sub)] select-none">
      {/* Standard */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded border border-[var(--border-color)] bg-[var(--surface-hover)] shrink-0" />
        <span>Ghế Thường</span>
      </div>

      {/* VIP */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded border border-[var(--gold)]/60 bg-[var(--gold)]/20 text-[var(--gold)] shrink-0" />
        <span className="font-semibold text-[var(--gold)]">Ghế VIP</span>
      </div>

      {/* Couple / Sweetbox */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-5 rounded border border-rose-500/50 bg-rose-500/20 text-rose-500 shrink-0" />
        <span className="font-semibold text-rose-500">Ghế Đôi (Sweetbox)</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded border border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm shadow-red-600/50 shrink-0" />
        <span className="font-bold text-[var(--text-main)]">Đang Chọn</span>
      </div>

      {/* Sold */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded border border-dashed border-slate-700/40 bg-slate-700/20 opacity-40 shrink-0" />
        <span>Đã Bán</span>
      </div>
    </div>
  );
};
