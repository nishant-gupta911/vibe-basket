import { api } from '@/lib/api';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  shippingAddress?: string;
  notes?: string;
}

export const orderService = {
  createOrder: async (data: CreateOrderData = {}) => {
    const response = await api.post<Order>('/orders', data);
    return response;
  },

  getOrders: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get<Order[]>(`/orders${params}`);
    return response;
  },

  getOrder: async (id: string | number) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response;
  },
};
