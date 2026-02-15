import { api } from '@/lib/api';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderData {
  shippingAddress?: string;
  notes?: string;
}

export const orderService = {
  createOrder: async (data: CreateOrderData = {}) => {
    const response = await api.post<any>('/orders', data);
    return {
      ...response,
      data: normalizeOrder(response.data),
    };
  },

  getOrders: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get<any[]>(`/orders${params}`);
    return {
      ...response,
      data: (response.data || []).map(normalizeOrder),
    };
  },

  getOrder: async (id: string | number) => {
    const response = await api.get<any>(`/orders/${id}`);
    return {
      ...response,
      data: normalizeOrder(response.data),
    };
  },
};

function normalizeOrder(order: any): Order {
  return {
    id: order?.id,
    userId: order?.userId,
    items: Array.isArray(order?.items) ? order.items : [],
    totalAmount: typeof order?.total === 'number' ? order.total : order?.totalAmount || 0,
    status: String(order?.status || 'pending').toUpperCase(),
    createdAt: order?.createdAt || new Date().toISOString(),
    updatedAt: order?.updatedAt,
  };
}
