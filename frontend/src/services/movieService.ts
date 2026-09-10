import { apiClient, type ApiResponse } from './apiClient';
import type { Movie, CinemaBranch } from '../types/movie';
import type { UserReview } from '../types/review';
import { MOCK_MOVIES, MOCK_CINEMAS, getMovieShowtimesGrouped } from '../data/mockData';
import { INITIAL_MOCK_REVIEWS } from '../data/mockReviews';

export const movieService = {
  /**
   * Lấy danh sách tất cả các phim (có thể lọc theo trạng thái: now_showing, coming_soon, special_sneak)
   */
  async getMovies(params?: { status?: string; genre?: string; search?: string }): Promise<Movie[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.genre) query.append('genre', params.genre);
      if (params?.search) query.append('q', params.search);

      const res = await apiClient.get<ApiResponse<Movie[]>>(`/movies?${query.toString()}`);
      return res.data;
    } catch {
      // Fallback local mock data
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
   * Lấy thông tin chi tiết một bộ phim theo ID
   */
  async getMovieById(movieId: string): Promise<Movie | null> {
    try {
      const res = await apiClient.get<ApiResponse<Movie>>(`/movies/${movieId}`);
      return res.data;
    } catch {
      return MOCK_MOVIES.find((m) => m.id === movieId) || null;
    }
  },

  /**
   * Lấy danh sách cụm rạp
   */
  async getCinemas(cityId?: string): Promise<CinemaBranch[]> {
    try {
      const query = cityId ? `?cityId=${cityId}` : '';
      const res = await apiClient.get<ApiResponse<CinemaBranch[]>>(`/cinemas${query}`);
      return res.data;
    } catch {
      if (cityId) {
        return MOCK_CINEMAS.filter((c) => c.cityId === cityId);
      }
      return MOCK_CINEMAS;
    }
  },

  /**
   * Lấy lịch chiếu của phim theo ngày và khu vực
   */
  async getMovieShowtimes(movieId: string, date: string, cityId?: string) {
    try {
      const query = new URLSearchParams({ movieId, date });
      if (cityId) query.append('cityId', cityId);

      const res = await apiClient.get<ApiResponse<any>>(`/showtimes?${query.toString()}`);
      return res.data;
    } catch {
      return getMovieShowtimesGrouped(movieId, date, cityId);
    }
  },

  /**
   * Lấy danh sách đánh giá của một bộ phim
   */
  async getMovieReviews(movieId: string): Promise<UserReview[]> {
    try {
      const res = await apiClient.get<ApiResponse<UserReview[]>>(`/movies/${movieId}/reviews`);
      return res.data;
    } catch {
      return INITIAL_MOCK_REVIEWS.filter((r) => r.movieId === movieId);
    }
  },

  /**
   * Đăng nhận xét mới cho phim
   */
  async submitReview(reviewData: Omit<UserReview, 'id' | 'createdAt' | 'likesCount'>): Promise<UserReview> {
    try {
      const res = await apiClient.post<ApiResponse<UserReview>>(`/movies/${reviewData.movieId}/reviews`, reviewData);
      return res.data;
    } catch {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newReview: UserReview = {
        ...reviewData,
        id: `mock-rev-${Date.now()}`,
        createdAt: formattedDate,
        likesCount: 1,
      };
      return newReview;
    }
  },
};
