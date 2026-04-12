'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TopProduct } from '@/types';
import { Trophy } from 'lucide-react';

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  const topThree = products.slice(0, 3);
  const others = products.slice(3);

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '📊';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top 3 Products */}
        {topThree.length > 0 && (
          <div className="space-y-4">
            {/* Rank 1 - Largest */}
            {topThree[0] && (
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                    {topThree[0].image_url ? (
                      <img src={topThree[0].image_url} alt={topThree[0].name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{getMedalIcon(1)}</span>
                      <h3 className="text-2xl font-bold text-slate-900">{topThree[0].name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">Top performing product</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-600">Units Sold</p>
                        <p className="text-lg font-bold text-slate-900">{Math.round(topThree[0].sold)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Revenue</p>
                        <p className="text-lg font-bold text-amber-600">Rp {topThree[0].revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 2 & 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topThree.slice(1).map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-300 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{getMedalIcon(product.rank)}</span>
                        <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{Math.round(product.sold)} sold</p>
                      <p className="text-sm font-bold text-slate-700">Rp {product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Products (Rank 4+) */}
        {others.length > 0 && (
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-700">Other Top Sellers</h4>
            <div className="space-y-2">
              {others.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-bold text-slate-600 flex-shrink-0">#{product.rank}</span>
                    <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-600">{Math.round(product.sold)} sold</p>
                    <p className="text-sm font-semibold text-slate-700">Rp {Math.round(product.revenue).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-600">No products sold yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
