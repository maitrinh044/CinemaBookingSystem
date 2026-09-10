import React, { useRef, useState } from 'react';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  Printer, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Info,
  ShieldCheck,
  Check
} from 'lucide-react';
import type { CompletedBooking } from '../../types/booking';
import { ETicketCard } from '../../components/ticket/ETicketCard';
import { Button } from '../../components/common/Button';
import { downloadTicketImage } from '../../utils/ticketExporter';
import { useToast } from '../../contexts/ToastContext';

export interface TicketSuccessPageProps {
  booking: CompletedBooking;
  onBackToHome: () => void;
}

export const TicketSuccessPage: React.FC<TicketSuccessPageProps> = ({
  booking,
  onBackToHome,
}) => {
  const { toast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    toast.info('In vé xem phim', 'Đang mở hộp thoại in vé...');
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Vé xem phim ${booking.movie.title} tại ${booking.cinema.name} - Suất ${booking.showtime.time} ngày ${booking.date}. Mã vé: ${booking.bookingCode}`
      );
      setCopied(true);
      toast.success('Đã sao chép mã vé!', `Mã đặt vé: ${booking.bookingCode} đã lưu vào bộ nhớ tạm.`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      toast.info('Đang xuất vé điện tử', 'Hệ thống đang khởi tạo hình ảnh vé chất lượng cao...');
      await downloadTicketImage(booking);
      setDownloaded(true);
      toast.success('Tải vé thành công!', `Ảnh vé ${booking.bookingCode}.png đã sẵn sàng.`);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Lỗi khi xuất ảnh vé:', err);
      toast.error('Lỗi xuất vé', 'Không thể tạo ảnh vé tự động. Bạn có thể chụp màn hình hoặc dùng tính năng In vé.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      {/* 1. Congratulatory Banner */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
            Giao Dịch Đã Hoàn Tất
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tight mt-1">
            Đặt Vé Thành Công!
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-sub)] max-w-md mx-auto mt-1.5">
            Cảm ơn bạn đã lựa chọn CineGlow. Thông tin vé và hóa đơn điện tử đã được gửi tự động tới <b>{booking.customerInfo.email}</b>.
          </p>
        </div>
      </div>

      {/* 2. The Perforated E-Ticket Card */}
      <div className="py-2">
        <ETicketCard booking={booking} cardRef={ticketRef} />
      </div>

      {/* 3. Action Buttons Bar */}
      <div className="max-w-md mx-auto flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          leftIcon={downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 shadow-lg shadow-red-600/30"
        >
          {isExporting ? 'Đang Tạo Ảnh...' : downloaded ? 'Đã Lưu Vé .PNG' : 'Tải Vé Điện Tử (.PNG)'}
        </Button>

        <Button
          variant="secondary"
          size="md"
          leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          onClick={handleShare}
          className="flex-1"
        >
          {copied ? 'Đã Sao Chép!' : 'Chia Sẻ Vé'}
        </Button>

        <button
          onClick={handlePrint}
          className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          title="In vé"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {/* 4. Cinema Guidelines & Tips Box */}
      <div className="max-w-xl mx-auto glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border-color)] text-left space-y-3.5">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
          <Info className="w-4 h-4 text-[var(--primary)]" />
          <span>Hướng Dẫn & Lưu Ý Khi Đến Rạp CineGlow</span>
        </div>

        <ul className="space-y-2 text-xs text-[var(--text-sub)] leading-relaxed">
          <li className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
            <span>Vui lòng đến rạp trước giờ chiếu từ <b>15 - 20 phút</b> để thong thả check-in và nhận bắp nước.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>Bạn có thể <b>quét trực tiếp mã QR</b> trên màn hình điện thoại tại cổng soát vé tự động mà không cần in vé giấy.</span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <span>Phim có phân loại độ tuổi <b>{booking.movie.ageRating}</b>. Nhân viên có thể yêu cầu xuất trình CCCD/VNeID trước khi vào phòng chiếu.</span>
          </li>
        </ul>
      </div>

      {/* 5. Back to Home Navigation */}
      <div className="text-center pt-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-sub)] hover:text-[var(--primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ đặt vé khác</span>
        </button>
      </div>
    </div>
  );
};
