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
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">{transaction.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">{transaction.cashierName}</p>
                <p className="text-xs text-muted-foreground">{transaction.dateTime}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-bold text-primary">Rp {transaction.amount.toLocaleString()}</p>
                </div>
                <Badge variant={transaction.status === 'paid' ? 'default' : 'destructive'}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
