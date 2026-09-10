import React from 'react';
import { Film, MapPin, Calendar, Armchair, Popcorn, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Movie, CinemaBranch, ShowtimeSlot } from '../../types/movie';
import type { Seat, SelectedConcession } from '../../types/booking';
import type { BookingStep } from './BookingStepsBar';
import { Button } from '../common/Button';
import { PosterImage } from '../common/PosterImage';

export interface OrderSummaryCardProps {
  movie: Movie;
  cinema: CinemaBranch;
  date: string;
  showtime: ShowtimeSlot;
  selectedSeats: Seat[];
  selectedConcessions: SelectedConcession[];
  discountAmount: number;
  currentStep: BookingStep;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCancelBooking: () => void;
  isFormValid?: boolean;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  movie,
  cinema,
  date,
  showtime,
  selectedSeats,
  selectedConcessions,
  discountAmount,
  currentStep,
  onNextStep,
  onPrevStep,
  onCancelBooking,
  isFormValid = true,
}) => {
  // Calculations
  const seatsTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const concessionsTotal = selectedConcessions.reduce(
    (acc, sc) => acc + sc.item.price * sc.quantity,
    0
  );
  const subtotal = seatsTotal + concessionsTotal;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const canProceed = 
    (currentStep === 'seat' && selectedSeats.length > 0) ||
    (currentStep === 'concession') ||
    (currentStep === 'checkout' && isFormValid);

  let nextButtonText = 'Tiếp Tục Chọn Bắp Nước';
  if (currentStep === 'concession') {
    nextButtonText = 'Tiếp Tục Thanh Toán';
  } else if (currentStep === 'checkout') {
    nextButtonText = 'Xác Nhận & Thanh Toán';
  }

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] shadow-xl space-y-4 text-left">
      {/* Header: Movie Info */}
      <div className="flex items-start gap-3 pb-3 border-b border-[var(--border-color)]">
        <PosterImage
                  src={movie.poster}
          alt={movie.title}
          className="w-14 h-20 rounded-lg object-cover shadow shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)] truncate">
            {movie.title}
          </h3>
          <p className="text-[11px] text-[var(--text-sub)] truncate">
            {movie.originalTitle}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[var(--primary)] text-white">
              {showtime.format}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-sub)] border border-[var(--border-color)]">
              {movie.ageRating}
            </span>
          </div>
        </div>
      </div>

      {/* Showtime Details */}
      <div className="space-y-1.5 text-xs text-[var(--text-sub)] pb-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
          <span className="text-[var(--text-main)] font-semibold truncate">{cinema.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
          <span>Suất chiếu: <b>{showtime.time}</b> • {date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
          <span>{showtime.hallName}</span>
        </div>
      </div>

      {/* Selected Seats List */}
      <div className="space-y-2 pb-3 border-b border-[var(--border-color)] text-xs">
        <div className="flex items-center justify-between font-bold text-[var(--text-main)]">
          <span className="flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 text-[var(--primary)]" />
            Ghế đã chọn ({selectedSeats.length}):
          </span>
          <span>{seatsTotal.toLocaleString('vi-VN')} đ</span>
        </div>

        {selectedSeats.length === 0 ? (
          <p className="text-[11px] text-[var(--text-sub)] italic">
            Chưa có ghế nào được chọn. Vui lòng chọn tối đa 8 ghế.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedSeats.map((seat) => (
              <span
                key={seat.id}
                className="px-2 py-0.5 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 font-bold text-[11px]"
              >
                {seat.id}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Selected Concessions List */}
      {selectedConcessions.length > 0 && (
        <div className="space-y-1.5 pb-3 border-b border-[var(--border-color)] text-xs">
          <div className="flex items-center justify-between font-bold text-[var(--text-main)]">
            <span className="flex items-center gap-1.5">
              <Popcorn className="w-3.5 h-3.5 text-[var(--gold)]" />
              Bắp nước ({selectedConcessions.reduce((a, b) => a + b.quantity, 0)}):
            </span>
            <span>{concessionsTotal.toLocaleString('vi-VN')} đ</span>
          </div>

          <div className="space-y-1 text-[11px] text-[var(--text-sub)]">
            {selectedConcessions.map((sc) => (
              <div key={sc.item.id} className="flex justify-between items-center">
                <span className="truncate max-w-[170px]">
                  {sc.item.name} <b className="text-[var(--text-main)]">x{sc.quantity}</b>
                </span>
                <span>{(sc.item.price * sc.quantity).toLocaleString('vi-VN')} đ</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discount (if any) */}
      {discountAmount > 0 && (
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-500 pb-2">
          <span>Khuyến mãi / Voucher:</span>
          <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
        </div>
      )}

      {/* Total Amount Row */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs text-[var(--text-sub)] block">Tổng cộng</span>
          <span className="text-lg sm:text-xl font-black text-[var(--primary)] tracking-tight">
            {finalTotal.toLocaleString('vi-VN')} đ
          </span>
        </div>

        <span className="text-[10px] text-[var(--text-sub)] text-right">
          (Đã bao gồm thuế VAT)
        </span>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2 pt-2">
        <Button
          variant="primary"
          size="md"
          disabled={!canProceed}
          onClick={onNextStep}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full shadow-lg shadow-red-600/30"
        >
          {nextButtonText}
        </Button>

        <div className="flex items-center justify-between gap-2">
          {currentStep !== 'seat' ? (
            <button
              type="button"
              onClick={onPrevStep}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors py-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onCancelBooking}
            className="text-xs font-semibold text-rose-500/80 hover:text-rose-500 transition-colors py-1 cursor-pointer"
          >
            Hủy đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};


