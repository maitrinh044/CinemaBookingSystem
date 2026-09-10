import React, { useState, useMemo, useRef } from 'react';
import { 
  Star, 
  Clock, 
  Calendar, 
  Play, 
  ArrowLeft, 
  MapPin, 
  Film, 
  Ticket,
  ChevronRight,
  Share2,
  Heart
} from 'lucide-react';
import type { Movie, CinemaBranch, ShowtimeSlot } from '../../types/movie';
import { MOCK_MOVIES, getUpcomingDates, getMovieShowtimesGrouped } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { DateSelector } from '../../components/showtime/DateSelector';
import { useParams, useNavigate } from 'react-router-dom';
import { ShowtimeList } from '../../components/showtime/ShowtimeList';
import { TrailerModal } from '../../components/movie/TrailerModal';
import { MovieCard } from '../../components/movie/MovieCard';
import { ReviewSection } from '../../components/review/ReviewSection';
import { PosterImage } from '../../components/common/PosterImage';

export interface MovieDetailPageProps {
  movie?: Movie | null;
  onBack?: () => void;
  onSelectMovie?: (movie: Movie) => void;
  onProceedToSeatSelection?: (booking: {
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
  }) => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
  movie: propMovie,
  onBack: propOnBack,
  onSelectMovie: propOnSelectMovie,
  onProceedToSeatSelection: propOnProceedToSeatSelection,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const movie = useMemo(() => {
    if (propMovie) return propMovie;
    if (id) {
      return MOCK_MOVIES.find((m) => m.id === id) || null;
    }
    return null;
  }, [propMovie, id]);

  const onBack = propOnBack || (() => navigate(-1));
  const onSelectMovie = propOnSelectMovie || ((m: Movie) => navigate(`/movie/${m.id}`));
  const onProceedToSeatSelection = propOnProceedToSeatSelection || ((booking) => {
    navigate('/booking', { state: booking });
  });

