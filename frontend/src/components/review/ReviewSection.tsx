import React, { useState, useMemo } from 'react';
import { 
  Star, 
  MessageSquare, 
  PenLine, 
  Sparkles, 
  SlidersHorizontal 
} from 'lucide-react';
import type { UserReview, ReviewSortOption } from '../../types/review';
import { INITIAL_MOCK_REVIEWS } from '../../data/mockReviews';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';

export interface ReviewSectionProps {
  movieId: string;
  movieTitle: string;
  officialRating: number;
  totalVotes: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  movieId,
  movieTitle,
  officialRating,
  totalVotes,
}) => {
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    return INITIAL_MOCK_REVIEWS.filter((r) => r.movieId === movieId);
  });

  const [isWriting, setIsWriting] = useState(false);
  const [sortOption, setSortOption] = useState<ReviewSortOption>('newest');
  const [filterFilter, setFilterFilter] = useState<'all' | 'verified' | 'no_spoiler'>('all');

  // Handle adding a new review
  const handleAddReview = (newReviewData: Omit<UserReview, 'id' | 'createdAt' | 'likesCount'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReview: UserReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      createdAt: formattedDate,
      likesCount: 1,
    };

    setReviews((prev) => [newReview, ...prev]);
  };

  // Filter & Sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let list = [...reviews];

    // Filter
    if (filterFilter === 'verified') {
      list = list.filter((r) => r.isVerifiedBuyer);
    } else if (filterFilter === 'no_spoiler') {
      list = list.filter((r) => !r.isSpoiler);
    }

    // Sort
    if (sortOption === 'newest') {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortOption === 'highest_rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'lowest_rating') {
      list.sort((a, b) => a.rating - b.rating);
    }

    return list;
  }, [reviews, sortOption, filterFilter]);

  // Compute stats
  const averageScore = useMemo(() => {
    if (reviews.length === 0) return officialRating;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews, officialRating]);

  // Breakdown percentages
  const ratingDistribution = useMemo(() => {
    if (reviews.length === 0) {
      return [
        { label: '9 - 10 sao (Siêu phẩm)', percent: 75 },
        { label: '7 - 8 sao (Rất hay)', percent: 20 },
        { label: '5 - 6 sao (Tạm ổn)', percent: 5 },
        { label: '1 - 4 sao (Cần cải thiện)', percent: 0 },
      ];
    }

    const tier9_10 = reviews.filter((r) => r.rating >= 9).length;
    const tier7_8 = reviews.filter((r) => r.rating >= 7 && r.rating <= 8).length;
    const tier5_6 = reviews.filter((r) => r.rating >= 5 && r.rating <= 6).length;
    const tier1_4 = reviews.filter((r) => r.rating < 5).length;

    const total = reviews.length;
    return [
      { label: '9 - 10 sao (Siêu phẩm)', percent: Math.round((tier9_10 / total) * 100) },
      { label: '7 - 8 sao (Rất hay)', percent: Math.round((tier7_8 / total) * 100) },
      { label: '5 - 6 sao (Tạm ổn)', percent: Math.round((tier5_6 / total) * 100) },
      { label: '1 - 4 sao (Cần cải thiện)', percent: Math.round((tier1_4 / total) * 100) },
    ];
  }, [reviews]);

  return (
    <div className="space-y-6 text-left pt-8 border-t border-[var(--border-color)]">
      {/* 1. Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold border border-[var(--primary)]/20 shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
              Đánh Giá & Nhận Xét Khán Giả
            </h3>
            <p className="text-xs text-[var(--text-sub)]">
              Góc nhìn chân thực từ cộng đồng người xem phim tại CineGlow Cinema
            </p>
          </div>
        </div>

        {!isWriting && (
          <button
            type="button"
            onClick={() => setIsWriting(true)}
            className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-red-600/30 cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            <span>Viết Đánh Giá Của Bạn</span>
          </button>
        )}
      </div>

      {/* 2. Writing Form Dropdown */}
      {isWriting && (
        <ReviewForm
          movieId={movieId}
          movieTitle={movieTitle}
          onSubmitReview={handleAddReview}
          onCancel={() => setIsWriting(false)}
        />
      )}

      {/* 3. Overall Rating Summary Dashboard */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-xl">
        {/* Overall Score Box */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-[var(--border-color)]">
          <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight flex items-baseline gap-1">
            <span>{averageScore}</span>
            <span className="text-lg text-[var(--text-sub)] font-normal">/10</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <div className="text-xs text-[var(--text-sub)] mt-2 font-medium">
            Dựa trên {totalVotes + reviews.length} lượt đánh giá cộng đồng
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-2.5 md:col-span-2">
          {ratingDistribution.map((tier, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs">
              <span className="w-44 text-[var(--text-sub)] font-semibold truncate shrink-0">
                {tier.label}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-[var(--surface-hover)] overflow-hidden border border-[var(--border-color)]">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[var(--primary)] rounded-full transition-all duration-700"
                  style={{ width: `${tier.percent}%` }}
                />
              </div>
              <span className="w-10 text-right font-bold text-[var(--text-main)] shrink-0">
                {tier.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Filter & Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel p-3 sm:p-4 rounded-2xl border border-[var(--border-color)]">
        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-[var(--text-sub)] mr-1">Lọc:</span>
          <button
            onClick={() => setFilterFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filterFilter === 'all'
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow'
                : 'bg-[var(--surface-hover)] text-[var(--text-sub)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            Tất cả ({reviews.length})
          </button>
          <button
            onClick={() => setFilterFilter('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filterFilter === 'verified'
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow'
                : 'bg-[var(--surface-hover)] text-[var(--text-sub)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            Đã mua vé rạp
          </button>
          <button
            onClick={() => setFilterFilter('no_spoiler')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filterFilter === 'no_spoiler'
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow'
                : 'bg-[var(--surface-hover)] text-[var(--text-sub)] border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            Không chứa Spoiler
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span className="text-xs font-bold text-[var(--text-sub)] shrink-0">Sắp xếp:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as ReviewSortOption)}
            className="bg-[var(--surface-hover)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 cursor-pointer"
          >
            <option value="newest">Mới nhất trước</option>
            <option value="highest_rating">Điểm cao nhất (10★)</option>
            <option value="lowest_rating">Điểm thấp nhất</option>
          </select>
        </div>
      </div>

      {/* 5. Reviews Feed */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center border border-[var(--border-color)] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] text-[var(--text-sub)] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-main)]">
              Chưa có bài đánh giá nào phù hợp với bộ lọc hiện tại.
            </p>
            <p className="text-xs text-[var(--text-sub)]">
              Hãy là một trong những người đầu tiên viết cảm nhận về phim!
            </p>
          </div>
        ) : (
          filteredAndSortedReviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))
        )}
      </div>
    </div>
  );
};
