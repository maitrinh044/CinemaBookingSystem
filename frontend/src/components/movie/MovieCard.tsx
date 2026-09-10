import React from 'react';
import { Star, Clock, Play, Ticket } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { Badge } from '../common/Badge';
import { PosterImage } from '../common/PosterImage';

export interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onWatchTrailer,
}) => {
  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden glass-panel border border-[var(--border-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--primary)]/50">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
        <PosterImage
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <Badge ageRating={movie.ageRating} size="sm" />
          {movie.isHot && (
            <span className="px-1 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-red-600 text-white shadow">
              HOT
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          {movie.formats.slice(0, 1).map((fmt) => (
            <Badge key={fmt} format={fmt} size="sm" />
          ))}
        </div>

        {/* Hover Overlay with Quick Trailer Action */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 z-20">
          <button
            onClick={() => onWatchTrailer(movie)}
            className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg shadow-red-600/50 hover:scale-110 transition-transform cursor-pointer"
            title="Xem Trailer"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>

        {/* Bottom Info Bar Overlay inside Poster */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2 pt-6 flex items-center justify-between text-[11px] text-white z-10">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-current" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300 text-[10px] font-medium">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <span>{movie.duration}m</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-wider line-clamp-1">
            {movie.genres.slice(0, 2).join(' • ')}
          </div>
          <h3
            className="text-xs sm:text-sm font-bold text-[var(--text-main)] line-clamp-1 mt-0.5 group-hover:text-[var(--primary)] transition-colors cursor-pointer"
            title={movie.title}
            onClick={() => onSelectMovie(movie)}
          >
            {movie.title}
          </h3>
          <p className="text-[10px] text-[var(--text-sub)] line-clamp-1 font-medium">
            {movie.originalTitle}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectMovie(movie)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--primary)] hover:text-white border border-[var(--border-color)] hover:border-[var(--primary)] text-[var(--text-main)] text-[11px] font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>ĐẶT VÉ</span>
        </button>
      </div>
    </div>
  );
};
