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
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">{product.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{product.stock} units</span>
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
