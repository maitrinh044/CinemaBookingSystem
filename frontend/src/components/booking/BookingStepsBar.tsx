import React, { useEffect, useState } from 'react';
import { Armchair, Popcorn, CreditCard, Clock, AlertTriangle } from 'lucide-react';

export type BookingStep = 'seat' | 'concession' | 'checkout';

export interface BookingStepsBarProps {
  currentStep: BookingStep;
  onStepChange: (step: BookingStep) => void;
  canGoToConcession: boolean;
  canGoToCheckout: boolean;
  onTimeout: () => void;
}

export const BookingStepsBar: React.FC<BookingStepsBarProps> = ({
  currentStep,
  onStepChange,
  canGoToConcession,
  canGoToCheckout,
  onTimeout,
}) => {
  // 5 minutes timer (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 60;

  const steps = [
    { id: 'seat' as BookingStep, label: '1. Chọn Ghế', icon: Armchair, enabled: true },
    { id: 'concession' as BookingStep, label: '2. Bắp Nước', icon: Popcorn, enabled: canGoToConcession },
    { id: 'checkout' as BookingStep, label: '3. Thanh Toán', icon: CreditCard, enabled: canGoToCheckout },
  ];

  return (
    <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      {/* 3 Step Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = 
            (step.id === 'seat' && canGoToConcession) ||
            (step.id === 'concession' && canGoToCheckout);

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div className="w-4 sm:w-8 h-[2px] bg-[var(--border-color)] shrink-0 hidden sm:block" />
              )}
              <button
                type="button"
                disabled={!step.enabled}
                onClick={() => onStepChange(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-md shadow-red-600/30'
                    : isDone
                    ? 'bg-[var(--surface-hover)] text-[var(--text-main)] hover:border-[var(--primary)] border border-transparent'
                    : 'text-[var(--text-sub)] opacity-50 cursor-not-allowed'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* 5-Minute Countdown Timer */}
      <div
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-bold shrink-0 transition-colors ${
          isUrgent
            ? 'border-rose-500 bg-rose-500/10 text-rose-500 animate-pulse'
            : 'border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-main)]'
        }`}
        title="Thời gian giữ ghế cho đơn hàng này"
      >
        {isUrgent ? (
          <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
        ) : (
          <Clock className="w-4 h-4 text-[var(--primary)]" />
        )}
        <span className="text-xs text-[var(--text-sub)]">Thời gian giữ vé:</span>
        <span className="font-mono text-sm sm:text-base font-black text-[var(--primary)]">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
