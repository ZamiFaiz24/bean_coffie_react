import apiClient from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Ubah interface ini untuk menyesuaikan response Laravel
export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserResponse {
  data: User;
  status: string;
}

export const authService = {
  // Login
  async login(email: string, password: string) {
    try {
      console.log('🔵 Sending login request to:', apiClient.defaults.baseURL + '/auth/login');
      
      // Response langsung tanpa wrapper 'data'
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      console.log('✅ Login response:', response.data);

      // Sesuaikan dengan response yang sebenarnya
      if (response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      console.error('❌ Error logging in:', error);
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
