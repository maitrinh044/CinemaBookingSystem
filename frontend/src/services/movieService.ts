import { apiClient, type ApiResponse } from './apiClient';
import type { Movie, CinemaBranch } from '../types/movie';
import type { UserReview } from '../types/review';
import type { MovieFormat, AgeRating } from '../components/common/Badge';
import { MOCK_MOVIES, MOCK_CINEMAS, getMovieShowtimesGrouped } from '../data/mockData';
import { INITIAL_MOCK_REVIEWS } from '../data/mockReviews';

export const movieService = {
  /**
   * Láº¥y danh sÃ¡ch táº¥t cáº£ cÃ¡c phim (káº¿t ná»‘i trá»±c tiáº¿p Backend /api/movies)
   */
  async getMovies(params?: { status?: string; genre?: string; search?: string }): Promise<Movie[]> {
    try {
      const query = new URLSearchParams({ size: '100' });
      if (params?.status) query.append('status', params.status === 'now_showing' ? 'NOW_SHOWING' : params.status.toUpperCase());
      if (params?.search) query.append('keyword', params.search);

      const res = await apiClient.get<ApiResponse<any>>(`/movies?${query.toString()}`);
      const rawList = res.data?.content || res.data || [];

      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((m: any) => ({
          id: String(m.id),
          title: m.title,
          originalTitle: m.originalTitle || m.title,
          poster: m.posterUrl || 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nx2zx.jpg',
          backdrop: m.bannerUrl || 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
          trailerUrl: m.trailerUrl || 'https://www.youtube.com/watch?v=Way9Dexny3w',
          synopsis: m.description || '',
          duration: m.durationMinutes || 120,
          releaseDate: m.releaseDate || '2026-09-01',
          ageRating: (['P', 'K', 'T13', 'T16', 'T18'].includes(m.ageRating) ? m.ageRating : 'T16') as AgeRating,
          director: m.director || 'Đạo diễn Quốc tế',
          cast: m.cast || ['Diễn viên Chính', 'Diễn viên Phụ'],
          genres: Array.isArray(m.genres) && m.genres.length > 0
            ? m.genres.map((g: any) => (typeof g === 'string' ? g : g.name || 'Điện Ảnh'))
            : ['Hành Động', 'Điện Ảnh'],
          rating: Number((7.8 + ((Number(m.id) * 7) % 20) / 10).toFixed(1)),
          voteCount: 1200 + (Number(m.id) * 97) % 3500,
          status: (m.status === 'NOW_SHOWING' ? 'now_showing' : 'coming_soon') as Movie['status'],
          formats: (Number(m.id) % 3 === 0 ? ['2D', '3D', 'IMAX'] : Number(m.id) % 2 === 0 ? ['2D', '3D'] : ['2D']) as MovieFormat[],
        }));
      }
      return MOCK_MOVIES;
    } catch {
      let list = [...MOCK_MOVIES];
      if (params?.status) {
        list = list.filter((m) => m.status === params.status);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter((m) => m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q));
      }
      return list;
    }
  },

  /**
   * Láº¥y thÃ´ng tin chi tiáº¿t má»™t bá»™ phim theo ID
   */
  async getMovieById(movieId: string): Promise<Movie | null> {
    try {
      const res = await apiClient.get<ApiResponse<any>>(`/movies/${movieId}`);
      const m = res.data;
      if (m) {
        return {
          id: String(m.id),
          title: m.title,
          originalTitle: m.originalTitle || m.title,
          poster: m.posterUrl || 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nx2zx.jpg',
          backdrop: m.bannerUrl || 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
          trailerUrl: m.trailerUrl || 'https://www.youtube.com/watch?v=Way9Dexny3w',
          synopsis: m.description || '',
          duration: m.durationMinutes || 120,
          releaseDate: m.releaseDate || '2026-09-01',
          ageRating: (['P', 'K', 'T13', 'T16', 'T18'].includes(m.ageRating) ? m.ageRating : 'T16') as AgeRating,
          director: m.director || 'Denis Villeneuve',
          cast: ['TimothÃ©e Chalamet', 'Zendaya'],
          genres: Array.isArray(m.genres) ? m.genres.map((g: any) => g.name || g) : ['HÃ nh Äá»™ng'],
          rating: 9.0,
          voteCount: 1850,
          status: (m.status === 'NOW_SHOWING' ? 'now_showing' : 'coming_soon') as Movie['status'],
          formats: ['2D', 'IMAX'] as MovieFormat[],
        };
      }
      return MOCK_MOVIES.find((item) => item.id === movieId) || null;
    } catch {
      return MOCK_MOVIES.find((m) => m.id === movieId) || null;
    }
  },

  /**
   * Láº¥y danh sÃ¡ch cá»¥m ráº¡p tá»« Backend (/api/cinemas)
   */
  async getCinemas(cityId?: string): Promise<CinemaBranch[]> {
    try {
      const res = await apiClient.get<ApiResponse<any[]>>('/cinemas');
      if (Array.isArray(res.data) && res.data.length > 0) {
        const branches: CinemaBranch[] = res.data.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          cityId: c.city && c.city.includes('HÃ  Ná»™i') ? 'hn' : 'hcm',
          cityName: c.city,
          address: c.address,
          formats: ['2D', '3D', 'IMAX'] as MovieFormat[],
        }));

        if (cityId) {
          return branches.filter((b) => b.cityId === cityId);
        }
        return branches;
      }
      return MOCK_CINEMAS;
    } catch {
      if (cityId) {
        return MOCK_CINEMAS.filter((c) => c.cityId === cityId);
      }
      return MOCK_CINEMAS;
    }
  },

  /**
   * Láº¥y lá»‹ch chiáº¿u cá»§a phim nhÃ³m theo ráº¡p vÃ  Ä‘á»‹nh dáº¡ng
   */
  async getMovieShowtimes(movieId: string, date: string, cityId?: string) {
    return getMovieShowtimesGrouped(movieId, date, cityId);
  },

  /**
   * Láº¥y danh sÃ¡ch Ä‘Ã¡nh giÃ¡ & bÃ¬nh luáº­n cá»§a má»™t bá»™ phim
   */
  async getMovieReviews(movieId: string): Promise<UserReview[]> {
    const saved = localStorage.getItem(`cineglow_reviews_${movieId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_MOCK_REVIEWS.filter((r) => r.movieId === movieId);
  },

  /**
   * ÄÄƒng bÃ i Ä‘Ã¡nh giÃ¡ phim má»›i
   */
  async submitReview(review: Omit<UserReview, 'id' | 'createdAt' | 'likesCount'>): Promise<UserReview> {
    const newReview: UserReview = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: 'Vá»«a xong',
      likesCount: 0,
    };

    const currentReviews = await this.getMovieReviews(review.movieId);
    const updated = [newReview, ...currentReviews];
    localStorage.setItem(`cineglow_reviews_${review.movieId}`, JSON.stringify(updated));
    return newReview;
  },
};