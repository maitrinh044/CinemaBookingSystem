import type { AgeRating, MovieFormat } from '../components/common/Badge';

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  poster: string;
  backdrop: string;
  duration: number; // minutes
  releaseDate: string;
  ageRating: AgeRating;
  formats: MovieFormat[];
  rating: number; // e.g. 8.8
  voteCount: number;
  genres: string[];
  director: string;
  cast: string[];
  trailerUrl: string; // YouTube embed URL
  synopsis: string;
  status: 'now_showing' | 'coming_soon' | 'special_sneak';
  isHot?: boolean;
}

export interface CinemaBranch {
  id: string;
  name: string;
  address: string;
  cityId: string;
  cityName: string;
  formats: MovieFormat[];
}

export interface ShowtimeSlot {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  format: MovieFormat;
  hallName: string;
  price: number; // VND
  availableSeats: number;
  totalSeats: number;
}
