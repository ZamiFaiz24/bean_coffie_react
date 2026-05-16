'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="bg-brand-surface border-gray-200 shadow-card">
      <CardHeader>
        <CardTitle className="text-brand-text">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
            >
              <div>
                <p className="font-medium text-brand-text">{transaction.invoiceNumber}</p>
                <p className="text-sm text-brand-text/70">
                  Cashier: {transaction.cashierName || '-'}
                </p>
                <p className="text-sm text-brand-text/70">
                  Customer: {transaction.customerName || '-'}
                </p>
                <p className="text-xs text-brand-text/50">
                  {new Date(transaction.dateTime).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-brand-accent">
                  Rp {Number(transaction.amount).toLocaleString('id-ID')}
                </p>
                <p className="text-sm capitalize text-brand-text/70">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
