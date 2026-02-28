import apiClient from './api';

export interface Product {
  id: number;
  category_id?: number;
  name: string;
  price: string | number;
  stock: number;
  image: string | null;
  description?: string;
  is_active?: boolean | null;
  category?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  type?: string;
  status?: boolean;
}

export interface ProductResponse {
  data: Product[];
  status?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
}

export const productService = {
  async getCashierProducts() {
    try {
      const endpoint = '/products'; 
      
      console.log('🟢 [ProductService] Starting getCashierProducts');
      const response = await apiClient.get<ProductResponse>(endpoint);
      
      console.log('✅ [ProductService] Success! Received data:', {
        count: response.data?.data?.length,
        data: response.data,
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [ProductService] ERROR:', error.message);
      throw error;
    }
  },

  async getCashierCategories() {
    try {
      const endpoint = '/categories';
      
      console.log('🟢 [ProductService] Starting getCashierCategories');
      const response = await apiClient.get<CategoryResponse>(endpoint);
      
      console.log('✅ [ProductService] Categories loaded:', {
        count: response.data?.data?.length,
        data: response.data?.data,
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [ProductService] ERROR:', error.message);
      throw error;
    }
  },

  async getProducts() {
    try {
      console.log('🟢 [ProductService] Starting getProducts');
      const response = await apiClient.get<ProductResponse>('/products');
      console.log('✅ [ProductService] Products fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [ProductService] Error fetching products:', error);
      throw error;
    }
  },

  async getProduct(id: number) {
    try {
      const response = await apiClient.get<{ data: Product }>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  async getProductsByCategory(categoryId: number) {
    try {
      const response = await apiClient.get<ProductResponse>(
        `/categories/${categoryId}/products`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await apiClient.get<{ data: Category[] }>('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async createProduct(data: Partial<Product>) {
    try {
      const response = await apiClient.post<{ data: Product }>('/products', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: number, data: Partial<Product>) {
    try {
      const response = await apiClient.put<{ data: Product }>(
        `/products/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

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
