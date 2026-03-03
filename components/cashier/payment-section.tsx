'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type PaymentMethod = 'cash' | 'card' | 'transfer';

interface PaymentSectionProps {
  subtotal: number;
  tax: number;
  total: number;
  onClearCart: () => void;
  onCompleteOrder: (paymentMethod: PaymentMethod, paidAmount: number, customerName?: string) => void; // ✅ Tambah customerName
  disabled?: boolean;
}

export function PaymentSection({
  subtotal,
  tax,
  total,
  onClearCart,
  onCompleteOrder,
  disabled = false,
}: PaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paidAmount, setPaidAmount] = useState<number>(total);
  const [customerName, setCustomerName] = useState<string>(''); // ✅ Tambah state

  const handleCompleteOrder = () => {
    if (paidAmount < total) {
      alert('Paid amount must be >= total');
      return;
    }
    onCompleteOrder(paymentMethod, paidAmount, customerName); // ✅ Pass customerName
  };

  return (
    <div className="space-y-4">
      {/* Customer Name Input */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-coffee-700">Customer Name (Optional):</label>
        <input
          type="text"
          placeholder="Enter customer name..."
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-coffee-300 rounded-lg focus:outline-none focus:border-coffee-600"
        />
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-coffee-700">Payment Method:</label>
        <div className="grid grid-cols-3 gap-2">
          {(['cash', 'card', 'transfer'] as const).map((method) => (
            <Button
              key={method}
              onClick={() => setPaymentMethod(method)}
              variant={paymentMethod === method ? 'default' : 'outline'}
              className={`text-xs ${
                paymentMethod === method
                  ? 'bg-coffee-600 text-white'
                  : 'border-coffee-300'
              }`}
              size="sm"
            >
              {method === 'cash' && '💵'}
              {method === 'card' && '💳'}
              {method === 'transfer' && '📱'}
              <span className="ml-1">{method}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Paid Amount Input */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-coffee-700">Paid Amount:</label>
        <input
          type="number"
          value={paidAmount}
          onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 text-sm border border-coffee-300 rounded-lg focus:outline-none focus:border-coffee-600"
        />
      </div>

      {/* Summary */}
      <div className="bg-coffee-50 p-3 rounded-lg space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span className="font-semibold">Rp {tax.toLocaleString('id-ID')}</span>
        </div>
        <div className="border-t border-coffee-200 pt-1 flex justify-between font-bold">
          <span>Total:</span>
          <span className="text-coffee-600">Rp {total.toLocaleString('id-ID')}</span>
        </div>
        <div className="border-t border-coffee-200 pt-1 flex justify-between font-bold">
          <span>Change:</span>
          <span className="text-green-600">
            Rp {Math.max(0, paidAmount - total).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onClearCart}
          variant="outline"
          className="flex-1 border-coffee-300 text-xs"
          size="sm"
          disabled={disabled}
        >
          Clear Cart
        </Button>
        <Button
          onClick={handleCompleteOrder}
          className="flex-1 bg-coffee-600 hover:bg-coffee-700 text-white text-xs"
          size="sm"
          disabled={disabled || paidAmount < total}
        >
          Complete Order ✓
        </Button>
      </div>
    </div>
  );
}
