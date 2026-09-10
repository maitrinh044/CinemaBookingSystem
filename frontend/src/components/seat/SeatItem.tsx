import React from 'react';
import type { Seat } from '../../types/booking';

export interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  onToggle: (seat: Seat) => void;
}

export const SeatItem: React.FC<SeatItemProps> = ({ seat, isSelected, onToggle }) => {
  const isSold = seat.status === 'sold';
  const isCouple = seat.type === 'couple';
  const isVip = seat.type === 'vip';

  // Format label: row + number (e.g. A01 or 01)
  const label = isCouple 
    ? `${seat.row}${seat.col}-${seat.col + 1}`
    : seat.col.toString().padStart(2, '0');

  const handleClick = () => {
    if (!isSold) {
      onToggle(seat);
    }
  };

  // Base styling per state
  let styleClasses = '';
  if (isSold) {
    styleClasses = 'bg-slate-700/20 text-slate-500/50 border-dashed border-slate-700/40 cursor-not-allowed select-none';
  } else if (isSelected) {
    styleClasses = 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-red-600/40 scale-105 font-black z-10';
  } else if (isCouple) {
    styleClasses = 'bg-rose-500/10 text-rose-500 border-rose-500/40 hover:bg-rose-500/20 hover:border-rose-500 font-bold';
  } else if (isVip) {
    styleClasses = 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/50 hover:bg-[var(--gold)]/20 hover:border-[var(--gold)] font-bold';
  } else {
    styleClasses = 'bg-[var(--surface-hover)] text-[var(--text-sub)] border-[var(--border-color)] hover:border-slate-400 hover:text-[var(--text-main)] font-semibold';
  }

  return (
    <button
      type="button"
      disabled={isSold}
      onClick={handleClick}
      title={
        isSold
          ? `Ghế ${seat.id} - Đã bán`
          : `Ghế ${seat.id} (${seat.type.toUpperCase()}) - ${seat.price.toLocaleString('vi-VN')} đ`
      }
      className={`relative flex items-center justify-center rounded-md sm:rounded-lg border text-[9px] sm:text-[10px] lg:text-[11px] transition-all duration-150 cursor-pointer touch-manipulation ${
        isCouple ? 'w-11 sm:w-14 lg:w-16 h-6 sm:h-7 lg:h-8' : 'w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8'
      } ${styleClasses}`}
    >
      <span>{label}</span>
    </button>
  );
};
