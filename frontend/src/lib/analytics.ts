import { api } from '@/lib/api';

export const trackEvent = async (event: string, meta?: Record<string, any>) => {
  try {
    await api.post('/analytics', { event, meta });
  } catch {
    // Fail silently to avoid impacting UX
  }
};
