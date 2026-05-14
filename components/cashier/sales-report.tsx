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
import { RotateCcw, TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';

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

  const COLORS = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#BC8F8F', '#D3D3D3'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-coffee-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-coffee-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <Button onClick={fetchTransactions} className="bg-coffee-600 hover:bg-coffee-700">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-coffee-700" />
          <h1 className="text-3xl font-bold text-coffee-800">Sales Report</h1>
        </div>
        <Button onClick={fetchTransactions} className="bg-coffee-600 hover:bg-coffee-700 text-white">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="bg-coffee-50 border-coffee-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-2">From Date</label>
              <input
                type="date"
                value={filterDateFrom ? formatDateInput(filterDateFrom) : ''}
                onChange={(e) => setFilterDateFrom(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-3 py-2 border border-coffee-200 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-600"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-2">To Date</label>
              <input
                type="date"
                value={filterDateTo ? formatDateInput(filterDateTo) : ''}
                onChange={(e) => setFilterDateTo(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-3 py-2 border border-coffee-200 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-600"
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
              variant="outline"
              className="mt-4 border-coffee-300 text-coffee-700 hover:bg-coffee-100"
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Sales */}
        <Card className="border-coffee-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-coffee-600 font-medium mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-coffee-900">{formatCurrency(summary.totalSales)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-coffee-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border-coffee-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-coffee-600 font-medium mb-1">Transactions</p>
                <p className="text-2xl font-bold text-coffee-900">{summary.totalTransactions}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-coffee-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Avg Transaction */}
        <Card className="border-coffee-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-coffee-600 font-medium mb-1">Avg Transaction</p>
                <p className="text-2xl font-bold text-coffee-900">{formatCurrency(summary.avgTransaction)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-coffee-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Top Category */}
        <Card className="border-coffee-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-coffee-600 font-medium mb-1">Top Category</p>
                <p className="text-lg font-bold text-coffee-900">{summary.topCategory}</p>
              </div>
              <Package className="w-8 h-8 text-coffee-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        {salesByDate.length > 0 && (
          <Card className="border-coffee-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-coffee-800 mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8d7c3" />
                  <XAxis dataKey="date" stroke="#a0826d" />
                  <YAxis stroke="#a0826d" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f5e6d3', border: '1px solid #d4a574' }}
                    formatter={(value: any) => [formatCurrency(value as number), 'Sales']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8B4513"
                    strokeWidth={2}
                    dot={{ fill: '#8B4513', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Payment Method Breakdown */}
        {paymentMethodData.length > 0 && (
          <Card className="border-coffee-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-coffee-800 mb-4">Payment Method Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8B4513"
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
        <Card className="border-coffee-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-coffee-800 mb-4">Top 5 Products</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8d7c3" />
                <XAxis dataKey="name" stroke="#a0826d" angle={-45} textAnchor="end" height={120} />
                <YAxis stroke="#a0826d" yAxisId="left" label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
                <YAxis stroke="#a0826d" yAxisId="right" orientation="right" label={{ value: 'Revenue', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f5e6d3', border: '1px solid #d4a574' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'quantity') return [value, 'Qty'];
                    return [formatCurrency(value as number), 'Revenue'];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="quantity" fill="#CD853F" name="quantity" />
                <Bar yAxisId="right" dataKey="revenue" fill="#8B4513" name="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Products Table */}
      {topProducts.length > 0 && (
        <Card className="border-coffee-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-coffee-800 mb-4">Product Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-coffee-200">
                    <th className="text-left py-3 px-4 text-coffee-700 font-semibold">Product Name</th>
                    <th className="text-right py-3 px-4 text-coffee-700 font-semibold">Qty Sold</th>
                    <th className="text-right py-3 px-4 text-coffee-700 font-semibold">Revenue</th>
                    <th className="text-right py-3 px-4 text-coffee-700 font-semibold">Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => (
                    <tr key={idx} className="border-b border-coffee-100 hover:bg-coffee-50 transition">
                      <td className="py-3 px-4 text-coffee-900">{product.name}</td>
                      <td className="text-right py-3 px-4 text-coffee-800 font-semibold">{product.quantity}</td>
                      <td className="text-right py-3 px-4 text-coffee-700 font-semibold">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td className="text-right py-3 px-4 text-coffee-600">
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
        <Card className="bg-white border-coffee-200">
          <CardContent className="p-12 text-center">
            <p className="text-coffee-600 text-lg">
              {transactions.length === 0 ? 'No sales data available' : 'No sales match the selected filters'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
