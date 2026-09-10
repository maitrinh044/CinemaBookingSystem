import React, { useState } from 'react';
import { 
  User, 
  Ticket, 
  Gift, 
  Sparkles, 
  QrCode, 
  Calendar, 
  MapPin, 
  Armchair, 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Phone,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { CompletedBooking } from '../../types/booking';
import { ETicketCard } from '../../components/ticket/ETicketCard';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { downloadTicketImage } from '../../utils/ticketExporter';
import { PosterImage } from '../../components/common/PosterImage';

export interface ProfilePageProps {
  initialTab?: 'tickets' | 'info' | 'rewards';
  onBackToHome: () => void;
  onBookMore: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  initialTab = 'tickets',
  onBackToHome,
  onBookMore,
}) => {
  const { user, userBookings, updateUserProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'tickets' | 'info' | 'rewards'>(initialTab);
  const [ticketFilter, setTicketFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [viewingTicket, setViewingTicket] = useState<CompletedBooking | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(user?.name || 'Nguyễn Mai Trinh');
  const [editPhone, setEditPhone] = useState(user?.phone || '0988 668 886');
  const [editEmail, setEditEmail] = useState(user?.email || 'maitrinh@cineglow.vn');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      phone: editPhone,
      email: editEmail,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Filter bookings
  const filteredBookings = userBookings.filter((b) => {
    if (ticketFilter === 'all') return true;
    if (ticketFilter === 'upcoming') {
      return b.bookingCode === 'CG-918234' || b.bookingCode.startsWith('CG-');
    }
    if (ticketFilter === 'past') {
      return b.bookingCode === 'CG-452189';
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto px-4 sm:px-6 text-left">
      {/* Back to Home Button */}
      <div>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-sub)] hover:text-[var(--primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>
      </div>

      {/* 1. Member Profile Banner */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-[var(--border-color)] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with VIP border */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-[var(--gold)]/40 shadow-xl shadow-amber-500/10">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User Avatar'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[var(--gold)] text-black text-[10px] font-black uppercase tracking-wider shadow">
              {user?.membership || 'VIP'}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--text-main)]">
                {user?.name || 'Nguyễn Mai Trinh'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30">
                Thành Viên {user?.membership || 'VIP'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-sub)]">
              {user?.email || 'maitrinh@cineglow.vn'} • {user?.phone || '0988 668 886'}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
              <span className="text-[var(--text-sub)]">Điểm tích lũy:</span>
              <span className="font-mono font-black text-[var(--gold)] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                {user?.points || 850} CinePoint
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            className="text-xs text-rose-500 border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500"
          >
            Đăng Xuất
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onBookMore}
            className="text-xs shadow-md shadow-red-600/30"
          >
            Đặt Vé Mới
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tickets'
              ? 'bg-[var(--primary)] text-white shadow-md shadow-red-600/30'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Vé Của Tôi ({userBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'info'
              ? 'bg-[var(--primary)] text-white shadow-md shadow-red-600/30'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Thông Tin Cá Nhân</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rewards'
              ? 'bg-[var(--primary)] text-white shadow-md shadow-red-600/30'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Điểm Thưởng & Đặc Quyền</span>
        </button>
      </div>

      {/* TAB 1: TICKETS HISTORY */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* Sub-filter pills */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTicketFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  ticketFilter === 'all'
                    ? 'bg-[var(--surface-hover)] text-[var(--text-main)] border border-[var(--border-color)]'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                Tất cả ({userBookings.length})
              </button>
              <button
                onClick={() => setTicketFilter('upcoming')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  ticketFilter === 'upcoming'
                    ? 'bg-[var(--surface-hover)] text-[var(--text-main)] border border-[var(--border-color)]'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                Sắp chiếu
              </button>
              <button
                onClick={() => setTicketFilter('past')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  ticketFilter === 'past'
                    ? 'bg-[var(--surface-hover)] text-[var(--text-main)] border border-[var(--border-color)]'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                Đã xem
              </button>
            </div>

            <span className="text-[11px] text-[var(--text-sub)] hidden sm:block">
              Nhấn "Xem Vé QR" để xuất trình khi vào rạp
            </span>
          </div>

          {/* Ticket Cards Grid */}
          {filteredBookings.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-[var(--border-color)] text-center space-y-3">
              <Ticket className="w-12 h-12 text-[var(--text-sub)] mx-auto opacity-40" />
              <h3 className="text-base font-bold text-[var(--text-main)]">Chưa có vé nào</h3>
              <p className="text-xs text-[var(--text-sub)] max-w-sm mx-auto">
                Bạn chưa có đơn đặt vé nào trong danh mục này. Hãy khám phá các bom tấn mới nhất ngay hôm nay!
              </p>
              <Button variant="primary" size="sm" onClick={onBookMore}>
                Khám Phá Phim Ngay
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((b) => {
                const isPast = b.bookingCode === 'CG-452189';

                return (
                  <div
                    key={b.bookingCode}
                    className="glass-panel p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] hover:border-slate-500 transition-all duration-200 shadow-md flex flex-col justify-between space-y-4"
                  >
                    {/* Top Row: Movie Poster & Details */}
                    <div className="flex items-start gap-3.5">
                      <PosterImage
                  src={b.movie.poster}
                        alt={b.movie.title}
                        className="w-16 h-24 rounded-xl object-cover shadow shrink-0 border border-white/10"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[var(--primary)] text-white">
                              {b.showtime.format}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-sub)] border border-[var(--border-color)]">
                              {b.movie.ageRating}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPast 
                              ? 'bg-slate-700/30 text-[var(--text-sub)]' 
                              : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}>
                            {isPast ? 'Đã xem' : 'Sắp chiếu'}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)] truncate">
                          {b.movie.title}
                        </h3>

                        <div className="space-y-0.5 text-xs text-[var(--text-sub)]">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                            <span className="truncate">{b.cinema.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                            <span>{b.showtime.time} • {b.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                            <Armchair className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                            <span>Ghế: {b.seats.map((s) => s.id).join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Code, Price & View QR Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs">
                      <div>
                        <span className="text-[10px] text-[var(--text-sub)] block">Mã vé:</span>
                        <span className="font-mono font-black text-sm text-[var(--primary)]">
                          {b.bookingCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--text-main)]">
                          {b.finalTotal.toLocaleString('vi-VN')} đ
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<QrCode className="w-3.5 h-3.5" />}
                          onClick={() => setViewingTicket(b)}
                          className="text-xs shadow-sm shadow-red-600/30"
                        >
                          Xem Vé QR
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROFILE INFO EDIT */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] max-w-2xl space-y-6">
          <div className="border-b border-[var(--border-color)] pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
              Cập Nhật Thông Tin Tài Khoản
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Thông tin này sẽ được tự động sử dụng khi đặt vé xem phim tại CineGlow
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Cập nhật thông tin tài khoản thành công!</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-sub)]">Họ và tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-sub)]">Số điện thoại</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-sub)]">Email nhận vé</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                </div>
              </div>
            </div>

            {/* Change Password (Optional) */}
            <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
              <h3 className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--text-sub)]" />
                <span>Đổi Mật Khẩu (Tùy chọn)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-sub)]">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-sub)]">Mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
              className="shadow-md shadow-red-600/30"
            >
              Lưu Thông Tin
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: REWARDS & PRIVILEGES */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Points Card */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-color)] space-y-4 md:col-span-1 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-7 h-7 fill-current" />
            </div>
            <div>
              <span className="text-xs text-[var(--text-sub)] block uppercase font-bold tracking-wider">
                Điểm Khả Dụng
              </span>
              <div className="text-3xl font-black text-[var(--gold)] mt-1">
                {user?.points || 850}
              </div>
              <span className="text-[11px] text-[var(--text-sub)] mt-1 block">
                Cần thêm 150 điểm để nâng hạng Diamond
              </span>
            </div>

            {/* Progress bar to Diamond */}
            <div className="w-full bg-[var(--surface-hover)] rounded-full h-2 overflow-hidden border border-[var(--border-color)]">
              <div className="bg-[var(--gold)] h-full rounded-full" style={{ width: '85%' }} />
            </div>

            <Button variant="secondary" size="sm" onClick={onBookMore} className="w-full text-xs">
              Tích Thêm Điểm (+10% Mỗi Vé)
            </Button>
          </div>

          {/* Privileges List */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-color)] space-y-4 md:col-span-2">
            <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Gift className="w-4 h-4 text-[var(--gold)]" />
              <span>Đặc Quyền Thành Viên {user?.membership || 'VIP'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-1">
                <div className="font-bold text-[var(--text-main)]">🍿 Giảm 10% Bắp Nước</div>
                <div className="text-[11px] text-[var(--text-sub)]">Áp dụng cho mọi combo tại quầy Concessions.</div>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-1">
                <div className="font-bold text-[var(--text-main)]">🎂 Quà Tặng Sinh Nhật</div>
                <div className="text-[11px] text-[var(--text-sub)]">Tặng 1 vé xem phim 2D miễn phí trong tháng sinh nhật.</div>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-1">
                <div className="font-bold text-[var(--text-main)]">⚡ Lối Đi Ưu Tiên VIP</div>
                <div className="text-[11px] text-[var(--text-sub)]">Check-in nhanh không cần xếp hàng tại quầy vé rạp.</div>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-1">
                <div className="font-bold text-[var(--text-main)]">🎟️ Đổi Điểm Lấy Vé</div>
                <div className="text-[11px] text-[var(--text-sub)]">Cứ 100 CinePoint đổi được 1 vé xem phim 2D bất kỳ.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal to View Full E-Ticket with Live QR */}
      {viewingTicket && (
        <Modal
          isOpen={true}
          onClose={() => setViewingTicket(null)}
          title={`Chi Tiết Vé Điện Tử - ${viewingTicket.bookingCode}`}
          size="md"
        >
          <div className="py-2 space-y-4">
            <ETicketCard booking={viewingTicket} />
            <div className="flex justify-center pt-2">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => downloadTicketImage(viewingTicket)}
                className="shadow-lg shadow-red-600/30"
              >
                Tải Ảnh Vé Về Máy (.PNG)
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


