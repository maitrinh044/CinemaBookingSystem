import React, { useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUpcomingDates } from '../../data/mockData';

export interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const dates = getUpcomingDates();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-sub)]">
          <Calendar className="w-4 h-4 text-[var(--primary)]" />
          <span>Chọn Ngày Chiếu</span>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            aria-label="Previous dates"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            aria-label="Next dates"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Date Pills */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth"
      >
        {dates.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          return (
            <button
              key={d.dateStr}
              onClick={() => onSelectDate(d.dateStr)}
              className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[80px] py-2 px-2 rounded-xl border transition-all duration-150 cursor-pointer select-none shrink-0 ${
                isSelected
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-md shadow-red-600/30 scale-[1.02]'
                  : 'border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-main)] hover:border-slate-500'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-[var(--text-sub)]'}`}>
                {d.label}
              </span>
              <span className="text-sm sm:text-base font-black mt-0.5 tracking-tight">
                {d.subLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
