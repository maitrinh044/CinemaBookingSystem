import React from 'react';
import { X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onClear,
  showClearButton,
  className = '',
  value,
  disabled,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-sub)]">
            {leftIcon}
          </div>
        )}

        <input
          value={value}
          disabled={disabled}
          className={`w-full rounded-xl border bg-[var(--surface)] text-[var(--text-main)] text-sm transition-all duration-200 placeholder:text-[var(--text-sub)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${
            showClearButton && value ? 'pr-18' : rightIcon ? 'pr-10' : 'pr-3.5'
          } py-2.5 ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-[var(--border-color)] hover:border-slate-500 focus:border-[var(--primary)]'
          } ${className}`}
          {...props}
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {showClearButton && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded-full text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              title="Xóa nội dung"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {rightIcon && (
            <div className="flex items-center text-[var(--text-sub)]">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[var(--text-sub)] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
