import { apiClient, type ApiResponse } from './apiClient';

export interface AppNotification {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const res = await apiClient.get<ApiResponse<AppNotification[]>>('/notifications');
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const res = await apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
      return res.data?.unreadCount || 0;
    } catch {
      return 0;
    }
  },

  async markAsRead(id: number): Promise<void> {
    try {
      await apiClient.request(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch {
      // Ignore
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.request('/notifications/read-all', { method: 'PATCH' });
    } catch {
      // Ignore
    }
  },
};