import { api } from '@/lib/api';
import { Notification } from '@/types';

export const notificationService = {
  async getNotifications(params?: { unread?: boolean; limit?: number; since?: string }) {
    const response = await api.get('/notifications', { params });
    return response.data as { success: boolean; data: Notification[]; message: string };
  },
  async markRead(ids: string[]) {
    const response = await api.post('/notifications/read', { ids });
    return response.data as { success: boolean; data: { count: number }; message: string };
  },
};
