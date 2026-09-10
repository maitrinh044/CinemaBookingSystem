import React, { useEffect, useRef } from 'react';
import { Star, Clock, Film } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { MOCK_MOVIES } from '../../data/mockData';
import { PosterImage } from '../common/PosterImage';

export interface SearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  query,
  isOpen,
  onClose,
  onSelectMovie,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !query.trim()) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search filter across titles, directors, actors, genres
  const filteredMovies = MOCK_MOVIES.filter((movie) => {
    const matchTitle = movie.title.toLowerCase().includes(normalizedQuery);
    const matchOriginal = movie.originalTitle.toLowerCase().includes(normalizedQuery);
    const matchDirector = movie.director.toLowerCase().includes(normalizedQuery);
    const matchCast = movie.cast.some((actor) => actor.toLowerCase().includes(normalizedQuery));
    const matchGenres = movie.genres.some((genre) => genre.toLowerCase().includes(normalizedQuery));

    return matchTitle || matchOriginal || matchDirector || matchCast || matchGenres;
  });

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel border border-[var(--border-color)] shadow-2xl overflow-hidden z-50 animate-fade-in text-left"
    >
      <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-sub)]">
        <span>Kết quả tìm kiếm cho: <b className="text-[var(--text-main)] font-semibold">"{query}"</b></span>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-hover)]">
          {filteredMovies.length} phim
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-color)] p-1.5 space-y-0.5">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => {
                onSelectMovie(movie);
                onClose();
              }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface-hover)] transition-colors cursor-pointer group"
            >
              {/* Poster Thumbnail */}
              <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--border-color)] bg-[var(--surface)]">
                <PosterImage
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[var(--primary)] text-white shrink-0">
                    {movie.ageRating}
                  </span>
                  <h4 className="text-xs font-bold text-[var(--text-main)] truncate group-hover:text-[var(--primary)] transition-colors">
                    {movie.title}
                  </h4>
                </div>
                <div className="text-[10px] text-[var(--text-sub)] truncate">
                  {movie.originalTitle}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[var(--text-sub)]">
                  <span className="flex items-center gap-1 text-[var(--gold)] font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{movie.duration}m</span>
                  </span>
                  <span className="truncate max-w-[120px]">
                    {movie.genres.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 px-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mx-auto text-[var(--text-sub)]">
              <Film className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[var(--text-main)]">
              Không tìm thấy phim phù hợp
            </p>
            <p className="text-[11px] text-[var(--text-sub)]">
              Thử tìm kiếm với tên phim khác, tên diễn viên hoặc thể loại như 'Hành Động', 'Hoạt Hình'.
            </p>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-[var(--border-color)] bg-[var(--surface-hover)] text-center">
        <span className="text-[10px] text-[var(--text-sub)]">
          Nhấn phím <kbd className="px-1.5 py-0.5 rounded bg-[var(--card-elevated)] border border-[var(--border-color)] text-[9px] font-mono text-[var(--text-main)]">ESC</kbd> để đóng gợi ý
        </span>
      </div>
    </div>
  );
};

