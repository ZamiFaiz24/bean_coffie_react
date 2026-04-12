'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { SummaryCard, TopProduct, LowStockProduct, Transaction } from '@/types';

export function useAdminDashboard() {
  const [summaryCardsData, setSummaryCardsData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, transactionsRes] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/transactions'),
      ]);

      const products = productsRes.data.data || [];
      const txRaw = transactionsRes.data?.data;

      // handle: array | {data: array} | object tunggal
      const allTransactions = Array.isArray(txRaw)
        ? txRaw
        : Array.isArray(txRaw?.data)
        ? txRaw.data
        : txRaw
        ? [txRaw]
        : [];

      console.log('TX first item:', allTransactions[0]); // debug cepat

      const validTransactions = allTransactions.filter((t: any) =>
        ['paid', 'completed', 'success'].includes(String(t.status || '').toLowerCase())
      );

      const totalRevenue = validTransactions.reduce((sum: number, t: any) => {
        return sum + (parseFloat(t.total_amount) || 0);
      }, 0);

      const totalOrders = validTransactions.length;
      const totalProducts = products.length || 0;
      const lowStockCount = products.filter((p: any) => (p.stock || 0) <= 5).length || 0;

      setSummaryCardsData([
        {
          title: "Today's Revenue",
          value: `Rp ${Math.floor(totalRevenue).toLocaleString('id-ID')}`,
          subtitle: 'Total sales today',
          type: 'revenue',
          trend: 12,
        },
        {
          title: 'Total Orders Today',
          value: totalOrders.toString(),
          subtitle: 'Number of transactions',
          type: 'orders',
          trend: 8,
        },
        {
          title: 'Total Products',
          value: totalProducts.toString(),
          subtitle: 'Items in inventory',
          type: 'products',
          trend: 0,
        },
        {
          title: 'Low Stock Items',
          value: lowStockCount.toString(),
          subtitle: 'Items need restocking',
          type: 'low-stock',
          trend: -2,
        },
      ]);

      // Top products
      const topProductsMap = new Map<number, TopProduct>();

      validTransactions.forEach((transaction: any) => {
        const items = transaction.items || [];
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            const productId = item.product_id;
            const existing = topProductsMap.get(productId);
            const qty = parseFloat(item.quantity) || 0;  // ✅ Ubah dari item.qty ke item.quantity
            const subtotal = parseFloat(item.subtotal) || 0;

            if (existing) {
              existing.sold += qty;
              existing.revenue += subtotal;
            } else {
              topProductsMap.set(productId, {
                id: productId,
                name: item.product_name || 'Unknown',
                sold: qty,
                revenue: subtotal,
                rank: 0,
              });
            }
          });
        }
      });

      const sortedTopProducts = Array.from(topProductsMap.values())
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5)
        .map((p, idx) => {
          // Find product image from products list
          const productData = products.find((prod: any) => prod.id === p.id);
          return {
            ...p,
            rank: idx + 1,
            image_url: productData?.image_url || null,
          };
        });

      setTopProducts(sortedTopProducts);

      // Low stock products
      const lowStock = products
        .filter((p: any) => (p.stock || 0) <= 5)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          stock: p.stock || 0,
          status: (p.stock || 0) === 0 ? ('out' as const) : ('low' as const),
        }));

      setLowStockProducts(lowStock);

      // Recent transactions
      const recentTransactions = validTransactions
        .slice(-5)
        .reverse()
        .map((t: any) => {
          const cashierName =
            typeof t.cashier === 'string'
              ? t.cashier
              : t.cashier?.name || t.cashier_name || '-';

          return {
            id: String(t.id ?? ''),
            invoiceNumber: t.invoice_code || `INV-${t.id}`,
            cashierName,
            customerName: t.customer_name || '-',
            amount: parseFloat(t.total_amount) || 0,
            status: t.status || 'paid',
            dateTime: t.created_at || new Date().toISOString(),
          };
        });

      setTransactions(recentTransactions);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Gagal fetch data dashboard');
    } finally {
      setLoading(false);
    }
  };

  return {
    summaryCardsData,
    topProducts,
    lowStockProducts,
    transactions,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}