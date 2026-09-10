import { apiClient, type ApiResponse } from './apiClient';
import type { CompletedBooking } from '../types/booking';
import { MOCK_PAST_BOOKINGS } from '../data/mockBookingData';

export const bookingService = {
  /**
   * Giữ ghế tạm thời (Lock seats in real-time)
   */
  async holdSeats(params: {
    showtimeId: string;
    seatIds: string[];
  }): Promise<{ success: boolean; expiresAt: string }> {
    try {
      const res = await apiClient.post<ApiResponse<{ success: boolean; expiresAt: string }>>(
        '/bookings/hold-seats',
        params
      );
      return res.data;
    } catch {
      // Fallback 10-minute hold expiration
      const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      return { success: true, expiresAt: expires };
    }
  },

  /**
   * Hủy giữ chỗ khi người dùng quay lại hoặc hết thời gian
   */
  async releaseSeats(params: {
    showtimeId: string;
    seatIds: string[];
  }): Promise<void> {
    try {
      await apiClient.post('/bookings/release-seats', params);
    } catch {
      // Graceful no-op in mock mode
    }
  },

  /**
   * Tạo đơn đặt vé và hóa đơn hoàn chỉnh
   */
  async createBooking(booking: CompletedBooking): Promise<CompletedBooking> {
    try {
      const res = await apiClient.post<ApiResponse<CompletedBooking>>('/bookings', booking);
      return res.data;
    } catch {
      // Fallback: save to localStorage for persistence
      const currentStorage = localStorage.getItem('cineglow_user_tickets');
      const tickets: CompletedBooking[] = currentStorage ? JSON.parse(currentStorage) : [];
      tickets.unshift(booking);
      localStorage.setItem('cineglow_user_tickets', JSON.stringify(tickets));
      return booking;
    }
  },

  /**
   * Lấy lịch sử vé xem phim của người dùng
   */
  async getUserBookings(userId: string): Promise<CompletedBooking[]> {
    try {
      const res = await apiClient.get<ApiResponse<CompletedBooking[]>>(`/users/${userId}/bookings`);
      return res.data;
    } catch {
      // Return local storage combined with mock past bookings
      const localTicketsRaw = localStorage.getItem('cineglow_user_tickets');
      const localTickets: CompletedBooking[] = localTicketsRaw ? JSON.parse(localTicketsRaw) : [];
      return [...localTickets, ...MOCK_PAST_BOOKINGS];
    }
  },

  /**
   * Tra cứu vé xem phim theo mã đặt vé (Booking Code)
   */
  async getBookingByCode(bookingCode: string): Promise<CompletedBooking | null> {
    try {
      const res = await apiClient.get<ApiResponse<CompletedBooking>>(`/bookings/code/${bookingCode}`);
      return res.data;
    } catch {
      const all = await this.getUserBookings('current');
      return all.find((b) => b.bookingCode.toUpperCase() === bookingCode.toUpperCase()) || null;
    }
  },
};
