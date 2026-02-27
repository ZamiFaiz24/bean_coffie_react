'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TopProduct } from '@/types';

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500';
      case 2:
        return 'bg-gray-400';
      case 3:
        return 'bg-orange-600';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className={`${getRankBadgeColor(product.rank)} text-white w-8 h-8 flex items-center justify-center`}>
                  #{product.rank}
                </Badge>
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sold} sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">Rp {product.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
