import React from 'react';
import { Clapperboard, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export interface FooterProps {
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-main)] transition-colors duration-300">
      {/* Top Footer: Brand, Links & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => onNavigate?.('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--logo-icon)] flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <Clapperboard className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[var(--logo-text)] transition-colors">
                  CineGlow
                </span>
              </div>
            </div>
            <p className="text-sm text-[var(--text-sub)] max-w-sm leading-relaxed text-left">
              Hệ thống cụm rạp chiếu phim chuẩn quốc tế với trải nghiệm hình ảnh IMAX Laser, âm thanh vòm Dolby Atmos đỉnh cao và dịch vụ đặt vé trực tuyến siêu tốc.
            </p>

            <div className="space-y-2 text-xs text-[var(--text-sub)] pt-2 text-left">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span>Tầng 8, Tòa nhà CineGlow Tower, Q.1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span>Hotline: <b className="text-[var(--text-main)]">1900 6886</b> (8:00 - 22:00 tất cả các ngày)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span>Email hỗ trợ: support@cineglow.vn</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-sub)] hover:text-blue-500 hover:border-blue-500 transition-colors" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-sub)] hover:text-red-500 hover:border-red-500 transition-colors" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-sub)] hover:text-pink-500 hover:border-pink-500 transition-colors" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Về CineGlow */}
          <div className="text-left">
            <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-4">
              Về CineGlow
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-sub)]">
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Giới thiệu rạp</button></li>
              <li><button onClick={() => onNavigate?.('cinemas')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Hệ thống cụm rạp</button></li>
              <li><button onClick={() => onNavigate?.('showtimes')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Trải nghiệm IMAX Laser</button></li>
              <li><button onClick={() => onNavigate?.('movies')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Kho phim rạp mới nhất</button></li>
              <li><button onClick={() => onNavigate?.('promotions')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Ưu đãi & Khuyến mãi</button></li>
            </ul>
          </div>

          {/* Col 3: Quy định & Chính sách */}
          <div className="text-left">
            <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-4">
              Chính Sách & Dịch Vụ
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-sub)]">
              <li><button onClick={() => onNavigate?.('concessions')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Menu Bắp Nước Cinema</button></li>
              <li><button onClick={() => onNavigate?.('showtimes')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Lịch chiếu toàn quốc</button></li>
              <li><button onClick={() => onNavigate?.('profile')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Tra cứu vé đã đặt</button></li>
              <li><button onClick={() => onNavigate?.('promotions')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">Chính sách thành viên VIP</button></li>
              <li><span className="text-[var(--text-sub)]">Hotline phản ánh: 1900 6886</span></li>
            </ul>
          </div>

          {/* Col 4: Đối tác & Thanh toán */}
          <div>
            <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-4">
              Phương Thức Thanh Toán
            </h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <span className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-hover)] text-center text-xs font-bold text-pink-500">MoMo</span>
              <span className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-hover)] text-center text-xs font-bold text-blue-500">ZaloPay</span>
              <span className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-hover)] text-center text-xs font-bold text-red-500">VNPay</span>
              <span className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-hover)] text-center text-xs font-bold text-blue-600">VISA</span>
              <span className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-hover)] text-center text-xs font-bold text-amber-500">Master</span>
              <span className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-hover)] text-center text-xs font-bold text-emerald-500">ATM</span>
            </div>

            <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)]/60 flex items-center gap-2.5 text-xs text-[var(--text-sub)]">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Giao dịch bảo mật chuẩn mã hóa SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[var(--border-color)] py-6 text-center text-xs text-[var(--text-sub)] px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 CineGlow Entertainment Cinema JSC. Tất cả quyền được bảo lưu.</span>
          <span className="text-[11px]">Giấy phép kinh doanh số 0102938475 cấp bởi Sở Kế hoạch & Đầu tư TP.HCM</span>
        </div>
      </div>
    </footer>
  );
};
