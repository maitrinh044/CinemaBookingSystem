import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AuthModal } from '../components/auth/AuthModal';

import type { Movie } from '../types/movie';

export interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onSelectMovie?: (movie: Movie) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab = 'home',
  onNavigate,
  onSelectMovie,
}) => {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col justify-between bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 overflow-x-hidden">
      <Header activeTab={activeTab} onNavigate={onNavigate} onSelectMovie={onSelectMovie} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>
      <Footer onNavigate={onNavigate} />
      <AuthModal />
    </div>
  );
};
