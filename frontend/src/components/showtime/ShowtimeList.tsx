import React from 'react';
import { Building2, MapPin, Clock, Armchair, Sparkles } from 'lucide-react';
import type { CinemaBranch, ShowtimeSlot } from '../../types/movie';
import type { CinemaShowtimeGroup } from '../../data/mockData';

export interface ShowtimeListProps {
  cinemaGroups: CinemaShowtimeGroup[];
  selectedShowtimeId?: string;
  onSelectShowtime: (slot: ShowtimeSlot, cinema: CinemaBranch) => void;
}

export const ShowtimeList: React.FC<ShowtimeListProps> = ({
  cinemaGroups,
  selectedShowtimeId,
  onSelectShowtime,
}) => {
  if (cinemaGroups.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-[var(--border-color)] text-center space-y-3">
        <Clock className="w-12 h-12 text-[var(--text-sub)] mx-auto opacity-40" />
        <h3 className="text-base font-bold text-[var(--text-main)]">Chưa có lịch chiếu</h3>
        <p className="text-xs text-[var(--text-sub)] max-w-sm mx-auto">
          Hiện tại chưa có suất chiếu cho ngày đã chọn. Vui lòng chọn một ngày chiếu khác.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cinemaGroups.map((group) => (
        <div
          key={group.cinema.id}
          className="glass-panel rounded-2xl border border-[var(--border-color)] overflow-hidden transition-all duration-200 hover:border-slate-600 shadow-sm"
        >
          {/* Cinema Header */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[var(--border-color)] bg-[var(--surface-hover)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                  {group.cinema.name}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-[var(--text-sub)] mt-0.5">
                  <MapPin className="w-3 h-3 text-[var(--primary)] shrink-0" />
                  <span className="line-clamp-1">{group.cinema.address}</span>
                </div>
              </div>
            </div>

            {/* Formats Supported */}
            <div className="flex flex-wrap items-center gap-1">
              {group.cinema.formats.map((fmt) => (
                <span
                  key={fmt}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--text-sub)] border border-[var(--border-color)]"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Format Groups & Time Slots */}
          <div className="p-3.5 sm:p-4 space-y-3.5">
            {group.formatGroups.map((fg) => (
              <div key={fg.format} className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <h4 className="text-[11px] sm:text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                    {fg.format}
                  </h4>
                </div>

                {/* Compact Time Slots Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2">
                  {fg.slots.map((slot) => {
                    const isSelected = selectedShowtimeId === slot.id;
                    const isLowSeats = slot.availableSeats <= 10;

                    return (
                      <button
                        key={slot.id}
                        onClick={() => onSelectShowtime(slot, group.cinema)}
                        className={`group relative flex flex-col items-center justify-center py-2 px-2 rounded-xl border transition-all duration-150 cursor-pointer select-none text-center ${
                          isSelected
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-md shadow-red-600/30 scale-[1.02]'
                            : 'border-[var(--border-color)] bg-[var(--surface-hover)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/60 text-[var(--text-main)]'
                        }`}
                      >
                        {/* Time */}
                        <div className="text-sm sm:text-base font-black tracking-tight leading-tight">
                          {slot.time}
                        </div>

                        {/* Price */}
                        <div className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-white/90' : 'text-[var(--text-sub)]'}`}>
                          {slot.price.toLocaleString('vi-VN')} đ
                        </div>

                        {/* Available Seats */}
                        <div className="flex items-center gap-0.5 mt-1 text-[9px]">
                          <Armchair className="w-2.5 h-2.5" />
                          <span className={isLowSeats && !isSelected ? 'text-rose-500 font-bold' : ''}>
                            {slot.availableSeats} ghế
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
