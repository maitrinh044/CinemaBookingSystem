import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Armchair, 
  Popcorn, 
  CheckCircle2, 
  Film 
} from 'lucide-react';
import type { CompletedBooking } from '../../types/booking';
import { QRCodeView } from './QRCodeView';
import { BarcodeView } from './BarcodeView';
import { PosterImage } from '../common/PosterImage';

export interface ETicketCardProps {
  booking: CompletedBooking;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export const ETicketCard: React.FC<ETicketCardProps> = ({ booking, cardRef }) => {
  const { movie, cinema, date, showtime, seats, concessions, customerInfo, bookingCode, finalTotal } = booking;

  return (
    <div
      ref={cardRef}
      className="relative max-w-md mx-auto rounded-3xl overflow-hidden glass-panel border border-[var(--border-color)] shadow-2xl transition-all duration-300 print:border-black print:shadow-none"
    >
      {/* 1. Ticket Top Section */}
      <div className="relative p-6 sm:p-7 space-y-5 text-left">
        {/* Subtle Movie Backdrop Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-lg pointer-events-none"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />

        {/* Top Header: Brand & Status */}
        <div className="relative z-10 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-[var(--logo-text)]">
              CineGlow
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--primary)] text-white">
              E-TICKET
            </span>
          </div>

          <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ĐÃ THANH TOÁN</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="relative z-10 flex items-start gap-4">
          <PosterImage
                  src={movie.poster}
            alt={movie.title}
            className="w-20 h-28 rounded-xl object-cover shadow-md shrink-0 border border-white/10"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[var(--primary)] text-white">
                {showtime.format}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-sub)] border border-[var(--border-color)]">
                {movie.ageRating}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)] tracking-tight leading-tight line-clamp-2">
              {movie.title}
            </h2>
            <p className="text-xs text-[var(--text-sub)] truncate">
              {movie.originalTitle}
            </p>
            <p className="text-[11px] text-[var(--text-sub)]">
              Thời lượng: <b>{movie.duration} phút</b>
            </p>
          </div>
        </div>

        {/* Screening Specs Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[var(--surface-hover)]/70 border border-[var(--border-color)] text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[var(--text-sub)] text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Ngày chiếu</span>
            </div>
            <div className="font-bold text-[var(--text-main)]">{date}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[var(--text-sub)] text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Suất chiếu</span>
            </div>
            <div className="font-black text-sm text-[var(--primary)]">{showtime.time}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[var(--text-sub)] text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Rạp chiếu</span>
            </div>
            <div className="font-semibold text-[var(--text-main)] truncate">{cinema.name}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[var(--text-sub)] text-[11px]">
              <Film className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Phòng chiếu</span>
            </div>
            <div className="font-bold text-[var(--text-main)]">{showtime.hallName}</div>
          </div>
        </div>

        {/* Seat Numbers Highlight */}
        <div className="relative z-10 p-3.5 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
              <Armchair className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--primary)]">
                Vị Trí Ghế Ngồi ({seats.length} ghế)
              </div>
              <div className="text-base sm:text-lg font-black text-[var(--text-main)] tracking-tight">
                {seats.map((s) => s.id).join(', ')}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text-sub)] border border-[var(--border-color)]">
            {seats[0]?.type.toUpperCase()}
          </span>
        </div>

        {/* Concessions Summary (if any) */}
        {concessions.length > 0 && (
          <div className="relative z-10 p-3 rounded-xl bg-[var(--surface-hover)]/40 border border-[var(--border-color)] flex items-start gap-2.5 text-xs">
            <Popcorn className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                Bắp nước kèm theo:
              </div>
              <div className="text-[11px] text-[var(--text-main)] mt-0.5 space-y-0.5">
                {concessions.map((c) => (
                  <div key={c.item.id} className="flex justify-between">
                    <span className="truncate">{c.item.name} x{c.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Perforated Tear Line with Half-Circle Cutouts */}
      <div className="relative flex items-center justify-center my-0 select-none">
        {/* Left Semi-Circle Cutout */}
        <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] shadow-inner z-20" />

        {/* Dashed Line */}
        <div className="w-full border-t-2 border-dashed border-[var(--border-color)] z-10 mx-6" />

        {/* Right Semi-Circle Cutout */}
        <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] shadow-inner z-20" />
      </div>

      {/* 3. Ticket Stub (Bottom QR & Barcode Section) */}
      <div className="p-6 sm:p-7 space-y-4 text-center bg-[var(--surface-hover)]/30">
        {/* Booking Code & Customer Name */}
        <div className="flex items-center justify-between text-xs px-2">
          <div className="text-left">
            <span className="text-[10px] text-[var(--text-sub)] uppercase tracking-wider block">Khách hàng</span>
            <span className="font-bold text-[var(--text-main)]">{customerInfo.fullName}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[var(--text-sub)] uppercase tracking-wider block">Mã đặt vé</span>
            <span className="font-mono text-sm font-black text-[var(--primary)]">{bookingCode}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="py-2 flex flex-col items-center justify-center">
          <QRCodeView value={`CINEGLOW:${bookingCode}:${seats.map(s => s.id).join(',')}`} size={140} />
          <p className="text-[10px] text-[var(--text-sub)] mt-2">
            Quét mã QR tại cổng soát vé tự động hoặc quầy check-in
          </p>
        </div>

        {/* Barcode */}
        <div className="pt-2 border-t border-[var(--border-color)]">
          <BarcodeView code={bookingCode} />
        </div>

        {/* Total Price */}
        <div className="pt-2 flex items-center justify-between text-xs text-[var(--text-sub)] border-t border-[var(--border-color)] px-2">
          <span>Tổng tiền đã thanh toán:</span>
          <span className="text-sm font-black text-[var(--primary)]">
            {finalTotal.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </div>
    </div>
  );
};


