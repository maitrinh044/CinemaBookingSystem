import { apiClient, type ApiResponse } from './apiClient';

export interface BackendShowtime {
  id: number;
  movieId: number;
  roomId: number;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: string;
}

export interface LiveSeatItem {
  seatId: number;
  rowLabel: string;
  seatNumber: number;
  seatCode: string;
  seatType: 'NORMAL' | 'VIP' | 'COUPLE';
  price: number;
  status: 'AVAILABLE' | 'HOLDING' | 'SOLD';
}

export interface ShowtimeSeatsMap {
  showtimeId: number;
  movieId: number;
  movieTitle: string;
  roomId: number;
  roomName: string;
  cinemaId: number;
  cinemaName: string;
  startTime: string;
  totalRows: number;
  totalColumns: number;
  seats: LiveSeatItem[];
}

export const showtimeService = {
  async getShowtimes(params?: { movieId?: number | string }): Promise<BackendShowtime[]> {
    try {
      const query = params?.movieId ? `?movieId=${params.movieId}` : '';
      const res = await apiClient.get<ApiResponse<BackendShowtime[]>>(`/showtimes${query}`);
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getShowtimeById(id: number | string): Promise<BackendShowtime | null> {
    try {
      const res = await apiClient.get<ApiResponse<BackendShowtime>>(`/showtimes/${id}`);
      return res.data;
    } catch {
      return null;
    }
  },

  async getLiveSeats(showtimeId: number | string): Promise<ShowtimeSeatsMap | null> {
    try {
      const res = await apiClient.get<ApiResponse<ShowtimeSeatsMap>>(`/showtimes/${showtimeId}/seats`);
      return res.data;
    } catch {
      return null;
    }
  },
};