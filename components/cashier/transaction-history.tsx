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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-650 border-t-transparent mx-auto mb-4"></div>
          <p className="text-emerald-650">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <Button onClick={fetchTransactions} className="bg-emerald-650 hover:bg-emerald-700">
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
          <History className="w-8 h-8 text-emerald-700" />
          <h1 className="text-3xl font-bold text-charcoal-900">Transaction History</h1>
        </div>
        <Button onClick={fetchTransactions} className="bg-emerald-650 hover:bg-emerald-700 text-white">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="bg-emerald-50 border-charcoal-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-emerald-700" />
            <h3 className="font-semibold text-charcoal-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">From Date</label>
              <input
                type="date"
                value={filterDateFrom ? formatDateInput(filterDateFrom) : ''}
                onChange={(e) => setFilterDateFrom(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-3 py-2 border border-charcoal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-650"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">To Date</label>
              <input
                type="date"
                value={filterDateTo ? formatDateInput(filterDateTo) : ''}
                onChange={(e) => setFilterDateTo(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-3 py-2 border border-charcoal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-650"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Payment Method</label>
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-charcoal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-650"
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
              className="mt-4 border-charcoal-300 text-emerald-700 hover:bg-charcoal-100"
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Card className="bg-white border-charcoal-200">
          <CardContent className="p-12 text-center">
            <p className="text-emerald-650 text-lg">
              {transactions.length === 0 ? 'No transactions yet' : 'No transactions match the selected filters'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className="hover:shadow-md transition-all border-charcoal-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                  {/* Invoice */}
                  <div>
                    <p className="text-xs text-emerald-650 font-medium">Invoice</p>
                    <p className="font-semibold text-coffee-900">{tx.invoice_code}</p>
                  </div>

                  {/* Customer */}
                  <div>
                    <p className="text-xs text-emerald-650 font-medium">Customer</p>
                    <p className="text-sm text-charcoal-900">{tx.customer_name}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-xs text-emerald-650 font-medium">Total</p>
                    <p className="font-bold text-emerald-700">{formatCurrency(tx.total_amount)}</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-xs text-emerald-650 font-medium">Method</p>
                    <p className="text-sm capitalize text-charcoal-900">{tx.payment_method || '-'}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs text-emerald-650 font-medium mb-1">Status</p>
                    {getStatusBadge(tx.status)}
                  </div>

                  {/* Actions */}
                  <div className="text-right">
                    <p className="text-xs text-emerald-650 mb-2">{formatDate(tx.created_at)}</p>
                    <Button
                      size="sm"
                      onClick={() => setSelectedTransaction(tx)}
                      className="bg-emerald-650 hover:bg-emerald-700 text-white"
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
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-charcoal-200">
            <CardContent className="p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-charcoal-200">
                <h2 className="text-2xl font-bold text-charcoal-900">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-coffee-400 hover:text-emerald-700 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-emerald-650 mb-1">Invoice Number</p>
                  <p className="font-bold text-lg text-coffee-900">{selectedTransaction.invoice_code}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-emerald-650 mb-1">Customer Name</p>
                  <p className="font-bold text-lg text-coffee-900">{selectedTransaction.customer_name}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-emerald-650 mb-1">Transaction Date</p>
                  <p className="font-semibold text-charcoal-900">{formatDate(selectedTransaction.created_at)}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-emerald-650 mb-2">Status</p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              {/* Items Section */}
              <div className="mb-8">
                <h3 className="font-bold text-charcoal-900 mb-4 pb-2 border-b border-charcoal-200">Items Purchased</h3>
                <div className="space-y-2">
                  {(selectedTransaction.items ?? []).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-emerald-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-coffee-900">{item.product_name}</p>
                        <p className="text-sm text-emerald-650">
                          {item.quantity}x @ {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-emerald-700">
                        {formatCurrency(item.subtotal || Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-linear-to-r from-charcoal-50 to-emerald-50 p-6 rounded-lg mb-8">
                <h3 className="font-bold text-charcoal-900 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Total Amount:</span>
                    <span className="font-bold text-coffee-900">{formatCurrency(selectedTransaction.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Paid Amount:</span>
                    <span className="font-bold text-coffee-900">{formatCurrency(selectedTransaction.paid_amount)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-charcoal-200">
                    <span className="text-emerald-700 font-semibold">Change:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(selectedTransaction.change_amount)}
                    </span>
                  </div>
                  {selectedTransaction.payment_method && (
                    <div className="flex justify-between pt-3 border-t border-charcoal-200">
                      <span className="text-emerald-700">Payment Method:</span>
                      <Badge variant="outline" className="bg-charcoal-100 text-charcoal-900 border-charcoal-300">
                        {selectedTransaction.payment_method.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setSelectedTransaction(null)}
                className="w-full bg-emerald-650 hover:bg-emerald-700 text-white font-semibold"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
