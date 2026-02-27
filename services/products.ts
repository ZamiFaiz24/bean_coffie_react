import apiClient from './api';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface ProductResponse {
  data: Product[];
  status: string;
}

export const productService = {
  // Get all products
  async getProducts() {
    try {
      const response = await apiClient.get<ProductResponse>('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  async getProduct(id: number) {
    try {
      const response = await apiClient.get<{ data: Product }>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId: number) {
    try {
      const response = await apiClient.get<ProductResponse>(`/categories/${categoryId}/products`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get all categories
  async getCategories() {
    try {
      const response = await apiClient.get<{ data: Category[] }>('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create product (admin only)
  async createProduct(data: Partial<Product>) {
    try {
      const response = await apiClient.post<{ data: Product }>('/products', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product (admin only)
  async updateProduct(id: number, data: Partial<Product>) {
    try {
      const response = await apiClient.put<{ data: Product }>(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete product (admin only)
  async deleteProduct(id: number) {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};
