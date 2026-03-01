'use client';

import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({
  products,
  isLoading,
  onAddToCart,
}: ProductGridProps) {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getCategoryName = (category: any): string => {
    if (!category) return '';
    if (typeof category === 'string') return category;
    if (typeof category === 'object' && category.name) return category.name;
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-coffee-800">📦 Products</h2>
        {isLoading && (
          <div className="flex items-center space-x-2 text-coffee-600">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-coffee-600 border-t-transparent"></div>
            <span className="font-semibold text-sm">Loading...</span>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-coffee-600 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const categoryName = getCategoryName(product.category);
            
            return (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 border-coffee-200 hover:border-coffee-400 bg-white"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="w-full h-40 bg-coffee-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<span class="text-5xl">☕</span>';
                        }}
                      />
                    ) : (
                      <span className="text-5xl">☕</span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-coffee-800 line-clamp-2 mb-1">
                      {product.name}
                    </p>

                    {categoryName && (
                      <Badge variant="secondary" className="text-xs mb-2 bg-coffee-200 text-coffee-700">
                        {categoryName}
                      </Badge>
                    )}

                    <p className="text-lg font-bold text-coffee-500 mb-2">
                      {formatPrice(product.price)}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-coffee-600 font-semibold">Stock:</span>
                      <Badge
                        variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {product.stock}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-coffee-600 hover:bg-coffee-700 disabled:opacity-50 text-white font-semibold"
                    size="sm"
                  >
                    {product.stock === 0 ? '❌ Out of Stock' : '➕ Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
