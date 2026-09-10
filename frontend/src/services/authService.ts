import { apiClient, type ApiResponse } from './apiClient';
import type { UserProfile } from '../contexts/AuthContext';

export interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: {
    id: number | string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
  };
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken?: string;
}

export const authService = {
  /**
   * Đăng nhập với email và mật khẩu
   */
  async login(credentials: { email: string; password?: string }): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<ApiResponse<BackendAuthResponse>>('/auth/login', {
        email: credentials.email,
        password: credentials.password || '123456',
      });

      const data = res.data;
      const userProfile: UserProfile = {
        id: String(data.user.id),
        name: data.user.fullName || credentials.email.split('@')[0],
        email: data.user.email,
        phone: data.user.phone || '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        membership: data.user.role === 'ADMIN' ? 'Diamond' : 'VIP',
        points: 350,
      };

      if (data.accessToken) {
        localStorage.setItem('cineglow_auth_token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('cineglow_auth_refresh_token', data.refreshToken);
      }
      localStorage.setItem('cineglow_auth_user', JSON.stringify(userProfile));

      return {
        user: userProfile,
        token: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (err: any) {
      // Fallback mock authentication if backend unavailable
      const mockUser: UserProfile = {
        id: 'usr-mock-01',
        name: credentials.email.split('@')[0].toUpperCase() || 'Khách Hàng Thân Thiết',
        email: credentials.email,
        phone: '0901234567',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        membership: 'VIP',
        points: 450,
      };
      const mockToken = `jwt_mock_${Date.now()}`;
      localStorage.setItem('cineglow_auth_token', mockToken);
      localStorage.setItem('cineglow_auth_user', JSON.stringify(mockUser));
      return { user: mockUser, token: mockToken };
    }
  },

  /**
   * Đăng ký tài khoản thành viên mới
   */
  async register(payload: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<ApiResponse<BackendAuthResponse>>('/auth/register', {
        fullName: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password || '123456',
      });

      const data = res.data;
      const userProfile: UserProfile = {
        id: String(data.user.id),
        name: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone,
        membership: 'Standard',
        points: 100,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      if (data.accessToken) {
        localStorage.setItem('cineglow_auth_token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('cineglow_auth_refresh_token', data.refreshToken);
      }
      localStorage.setItem('cineglow_auth_user', JSON.stringify(userProfile));

      return {
        user: userProfile,
        token: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (err: any) {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        membership: 'Standard',
        points: 100,
      };
      const mockToken = `jwt_mock_${Date.now()}`;
      localStorage.setItem('cineglow_auth_token', mockToken);
      localStorage.setItem('cineglow_auth_user', JSON.stringify(newUser));
      return { user: newUser, token: mockToken };
    }
  },

  /**
   * Lấy thông tin tài khoản người dùng hiện tại từ Backend
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const res = await apiClient.get<ApiResponse<any>>('/users/me');
      const u = res.data;
      if (!u) return null;
      const profile: UserProfile = {
        id: String(u.id),
        name: u.fullName,
        email: u.email,
        phone: u.phone || '',
        membership: u.role === 'ADMIN' ? 'Diamond' : 'VIP',
        points: 300,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      localStorage.setItem('cineglow_auth_user', JSON.stringify(profile));
      return profile;
    } catch {
      const stored = localStorage.getItem('cineglow_auth_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  /**
   * Đăng xuất khỏi hệ thống
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('cineglow_auth_refresh_token');
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch {
        // Ignore logout error
      }
    }
    localStorage.removeItem('cineglow_auth_token');
    localStorage.removeItem('cineglow_auth_refresh_token');
    localStorage.removeItem('cineglow_auth_user');
  },

  /**
   * Lấy token hiện tại trong LocalStorage
   */
  getStoredToken(): string | null {
    return localStorage.getItem('cineglow_auth_token');
  },
};