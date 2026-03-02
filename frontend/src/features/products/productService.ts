import { api } from '@/lib/api';
import { Product } from '@/types';

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

type RawProduct = Partial<Product> & {
  id?: string | number;
  title?: string;
};

const normalizeProduct = (product: RawProduct): Product => ({
  ...product,
  id: String(product?.id ?? ''),
  name: product?.name || product?.title || 'Untitled Product',
  description: product?.description || '',
  image: product?.image || '/placeholder.svg',
  category: product?.category || 'uncategorized',
  stock: typeof product?.stock === 'number' ? product.stock : 0,
  inStock: typeof product?.inStock === 'boolean' ? product.inStock : (product?.stock ?? 0) > 0,
});

export const productService = {
  getProducts: async (query: ProductQuery = {}) => {
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.category) params.append('category', query.category);
    if (query.search) params.append('search', query.search);
    if (typeof query.minPrice === 'number') params.append('minPrice', query.minPrice.toString());
    if (typeof query.maxPrice === 'number') params.append('maxPrice', query.maxPrice.toString());

    const suffix = params.toString();
    const response = await api.get<ProductsResponse>(suffix ? `/products?${suffix}` : '/products');

    return {
      ...response,
      data: {
        products: (response.data?.products || []).map(normalizeProduct),
        pagination: response.data?.pagination,
      },
    };
  },

  getProduct: async (id: string | number) => {
    const response = await api.get<Product>(`/products/${id}`);

    return {
      ...response,
      data: normalizeProduct(response.data),
    };
  },

  getCategories: async () => {
    return api.get<CategoryResponseItem[]>('/products/categories');
  },
};