  const dates = useMemo(() => getUpcomingDates(), []);
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]?.dateStr || '');
  const [selectedCityId, setSelectedCityId] = useState<string>(''); // empty means all
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Selected showtime & cinema for booking
  const [selectedShowtimeData, setSelectedShowtimeData] = useState<{
    slot: ShowtimeSlot;
    cinema: CinemaBranch;
  } | null>(null);

  const showtimesRef = useRef<HTMLDivElement>(null);

  // Grouped showtimes for this movie, date, and city
  const cinemaGroups = useMemo(() => {
    if (!movie) return [];
    return getMovieShowtimesGrouped(movie.id, selectedDate, selectedCityId || undefined);
  }, [movie, selectedDate, selectedCityId]);

  // Similar movies
  const similarMovies = useMemo(() => {
    if (!movie) return [];
    return MOCK_MOVIES.filter((m) => m.id !== movie.id).slice(0, 4);
  }, [movie]);

  const scrollToSchedule = () => {
    showtimesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectSlot = (slot: ShowtimeSlot, cinema: CinemaBranch) => {
    setSelectedShowtimeData({ slot, cinema });
  };

  const handleProceed = () => {
    if (selectedShowtimeData && movie) {
      onProceedToSeatSelection({
        movie,
        cinema: selectedShowtimeData.cinema,
        date: selectedDate,
        showtime: selectedShowtimeData.slot,
      });
    }
  };

  if (!movie) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-[var(--border-color)] text-center space-y-4 max-w-lg mx-auto my-16">
        <h2 className="text-xl font-bold text-[var(--text-main)]">Không tìm thấy bộ phim yêu cầu</h2>
        <p className="text-xs text-[var(--text-sub)]">
          Bộ phim này có thể đã hết thời hạn công chiếu hoặc liên kết của bạn không chính xác.
        </p>
        <button
          onClick={() => navigate('/movies')}
          className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:scale-105 transition-transform cursor-pointer"
        >
          Xem Danh Sách Phim Đang Chiếu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Back Navigation Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-sub)] hover:text-[var(--primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại danh sách phim</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] transition-colors cursor-pointer ${
              isLiked ? 'text-rose-500 border-rose-500/40 bg-rose-500/10' : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
            title="Thêm vào danh sách yêu thích"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => alert('Đã sao chép liên kết chia sẻ phim!')}
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            title="Chia sẻ phim"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Hero Movie Header */}
      <div className="relative rounded-2xl overflow-hidden glass-panel border border-[var(--border-color)] shadow-xl">
        {/* Blurred Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/90 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row gap-5 lg:gap-7 items-start">
          {/* Compact Poster with Play Trailer Button */}
          <div className="relative w-32 sm:w-40 lg:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-xl shrink-0 mx-auto md:mx-0 group border border-white/10">
            <PosterImage
                  src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg shadow-red-600/50 hover:scale-110 transition-transform cursor-pointer"
                title="Bấm để phát Trailer"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
            <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-bold text-white drop-shadow">
              Trailer
            </div>
          </div>

          {/* Movie Details */}
          <div className="flex-1 space-y-3.5 text-left w-full">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge ageRating={movie.ageRating} size="sm" />
              {movie.formats.map((fmt) => (
                <Badge key={fmt} format={fmt} size="sm" />
              ))}
              {movie.isHot && <Badge variant="primary" size="sm">BOM TẤN HOT</Badge>}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--text-main)] tracking-tight">
                {movie.title}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[var(--text-sub)] mt-0.5">
                {movie.originalTitle}
              </p>
            </div>

            {/* Quick Meta Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 py-2 border-y border-[var(--border-color)] text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-sm font-black">{movie.rating.toFixed(1)}</span>
                <span className="text-[11px] text-[var(--text-sub)] font-normal">
                  ({movie.voteCount.toLocaleString('vi-VN')})
                </span>
              </div>
              <div className="flex items-center gap-1 text-[var(--text-sub)]">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{movie.duration} phút</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--text-sub)]">
                <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Khởi chiếu: {movie.releaseDate}</span>
              </div>
            </div>

            {/* Info Grid: Director, Cast, Genres */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[var(--text-sub)]">Đạo diễn: </span>
                <span className="font-semibold text-[var(--text-main)]">{movie.director}</span>
              </div>
              <div>
                <span className="text-[var(--text-sub)]">Thể loại: </span>
                <span className="font-semibold text-[var(--text-main)]">{movie.genres.join(', ')}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[var(--text-sub)]">Diễn viên: </span>
                <span className="font-semibold text-[var(--text-main)]">{movie.cast.join(', ')}</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-1">
              <p className="text-xs text-[var(--text-sub)] line-clamp-2 leading-relaxed">
                {movie.synopsis}
              </p>
            </div>

            {/* CTA Button to Scroll to Showtimes */}
            <div className="pt-1">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Ticket className="w-4 h-4" />}
                onClick={scrollToSchedule}
                className="shadow-lg shadow-red-600/30"
              >
                Xem Lịch Chiếu & Đặt Vé
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Showtime Selector Section */}
      <div ref={showtimesRef} className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-black">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)] tracking-tight">
                Lịch Chiếu Phim: {movie.title}
              </h2>
              <p className="text-[11px] text-[var(--text-sub)]">
                Bấm chọn khung giờ để tiếp tục bước chọn vị trí ghế phòng vé
              </p>
            </div>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--text-sub)] font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
              Khu vực:
            </span>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 cursor-pointer"
            >
              <option value="">Tất Cả Cụm Rạp</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
              <option value="hn">Hà Nội</option>
              <option value="dn">Đà Nẵng</option>
            </select>
          </div>
        </div>

        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setSelectedShowtimeData(null);
          }}
        />

        {/* Grouped Showtimes List */}
        <ShowtimeList
          cinemaGroups={cinemaGroups}
          selectedShowtimeId={selectedShowtimeData?.slot.id}
          onSelectShowtime={handleSelectSlot}
        />
      </div>

      {/* 4. Customer Reviews & Ratings Section */}
      <ReviewSection
        movieId={movie.id}
        movieTitle={movie.title}
        officialRating={movie.rating}
        totalVotes={movie.voteCount}
      />

      {/* 5. Similar Movies Section */}
      <div className="space-y-6 text-left pt-6 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">
            Có Thể Bạn Cũng Thích
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {similarMovies.map((simMovie) => (
            <MovieCard
              key={simMovie.id}
              movie={simMovie}
              onSelectMovie={onSelectMovie}
              onWatchTrailer={() => setIsTrailerOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* Sticky Bottom Booking Bar (Shows when user clicks a showtime) */}
      {selectedShowtimeData && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--border-color)] p-4 shadow-2xl transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
              <div className="w-11 h-11 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/30">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[var(--text-sub)]">Suất chiếu đã chọn:</div>
                <div className="text-sm sm:text-base font-black text-[var(--text-main)] flex items-center gap-2">
                  <span>{selectedShowtimeData.slot.time}</span>
                  <span className="text-[var(--primary)]">•</span>
                  <span>{selectedShowtimeData.slot.format}</span>
                  <span className="text-[var(--primary)]">•</span>
                  <span className="text-emerald-500 font-bold">
                    {selectedShowtimeData.slot.price.toLocaleString('vi-VN')} đ/vé
                  </span>
                </div>
                <div className="text-xs text-[var(--text-sub)] truncate max-w-xs sm:max-w-md">
                  {selectedShowtimeData.cinema.name} ({selectedShowtimeData.slot.hallName})
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              rightIcon={<ChevronRight className="w-5 h-5" />}
              onClick={handleProceed}
              className="w-full sm:w-auto px-8 shadow-xl shadow-red-600/40"
            >
              Chọn Ghế Phòng Vé
            </Button>
          </div>
        </div>
      )}

      {/* Trailer Video Player Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={movie.title}
        trailerUrl={movie.trailerUrl}
      />
    </div>
  );
};


