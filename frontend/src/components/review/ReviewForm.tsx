import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle, X, ShieldCheck } from 'lucide-react';
import { StarRatingSelector } from './StarRatingSelector';
import type { UserReview } from '../../types/review';

export interface ReviewFormProps {
  movieId: string;
  movieTitle: string;
  onSubmitReview: (review: Omit<UserReview, 'id' | 'createdAt' | 'likesCount'>) => void;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  movieId,
  movieTitle,
  onSubmitReview,
  onCancel,
}) => {
  const [rating, setRating] = useState<number>(9);
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMsg('Vui lòng nhập tên hoặc biệt danh của bạn.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề ngắn gọn cho bài đánh giá.');
      return;
    }
    if (content.trim().length < 15) {
      setErrorMsg('Nội dung nhận xét cần ít nhất 15 ký tự để giúp ích cho cộng đồng.');
      return;
    }

    setErrorMsg('');
    onSubmitReview({
      movieId,
      userName: userName.trim(),
      rating,
      title: title.trim(),
      content: content.trim(),
      isSpoiler,
      isVerifiedBuyer: true, // Mark verified from app interaction
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[var(--text-main)]">
            Đã đăng bài đánh giá thành công!
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-sub)]">
            Cảm ơn bạn đã đóng góp ý kiến công tâm cho phim <span className="text-[var(--primary)] font-bold">{movieTitle}</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:scale-105 transition-transform cursor-pointer"
        >
          Xem Đánh Giá Của Bạn
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--primary)]/30 bg-[var(--surface)]/90 shadow-2xl space-y-5 text-left animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[var(--text-main)]">
            Viết Đánh Giá Cho Phim: {movieTitle}
          </h3>
          <p className="text-xs text-[var(--text-sub)] mt-0.5">
            Chia sẻ cảm xúc và chấm điểm chân thực nhất để giúp khán giả khác chọn phim
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Rating Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
          Điểm số của bạn (Thang điểm 1 - 10) <span className="text-rose-500">*</span>
        </label>
        <StarRatingSelector value={rating} onChange={setRating} size="md" />
      </div>

      {/* 2. User Name Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
          Tên hiển thị / Biệt danh <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ví dụ: Hoàng Tuấn, Lan Anh Cinema..."
            className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-sub)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
          />
          <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            <span>Khán giả CineGlow</span>
          </div>
        </div>
      </div>

      {/* 3. Review Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
          Tiêu đề nhận xét <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tóm tắt cảm xúc của bạn (VD: Kỹ xảo mãn nhãn, âm thanh sống động...)"
          className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-sub)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
        />
      </div>

      {/* 4. Review Content */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
          Nội dung bài viết chi tiết <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hãy chia sẻ kỹ hơn về diễn xuất, âm thanh, bối cảnh, điểm bạn thích hoặc chưa thích..."
          className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-sub)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 resize-none"
        />
        <div className="text-[10px] text-right text-[var(--text-sub)]">
          {content.length} ký tự (tối thiểu 15 ký tự)
        </div>
      </div>

      {/* 5. Spoiler Checkbox */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)]">
        <input
          type="checkbox"
          id="spoilerCheck"
          checked={isSpoiler}
          onChange={(e) => setIsSpoiler(e.target.checked)}
          className="mt-0.5 rounded text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
        />
        <label htmlFor="spoilerCheck" className="text-xs text-[var(--text-sub)] cursor-pointer select-none">
          <span className="font-bold text-[var(--text-main)] block">
            Bài viết có chứa nội dung tiết lộ tình tiết cốt truyện (Spoiler)
          </span>
          Hệ thống sẽ gắn thẻ cảnh báo và che mờ nội dung để tránh ảnh hưởng đến trải nghiệm của người xem sau.
        </label>
      </div>

      {/* 6. Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-red-600/30 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Gửi Đánh Giá Ngay</span>
        </button>
      </div>
    </form>
  );
};
