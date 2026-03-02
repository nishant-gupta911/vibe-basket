import { api } from '@/lib/api';
import { Product } from '@/types';

export interface AdminProductInput {
  title: string;
  description?: string;
  category: string;
  price: number;
  image?: string;
  inStock?: boolean;
  stock?: number;
  tags?: string[];
}

export const adminProductService = {
  list: async () => api.get<{ products: Product[]; pagination: { total: number } }>('/products?limit=50'),
  create: async (data: AdminProductInput) => api.post<Product>('/products', data),
  update: async (id: string, data: Partial<AdminProductInput>) => api.patch<Product>(`/products/${id}`, data),
  remove: async (id: string) => api.delete<{ id: string }>(`/products/${id}`),
};
