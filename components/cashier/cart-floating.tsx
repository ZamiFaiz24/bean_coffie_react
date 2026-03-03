'use client';

import { useState } from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CartItems } from './cart-items';
import { PaymentSection } from './payment-section';
import { X, ShoppingCart, Minus } from 'lucide-react';

interface CartFloatingProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClearCart: () => void;
  onCompleteOrder: (paymentMethod: 'cash' | 'card' | 'transfer', paidAmount: number, customerName?: string) => void; // ✅ Tambah customerName
}

export function CartFloating({
  items,
  subtotal,
  tax,
  total,
  onUpdateQuantity,
  onRemove,
  onClearCart,
  onCompleteOrder,
}: CartFloatingProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleCart = () => {
    setIsMinimized(!isMinimized);
  };

  const closeCart = () => {
    setIsMinimized(false);
  };

  // Floating Cart Button (always visible when has items and minimized)
  if (isMinimized && items.length > 0) {
    return (
      <button
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-coffee-600 to-coffee-700 text-white rounded-full shadow-xl hover:shadow-lg transition-all hover:scale-110 p-4 flex items-center space-x-3"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {items.length}
          </span>
        </div>
        <span className="font-bold text-lg">Cart</span>
      </button>
    );
  }

  // Empty state - no cart shown
  if (items.length === 0) {
    return null;
  }

  // Full Cart Popup
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 max-h-[85vh] shadow-xl border-2 border-coffee-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <h3 className="font-bold text-lg">Cart ({items.length})</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCart}
              className="hover:bg-coffee-500 rounded p-1 transition"
              title="Minimize"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={closeCart}
              className="hover:bg-coffee-500 rounded p-1 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 bg-coffee-50">
          <CartItems
            items={items}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        </div>

        {/* Payment Section - Fixed Bottom */}
        <div className="border-t border-coffee-200 bg-white p-4">
          <PaymentSection
            subtotal={subtotal}
            tax={tax}
            total={total}
            onClearCart={onClearCart}
            onCompleteOrder={onCompleteOrder} // ✅ Sekarang menerima customerName juga
            disabled={items.length === 0}
          />
        </div>
      </Card>
    </div>
  );
}