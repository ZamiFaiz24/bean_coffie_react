'use client';

import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItems({ items, onUpdateQuantity, onRemove }: CartItemsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 h-full">
        <div className="text-6xl mb-3">🛒</div>
        <p className="text-gray-600 font-semibold text-center">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card
          key={item.product_id}
          className="bg-white border border-gray-200 p-3"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-600">
                {formatPrice(item.price)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.product_id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
            >
              ✕
            </Button>
          </div>

          {/* Quantity & Subtotal */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1 bg-gray-100 border border-gray-300 rounded overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                className="px-2 py-1 h-auto hover:bg-orange-100 text-gray-700"
              >
                −
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const qty = parseInt(e.target.value);
                  if (qty > 0) onUpdateQuantity(item.product_id, qty);
                }}
                className="w-10 text-center text-sm font-bold border-0 h-auto p-1 focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                className="px-2 py-1 h-auto hover:bg-orange-100 text-gray-700"
              >
                +
              </Button>
            </div>
            <p className="text-sm font-bold text-orange-600 min-w-fit">
              {formatPrice(item.subtotal)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
