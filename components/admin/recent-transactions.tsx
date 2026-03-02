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
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{transaction.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">
                  Cashier: {transaction.cashierName || '-'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Customer: {transaction.customerName || '-'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.dateTime).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  Rp {Number(transaction.amount).toLocaleString('id-ID')}
                </p>
                <p className="text-sm capitalize">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
