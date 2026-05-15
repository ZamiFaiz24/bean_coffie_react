'use client';

import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  cartItems?: any[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({
  products,
  isLoading,
  cartItems = [],
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

  const getImageUrl = (image: string | null | undefined): string | null => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${image}`;
  };

  // ✅ Check dengan product_id
  const isProductInCart = (productId: string) => {
    return cartItems.some(item => 
      item.product_id === productId || item.id === productId
    );
  };

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(
      item => item.product_id === productId || item.id === productId
    );
    return item?.quantity || 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        {isLoading && (
          <div className="flex items-center space-x-2 text-emerald-600">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
            <span className="font-semibold text-sm">Loading...</span>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-emerald-600 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const categoryName = getCategoryName(product.category);
            const imageUrl = getImageUrl(product.image);
            const inCart = isProductInCart(String(product.id));
            const cartQty = getCartQuantity(String(product.id));
            
            return (
              <Card
                key={product.id}
                className="bg-white h-full flex flex-col shadow-soft transition-all duration-200 cursor-pointer border-2 border-gray-200 hover:border-emerald-600 hover:scale-100 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* Image */}
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
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

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">
                      {product.name}
                    </p>

                    {categoryName && (
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-amber-400 text-gray-900 text-xs font-semibold"
                      >
                        {categoryName}
                      </Badge>
                    )}
                    <p className="text-lg font-bold text-gray-800 mb-2">
                      {formatPrice(product.price)}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-emerald-600 font-semibold">Stock:</span>
                      <Badge
                        className={`
                          text-xs font-semibold

                          ${
                            product.stock > 10
                              ? 'bg-emerald-100 text-emerald-700'
                              : product.stock > 0
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }
                        `}
                      >
                        {product.stock}
                      </Badge>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full text-gray-700 font-semibold transition-all mt-2 rounded-md px-3 py-2 hover:shadow-md hover:scale-100 ${
                      inCart
                        ? 'bg-green-600 hover:bg-green-700' // ✅ Hijau jika di cart
                        : 'bg-amber-400 hover:bg-amber-500 hover:text-gray-900' // Amber accent jika belum
                    } disabled:opacity-50`}
                    type="button"
                  >
                    {product.stock === 0 ? (
                      '❌ Out of Stock'
                    ) : inCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add More
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </span>
                    )}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
