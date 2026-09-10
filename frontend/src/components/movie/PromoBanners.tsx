import React from 'react';
import { Gift, Sparkles, Percent, Crown, ArrowRight } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  const promos = [
    {
      id: 'p1',
      title: 'Thứ Ba Vui Vẻ - Đồng Giá 50K',
      description: 'Áp dụng cho mọi suất chiếu 2D vào mỗi Thứ Ba hàng tuần tại tất cả cụm rạp CineGlow.',
      tag: 'HOT DEAL',
      icon: <Percent className="w-5 h-5" />,
      bgGradient: 'from-red-600/90 to-rose-700/90',
    },
    {
      id: 'p2',
      title: 'Thành Viên CineGlow VIP Club',
      description: 'Tích lũy 10% điểm thưởng, nhận bắp nước miễn phí vào ngày sinh nhật và ưu tiên chọn ghế.',
      tag: 'MEMBERSHIP',
      icon: <Crown className="w-5 h-5 text-amber-300" />,
      bgGradient: 'from-amber-600/90 to-yellow-700/90',
    },
    {
      id: 'p3',
      title: 'Đặc Quyền Phòng Chiếu IMAX Laser',
      description: 'Tận hưởng màn hình lớn gấp 3 lần, độ sáng vượt trội và hệ thống âm thanh vòm 12 kênh.',
      tag: 'PREMIUM',
      icon: <Sparkles className="w-5 h-5 text-cyan-300" />,
      bgGradient: 'from-blue-600/90 to-cyan-700/90',
    },
  ];

  return (
    <div className="space-y-4 mb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
            <Gift className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)] tracking-tight">
            Ưu Đãi & Sự Kiện Nổi Bật
          </h2>
        </div>
        <a href="#" className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="group relative rounded-xl overflow-hidden p-4 sm:p-4.5 border border-[var(--border-color)] bg-[var(--surface)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            {/* Ambient background glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${promo.bgGradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity`} />

            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--primary)]">
                  {promo.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--surface-hover)] text-[var(--text-sub)] border border-[var(--border-color)]">
                  {promo.tag}
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                {promo.title}
              </h3>
              <p className="text-xs text-[var(--text-sub)] leading-relaxed">
                {promo.description}
              </p>
            </div>

            <div className="relative pt-4 mt-2 border-t border-[var(--border-color)]">
              <span className="text-xs font-bold text-[var(--primary)] group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform cursor-pointer">
                <span>Chi tiết chương trình</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
