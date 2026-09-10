import { authService } from '../services/authService';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CompletedBooking } from '../types/booking';
import { MOCK_MOVIES, MOCK_CINEMAS } from '../data/mockData';
import { useToast } from './ToastContext';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  membership: 'Standard' | 'VIP' | 'Diamond';
  points: number;
}

export type AuthTab = 'login' | 'register' | 'forgot';

interface AuthContextType {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  authTab: AuthTab;
  userBookings: CompletedBooking[];
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
  setAuthTab: (tab: AuthTab) => void;
  login: (email: string, password?: string) => Promise<boolean> | boolean;
  loginAsDemo: () => void;
  register: (name: string, email: string, phone: string, password?: string) => Promise<boolean> | boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addBooking: (booking: CompletedBooking) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cineglow_auth_user';
const BOOKINGS_STORAGE_KEY = 'cineglow_user_bookings';

const DEFAULT_BOOKINGS: CompletedBooking[] = [
  {
    bookingCode: 'CG-918234',
    movie: MOCK_MOVIES[0], // Dune: Part Two
    cinema: MOCK_CINEMAS[0], // Landmark 81 IMAX Laser
    date: '12/09/2026',
    showtime: {
      id: 'st-dune-01',
      movieId: 'dune-2',
      cinemaId: 'cineglow-l81',
      date: '2026-09-12',
      time: '19:30',
      format: 'IMAX',
      hallName: 'PhÃ²ng Chiáº¿u IMAX Laser 01',
      price: 135000,
      availableSeats: 45,
      totalSeats: 120,
    },
    seats: [
      { id: 'F-06', row: 'F', col: 6, type: 'vip', status: 'selected', price: 160000 },
      { id: 'F-07', row: 'F', col: 7, type: 'vip', status: 'selected', price: 160000 },
    ],
    concessions: [
      {
        item: {
          id: 'combo-duo-sweet',
          name: 'Combo CineGlow Duo VIP',
          description: '1 Báº¯p lá»›n + 2 NÆ°á»›c ngá»t mÃ¡t láº¡nh',
          price: 119000,
          image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=600&auto=format&fit=crop&q=80',
          category: 'combo',
        },
        quantity: 1,
      },
    ],
    customerInfo: {
      fullName: 'Nguyá»…n Mai Trinh',
      phone: '0988 668 886',
      email: 'maitrinh@cineglow.vn',
    },
    paymentMethod: 'momo',
    finalTotal: 439000,
    bookedAt: '10/09/2026 10:15',
    qrData: 'CINEGLOW:CG-918234:st-dune-01:F-06,F-07',
  },
  {
    bookingCode: 'CG-452189',
    movie: MOCK_MOVIES[2], // Exhuma
    cinema: MOCK_CINEMAS[1], // Vincom Äá»“ng Khá»Ÿi
    date: '05/09/2026',
    showtime: {
      id: 'st-exhuma-01',
      movieId: 'exhuma',
      cinemaId: 'cineglow-dongkhoi',
      date: '2026-09-05',
      time: '20:15',
      format: '2D',
      hallName: 'PhÃ²ng Chiáº¿u 03 (Dolby Atmos)',
      price: 95000,
      availableSeats: 20,
      totalSeats: 90,
    },
    seats: [
      { id: 'E-05', row: 'E', col: 5, type: 'standard', status: 'selected', price: 95000 },
      { id: 'E-06', row: 'E', col: 6, type: 'standard', status: 'selected', price: 95000 },
    ],
    concessions: [],
    customerInfo: {
      fullName: 'Nguyá»…n Mai Trinh',
      phone: '0988 668 886',
      email: 'maitrinh@cineglow.vn',
    },
    paymentMethod: 'vnpay',
    finalTotal: 190000,
    bookedAt: '03/09/2026 14:20',
    qrData: 'CINEGLOW:CG-452189:st-exhuma-01:E-05,E-06',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const openAuthModal = (tab: AuthTab = 'login') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email: string, _password?: string) => {
    const displayName = email.split('@')[0] || 'KhÃ¡ch HÃ ng';
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: displayName,
      email,
      phone: '0912345678',
      membership: 'VIP',
      points: 250,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    closeAuthModal();
    toast.success(
      'ÄÄƒng nháº­p thÃ nh cÃ´ng!',
      `ChÃ o má»«ng ${displayName} quay trá»Ÿ láº¡i vá»›i CineGlow!`
    );
    return true;
  };

  const loginAsDemo = () => {
    const demoUser: UserProfile = {
      id: 'demo_user_01',
      name: 'Nguyá»…n Mai Trinh',
      email: 'maitrinh@cineglow.vn',
      phone: '0988 668 886',
      membership: 'Diamond',
      points: 850,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(demoUser);
    closeAuthModal();
    toast.success(
      'ÄÄƒng nháº­p Demo thÃ nh cÃ´ng!',
      'ChÃ o má»«ng báº¡n tráº£i nghiá»‡m vá»›i tÃ i khoáº£n VIP Diamond cá»§a Nguyá»…n Mai Trinh.'
    );
  };

  const register = (name: string, email: string, phone: string, _password?: string) => {
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone,
      membership: 'Standard',
      points: 50, // 50 welcome points
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    closeAuthModal();
    toast.success(
      'ÄÄƒng kÃ½ tÃ i khoáº£n thÃ nh cÃ´ng!',
      `ChÃ o má»«ng ${name}! Báº¡n nháº­n Ä‘Æ°á»£c +50 Ä‘iá»ƒm CinePoint khá»Ÿi Ä‘áº§u.`
    );
    return true;
  };

  const [userBookings, setUserBookings] = useState<CompletedBooking[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
    } catch {
      return DEFAULT_BOOKINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(userBookings));
    } catch {
      // ignore
    }
  }, [userBookings]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    toast.success('ÄÃ£ lÆ°u há»“ sÆ¡!', 'ThÃ´ng tin tÃ i khoáº£n Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t thÃ nh cÃ´ng.');
  };

  const addBooking = (booking: CompletedBooking) => {
    setUserBookings((prev) => [booking, ...prev]);
    // Add CinePoints (+10% points)
    if (user) {
      const earnedPoints = Math.round(booking.finalTotal / 10000);
      setUser((prev) => (prev ? { ...prev, points: prev.points + earnedPoints } : null));
      if (earnedPoints > 0) {
        setTimeout(() => {
          toast.info(
            'TÃ­ch lÅ©y CinePoint!',
            `+${earnedPoints} Ä‘iá»ƒm CinePoint Ä‘Ã£ Ä‘Æ°á»£c cá»™ng vÃ o tÃ i khoáº£n cá»§a báº¡n.`
          );
        }, 800);
      }
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    toast.info('ÄÃ£ Ä‘Äƒng xuáº¥t', 'TÃ i khoáº£n cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng xuáº¥t an toÃ n. Háº¹n sá»›m gáº·p láº¡i!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authTab,
        userBookings,
        openAuthModal,
        closeAuthModal,
        setAuthTab,
        login,
        loginAsDemo,
        register,
        logout,
        updateUserProfile,
        addBooking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
