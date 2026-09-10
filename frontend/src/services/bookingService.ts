import { apiClient, type ApiResponse } from './apiClient';
import type { CompletedBooking } from '../types/booking';

export interface HoldSeatsRequest {
  showtimeId: number;
  seatIds: number[];
}

export interface BackendBookingResponse {
  id: number;
  bookingCode: string;
  showtimeId: number;
  userId: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
  totalAmount: number;
  expiresAt: string;
  confirmedAt?: string;
  seats: Array<{
    seatId: number;
    seatCode: string;
    seatType: string;
    price: number;
  }>;
  tickets?: Array<{
    id: number;
    ticketCode: string;
    seatCode: string;
    seatType: string;
    movieTitle: string;
    cinemaName: string;
    roomName: string;
    startTime: string;
    qrCode: string;
    status: 'UNUSED' | 'USED' | 'CANCELLED';
  }>;
}

export interface BackendTicketResponse {
  id: number;
  ticketCode: string;
  seatId: number;
  seatCode: string;
  seatType: string;
  movieTitle: string;
  cinemaName: string;
  roomName: string;
  startTime: string;
  qrCode: string;
  status: 'UNUSED' | 'USED' | 'CANCELLED';
  checkedInAt?: string;
}

export const bookingService = {
  /**
   * Giữ ghế 5 phút qua API Backend (/api/bookings/hold)
   */
  async holdSeats(params: {
    showtimeId: number;
    seatIds: number[];
  }): Promise<BackendBookingResponse> {
    const res = await apiClient.post<ApiResponse<BackendBookingResponse>>('/bookings/hold', params);
    return res.data;
  },

  /**
   * Hủy giữ chỗ chủ động
   */
  async cancelHold(bookingId: number): Promise<void> {
    try {
      await apiClient.post(`/bookings/${bookingId}/cancel`);
    } catch {
      // Ignore
    }
  },

  /**
   * Lấy lịch sử đơn hàng của người dùng hiện tại
   */
  async getMyBookings(): Promise<BackendBookingResponse[]> {
    try {
      const res = await apiClient.get<ApiResponse<BackendBookingResponse[]>>('/bookings/my-bookings');
      return res.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Lấy danh sách vé điện tử kèm mã QR
   */
  async getMyTickets(): Promise<BackendTicketResponse[]> {
    try {
      const res = await apiClient.get<ApiResponse<BackendTicketResponse[]>>('/tickets/my-tickets');
      return res.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Nhân viên soát vé tại rạp bằng mã QR hoặc mã vé
   */
  async checkInTicket(ticketCodeOrQr: string): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/tickets/check-in', { ticketCodeOrQr });
    return res.data;
  },

  /**
   * Lưu vé cục bộ (dành cho fallback khi offline)
   */
  async createBooking(booking: CompletedBooking): Promise<CompletedBooking> {
    const currentStorage = localStorage.getItem('cineglow_user_tickets');
    const tickets: CompletedBooking[] = currentStorage ? JSON.parse(currentStorage) : [];
    tickets.unshift(booking);
    localStorage.setItem('cineglow_user_tickets', JSON.stringify(tickets));
    return booking;
  },
};