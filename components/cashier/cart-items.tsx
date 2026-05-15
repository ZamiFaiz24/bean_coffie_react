'use client';

import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItems({
  items,
  onUpdateQuantity,
  onRemove,
}: CartItemsProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-emerald-600 font-semibold">Cart is empty</p>
      </div>
    );
  }

  const handleMinus = (item: CartItem) => {
    console.log('Minus clicked for:', item.id, 'Current qty:', item.quantity);
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handlePlus = (item: CartItem) => {
    console.log('Plus clicked for:', item.id, 'Current qty:', item.quantity);
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div
          key={item.id}
          className="bg-white rounded-lg p-3 border border-gray-200 transition-all hover:shadow-md"
        >
          {/* Item Header with Image */}
          <div className="flex gap-3 mb-2">
            {/* Product Image */}
            <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  ☕
                </div>
              )}
            </div>

            {/* Item Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Rp {item.price.toLocaleString('id-ID')}
              </p>
              <p className="text-sm font-bold text-emerald-600 mt-1">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => {
                console.log('Remove clicked for:', item.id);
                onRemove(item.id);
              }}
              className="text-gray-400 hover:text-red-500 rounded p-1 transition-all hover:scale-110 shrink-0"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quantity Control */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 border border-gray-200">
            <button
              onClick={() => handleMinus(item)}
              className={`text-emerald-600 rounded p-1 transition-all ${
                item.quantity <= 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-emerald-600 hover:text-white hover:scale-110 cursor-pointer'
              }`}
              disabled={item.quantity <= 1}
              title="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-bold text-gray-900 text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() => handlePlus(item)}
              className="text-emerald-600 hover:bg-emerald-600 hover:text-white rounded p-1 transition-all hover:scale-110 cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
