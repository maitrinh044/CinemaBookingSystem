import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  Calendar,
  Sparkles,
  Layers,
  Volume2,
  Tv,
  Wine
} from 'lucide-react';
import { MOCK_CINEMAS } from '../../data/mockData';

export interface CinemasPageProps {
  onNavigateToShowtimes: () => void;
}

// Enhanced cinema data with photos, hotline, and facilities
const CINEMA_DETAILS: Record<string, {
  image: string;
  phone: string;
  hours: string;
  screens: number;
  totalSeats: number;
  facilities: string[];
  googleMapsQuery: string;
}> = {
  'cineglow-l81': {
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    phone: '1900 6868 (Ext 101)',
    hours: '08:00 - 02:00 hàng ngày',
    screens: 8,
    totalSeats: 1450,
    facilities: ['Màn Chiếu IMAX Laser 28m', 'Phòng Chờ VIP Lounge', 'Bãi Đỗ Xe Ô Tô Tầng Hầm B1', 'Quầy Bar Cocktail'],
    googleMapsQuery: 'Vincom Center Landmark 81 Bình Thạnh',
  },
  'cineglow-dongkhoi': {
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    phone: '1900 6868 (Ext 102)',
    hours: '08:30 - 01:30 hàng ngày',
    screens: 6,
    totalSeats: 980,
    facilities: ['Phòng Chiếu Gold Class Riêng Biệt', 'Âm Thanh Dolby Atmos 360', 'Ghế Sofa Chỉnh Điện', 'Phục Vụ Rượu Vang'],
    googleMapsQuery: 'Vincom Center Đồng Khởi Quận 1',
  },
  'cineglow-hanoi': {
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&auto=format&fit=crop&q=80',
    phone: '1900 6868 (Ext 103)',
    hours: '08:00 - 01:00 hàng ngày',
    screens: 10,
    totalSeats: 1820,
    facilities: ['Phòng Chiếu IMAX Laser Chuẩn Quốc Tế', 'Ghế Đôi Sweetbox Cao Cấp', 'Thang Máy Trực Tiếp', 'Quầy Concessions Tự Động'],
    googleMapsQuery: 'Lotte Mall West Lake Tây Hồ Hà Nội',
  },
  'cineglow-danang': {
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&auto=format&fit=crop&q=80',
    phone: '1900 6868 (Ext 104)',
    hours: '08:30 - 00:30 hàng ngày',
    screens: 5,
    totalSeats: 760,
    facilities: ['Tầm Nhìn Hướng Sông Hàn', 'Phòng Chiếu 3D RealD', 'Ghế Da Nhập Khẩu', 'Khu Vực Chụp Ảnh Check-in'],
    googleMapsQuery: 'Vincom Plaza Ngô Quyền Đà Nẵng',
  },
};

export const CinemasPage: React.FC<CinemasPageProps> = ({
  onNavigateToShowtimes,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredCinemas = MOCK_CINEMAS.filter((c) => {
    if (selectedCity === 'all') return true;
    return c.cityId === selectedCity;
  });

  const cityTabs = [
    { id: 'all', label: 'Tất Cả Cụm Rạp' },
    { id: 'hcm', label: 'TP. Hồ Chí Minh' },
    { id: 'hn', label: 'Hà Nội' },
    { id: 'dn', label: 'Đà Nẵng' },
  ];

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto text-left">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-color)] p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/80 to-transparent z-0" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold border border-[var(--primary)]/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hệ Thống Rạp Toàn Quốc</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            Cụm Rạp CineGlow Cinema
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-sub)]">
            Trải nghiệm không gian điện ảnh thượng lưu chuẩn Hollywood với hệ thống phòng chiếu hiện đại bậc nhất tại Việt Nam.
          </p>
        </div>
      </div>

      {/* 2. City Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
        {cityTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCity(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap border ${
              selectedCity === tab.id
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-red-600/30'
                : 'bg-[var(--surface-hover)] text-[var(--text-sub)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Cinema Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCinemas.map((cinema) => {
          const detail = CINEMA_DETAILS[cinema.id] || {
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
            phone: '1900 6868',
            hours: '08:00 - 01:00 hàng ngày',
            screens: 6,
            totalSeats: 1000,
            facilities: ['Ghế Da Cao Cấp', 'Âm Thanh Dolby Atmos', 'Bãi Xe Tiện Lợi'],
            googleMapsQuery: cinema.address,
          };

          return (
            <div
              key={cinema.id}
              className="glass-panel rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl flex flex-col justify-between group hover:border-[var(--primary)]/40 transition-all duration-300"
            >
              {/* Cinema Image Thumbnail */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={detail.image}
                  alt={cinema.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {cinema.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/20"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--primary)]">
                    {cinema.cityName}
                  </span>
                  <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                    {detail.screens} Phòng Chiếu • {detail.totalSeats} Ghế
                  </span>
                </div>
              </div>

              {/* Cinema Info */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                    {cinema.name}
                  </h2>

                  <div className="space-y-1.5 text-xs text-[var(--text-sub)]">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                      <span>{cinema.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <span>Hotline: {detail.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--text-sub)] shrink-0" />
                      <span>Giờ mở cửa: {detail.hours}</span>
                    </div>
                  </div>

                  {/* Facilities Badges */}
                  <div className="pt-2 border-t border-[var(--border-color)]">
                    <div className="text-[11px] font-bold text-[var(--text-sub)] mb-2">Tiện ích nổi bật:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-lg text-[10px] font-medium bg-[var(--surface-hover)] text-[var(--text-main)] border border-[var(--border-color)]"
                        >
                          ✓ {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--border-color)]">
                  <button
                    onClick={onNavigateToShowtimes}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:brightness-110 shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Xem Lịch Chiếu</span>
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.googleMapsQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-slate-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>Chỉ Đường Bản Đồ</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Cinematic Technologies Showcase */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Công Nghệ Trình Chiếu Độc Quyền</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[var(--text-main)]">
            Đỉnh Cao Trải Nghiệm Nghe Nhìn
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-main)]">IMAX with Laser</h4>
            <p className="text-[11px] text-[var(--text-sub)]">
              Màn hình cong khổng lồ 28m với độ phân giải siêu nét 4K cùng dải màu sâu thẳm, gấp 3 lần độ sáng rạp thông thường.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-main)]">Dolby Atmos 360°</h4>
            <p className="text-[11px] text-[var(--text-sub)]">
              Hệ thống loa vòm đa hướng trên trần và xung quanh rạp, cho âm thanh di chuyển chính xác từng miligiây trong không gian.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Wine className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-main)]">Gold Class VIP Suite</h4>
            <p className="text-[11px] text-[var(--text-sub)]">
              Ghế da bọc nệm chỉnh điện không trọng lực, chăn ấm, phục vụ rượu vang vang đỏ và thực đơn canapé ngay tại vị trí ngồi.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[var(--text-main)]">4DX All-Sensory</h4>
            <p className="text-[11px] text-[var(--text-sub)]">
              Ghế chuyển động 3 chiều đồng bộ hành động phim, tích hợp các hiệu ứng sương mù, cuồng phong, mưa rào và hương thơm thực tế.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
