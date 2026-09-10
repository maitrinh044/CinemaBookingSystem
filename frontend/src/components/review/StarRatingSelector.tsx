import React, { useState } from 'react';
import { Star } from 'lucide-react';

export interface StarRatingSelectorProps {
  value: number; // 1 to 10
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  10: 'Siêu phẩm hoàn hảo (10/10)',
  9: 'Xuất sắc tuyệt vời (9/10)',
  8: 'Rất hay, đáng tiền vé (8/10)',
  7: 'Hay, xem giải trí tốt (7/10)',
  6: 'Khá ổn, xem tạm được (6/10)',
  5: 'Trung bình, bình thường (5/10)',
  4: 'Hơi thất vọng (4/10)',
  3: 'Dưới kỳ vọng (3/10)',
  2: 'Nhiều điểm trừ (2/10)',
  1: 'Tệ, không nên xem (1/10)',
};

export const StarRatingSelector: React.FC<StarRatingSelectorProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  showLabel = true,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const activeRating = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starNum) => {
          const isFilled = starNum <= activeRating;

          return (
            <button
              key={starNum}
              type="button"
              disabled={readOnly}
              onClick={() => onChange?.(starNum)}
              onMouseEnter={() => !readOnly && setHoverValue(starNum)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              className={`p-0.5 transition-all duration-150 rounded ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-125 focus:outline-none'
              }`}
              title={RATING_LABELS[starNum] || `${starNum}/10`}
            >
              <Star
                className={`${starSizes[size]} transition-colors ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                    : 'text-zinc-600 fill-transparent hover:text-zinc-400'
                }`}
              />
            </button>
          );
        })}

        <span className="ml-2 font-black text-xs sm:text-sm text-amber-400">
          {activeRating}/10
        </span>
      </div>

      {showLabel && !readOnly && (
        <div className="text-xs font-semibold text-[var(--text-sub)] h-4">
          {activeRating > 0 ? (
            <span className="text-[var(--primary)] font-bold">
              {RATING_LABELS[activeRating]}
            </span>
          ) : (
            'Nhấp vào ngôi sao để chọn thang điểm chấm'
          )}
        </div>
      )}
    </div>
  );
};
