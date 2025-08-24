import axios from 'axios';
import type { Product, ProductsResponse } from '../types/Product';

// Use relative URLs in development (proxy) or full URL in production
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  // Get all products with optional filters
  async getProducts(filters?: {
    category?: string;
    tag?: string;
    search?: string;
  }): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/api/products?${params.toString()}`);
    return response.data;
  },

  // Get product by ID
  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    const response = await api.get('/api/categories');
    return response.data;
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get('/api/featured');
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  },
};

export default productService;
