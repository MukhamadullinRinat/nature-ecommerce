export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  inStock: boolean;
  quantity: number;
  characteristics: Record<string, any>;
  images: string[];
  tags: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  categories: string[];
  tags: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
