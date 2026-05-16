'use client';

import { useEffect, useState, useMemo } from 'react';
import { transactionService } from '@/services/transactions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, RotateCcw, History, Check, Clock, X, Filter } from 'lucide-react';

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
  items?: any[];
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Filter states
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('');

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

  // Filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Date range filter
      if (filterDateFrom || filterDateTo) {
        const txDate = new Date(tx.created_at);
        const fromDate = filterDateFrom ? new Date(filterDateFrom) : new Date(0);
        const toDate = filterDateTo ? new Date(filterDateTo) : new Date();

        // Set toDate to end of day
        toDate.setHours(23, 59, 59, 999);

        if (txDate < fromDate || txDate > toDate) {
          return false;
        }
      }

      // Payment method filter
      if (filterPaymentMethod && tx.payment_method !== filterPaymentMethod) {
        return false;
      }

      return true;
    });
  }, [transactions, filterDateFrom, filterDateTo, filterPaymentMethod]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateInput = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; icon: React.ReactNode; variant: any }> = {
      paid: { label: 'Paid', icon: <Check className="w-4 h-4" />, variant: 'default' },
      pending: { label: 'Pending', icon: <Clock className="w-4 h-4" />, variant: 'secondary' },
      cancelled: { label: 'Cancelled', icon: <X className="w-4 h-4" />, variant: 'destructive' },
    };
    const badge = statusMap[status] || { label: status, icon: null, variant: 'outline' };
    return (
      <Badge variant={badge.variant} className="flex items-center gap-2">
        {badge.icon}
        {badge.label}
      </Badge>
    );
  };

  const paymentMethods = ['cash', 'card', 'transfer'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-emerald-600">Loading transactions...</p>
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <History className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        </div>
        <Button onClick={fetchTransactions} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="bg-emerald-50 border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-900">Smart Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-emerald-600 mb-2">From Date</label>
              <input
                type="date"
                value={filterDateFrom ? formatDateInput(filterDateFrom) : ''}
                onChange={(e) => setFilterDateFrom(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-3 py-2 border shadow-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-emerald-600 mb-2">To Date</label>
              <input
                type="date"
                value={filterDateTo ? formatDateInput(filterDateTo) : ''}
                onChange={(e) => setFilterDateTo(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-3 py-2 border shadow-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-emerald-600 mb-2">Payment Method</label>
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border adow-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">All Methods</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filterDateFrom || filterDateTo || filterPaymentMethod) && (
            <Button
              onClick={() => {
                setFilterDateFrom('');
                setFilterDateTo('');
                setFilterPaymentMethod('');
              }}
              variant="outline"
              className="mt-4 border-gray-300 text-emerald-600 hover:bg-gray-100"
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Card className="bg-white border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <p className="text-emerald-600 text-lg">
              {transactions.length === 0 ? 'No transactions yet' : 'No transactions match the selected filters'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className="hover:shadow-md transition-all border-0 shadow-2xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                  {/* Invoice */}
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Invoice</p>
                    <p className="font-semibold text-gray-900">{tx.invoice_code}</p>
                  </div>

                  {/* Customer */}
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Customer</p>
                    <p className="text-sm text-gray-900">{tx.customer_name}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Total</p>
                    <p className="font-bold text-emerald-600">{formatCurrency(tx.total_amount)}</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Method</p>
                    <p className="text-sm capitalize text-gray-900">{tx.payment_method || '-'}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs text-emerald-600 font-medium mb-1">Status</p>
                    {getStatusBadge(tx.status)}
                  </div>

                  {/* Actions */}
                  <div className="text-right">
                    <p className="text-xs text-emerald-600 mb-2">{formatDate(tx.created_at)}</p>
                    <Button
                      size="sm"
                      onClick={() => setSelectedTransaction(tx)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            {/* Modern Gradient Header */}
            <div className="bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white p-6 md:p-8 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <History className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Transaction Receipt</p>
                  <h2 className="text-2xl font-bold">#{selectedTransaction.invoice_code}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-8 h-8 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <CardContent className="p-6 md:p-8">

              {/* Modern Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-linear-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 hover:shadow-md transition">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Customer</p>
                  <p className="text-lg font-bold text-emerald-900">{selectedTransaction.customer_name}</p>
                </div>
                <div className="bg-linear-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 hover:shadow-md transition">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Amount</p>
                  <p className="text-lg font-bold text-amber-900">{formatCurrency(selectedTransaction.total_amount)}</p>
                </div>
                <div className="bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Date & Time</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(selectedTransaction.created_at)}</p>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Status</p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              {/* Items Section with Numbering */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  Order Items
                </h3>
                <div className="space-y-3">
                  {(selectedTransaction.items ?? []).map((item, idx) => (
                    <div key={idx} className="flex gap-4 bg-linear-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition">
                      <div className="shrink-0">
                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.quantity} × {formatCurrency(item.price)} = <span className="font-bold text-emerald-600">{formatCurrency(item.subtotal || Number(item.price) * item.quantity)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modern Payment Summary */}
              <div className="bg-linear-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-xl mb-8 shadow-lg">
                <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
                  <span className="text-2xl">💰</span>
                  Payment Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-emerald-500 border-opacity-50">
                    <span className="text-emerald-100 font-medium">Subtotal:</span>
                    <span className="font-bold text-white text-lg">{formatCurrency(selectedTransaction.total_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-emerald-500 border-opacity-50">
                    <span className="text-emerald-100 font-medium">Paid:</span>
                    <span className="font-bold text-white text-lg">{formatCurrency(selectedTransaction.paid_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-emerald-500 bg-opacity-30 p-3 rounded-lg">
                    <span className="text-emerald-50 font-semibold">💵 Change:</span>
                    <span className="font-bold text-yellow-200 text-xl">
                      {formatCurrency(selectedTransaction.change_amount)}
                    </span>
                  </div>
                  {selectedTransaction.payment_method && (
                    <div className="flex justify-between items-center pt-3 border-t border-emerald-500 border-opacity-50">
                      <span className="text-emerald-100 font-medium">Method:</span>
                      <Badge className="bg-white bg-opacity-20 text-white border border-white border-opacity-40 font-semibold">
                        {selectedTransaction.payment_method.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold transition"
                >
                  ← Back to List
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
                >
                  🖨️ Print Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}



