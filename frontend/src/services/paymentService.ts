import { apiClient, type ApiResponse } from './apiClient';

export interface CreatePaymentParams {
  bookingId: number;
  paymentMethod: 'VNPAY' | 'MOMO' | 'CASH' | 'STRIPE' | 'OTHER';
}

export interface PaymentResponse {
  id: number;
  bookingId: number;
  bookingCode: string;
  transactionId: string;
  paymentMethod: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  amount: number;
  paymentUrl?: string;
  paidAt?: string;
  createdAt: string;
}

export const paymentService = {
  /**
   * Tạo liên kết thanh toán VNPay/MoMo qua Backend (/api/payments/create-url)
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    const res = await apiClient.post<ApiResponse<PaymentResponse>>('/payments/create-url', params);
    return res.data;
  },

  /**
   * Mô phỏng thanh toán thành công (dành cho môi trường Dev / Demo)
   */
  async simulateSuccess(bookingId: number): Promise<PaymentResponse> {
    const res = await apiClient.post<ApiResponse<PaymentResponse>>(`/payments/simulate-success/${bookingId}`);
    return res.data;
  },

  /**
   * Lấy thông tin thanh toán theo Booking ID
   */
  async getPaymentByBooking(bookingId: number): Promise<PaymentResponse | null> {
    try {
      const res = await apiClient.get<ApiResponse<PaymentResponse>>(`/payments/booking/${bookingId}`);
      return res.data;
    } catch {
      return null;
    }
  },
};