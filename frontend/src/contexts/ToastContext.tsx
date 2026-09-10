import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  X, 
  Sparkles,
  Ticket,
  CreditCard
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'booking' | 'payment';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // in ms
  action?: ToastAction;
  createdAt: number;
}

export type ToastOptions = Omit<ToastItem, 'id' | 'createdAt'>;

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
  toast: {
    success: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
    error: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
    warning: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
    info: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
    booking: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
    payment: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions): string => {
      const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const duration = options.duration ?? 4500;

      const newToast: ToastItem = {
        ...options,
        id,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const toastHelpers = useMemo(
    () => ({
      success: (title: string, message?: string, options?: Partial<ToastOptions>) =>
        showToast({ type: 'success', title, message, ...options }),
      error: (title: string, message?: string, options?: Partial<ToastOptions>) =>
        showToast({ type: 'error', title, message, ...options }),
      warning: (title: string, message?: string, options?: Partial<ToastOptions>) =>
        showToast({ type: 'warning', title, message, ...options }),
      info: (title: string, message?: string, options?: Partial<ToastOptions>) =>
        showToast({ type: 'info', title, message, ...options }),
      booking: (title: string, message?: string, options?: Partial<ToastOptions>) =>
        showToast({ type: 'booking', title, message, ...options }),
      payment: (title: string, message?: string, options?: Partial<ToastOptions>) =>
        showToast({ type: 'payment', title, message, ...options }),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        toast: toastHelpers,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Internal Toast Container Component
interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-[92vw] sm:max-w-md w-full pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast Card
interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const { type, title, message, action, duration = 4500 } = toast;

  const config = useMemo(() => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          glowColor: 'rgba(16, 185, 129, 0.25)',
          borderColor: 'border-emerald-500/30',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          badgeText: 'Thành Công',
          progressColor: 'bg-emerald-500',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
          glowColor: 'rgba(244, 63, 94, 0.25)',
          borderColor: 'border-rose-500/30',
          badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          badgeText: 'Lỗi',
          progressColor: 'bg-rose-500',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          glowColor: 'rgba(245, 158, 11, 0.25)',
          borderColor: 'border-amber-500/30',
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          badgeText: 'Lưu Ý',
          progressColor: 'bg-amber-500',
        };
      case 'booking':
        return {
          icon: <Ticket className="w-5 h-5 text-[var(--primary)]" />,
          glowColor: 'rgba(229, 9, 20, 0.25)',
          borderColor: 'border-[var(--primary)]/30',
          badgeBg: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20',
          badgeText: 'Vé Xem Phim',
          progressColor: 'bg-[var(--primary)]',
        };
      case 'payment':
        return {
          icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
          glowColor: 'rgba(16, 185, 129, 0.25)',
          borderColor: 'border-emerald-500/30',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          badgeText: 'Thanh Toán',
          progressColor: 'bg-emerald-500',
        };
      case 'info':
      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-sky-400" />,
          glowColor: 'rgba(14, 165, 233, 0.25)',
          borderColor: 'border-sky-500/30',
          badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          badgeText: 'Thông Báo',
          progressColor: 'bg-sky-500',
        };
    }
  }, [type]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.94, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 40, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-2xl bg-[var(--surface)] text-[var(--text-main)] shadow-2xl ${config.borderColor}`}
      style={{
        boxShadow: `0 12px 35px -8px ${config.glowColor}, 0 4px 15px rgba(0,0,0,0.25)`,
      }}
    >
      <div className="p-4 flex items-start gap-3.5">
        {/* Left Glow Icon */}
        <div className="shrink-0 p-2 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] shadow-inner">
          {config.icon}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pr-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeBg}`}
            >
              {config.badgeText}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)] leading-snug break-words">
            {title}
          </h4>

          {message && (
            <p className="text-[11px] sm:text-xs text-[var(--text-sub)] mt-1 leading-relaxed break-words font-medium">
              {message}
            </p>
          )}

          {action && (
            <button
              onClick={() => {
                action.onClick();
                onDismiss();
              }}
              className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
            >
              <span>{action.label}</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="shrink-0 text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Animated Remaining Duration Progress Bar */}
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-0.5 ${config.progressColor}`}
        />
      )}
    </motion.div>
  );
};
