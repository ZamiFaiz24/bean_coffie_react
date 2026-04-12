'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <p className="font-medium text-slate-900">{transaction.invoiceNumber}</p>
                <p className="text-sm text-slate-600">
                  Cashier: {transaction.cashierName || '-'}
                </p>
                <p className="text-sm text-slate-600">
                  Customer: {transaction.customerName || '-'}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(transaction.dateTime).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-amber-600">
                  Rp {Number(transaction.amount).toLocaleString('id-ID')}
                </p>
                <p className="text-sm capitalize text-slate-600">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
