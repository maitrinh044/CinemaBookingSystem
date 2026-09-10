import React, { useState } from 'react';
import { 
  Clapperboard, 
  MapPin, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Film,
  Calendar,
  Building2,
  Gift,
  Popcorn,
  LogOut,
  Sparkles,
  Ticket
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { CitySelectorModal, type City, POPULAR_CITIES } from './CitySelectorModal';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import type { Movie } from '../../types/movie';
import { SearchDropdown } from './SearchDropdown';

export interface HeaderProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onSelectMovie?: (movie: Movie) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'home',
  onNavigate,
  onSelectMovie,
}) => {
  const { user, userBookings, openAuthModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City>(POPULAR_CITIES[0]);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const handleMovieSelect = (movie: Movie) => {
    onSelectMovie?.(movie);
    setSearchQuery('');
    setIsSearchExpanded(false);
    setIsSearchDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Trang Chủ', icon: <Film className="w-4 h-4" /> },
    { id: 'movies', label: 'Phim Chiếu', icon: <Film className="w-4 h-4" /> },
    { id: 'showtimes', label: 'Lịch Chiếu', icon: <Calendar className="w-4 h-4" /> },
    { id: 'cinemas', label: 'Cụm Rạp', icon: <Building2 className="w-4 h-4" /> },
    { id: 'concessions', label: 'Bắp Nước', icon: <Popcorn className="w-4 h-4" /> },
    { id: 'promotions', label: 'Khuyến Mãi', icon: <Gift className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] glass-panel transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3 lg:gap-4 flex-nowrap">
            {/* Left: Brand Logo & City Picker */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0 flex-nowrap">
              {/* Brand Logo - strictly 1 line */}
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2.5 focus:outline-none cursor-pointer group shrink-0 whitespace-nowrap"
                aria-label="CineGlow Cinema Home"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--logo-icon)] flex items-center justify-center text-white shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[var(--logo-text)] transition-colors whitespace-nowrap">
                  CineGlow
                </span>
              </button>

              {/* Location Picker Button - 1 line */}
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)]/60 hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text-main)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Thay đổi Tỉnh/Thành phố xem rạp"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                <span className="whitespace-nowrap">{selectedCity.name}</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-sub)] shrink-0" />
              </button>
            </div>

            {/* Middle: Desktop Navigation Links - strictly 1 line per tab */}
            <nav className="hidden lg:flex items-center gap-1 flex-nowrap shrink-0">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--primary)]/10 font-bold'
                        : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Right: Search, Theme Toggle, Auth, Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap shrink-0">
              {/* Quick Search */}
              <div className="relative hidden xl:block shrink-0">
                <div className={`flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] transition-all duration-200 ${
                  isSearchExpanded ? 'w-64 ring-2 ring-[var(--primary)]/40' : 'w-44'
                }`}>
                  <Search className="w-3.5 h-3.5 text-[var(--text-sub)] ml-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Tìm phim, diễn viên..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchDropdownOpen(e.target.value.trim().length > 0);
                    }}
                    onFocus={() => {
                      setIsSearchExpanded(true);
                      if (searchQuery.trim().length > 0) setIsSearchDropdownOpen(true);
                    }}
                    className="w-full bg-transparent pl-2 pr-2.5 py-1.5 text-xs text-[var(--text-main)] placeholder:text-[var(--text-sub)] focus:outline-none whitespace-nowrap"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchDropdownOpen(false);
                      }}
                      className="text-[var(--text-sub)] hover:text-[var(--text-main)] pr-2 text-xs shrink-0 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Global Search Dropdown */}
                <SearchDropdown
                  query={searchQuery}
                  isOpen={isSearchDropdownOpen}
                  onClose={() => setIsSearchDropdownOpen(false)}
                  onSelectMovie={handleMovieSelect}
                />
              </div>

              {/* Theme Toggle Button */}
              <div className="shrink-0">
                <ThemeToggle />
              </div>

              {/* Auth Login / User Profile Area - 1 line */}
              {user ? (
                <div className="relative shrink-0">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="hidden sm:flex items-center gap-2 p-1 pr-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] hover:border-slate-400 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-[var(--text-main)] truncate max-w-[85px]">
                        {user.name}
                      </div>
                      <div className="text-[9px] font-bold text-[var(--gold)] uppercase tracking-wider -mt-0.5">
                        {user.membership}
                      </div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-[var(--text-sub)]" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl glass-panel border border-[var(--border-color)] shadow-2xl p-2 z-50 space-y-1 text-left animate-fade-in">
                      <div className="px-3 py-2 border-b border-[var(--border-color)]">
                        <div className="text-xs font-bold text-[var(--text-main)] truncate">{user.name}</div>
                        <div className="text-[10px] text-[var(--text-sub)] truncate">{user.email}</div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-[var(--gold)]">
                          <Sparkles className="w-3 h-3" />
                          <span>{user.points} Điểm CinePoint</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate?.('profile');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Ticket className="w-3.5 h-3.5 text-[var(--primary)]" />
                          <span>Vé của tôi</span>
                        </div>
                        {userBookings && userBookings.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">
                            {userBookings.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate?.('profile');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-[var(--text-sub)]" />
                        <span>Thông tin thành viên</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<User className="w-3.5 h-3.5 shrink-0" />}
                  onClick={() => openAuthModal('login')}
                  className="hidden sm:inline-flex whitespace-nowrap shrink-0 py-1.5 text-xs shadow-md shadow-red-600/30"
                >
                  Đăng Nhập
                </Button>
              )}

              {/* Mobile Hamburger Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer shrink-0"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-color)] bg-[var(--surface)] px-4 pt-3 pb-6 space-y-3 shadow-xl">
            {/* Mobile Location Selector */}
            <button
              onClick={() => {
                setIsCityModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-sm font-medium text-[var(--text-main)]"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--primary)]" />
                <span>Khu vực: <b>{selectedCity.name}</b></span>
              </div>
              <span className="text-xs text-[var(--primary)] font-semibold">Đổi rạp</span>
            </button>

            {/* Mobile Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-sub)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm phim, diễn viên..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(e.target.value.trim().length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setIsSearchDropdownOpen(true);
                }}
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchDropdownOpen(false);
                  }}
                  className="text-[var(--text-sub)] hover:text-[var(--text-main)] absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Global Search Dropdown */}
              <SearchDropdown
                query={searchQuery}
                isOpen={isSearchDropdownOpen}
                onClose={() => setIsSearchDropdownOpen(false)}
                onSelectMovie={handleMovieSelect}
              />
            </div>

            {/* Mobile Links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    activeTab === link.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--surface-hover)] text-[var(--text-main)]'
                  }`}
                >
                  {link.icon}
                  <span className="whitespace-nowrap">{link.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Auth Area */}
            {user ? (
              <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-[var(--text-main)]">{user.name}</div>
                    <div className="text-[11px] text-[var(--gold)] font-bold">{user.membership} Member • {user.points} điểm</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onNavigate?.('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Vé của tôi</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                leftIcon={<User className="w-4 h-4" />}
                onClick={() => {
                  openAuthModal('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-2 shadow-lg shadow-red-600/30"
              >
                Đăng Nhập / Đăng Ký
              </Button>
            )}
          </div>
        )}
      </header>

      {/* City Selector Modal Dialog */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity.name}
        onSelectCity={(city) => setSelectedCity(city)}
      />
    </>
  );
};
