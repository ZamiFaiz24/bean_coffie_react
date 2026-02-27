import apiClient from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  data?: {
    user: User;
    token: string;
  };
  status: string;
  message?: string;
}

export interface UserResponse {
  data: User;
  status: string;
}

export const authService = {
  // Login
  async login(email: string, password: string) {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      if (response.data.data?.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await apiClient.post('/auth/logout', {});
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiClient.get<UserResponse>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Get stored user from localStorage
  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Get stored token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  },

  // Check user role
  hasRole(role: 'admin' | 'cashier'): boolean {
    const user = this.getStoredUser();
    return user?.role === role;
  },
};
