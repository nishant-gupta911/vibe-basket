// Unified Product interface that works for both API and local data
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;  // Optional: for sale items
  image: string;
  category: string;
  categorySlug?: string;   // Optional: local data has this
  stock?: number;          // Optional: API returns this
  inStock?: boolean;       // Optional: local data has this
  rating?: number;         // Optional: local data has this
  reviewCount?: number;    // Optional: local data has this
  badge?: 'sale' | 'new' | 'bestseller';  // Optional: local data has this
  createdAt?: string;      // Optional: API returns this
  updatedAt?: string;      // Optional: API returns this
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
