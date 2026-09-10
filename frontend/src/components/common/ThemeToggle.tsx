import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, type ThemeMode } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, actualTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Giao diện sáng', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { mode: 'dark', label: 'Giao diện tối', icon: <Moon className="w-4 h-4 text-cyan-400" /> },
    { mode: 'system', label: 'Theo hệ thống', icon: <Laptop className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full glass-panel hover:border-cinema-red transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cinema-red/50 shadow-sm"
        title="Chuyển đổi giao diện Tối / Sáng"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          {actualTheme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-2xl py-2 z-50 border border-[var(--border-color)] overflow-hidden"
          >
            <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
              Chế độ hiển thị
            </div>
            {themeOptions.map((opt) => (
              <button
                key={opt.mode}
                onClick={() => {
                  setTheme(opt.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-hover)] cursor-pointer ${
                  theme === opt.mode
                    ? 'text-[var(--primary)] font-semibold'
                    : 'text-[var(--text-main)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {theme === opt.mode && (
                  <Check className="w-4 h-4 text-[var(--primary)]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
