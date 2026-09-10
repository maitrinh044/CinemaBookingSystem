import type { Movie, CinemaBranch, ShowtimeSlot } from './movie';

export type SeatType = 'standard' | 'vip' | 'couple';
export type SeatStatus = 'available' | 'selected' | 'sold';

export interface Seat {
  id: string; // e.g. 'A-01'
  row: string; // 'A' .. 'J'
  col: number; // 1 .. 12
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export interface ConcessionItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  category: 'combo' | 'popcorn' | 'drink' | 'snack';
}

export interface SelectedConcession {
  item: ConcessionItem;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
}

export type PaymentMethod = 'momo' | 'vnpay' | 'zalopay' | 'card';

export interface CompletedBooking {
  bookingCode: string;
  movie: Movie;
  cinema: CinemaBranch;
  date: string;
  showtime: ShowtimeSlot;
  seats: Seat[];
  concessions: SelectedConcession[];
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
  finalTotal: number;
  bookedAt: string;
  qrData: string;
}
