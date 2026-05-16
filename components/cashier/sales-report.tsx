'use client';

import { useEffect, useState, useMemo } from 'react';
import { transactionService } from '@/services/transactions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as PieChartRechartsType,
} from 'recharts';
import { RotateCcw, TrendingUp, DollarSign, ShoppingCart, Package, Filter } from 'lucide-react';

interface Transaction {
  id: number;
  invoice_code: string;
  customer_name: string;
  total_amount: string;
  paid_amount: string;
  change_amount: string;
  status: string;
  payment_method?: string;
  created_at: string;
  items?: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: string;
    subtotal: string;
  }>;
}

interface SalesData {
  date: string;
  sales: number;
  transactions: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface PaymentMethodData {
  name: string;
  value: number;
}

export function SalesReport() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactions();
      const data = (response as any)?.data?.data ?? (response as any)?.data ?? response;
      const txList = Array.isArray(data) ? data : data?.data ?? [];
      setTransactions(txList);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (!filterDateFrom && !filterDateTo) return true;

      const txDate = new Date(tx.created_at);
      const fromDate = filterDateFrom ? new Date(filterDateFrom) : new Date(0);
      const toDate = filterDateTo ? new Date(filterDateTo) : new Date();
      toDate.setHours(23, 59, 59, 999);

