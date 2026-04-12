import apiClient from './api';

export interface TransactionItem {
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: number;
  invoice_number: string; // ✅ Ubah dari transaction_number ke invoice_number
  customer_name?: string; // ✅ Tambah field ini
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment_method: 'cash' | 'qris' | 'debit' | 'card' | 'transfer'; // ✅ Tambah opsi
  paid_amount: number;
  change?: number;
  status: 'completed' | 'pending' | 'cancelled';
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionPayload {
  customer_name: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
  paid_amount: number;
}

export interface TransactionResponse {
  data: Transaction;
  status: string;
  message?: string;
}

export interface TransactionsListResponse {
  data: Transaction[];
  status: string;
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const transactionService = {
  // Create transaction
  async createTransaction(data: CreateTransactionPayload) {
    try {
      const response = await apiClient.post<TransactionResponse>('/transactions', data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating transaction:', error);
      throw error;
    }
  },

  // Get all transactions
  async getTransactions(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get<TransactionsListResponse>('/transactions', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      throw error;
    }
  },

  // Get single transaction
  async getTransaction(id: number) {
    try {
      const response = await apiClient.get<TransactionResponse>(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching transaction ${id}:`, error);
      throw error;
    }
  },

  // ✅ Cancel transaction (sesuai route backend)
  async cancelTransaction(id: number) {
    try {
      const response = await apiClient.post<TransactionResponse>(`/transactions/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error cancelling transaction ${id}:`, error);
      throw error;
    }
  },

  // Get transaction by date range (untuk laporan)
  async getTransactionsByDateRange(startDate: string, endDate: string) {
    try {
      const response = await apiClient.get<TransactionsListResponse>('/transactions', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching transaction report:', error);
      throw error;
    }
  },

  // Get daily revenue
  async getDailyRevenue(date: string) {
    try {
      const response = await apiClient.get('/transactions/daily-revenue', {
        params: { date },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching daily revenue:', error);
      throw error;
    }
  },
};
