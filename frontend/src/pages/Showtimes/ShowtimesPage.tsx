import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  Film, 
  Armchair,
  ChevronRight
} from 'lucide-react';
import type { Movie, CinemaBranch, ShowtimeSlot } from '../../types/movie';
import { PosterImage } from '../../components/common/PosterImage';
import { MOCK_MOVIES, MOCK_CINEMAS, getUpcomingDates, getMovieShowtimesGrouped } from '../../data/mockData';

export interface ShowtimesPageProps {
  onSelectMovieForBooking: (movie: Movie) => void;
  onProceedToBooking: (booking: {
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
  }) => void;
}

export const ShowtimesPage: React.FC<ShowtimesPageProps> = ({
  onSelectMovieForBooking,
  onProceedToBooking,
}) => {
  const dates = getUpcomingDates();
  const [selectedDate, setSelectedDate] = useState(dates[0].dateStr);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  // Filter movies currently now showing or sneak preview
  const activeMovies = MOCK_MOVIES.filter(m => m.status === 'now_showing' || m.status === 'special_sneak');
  const [selectedMovieId, setSelectedMovieId] = useState<string>(activeMovies[0]?.id || '');

  // Available format filters
  const formatOptions = [
    { id: 'all', label: 'Tất Cả Định Dạng' },
    { id: 'IMAX', label: 'IMAX Laser' },
    { id: '2D', label: '2D Digital' },
    { id: 'GOLD CLASS', label: 'VIP Gold Class' },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto text-left">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-color)] p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/85 to-transparent z-0" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold border border-[var(--primary)]/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>Lịch Chiếu Toàn Quốc</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            Lịch Chiếu Phim Rạp CineGlow
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-sub)]">
            Cập nhật lịch chiếu sớm nhất với các chuẩn rạp cao cấp: IMAX Laser, 2D Digital siêu nét, VIP Gold Class riêng tư.
          </p>
        </div>
      </div>

      {/* 2. Date Selector Slider */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
          {dates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all cursor-pointer min-w-[100px] sm:min-w-[115px] border ${
                  isSelected
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-red-600/30 scale-[1.02]'
                    : 'bg-[var(--surface-hover)] text-[var(--text-main)] border-[var(--border-color)] hover:border-slate-400'
                }`}
              >
                <div className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-[var(--text-sub)]'}`}>
                  {d.label}
                </div>
                <div className="text-sm sm:text-base font-black mt-0.5">
                  {d.subLabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filters: Cinema & Format */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-[var(--border-color)]">
        {/* Cinema Branch Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0" />
          <span className="text-xs font-bold text-[var(--text-sub)] shrink-0">Cụm rạp:</span>
          <select
            value={selectedCinemaId}
            onChange={(e) => setSelectedCinemaId(e.target.value)}
            className="w-full sm:w-64 bg-[var(--surface-hover)] border border-[var(--border-color)] text-xs sm:text-sm font-semibold text-[var(--text-main)] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
          >
            <option value="all">Tất cả rạp trên toàn quốc</option>
            {MOCK_CINEMAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.cityName})
              </option>
            ))}
          </select>
        </div>

        {/* Format Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-[var(--text-sub)] mr-1">Định dạng:</span>
          {formatOptions.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                selectedFormat === fmt.id
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow'
                  : 'bg-[var(--surface-hover)] text-[var(--text-sub)] border-[var(--border-color)] hover:text-[var(--text-main)]'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Movie Selection List */}
      <div className="flex overflow-x-auto gap-4 pb-6 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[var(--primary)]/50 scrollbar-track-transparent">
        {activeMovies.map((movie) => {
          const isSelected = movie.id === selectedMovieId;
          return (
            <button
              key={movie.id}
              onClick={() => setSelectedMovieId(movie.id)}
              className={`snap-start flex-shrink-0 w-28 sm:w-36 flex flex-col items-center gap-3 transition-all duration-300 cursor-pointer ${
                isSelected ? 'scale-105' : 'opacity-60 hover:opacity-100 hover:scale-100'
              }`}
            >
              <div className={`w-full rounded-2xl overflow-hidden border-2 transition-colors ${
                isSelected ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/30' : 'border-transparent'
              }`}>
                <PosterImage
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
              <h3 className={`text-xs sm:text-sm font-bold text-center line-clamp-2 px-1 ${
                isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-main)]'
              }`}>
                {movie.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* 5. Showtimes for Selected Movie */}
      {(() => {
        const movie = activeMovies.find(m => m.id === selectedMovieId);
        if (!movie) return (
          <div className="text-center text-[var(--text-sub)] py-10">Vui lòng chọn một phim.</div>
        );

        const cinemaGroups = getMovieShowtimesGrouped(movie.id, selectedDate).filter(group => {
          if (selectedCinemaId !== 'all' && group.cinema.id !== selectedCinemaId) {
            return false;
          }
          return true;
        });

        return (
          <div className="glass-panel rounded-3xl border border-[var(--border-color)] overflow-hidden p-5 sm:p-6 shadow-xl flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Movie Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)] shrink-0">
              <div className="flex items-start gap-4">
                {/* Poster Thumbnail */}
                <PosterImage
                  src={movie.poster}
                  alt={movie.title}
                  className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl object-cover shadow-md shrink-0 border border-[var(--border-color)] hidden sm:block"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[var(--primary)] text-white">
                      {movie.ageRating}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                        onClick={() => onSelectMovieForBooking(movie)}>
                      {movie.title}
                    </h2>
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-sub)]">
                    {movie.originalTitle} • {movie.genres.join(', ')}
                  </div>
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-[var(--text-sub)] pt-1">
                    <span className="flex items-center gap-1 text-[var(--gold)] font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{movie.rating.toFixed(1)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{movie.duration} phút</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Movie Details Button */}
              <button
                onClick={() => onSelectMovieForBooking(movie)}
                className="self-start sm:self-center px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 text-xs sm:text-sm font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg shadow-[var(--primary)]/20"
              >
                <Film className="w-4 h-4" />
                <span>Chi Tiết Phim</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Showtimes by Cinema Branch */}
            <div className="space-y-4">
              {cinemaGroups.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-sub)] text-sm">
                  Không có lịch chiếu phù hợp cho phim này vào ngày bạn chọn.
                </div>
              ) : (
                cinemaGroups.map((group) => {
                  const filteredFormats = group.formatGroups.filter(fg => {
                    if (selectedFormat === 'all') return true;
                    return fg.format.toUpperCase().includes(selectedFormat);
                  });

                  if (filteredFormats.length === 0) return null;

                  return (
                    <div
                      key={group.cinema.id}
                      className="p-4 rounded-2xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-3 shrink-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[var(--primary)]" />
                          <span className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                            {group.cinema.name}
                          </span>
                          <span className="text-[11px] text-[var(--text-sub)] hidden md:inline">
                            - {group.cinema.address}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--card-elevated)] text-[var(--text-sub)]">
                          {group.cinema.cityName}
                        </span>
                      </div>

                      {/* Format Slot Rows */}
                      <div className="space-y-2.5 pt-1">
                        {filteredFormats.map((fg, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="text-[11px] font-bold text-[var(--text-sub)] w-36 shrink-0 truncate">
                              {fg.format.split('(')[0]}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {fg.slots.map((slot) => (
                                <button
                                  key={slot.id}
                                  onClick={() => onProceedToBooking({
                                    movie,
                                    cinema: group.cinema,
                                    date: selectedDate,
                                    showtime: slot,
                                  })}
                                  className="group px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all text-center cursor-pointer shadow-sm hover:scale-105"
                                >
                                  <div className="text-xs font-black text-[var(--text-main)] group-hover:text-white transition-colors">
                                    {slot.time}
                                  </div>
                                  <div className="text-[9px] text-[var(--text-sub)] group-hover:text-white/80 transition-colors flex items-center justify-center gap-1">
                                    <Armchair className="w-2.5 h-2.5" />
                                    <span>{slot.availableSeats} ghế</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
