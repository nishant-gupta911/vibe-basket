import { api } from '@/lib/api';
import { Product } from '@/types';

// Re-export Product for convenience
export type { Product } from '@/types';

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const productService = {
  getProducts: async (query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.category) params.append('category', query.category);
    if (query.search) params.append('search', query.search);
    if (query.minPrice) params.append('minPrice', query.minPrice.toString());
    if (query.maxPrice) params.append('maxPrice', query.maxPrice.toString());

    const response = await api.get<ProductsResponse>(`/products?${params.toString()}`);
    return response;
  },

  getProduct: async (id: string | number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response;
  },

  getCategories: async () => {
    const response = await api.get<string[]>('/products/categories');
    return response;
  },

  searchProducts: async (query: string) => {
    const response = await api.get<ProductsResponse>(`/products/search?query=${query}`);
    return response;
  },
};
