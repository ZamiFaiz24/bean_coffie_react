'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { LowStockProduct } from '@/types';

interface LowStockAlertsProps {
  products: LowStockProduct[];
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  return (
    <Card className="border-red-200 bg-brand-surface shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-text">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-brand-text">{product.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-text/70">{product.stock} units</span>
                <Badge variant={product.status === 'out' ? 'destructive' : 'secondary'}>
                  {product.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
