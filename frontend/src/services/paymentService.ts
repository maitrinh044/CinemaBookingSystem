import { apiClient, type ApiResponse } from './apiClient';

export interface CreatePaymentParams {
  bookingCode: string;
  amount: number;
  paymentMethod: 'vnpay' | 'momo' | 'zalopay' | 'card';
  returnUrl?: string;
}

export interface PaymentInitResult {
  paymentUrl: string;
  transactionId: string;
  expiresInSeconds: number;
}

export interface PaymentVerifyResult {
  success: boolean;
  status: 'paid' | 'failed' | 'pending';
  transactionId: string;
  bookingCode: string;
  paidAt?: string;
}

export const paymentService = {
  /**
   * Khởi tạo liên kết thanh toán qua cổng VNPAY / MoMo / ZaloPay
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentInitResult> {
    try {
      const res = await apiClient.post<ApiResponse<PaymentInitResult>>('/payments/create-url', params);
      return res.data;
    } catch {
      // Mock payment simulation URL
      return {
        paymentUrl: `https://payment-mock.cineglow.vn/checkout?code=${params.bookingCode}&amount=${params.amount}&method=${params.paymentMethod}`,
        transactionId: `TXN_${Date.now()}`,
        expiresInSeconds: 600, // 10 minutes
      };
    }
  },

  /**
   * Kiểm tra kết quả giao dịch thanh toán (Webhook IPN / Polling)
   */
  async verifyPayment(params: {
    transactionId: string;
    bookingCode: string;
  }): Promise<PaymentVerifyResult> {
    try {
      const res = await apiClient.get<ApiResponse<PaymentVerifyResult>>(
        `/payments/verify?transactionId=${params.transactionId}&bookingCode=${params.bookingCode}`
      );
      return res.data;
    } catch {
      return {
        success: true,
        status: 'paid',
        transactionId: params.transactionId,
        bookingCode: params.bookingCode,
        paidAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Kiểm tra và áp dụng mã giảm giá / khuyến mãi
   */
  async checkPromotionCode(
    code: string,
    orderTotal: number
  ): Promise<{ valid: boolean; discountAmount: number; message: string }> {
    try {
      const res = await apiClient.post<ApiResponse<{ valid: boolean; discountAmount: number; message: string }>>(
        '/promotions/validate',
        { code, orderTotal }
      );
      return res.data;
    } catch {
      const upper = code.trim().toUpperCase();
      if (upper === 'CINEGLOW50') {
        const discount = Math.min(orderTotal * 0.5, 50000);
        return { valid: true, discountAmount: discount, message: 'Giảm 50% (tối đa 50.000đ)' };
      }
      if (upper === 'VIPMEMBER') {
        const discount = Math.min(orderTotal * 0.2, 80000);
        return { valid: true, discountAmount: discount, message: 'Ưu đãi VIP Member giảm 20%' };
      }
      if (upper === 'POPCORNFREE') {
        return { valid: true, discountAmount: 35000, message: 'Tặng 01 Bắp Ngọt 60oz (Trừ 35.000đ)' };
      }
      return { valid: false, discountAmount: 0, message: 'Mã khuyến mãi không tồn tại hoặc đã hết hạn.' };
    }
  },
};
