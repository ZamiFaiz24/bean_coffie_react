export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null; // ✅ Ganti dari image_url ke image
  category: Category;
  is_active?: boolean; // ✅ Tambah optional
}

export interface Category {
  id: number | string;
  name: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image: string | null;
  category: Category;
}

export interface Receipt {
  invoice_number: string;
  customer_name?: string; // ✅ Tambah field ini
  date: string;
  cashier: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment_method: string;
  paid_amount: number;
  change: number;
}

export type PaymentMethod = 'CASH' | 'QRIS' | 'DEBIT';

export interface TransactionPayload {
  items: Array<{ product_id: string; qty: number; price: number }>;
  payment_method: 'CASH' | 'QRIS' | 'DEBIT';
  paid_amount: number;
  total_amount: number;
}

export interface SummaryCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode; // Tambahkan ini
  trend: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sold: number;
  revenue: number;
  rank: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  status: 'low' | 'out';
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  cashierName: string;
  customerName?: string; // new
  amount: number;
  status: string;
  dateTime: string;
}
