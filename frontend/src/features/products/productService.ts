import { api } from '@/lib/api';
import { Product } from '@/types';

// Re-export Product for convenience
export type { Product } from '@/types';

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    totalPages: number;
  };
}

export interface CategoryResponseItem {
  name: string;
  count: number;
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

    const response = await api.get<{
      products: Array<any>;
      pagination: ProductsResponse['pagination'];
    }>(`/products?${params.toString()}`);

    const normalizedProducts = (response.data.products || []).map((product) => ({
      ...product,
      name: product.name || product.title || 'Untitled Product',
      description: product.description || '',
      image: product.image || '/placeholder.svg',
      category: product.category || 'uncategorized',
      stock: typeof product.stock === 'number' ? product.stock : 0,
      inStock: typeof product.inStock === 'boolean' ? product.inStock : product.stock > 0,
    })) as Product[];

    return {
      ...response,
      data: {
        products: normalizedProducts,
        pagination: response.data.pagination,
      },
    };
  },

  getProduct: async (id: string | number) => {
    const response = await api.get<any>(`/products/${id}`);
    const product = response.data;
    return {
      ...response,
      data: {
        ...product,
        name: product?.name || product?.title || 'Untitled Product',
        description: product?.description || '',
        image: product?.image || '/placeholder.svg',
        category: product?.category || 'uncategorized',
        stock: typeof product?.stock === 'number' ? product.stock : 0,
        inStock: typeof product?.inStock === 'boolean' ? product.inStock : product?.stock > 0,
      } as Product,
    };
  },

  getCategories: async () => {
    const response = await api.get<CategoryResponseItem[]>('/products/categories');
    return response;
  },

  searchProducts: async (query: string) => {
    const response = await api.get<ProductsResponse>(`/products/search?search=${encodeURIComponent(query)}`);
    return response;
  },
};
