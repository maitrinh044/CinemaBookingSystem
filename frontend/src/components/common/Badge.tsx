import React from 'react';

export type AgeRating = 'P' | 'K' | 'T13' | 'T16' | 'T18';
export type MovieFormat = '2D' | '3D' | 'IMAX' | '4DX' | 'GOLD CLASS' | 'VIP';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'gold' | 'cyan' | 'outline';
  size?: 'sm' | 'md';
  ageRating?: AgeRating;
  format?: MovieFormat;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  ageRating,
  format,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 font-bold rounded',
    md: 'text-xs px-2 py-0.5 font-semibold rounded-md',
  };

  // Pre-configured Age Rating Badges (Theo tiêu chuẩn kiểm duyệt phim Việt Nam)
  if (ageRating) {
    const ageRatingConfig: Record<AgeRating, { label: string; bg: string; title: string }> = {
      P: { label: 'P', bg: 'bg-emerald-600 text-white', title: 'P - Phim được phép phổ biến đến người xem ở mọi độ tuổi' },
      K: { label: 'K', bg: 'bg-blue-600 text-white', title: 'K - Phim phổ biến đến người xem dưới 13 tuổi có người giám hộ đi kèm' },
      T13: { label: 'T13', bg: 'bg-amber-600 text-white', title: 'T13 - Phim cấm phổ biến đến người xem dưới 13 tuổi' },
      T16: { label: 'T16', bg: 'bg-orange-600 text-white', title: 'T16 - Phim cấm phổ biến đến người xem dưới 16 tuổi' },
      T18: { label: 'T18', bg: 'bg-red-600 text-white', title: 'T18 - Phim cấm phổ biến đến người xem dưới 18 tuổi' },
    };

    const cfg = ageRatingConfig[ageRating];
    return (
      <span
        title={cfg.title}
        className={`inline-flex items-center justify-center font-black tracking-wider ${cfg.bg} ${sizeStyles[size]} shadow-sm ${className}`}
        {...props}
      >
        {cfg.label}
      </span>
    );
  }

  // Pre-configured Movie Format Badges
  if (format) {
    const formatStyles: Record<MovieFormat, string> = {
      '2D': 'bg-slate-700/60 text-slate-200 border border-slate-600',
      '3D': 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50',
      'IMAX': 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-sm',
      '4DX': 'bg-gradient-to-r from-red-600 to-rose-500 text-white font-extrabold',
      'GOLD CLASS': 'bg-amber-500 text-black font-extrabold shadow-amber-500/30',
      'VIP': 'bg-[var(--gold)] text-black font-black',
    };

    return (
      <span
        className={`inline-flex items-center justify-center tracking-wider ${formatStyles[format]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {format}
      </span>
    );
  }

  const variantStyles = {
    default: 'bg-[var(--surface-hover)] text-[var(--text-sub)] border border-[var(--border-color)]',
    primary: 'bg-red-500/15 text-[var(--primary)] border border-red-500/30',
    success: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-500 border border-amber-500/30',
    gold: 'bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30',
    cyan: 'bg-[var(--cyan)]/15 text-[var(--cyan)] border border-[var(--cyan)]/30',
    outline: 'border border-[var(--border-color)] text-[var(--text-main)]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
