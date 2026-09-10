import React, { useState, useMemo } from 'react';
import { Film, Building2, Calendar, Clock, Ticket, Check } from 'lucide-react';
import type { Movie, CinemaBranch, ShowtimeSlot } from '../../types/movie';
import { getUpcomingDates } from '../../data/mockData';
import { Button } from '../common/Button';

export interface QuickBookingProps {
  movies: Movie[];
  cinemas: CinemaBranch[];
  showtimes: ShowtimeSlot[];
  onConfirmBooking: (booking: {
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
  }) => void;
}

export const QuickBooking: React.FC<QuickBookingProps> = ({
  movies,
  cinemas,
  showtimes,
  onConfirmBooking,
}) => {
  const dates = useMemo(() => getUpcomingDates(), []);

  const [selectedMovieId, setSelectedMovieId] = useState<string>(movies[0]?.id || '');
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>(cinemas[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]?.dateStr || '');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>('');

  const selectedMovie = movies.find((m) => m.id === selectedMovieId);
  const selectedCinema = cinemas.find((c) => c.id === selectedCinemaId);

  // Filter available showtimes based on selected filters
  const availableShowtimes = useMemo(() => {
    return showtimes.filter(
      (st) =>
        st.movieId === selectedMovieId &&
        st.cinemaId === selectedCinemaId &&
        st.date === selectedDate
    );
  }, [showtimes, selectedMovieId, selectedCinemaId, selectedDate]);

  // Handle auto select first showtime if available, or reset if none
  const selectedShowtime = availableShowtimes.find((st) => st.id === selectedShowtimeId);

  const handleBooking = () => {
    if (selectedMovie && selectedCinema && selectedShowtime) {
      onConfirmBooking({
        movie: selectedMovie,
        cinema: selectedCinema,
        date: selectedDate,
        showtime: selectedShowtime,
      });
    }
  };

  return (
    <div className="relative -mt-8 sm:-mt-12 z-30 max-w-6xl mx-auto px-4 mb-10">
      <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-[var(--border-color)] shadow-2xl backdrop-blur-xl bg-[var(--surface)]/95">
        {/* Title Bar */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary)]">
            Đặt Vé Nhanh Trong 30 Giây
          </span>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-3">
          {/* Step 1: Select Movie */}
          <div className="space-y-1.5 text-left">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
              <Film className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>1. Chọn Phim</span>
            </label>
            <div className="relative">
              <select
                value={selectedMovieId}
                onChange={(e) => {
                  setSelectedMovieId(e.target.value);
                  setSelectedShowtimeId('');
                }}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 pr-8 truncate"
              >
                {movies.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[var(--surface)] text-[var(--text-main)]">
                    {m.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-sub)]">
                ▼
              </div>
            </div>
          </div>

          {/* Step 2: Select Cinema */}
          <div className="space-y-1.5 text-left">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>2. Chọn Rạp</span>
            </label>
            <div className="relative">
              <select
                value={selectedCinemaId}
                onChange={(e) => {
                  setSelectedCinemaId(e.target.value);
                  setSelectedShowtimeId('');
                }}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 pr-8 truncate"
              >
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[var(--surface)] text-[var(--text-main)]">
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-sub)]">
                ▼
              </div>
            </div>
          </div>

          {/* Step 3: Select Date */}
          <div className="space-y-1.5 text-left">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>3. Chọn Ngày</span>
            </label>
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedShowtimeId('');
                }}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 pr-8 truncate"
              >
                {dates.map((d) => (
                  <option key={d.dateStr} value={d.dateStr} className="bg-[var(--surface)] text-[var(--text-main)]">
                    {d.label} ({d.subLabel})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-sub)]">
                ▼
              </div>
            </div>
          </div>

          {/* Step 4: Select Showtime */}
          <div className="space-y-1.5 text-left">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>4. Suất Chiếu</span>
            </label>
            <div className="relative">
              <select
                value={selectedShowtimeId}
                onChange={(e) => setSelectedShowtimeId(e.target.value)}
                disabled={availableShowtimes.length === 0}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 pr-8 truncate disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {availableShowtimes.length === 0 ? (
                  <option value="">Chưa có suất chiếu</option>
                ) : (
                  <>
                    <option value="">-- Bấm chọn giờ chiếu --</option>
                    {availableShowtimes.map((st) => (
                      <option key={st.id} value={st.id} className="bg-[var(--surface)] text-[var(--text-main)]">
                        {st.time} - {st.format} ({st.price.toLocaleString('vi-VN')}đ)
                      </option>
                    ))}
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-sub)]">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Booking Confirm Bar */}
        <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[var(--text-sub)] flex items-center gap-2">
            {selectedShowtime ? (
              <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Đã chọn: <b>{selectedMovie?.title}</b> | {selectedShowtime.time} ({selectedShowtime.format}) | Rạp: {selectedCinema?.name}
              </span>
            ) : (
              <span>Vui lòng chọn suất chiếu để tiếp tục sang bước chọn ghế phòng vé</span>
            )}
          </div>

          <Button
            variant="primary"
            size="md"
            disabled={!selectedShowtimeId}
            leftIcon={<Ticket className="w-4 h-4" />}
            onClick={handleBooking}
            className="w-full sm:w-auto px-8"
          >
            Mua Vé Ngay
          </Button>
        </div>
      </div>
    </div>
  );
};
