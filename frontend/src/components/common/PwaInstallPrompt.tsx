import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user previously dismissed in the last 3 days
      const dismissedAt = localStorage.getItem('cineglow_pwa_dismissed');
      if (dismissedAt) {
        const diff = Date.now() - parseInt(dismissedAt, 10);
        if (diff < 3 * 24 * 60 * 60 * 1000) {
          return;
        }
      }

      // Show banner after 2 seconds for a natural experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      toast.success('Đã cài đặt CineGlow App!', 'Ứng dụng đã sẵn sàng trên màn hình chính của bạn.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback message for iOS or browsers without native prompt
      toast.info(
        'Thêm vào Màn hình chính',
        'Trên iOS Safari: Nhấn nút Chia sẻ (biểu tượng mũi tên lên) và chọn "Thêm vào MH chính".'
      );
      setIsVisible(false);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        toast.success('Cài đặt thành công!', 'Chào mừng bạn trải nghiệm CineGlow App.');
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } catch {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('cineglow_pwa_dismissed', Date.now().toString());
  };

  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
      >
        <div className="glass-panel p-4 rounded-2xl border border-[var(--primary)]/40 shadow-2xl bg-[var(--surface)] text-[var(--text-main)] flex items-center justify-between gap-3 backdrop-blur-2xl">
          {/* Icon & Details */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-rose-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-bold truncate text-[var(--text-main)]">
                  Cài Đặt App CineGlow
                </h4>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  Miễn phí
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-sub)] truncate mt-0.5">
                Đặt vé siêu tốc, tra cứu QR vé offline & tích điểm
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md shadow-red-600/30 hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cài Đặt</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-xl text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