      return txDate >= fromDate && txDate <= toDate;
    });
  }, [transactions, filterDateFrom, filterDateTo]);

  // Calculate sales by date
  const salesByDate = useMemo(() => {
    const map = new Map<string, { sales: number; transactions: number }>();

    filteredTransactions.forEach((tx) => {
      const date = new Date(tx.created_at).toLocaleDateString('id-ID', {
        month: 'short',
        day: 'numeric',
      });

      const current = map.get(date) || { sales: 0, transactions: 0 };
      current.sales += parseFloat(tx.total_amount);
      current.transactions += 1;
      map.set(date, current);
    });

    return Array.from(map.entries())
      .map(([date, data]) => ({
        date,
        sales: Math.round(data.sales),
        transactions: data.transactions,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  }, [filteredTransactions]);

  // Calculate payment method breakdown
  const paymentMethodData = useMemo(() => {
    const map = new Map<string, number>();

    filteredTransactions.forEach((tx) => {
      const method = tx.payment_method?.toLowerCase() || 'unknown';
      map.set(method, (map.get(method) || 0) + parseFloat(tx.total_amount));
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value),
    }));
  }, [filteredTransactions]);

  // Calculate top products
  const topProducts = useMemo(() => {
    const map = new Map<string, { quantity: number; revenue: number }>();

    filteredTransactions.forEach((tx) => {
      (tx.items || []).forEach((item) => {
        const current = map.get(item.product_name) || { quantity: 0, revenue: 0 };
        current.quantity += item.quantity;
        current.revenue += parseFloat(item.subtotal);
        map.set(item.product_name, current);
      });
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: Math.round(data.revenue),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredTransactions]);

  // Calculate summary metrics
  const summary = useMemo(() => {
    const totalSales = filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.total_amount), 0);
    const totalTransactions = filteredTransactions.length;
    const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    // Find top category (most revenue generating product)
    const topCategory = topProducts[0]?.name || 'N/A';

    return {
      totalSales: Math.round(totalSales),
      totalTransactions,
      avgTransaction: Math.round(avgTransaction),
      topCategory,
    };
  }, [filteredTransactions, topProducts]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDateInput = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const COLORS = ['#065F46', '#D4A373', '#6B7280', '#9CA3AF', '#F59E0B', '#D1D5DB'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <Button onClick={fetchTransactions} className="bg-emerald-600 hover:bg-emerald-700">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-emerald-600 text-sm font-medium">Dashboard Analytics</p>
            <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
          </div>
        </div>
        <Button onClick={fetchTransactions} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Modern Filter Section */}
      <Card className="bg-linear-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-emerald-600" />
            <p className="font-semibold text-emerald-900">Filter by Date Range</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-semibold text-emerald-700 mb-2">From Date</label>
              <input
                type="date"
                value={filterDateFrom ? formatDateInput(filterDateFrom) : ''}
                onChange={(e) => setFilterDateFrom(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-gray-900"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-semibold text-emerald-700 mb-2">To Date</label>
              <input
                type="date"
                value={filterDateTo ? formatDateInput(filterDateTo) : ''}
                onChange={(e) => setFilterDateTo(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filterDateFrom || filterDateTo) && (
            <Button
              onClick={() => {
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
            >
              ? Reset Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modern Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Sales */}
        <Card className="border-0 shadow-md hover:shadow-lg transition bg-linear-to-br from-emerald-50 to-emerald-100 border-l-4 border-l-emerald-600">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Total Sales</p>
                <p className="text-3xl font-bold text-emerald-900">{formatCurrency(summary.totalSales)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-emerald-600 opacity-15" />
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border-0 shadow-md hover:shadow-lg transition bg-linear-to-br from-amber-50 to-amber-100 border-l-4 border-l-amber-600">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Transactions</p>
                <p className="text-3xl font-bold text-amber-900">{summary.totalTransactions}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-amber-600 opacity-15" />
            </div>
          </CardContent>
        </Card>

        {/* Avg Transaction */}
        <Card className="border-0 shadow-md hover:shadow-lg transition bg-linear-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-600">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Avg Value</p>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(summary.avgTransaction)}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-600 opacity-15" />
            </div>
          </CardContent>
        </Card>

        {/* Top Category */}
        <Card className="border-0 shadow-md hover:shadow-lg transition bg-linear-to-br from-purple-50 to-purple-100 border-l-4 border-l-purple-600">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">Top Product</p>
                <p className="text-lg font-bold text-purple-900 line-clamp-2">{summary.topCategory}</p>
              </div>
              <Package className="w-10 h-10 text-purple-600 opacity-15" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        {salesByDate.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB' }}
                    formatter={(value: any) => [formatCurrency(value as number), 'Sales']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#065F46"
                    strokeWidth={2}
                    dot={{ fill: '#065F46', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Payment Method Breakdown */}
        {paymentMethodData.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#065F46"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Products Chart */}
      {topProducts.length > 0 && (
          <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Top 5 Products</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={120} />
                <YAxis stroke="#6B7280" yAxisId="left" label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
                <YAxis stroke="#6B7280" yAxisId="right" orientation="right" label={{ value: 'Revenue', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'quantity') return [value, 'Qty'];
                    return [formatCurrency(value as number), 'Revenue'];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="quantity" fill="#D4A373" name="quantity" />
                <Bar yAxisId="right" dataKey="revenue" fill="#065F46" name="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Products Table */}
      {topProducts.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Product Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-emerald-600 bg-linear-to-r from-emerald-50 to-emerald-100">
                    <th className="text-left py-4 px-4 text-emerald-900 font-bold">Product Name</th>
                    <th className="text-right py-4 px-4 text-emerald-900 font-bold">Qty Sold</th>
                    <th className="text-right py-4 px-4 text-emerald-900 font-bold">Revenue</th>
                    <th className="text-right py-4 px-4 text-emerald-900 font-bold">Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-emerald-50 hover:shadow-sm transition">
                      <td className="py-4 px-4 text-gray-900 font-medium">{product.name}</td>
                      <td className="text-right py-4 px-4 text-gray-900 font-semibold">{product.quantity}</td>
                      <td className="text-right py-4 px-4 text-emerald-700 font-bold">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td className="text-right py-4 px-4 text-emerald-600 font-semibold">
                        {formatCurrency(product.revenue / product.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <Card className="bg-linear-to-r from-emerald-50 to-emerald-100 border-emerald-200 border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-emerald-700 text-lg font-semibold">
              {transactions.length === 0 ? 'No sales data available' : 'No sales match the selected filters'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}








