import React, { useState, useEffect } from 'react';
import { Play, Ticket, ChevronLeft, ChevronRight, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Movie } from '../../types/movie';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PosterImage } from '../common/PosterImage';

export interface HeroSliderProps {
  movies: Movie[];
  onBookMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  movies,
  onBookMovie,
  onWatchTrailer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroMovies = movies.slice(0, 5); // Take top 5 movies for slider
  const currentMovie = heroMovies[currentIndex] || heroMovies[0];

  // Auto rotate every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  if (!currentMovie) return null;

  return (
    <div
      className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl mb-8 group select-none border border-[var(--border-color)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrop Image with Gradient Masks */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentMovie.backdrop})` }}
        >
          {/* Multi-layered Cinema Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-black/40 to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-20 h-full flex flex-col justify-between p-4 sm:p-7 lg:p-9 max-w-3xl">
        {/* Top: Status Pill */}
        <div className="flex items-center gap-2">
          {currentMovie.isHot && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Phim Sốt Vé
            </span>
          )}
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-semibold text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            <span>{currentMovie.rating.toFixed(1)} IMDb</span>
          </div>
        </div>

        {/* Center: Movie Details with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id + '-info'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-2 my-auto"
          >
            {/* Badges row - hidden on very small mobile */}
            <div className="hidden sm:flex flex-wrap items-center gap-2">
              <Badge ageRating={currentMovie.ageRating} size="sm" />
              {currentMovie.formats.slice(0, 2).map((fmt) => (
                <Badge key={fmt} format={fmt} size="sm" />
              ))}
              <div className="flex items-center gap-1 text-xs text-slate-300 ml-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentMovie.duration} phút</span>
              </div>
            </div>
            {/* Mobile: minimal badge row */}
            <div className="flex sm:hidden items-center gap-1.5">
              <Badge ageRating={currentMovie.ageRating} size="sm" />
              <div className="flex items-center gap-1 text-[10px] text-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{currentMovie.duration} phút</span>
              </div>
            </div>

            {/* Movie Title */}
            <div>
              <h1 className="text-lg sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md leading-tight line-clamp-2">
                {currentMovie.title}
              </h1>
              <p className="text-[10px] sm:text-sm font-medium text-slate-400 mt-0.5 line-clamp-1">
                {currentMovie.originalTitle} • {currentMovie.genres.join(', ')}
              </p>
            </div>

            {/* Synopsis - hidden on mobile */}
            <p className="hidden sm:block text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2 leading-relaxed drop-shadow">
              {currentMovie.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 pt-1">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                onClick={() => onBookMovie(currentMovie)}
                className="shadow-xl shadow-red-600/40 px-3 sm:px-5 text-xs sm:text-sm"
              >
                Đặt Vé Ngay
              </Button>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                onClick={() => onWatchTrailer(currentMovie)}
                className="bg-black/40 backdrop-blur-md text-white border-white/30 hover:border-[var(--primary)] hover:bg-[var(--primary)] px-3 sm:px-4 text-xs sm:text-sm"
              >
                Trailer
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Thumbnail Bar Indicators */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full py-1 scrollbar-none">
            {heroMovies.map((movie, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={movie.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all duration-200 cursor-pointer text-left shrink-0 ${
                    isActive
                      ? 'bg-white/20 backdrop-blur-md border border-white/40 ring-1 ring-white/50 text-white'
                      : 'bg-black/40 hover:bg-black/60 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <PosterImage
                    src={movie.poster}
                    alt={movie.title}
                    className="w-5 h-7 sm:w-7 sm:h-9 rounded object-cover shadow"
                  />
                  <div className="hidden sm:block max-w-[100px] lg:max-w-[120px]">
                    <div className="text-xs font-bold truncate text-white">{movie.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{movie.formats[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5 pl-2 sm:pl-4 shrink-0">
            <button
              onClick={handlePrev}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
