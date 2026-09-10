import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Tv,
  Volume2,
  Armchair,
  CheckCircle2,
  ArrowRight,
  Compass
} from 'lucide-react';
import type { Movie, CinemaBranch, ShowtimeSlot } from '../../types/movie';
import { MOCK_MOVIES, MOCK_CINEMAS, MOCK_SHOWTIMES } from '../../data/mockData';
import { movieService } from '../../services/movieService';
import { HeroSlider } from '../../components/movie/HeroSlider';
import { QuickBooking } from '../../components/movie/QuickBooking';
import { MovieGrid } from '../../components/movie/MovieGrid';
import { PromoBanners } from '../../components/movie/PromoBanners';
import { TrailerModal } from '../../components/movie/TrailerModal';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { PosterImage } from '../../components/common/PosterImage';

export interface HomePageProps {
  onSelectMovieForBooking?: (movie: Movie) => void;
  onProceedToBooking?: (booking: {
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
  }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectMovieForBooking,
  onProceedToBooking,
}) => {
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
  const [activeTrailer, setActiveTrailer] = useState<{ title: string; url: string } | null>(null);
  const [quickBookingSuccess, setQuickBookingSuccess] = useState<{
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    movieService.getMovies()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setMovies(data);
        }
      })
      .catch((err) => {
        console.warn('Backend movies load failed, fallback to mock data', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleBookMovie = (movie: Movie) => {
    if (onSelectMovieForBooking) {
      onSelectMovieForBooking(movie);
    } else {
      alert(`Đã chọn phim: "${movie.title}". Sẵn sàng chuyển sang Bước 4 (Chi tiết phim & Lịch chiếu)!`);
    }
  };

  const handleWatchTrailer = (movie: Movie) => {
    setActiveTrailer({
      title: movie.title,
      url: movie.trailerUrl,
    });
  };

  const handleQuickBooking = (data: {
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
  }) => {
    setQuickBookingSuccess(data);
  };

  return (
    <div className="space-y-4">
      {/* 1. Hero Banner Slider */}
      <HeroSlider
        movies={movies}
        onBookMovie={handleBookMovie}
        onWatchTrailer={handleWatchTrailer}
      />

      {/* 2. Quick Booking Bar (Đặt vé nhanh 4 bước) */}
      <QuickBooking
        movies={movies}
        cinemas={MOCK_CINEMAS}
        showtimes={MOCK_SHOWTIMES}
        onConfirmBooking={handleQuickBooking}
      />

      {/* 3. Movie Grid with Status Tabs & Genre Filters */}
      <MovieGrid
        movies={movies}
        onSelectMovie={handleBookMovie}
        onWatchTrailer={handleWatchTrailer}
      />

      {/* 4. Promotional Banners */}
      <PromoBanners />

      {/* 5. Cinema Experience Showcase */}
      <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-[var(--border-color)] mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-5 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Công Nghệ Rạp Chiếu Hàng Đầu</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)] tracking-tight">
            Trải Nghiệm Điện Ảnh Đỉnh Cao Tại CineGlow
          </h2>
          <p className="text-xs text-[var(--text-sub)] mt-1 leading-relaxed">
            Hệ thống phòng chiếu được trang bị những tiêu chuẩn kỹ thuật nghe nhìn khắt khe nhất thế giới, mang đến cho bạn từng phút giây đắm chìm trọn vẹn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Tv className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">IMAX Laser 4K</h3>
            <p className="text-[11px] text-[var(--text-sub)] leading-relaxed">
              Độ phân giải siêu nét, màu sắc rực rỡ và màn hình uốn cong mở rộng góc nhìn tối đa.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">Dolby Atmos</h3>
            <p className="text-[11px] text-[var(--text-sub)] leading-relaxed">
              Âm thanh vòm 360 độ sống động di chuyển xung quanh khán phòng rạp chiếu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">4DX Motion Effects</h3>
            <p className="text-[11px] text-[var(--text-sub)] leading-relaxed">
              Ghế rung chuyển kết hợp hiệu ứng gió, nước, ánh sáng và mùi hương chân thực.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Armchair className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">VIP Gold Class</h3>
            <p className="text-[11px] text-[var(--text-sub)] leading-relaxed">
              Ghế da sofa ngả điện cao cấp kèm chăn ấm, menu phục vụ tận nơi và phòng chờ riêng.
            </p>
          </div>
        </div>
      </div>

      {/* Trailer Video Player Modal */}
      {activeTrailer && (
        <TrailerModal
          isOpen={Boolean(activeTrailer)}
          onClose={() => setActiveTrailer(null)}
          title={activeTrailer.title}
          trailerUrl={activeTrailer.url}
        />
      )}

      {/* Quick Booking Success Confirmation Modal */}
      {quickBookingSuccess && (
        <Modal
          isOpen={Boolean(quickBookingSuccess)}
          onClose={() => setQuickBookingSuccess(null)}
          size="md"
          title={
            <div className="flex items-center gap-2 text-emerald-500 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Xác Nhận Đặt Vé Nhanh</span>
            </div>
          }
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" onClick={() => setQuickBookingSuccess(null)}>
                Hủy / Đổi lại
              </Button>
              <Button
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  if (onProceedToBooking && quickBookingSuccess) {
                    onProceedToBooking(quickBookingSuccess);
                  }
                  setQuickBookingSuccess(null);
                }}
              >
                Tiếp Tục Chọn Ghế
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-sm">
            <div className="flex gap-3 p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)]">
              <PosterImage
                  src={quickBookingSuccess.movie.poster}
                alt={quickBookingSuccess.movie.title}
                className="w-14 h-20 rounded-lg object-cover"
              />
              <div className="space-y-1">
                <div className="font-bold text-[var(--text-main)] text-base">{quickBookingSuccess.movie.title}</div>
                <div className="text-xs text-[var(--text-sub)]">{quickBookingSuccess.cinema.name}</div>
                <div className="text-xs text-[var(--primary)] font-bold">
                  {quickBookingSuccess.showtime.time} • {quickBookingSuccess.showtime.format} • {quickBookingSuccess.showtime.hallName}
                </div>
              </div>
            </div>
            <div className="text-xs text-[var(--text-sub)]">
              Giá vé: <b>{quickBookingSuccess.showtime.price.toLocaleString('vi-VN')} đ</b>/vé • Còn trống <b>{quickBookingSuccess.showtime.availableSeats}</b> ghế.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


