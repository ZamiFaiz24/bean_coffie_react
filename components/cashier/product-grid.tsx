'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, onAddToCart }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-muted h-48 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-square bg-muted">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="p-3 space-y-2">
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <div className="flex justify-between items-center">
              <span className="text-primary font-bold">Rp {product.price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
            </div>
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="w-full"
            >
              Add
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
