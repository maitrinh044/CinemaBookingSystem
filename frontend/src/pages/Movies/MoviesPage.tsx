import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Star, 
  ChevronRight,
  Ticket
} from 'lucide-react';
import type { Movie } from '../../types/movie';
import { MOCK_MOVIES } from '../../data/mockData';
import { PosterImage } from '../../components/common/PosterImage';

export interface MoviesPageProps {
  onSelectMovie: (movie: Movie) => void;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({ onSelectMovie }) => {
  const [statusTab, setStatusTab] = useState<'all' | 'now_showing' | 'coming_soon' | 'special_sneak'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'release' | 'duration'>('rating');

  // Extract all unique genres
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    MOCK_MOVIES.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return Array.from(set);
  }, []);

  // Filter & Sort
  const filteredMovies = useMemo(() => {
    let list = [...MOCK_MOVIES];

    // Status filter
    if (statusTab !== 'all') {
      list = list.filter((m) => m.status === statusTab);
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      list = list.filter((m) => m.genres.includes(selectedGenre));
    }

    // Format filter
    if (selectedFormat !== 'all') {
      list = list.filter((m) => m.formats.some((f) => f.toUpperCase().includes(selectedFormat.toUpperCase())));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.originalTitle.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'release') {
      list.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    } else if (sortBy === 'duration') {
      list.sort((a, b) => b.duration - a.duration);
    }

    return list;
  }, [statusTab, selectedGenre, selectedFormat, searchQuery, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      all: MOCK_MOVIES.length,
      now_showing: MOCK_MOVIES.filter((m) => m.status === 'now_showing').length,
      coming_soon: MOCK_MOVIES.filter((m) => m.status === 'coming_soon').length,
      special_sneak: MOCK_MOVIES.filter((m) => m.status === 'special_sneak').length,
    };
  }, []);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto text-left">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-color)] p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/85 to-transparent z-0" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold border border-[var(--primary)]/20">
            <Film className="w-3.5 h-3.5" />
            <span>Kho Phim Điện Ảnh Toàn Diện</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            Danh Sách Phim Chiếu Rạp CineGlow
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-sub)]">
            Khám phá những siêu phẩm bom tấn đình đám, phim chiếu rạp mới nhất với chất lượng đỉnh cao IMAX Laser và âm thanh Dolby Atmos.
          </p>
        </div>
      </div>

      {/* 2. Status Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--border-color)]">
        {[
          { id: 'all', label: 'Tất Cả Phim', count: statusCounts.all },
          { id: 'now_showing', label: 'Phim Đang Chiếu', count: statusCounts.now_showing },
          { id: 'special_sneak', label: 'Suất Chiếu Sớm', count: statusCounts.special_sneak },
          { id: 'coming_soon', label: 'Phim Sắp Chiếu', count: statusCounts.coming_soon },
        ].map((tab) => {
          const isActive = statusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-hover)] text-[var(--text-sub)]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Filter & Search Controls Toolbar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-[var(--border-color)] space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--text-sub)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên phim, diễn viên..."
              className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-sub)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            />
          </div>

          {/* Genre Dropdown */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 cursor-pointer"
            >
              <option value="all">Tất Cả Thể Loại</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Format Dropdown */}
          <div>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 cursor-pointer"
            >
              <option value="all">Tất Cả Định Dạng</option>
              <option value="IMAX">IMAX Laser</option>
              <option value="2D">2D Digital</option>
              <option value="3D">3D Siêu Nét</option>
              <option value="4DX">4DX Cảm Giác Mạnh</option>
              <option value="GOLD CLASS">VIP Gold Class</option>
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--primary)] shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 cursor-pointer"
            >
              <option value="rating">Đánh giá cao nhất (★)</option>
              <option value="release">Ngày khởi chiếu mới nhất</option>
              <option value="duration">Thời lượng dài nhất</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-[var(--text-sub)] pt-1 border-t border-[var(--border-color)]/60">
          <span>
            Hiển thị <b className="text-[var(--text-main)]">{filteredMovies.length}</b> bộ phim phù hợp
          </span>
          {(selectedGenre !== 'all' || selectedFormat !== 'all' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedGenre('all');
                setSelectedFormat('all');
                setSearchQuery('');
              }}
              className="text-[var(--primary)] font-bold hover:underline cursor-pointer"
            >
              Đặt lại tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* 4. Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-[var(--border-color)] space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[var(--surface-hover)] text-[var(--text-sub)] flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">
            Không tìm thấy phim phù hợp
          </h3>
          <p className="text-xs text-[var(--text-sub)] max-w-sm mx-auto">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bớt các tiêu chí lọc thể loại và định dạng.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group glass-panel rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl hover:border-[var(--primary)]/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Poster & Badges Container */}
              <div
                className="relative aspect-[2/3] overflow-hidden cursor-pointer"
                onClick={() => onSelectMovie(movie)}
              >
                <PosterImage
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[var(--primary)] text-white shadow">
                    {movie.ageRating}
                  </span>
                  {movie.isHot && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black shadow">
                      HOT
                    </span>
                  )}
                </div>

                {/* Bottom rating overlay on poster */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white pointer-events-none">
                  <span className="flex items-center gap-1 font-black text-xs text-amber-400 drop-shadow">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-white/90 drop-shadow">
                    {movie.duration} phút
                  </span>
                </div>
              </div>

              {/* Movie Info Content */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-1.5">
                  <h3
                    onClick={() => onSelectMovie(movie)}
                    className="font-bold text-base text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 cursor-pointer"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                  <div className="text-xs text-[var(--text-sub)] line-clamp-1">
                    {movie.genres.join(', ')}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {movie.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-sub)] border border-[var(--border-color)]"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center gap-2">
                  <button
                    onClick={() => onSelectMovie(movie)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-1 shadow-md shadow-red-600/30 cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>{movie.status === 'coming_soon' ? 'Xem Trailer' : 'Đặt Vé Ngay'}</span>
                  </button>
                  <button
                    onClick={() => onSelectMovie(movie)}
                    className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                    title="Chi tiết phim"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


