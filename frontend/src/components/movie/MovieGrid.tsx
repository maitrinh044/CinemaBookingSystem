import React, { useState, useMemo } from 'react';
import { Film, Calendar, Flame } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';

export interface MovieGridProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  onSelectMovie,
  onWatchTrailer,
}) => {
  const [activeTab, setActiveTab] = useState<'now_showing' | 'coming_soon' | 'special_sneak'>('now_showing');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tất cả');

  // Extract unique genres
  const genres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return ['Tất cả', ...Array.from(set)];
  }, [movies]);

  // Filter movies by tab and genre
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchTab = m.status === activeTab;
      const matchGenre = selectedGenre === 'Tất cả' || m.genres.includes(selectedGenre);
      return matchTab && matchGenre;
    });
  }, [movies, activeTab, selectedGenre]);

  const tabs = [
    { id: 'now_showing', label: 'Phim Đang Chiếu', icon: <Flame className="w-4 h-4 text-red-500" /> },
    { id: 'coming_soon', label: 'Phim Sắp Chiếu', icon: <Calendar className="w-4 h-4 text-cyan-400" /> },
    { id: 'special_sneak', label: 'Suất Chiếu Đặc Biệt', icon: <Film className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <div className="space-y-5 mb-12">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
        {/* Main Category Tabs - scrollable on mobile */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-sm shadow-red-600/30'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <div className="text-xs font-semibold text-[var(--text-sub)]">
          Hiển thị <b className="text-[var(--text-main)]">{filteredMovies.length}</b> phim
        </div>
      </div>

      {/* Genre Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {genres.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-bold shadow-xs'
                  : 'bg-[var(--surface-hover)] text-[var(--text-sub)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Grid of Movie Cards (Dense 5-6 cols on Desktop) */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-3.5">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              onWatchTrailer={onWatchTrailer}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-2xl border border-[var(--border-color)] p-6">
          <Film className="w-10 h-10 text-[var(--text-sub)] mx-auto mb-2 opacity-40" />
          <h3 className="text-sm font-bold text-[var(--text-main)]">Không tìm thấy bộ phim nào</h3>
          <p className="text-xs text-[var(--text-sub)] mt-0.5">
            Hiện chưa có phim nào trong danh mục thể loại "{selectedGenre}".
          </p>
        </div>
      )}
    </div>
  );
};
