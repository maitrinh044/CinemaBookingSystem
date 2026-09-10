import { apiClient, type ApiResponse } from './apiClient';
import type { UserProfile } from '../contexts/AuthContext';

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export const authService = {
  /**
   * Đăng nhập với email và mật khẩu
   */
  async login(credentials: { email: string; password?: string }): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      if (res.data?.token) {
        localStorage.setItem('cineglow_auth_token', res.data.token);
      }
      return res.data;
    } catch {
      // Fallback mock authentication
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
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      if (res.data?.token) {
        localStorage.setItem('cineglow_auth_token', res.data.token);
      }
      return res.data;
    } catch {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        membership: 'Standard',
        points: 100, // Tặng 100 điểm thưởng thành viên mới
      };
      const mockToken = `jwt_mock_${Date.now()}`;
      localStorage.setItem('cineglow_auth_token', mockToken);
      localStorage.setItem('cineglow_auth_user', JSON.stringify(newUser));
      return { user: newUser, token: mockToken };
    }
  },

  /**
   * Lấy thông tin tài khoản người dùng hiện tại
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const res = await apiClient.get<ApiResponse<UserProfile>>('/auth/me');
      return res.data;
    } catch {
      const stored = localStorage.getItem('cineglow_auth_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  /**
   * Cập nhật thông tin tài khoản
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await apiClient.put<ApiResponse<UserProfile>>('/auth/profile', updates);
      return res.data;
    } catch {
      const current = await this.getCurrentUser();
      const updated = { ...(current || {}), ...updates } as UserProfile;
      localStorage.setItem('cineglow_auth_user', JSON.stringify(updated));
      return updated;
    }
  },

  /**
   * Đăng xuất khỏi hệ thống
   */
  logout(): void {
    localStorage.removeItem('cineglow_auth_token');
    localStorage.removeItem('cineglow_auth_user');
  },

  /**
   * Lấy token hiện tại trong LocalStorage
   */
  getStoredToken(): string | null {
    return localStorage.getItem('cineglow_auth_token');
  },
};
