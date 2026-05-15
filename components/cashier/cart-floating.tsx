'use client';

import { useState, useMemo } from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CartItems } from './cart-items';
import { PaymentSection } from './payment-section';
import { X, ShoppingCart, Minus, Edit2 } from 'lucide-react';

interface CartFloatingProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClearCart: () => void;
  onCompleteOrder: (paymentMethod: 'cash' | 'card' | 'transfer', paidAmount: number, customerName?: string) => void;
}

export function CartFloating({
  items,
  onUpdateQuantity,
  onRemove,
  onClearCart,
  onCompleteOrder,
}: CartFloatingProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [customerName, setCustomerName] = useState(`Customer - ${Math.floor(Math.random() * 1000)}`);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(customerName);

  // ✅ Calculate everything from items
  const calculatedSubtotal = useMemo(() => {
    const total = items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return sum + (price * item.quantity);
    }, 0);
    console.log('💰 [CartFloating] Calculated subtotal:', total, 'from items:', items);
    return total;
  }, [items]);

  const calculatedTax = useMemo(() => {
    return calculatedSubtotal * 0.1;
  }, [calculatedSubtotal]);

  const calculatedTotal = useMemo(() => {
    return calculatedSubtotal + calculatedTax;
  }, [calculatedSubtotal, calculatedTax]);

  const subtotal = calculatedSubtotal;
  const tax = calculatedTax;
  const total = calculatedTotal;

  console.log('💳 [CartFloating] Render - Items:', items.length, 'Subtotal:', subtotal);

  const toggleCart = () => {
    setIsMinimized(!isMinimized);
  };

  const closeCart = () => {
    setIsMinimized(false);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setCustomerName(tempName);
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setTempName(customerName);
    setIsEditingName(false);
  };

  // Floating Cart Button
  if (isMinimized && items.length > 0) {
    return (
      <button
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-lg transition-all hover:scale-105 p-4 flex items-center space-x-3"
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

  if (items.length === 0) {
    return null;
  }

  // Full Cart Popup
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-96 max-h-[90vh] flex flex-col">
      <Card className="shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-700 to-emerald-600 text-white px-4 py-2 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <h3 className="font-bold text-lg">Detail Transaction</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCart}
              className="hover:bg-emerald-500 rounded p-1 transition"
              title="Minimize"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={closeCart}
              className="hover:bg-emerald-500 rounded p-1 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Customer Name */}
          <div className="bg-white px-4 pt-2 pb-3 border-b border-gray-200 shrink-0">
            <p className="text-xs text-gray-700 font-semibold mb-1">Customer</p>
            {isEditingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 px-2 py-1 border border-emerald-300 rounded text-sm focus:outline-none focus:border-emerald-600"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 h-8"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="px-2 h-8"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-800">{customerName}</p>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-emerald-600 hover:text-emerald-700 p-1"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="px-3 py-3 bg-gray-50 shrink-0">
            <CartItems
              items={items}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          </div>

          {/* Summary */}
          <div className="bg-white px-4 py-3 border-t border-emerald-200 space-y-2 shrink-0">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Sub Total</span>
              <span className="font-semibold text-emerald-900">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Tax (10%)</span>
              <span className="font-semibold text-emerald-900">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Discount</span>
              <span className="font-semibold text-red-600">-Rp 0</span>
            </div>
            <div className="border-t border-emerald-200 pt-2 flex justify-between bg-emerald-50 p-2 rounded -mx-4 px-4">
              <span className="font-bold text-emerald-900">Total Payment</span>
              <span className="font-bold text-lg text-emerald-900">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white px-4 py-3 border-t border-emerald-200 shrink-0">
          <PaymentSection
            subtotal={subtotal}
            tax={tax}
            total={total}
            customerName={customerName}
            onClearCart={onClearCart}
            onCompleteOrder={onCompleteOrder}
            disabled={items.length === 0}
          />
        </div>
      </Card>
    </div>
  );
}
