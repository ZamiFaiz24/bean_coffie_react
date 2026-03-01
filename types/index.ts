export interface Product {
  id: number;  // pastikan number, bukan string
  name: string;
  price: string;
  stock: number;
  image_url: string | null;
  is_active: number | null;
  category_id?: number;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string | null;
}

export interface Receipt {
  invoice_number: string;
  date: string;
  cashier: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod;
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
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
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
  status: 'out' | 'low';
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  cashierName: string;
  amount: number;
  status: 'paid' | 'cancelled';
  dateTime: string;
}
