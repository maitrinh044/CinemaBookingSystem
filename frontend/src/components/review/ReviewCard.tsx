import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertOctagon, 
  User 
} from 'lucide-react';
import type { UserReview } from '../../types/review';

export interface ReviewCardProps {
  review: UserReview;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [likes, setLikes] = useState(review.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [showSpoiler, setShowSpoiler] = useState(!review.isSpoiler);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)]/70 hover:border-[var(--primary)]/40 transition-all space-y-4 text-left shadow-lg">
      {/* 1. Header with User Info & Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)] shadow-sm shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm shrink-0 border border-[var(--primary)]/20">
              <User className="w-5 h-5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-[var(--text-main)]">
                {review.userName}
              </span>
              {review.isVerifiedBuyer && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Đã xem tại CineGlow</span>
                </span>
              )}
            </div>
            <div className="text-[11px] text-[var(--text-sub)]">
              Đăng ngày {review.createdAt}
            </div>
          </div>
        </div>

        {/* Rating Score Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-center px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm sm:text-base font-black">{review.rating}</span>
          <span className="text-[11px] text-amber-500/80">/10</span>
        </div>
      </div>

      {/* 2. Review Title */}
      <h4 className="font-bold text-base text-[var(--text-main)] leading-snug">
        {review.title}
      </h4>

      {/* 3. Review Content & Spoiler Handling */}
      {review.isSpoiler && !showSpoiler ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>Đánh giá này có chứa nội dung tiết lộ cốt truyện (Spoiler).</span>
          </div>
          <button
            type="button"
            onClick={() => setShowSpoiler(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Mở xem nội dung</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed whitespace-pre-line">
            {review.content}
          </p>
          {review.isSpoiler && (
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[10px] text-amber-500/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                Chứa Spoiler
              </span>
              <button
                type="button"
                onClick={() => setShowSpoiler(false)}
                className="text-[11px] text-[var(--text-sub)] hover:text-[var(--text-main)] flex items-center gap-1 cursor-pointer"
              >
                <EyeOff className="w-3 h-3" />
                <span>Ẩn lại</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Footer with Helpful Button */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-sub)]">
        <span>Đánh giá hữu ích với bạn?</span>
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            hasLiked
              ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-red-600/30'
              : 'border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
          <span className="font-bold text-[11px]">{likes}</span>
          <span className="text-[10px] hidden sm:inline">Hữu ích</span>
        </button>
      </div>
    </div>
  );
};
