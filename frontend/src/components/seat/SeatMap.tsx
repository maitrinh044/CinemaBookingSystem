import React, { useMemo } from 'react';
import type { Seat } from '../../types/booking';
import { SeatItem } from './SeatItem';
import { ScreenCurve } from './ScreenCurve';
import { SeatLegend } from './SeatLegend';

export interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  hallName?: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeats,
  onToggleSeat,
  hallName = 'Phòng Chiếu 01 (IMAX Laser)',
}) => {
  const selectedSeatIds = useMemo(
    () => new Set(selectedSeats.map((s) => s.id)),
    [selectedSeats]
  );

  // Group seats by row
  const rows = useMemo(() => {
    const rowMap = new Map<string, Seat[]>();
    seats.forEach((seat) => {
      if (!rowMap.has(seat.row)) {
        rowMap.set(seat.row, []);
      }
      rowMap.get(seat.row)!.push(seat);
    });

    // Ensure seats in each row are sorted by column
    rowMap.forEach((seatList) => {
      seatList.sort((a, b) => a.col - b.col);
    });

    return Array.from(rowMap.entries());
  }, [seats]);

  return (
    <div className="space-y-6">
      {/* Hall Info Header */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
          {hallName}
        </span>
      </div>

      {/* Screen Graphic */}
      <ScreenCurve />

      {/* Seat Grid Container with Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[var(--primary)]/30 scrollbar-track-transparent -mx-2 px-2">
        <div className="min-w-[380px] sm:min-w-[520px] max-w-3xl mx-auto space-y-1.5 sm:space-y-2.5 px-2 sm:px-4">
          {rows.map(([rowLetter, rowSeats]) => {
            const isCoupleRow = rowLetter === 'J';
            // If couple row, take only odd columns (1, 3, 5, 7, 9, 11) representing the 6 pairs
            const displaySeats = isCoupleRow
              ? rowSeats.filter((s) => s.col % 2 !== 0)
              : rowSeats;

            // Split into Left wing (col 1-6) and Right wing (col 7-12) with aisle in center
            const leftWing = displaySeats.filter((s) => (isCoupleRow ? s.col <= 5 : s.col <= 6));
            const rightWing = displaySeats.filter((s) => (isCoupleRow ? s.col > 5 : s.col > 6));

            return (
              <div key={rowLetter} className="flex items-center justify-between gap-3">
                {/* Left Row Indicator */}
                <span className="w-5 text-center text-xs font-black text-[var(--text-sub)] shrink-0">
                  {rowLetter}
                </span>

                {/* Seat Row Center with Aisle */}
                <div className="flex-1 flex items-center justify-center gap-6">
                  {/* Left Wing */}
                  <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5">
                    {leftWing.map((seat) => (
                      <SeatItem
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeatIds.has(seat.id)}
                        onToggle={onToggleSeat}
                      />
                    ))}
                  </div>

                  {/* Central Aisle Gap */}
                  <div className="w-3 sm:w-5 shrink-0 text-center select-none text-[10px] text-slate-500/30">
                    •
                  </div>

                  {/* Right Wing */}
                  <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-1.5">
                    {rightWing.map((seat) => (
                      <SeatItem
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeatIds.has(seat.id)}
                        onToggle={onToggleSeat}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Row Indicator */}
                <span className="w-5 text-center text-xs font-black text-[var(--text-sub)] shrink-0">
                  {rowLetter}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Legend */}
      <SeatLegend />
    </div>
  );
};
