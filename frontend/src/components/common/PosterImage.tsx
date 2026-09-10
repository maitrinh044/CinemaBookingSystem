import React, { useState } from 'react';
import { Film } from 'lucide-react';

export interface PosterImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Movie poster image with graceful fallback when image fails to load.
 * Shows a cinema-themed gradient placeholder with the movie title.
 */
export const PosterImage: React.FC<PosterImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black text-center px-2 ${className}`}
        aria-label={alt}
      >
        <Film className="w-8 h-8 text-[var(--primary)]/60 mb-2 shrink-0" />
        <span className="text-[10px] font-bold text-slate-400 line-clamp-3 leading-tight">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
