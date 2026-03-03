'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PaymentSectionProps {
  subtotal: number;
  tax: number;
  total: number;
  customerName?: string;
  onClearCart: () => void;
  onCompleteOrder: (paymentMethod: 'cash' | 'card' | 'transfer', paidAmount: number, customerName?: string) => void;
  disabled?: boolean;
}

export function PaymentSection({
  subtotal,
  tax,
  total,
  customerName,
  onClearCart,
  onCompleteOrder,
  disabled = false,
}: PaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [paidAmount, setPaidAmount] = useState(total);

  const handlePayment = () => {
    if (paidAmount < total) {
      alert('Paid amount must be at least the total');
      return;
    }

    onCompleteOrder(paymentMethod, paidAmount, customerName);
    handleReset();
  };

  const handleReset = () => {
    setPaidAmount(total);
    setPaymentMethod('cash');
    onClearCart();
  };

  const change = paidAmount - total;

  return (
    <div className="space-y-3">
      {/* Payment Method Selection */}
      <div className="flex gap-2">
        {(['cash', 'card', 'transfer'] as const).map(method => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`flex-1 py-2 px-2 rounded-lg font-semibold text-sm transition ${
              paymentMethod === method
                ? 'bg-coffee-600 text-white'
                : 'bg-coffee-100 text-coffee-700 hover:bg-coffee-200'
            }`}
          >
            {method === 'cash' && '💵 Cash'}
            {method === 'card' && '💳 Card'}
            {method === 'transfer' && '📱 Transfer'}
          </button>
        ))}
      </div>

      {/* Paid Amount Input */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-coffee-600">Paid Amount</label>
        <input
          type="number"
          value={paidAmount}
          onChange={(e) => setPaidAmount(Number(e.target.value))}
          className="w-full px-3 py-2 border border-coffee-300 rounded-lg focus:outline-none focus:border-coffee-600 text-sm"
        />
      </div>

      {/* Change Display */}
      <div className={`rounded-lg p-3 ${
        change >= 0
          ? 'bg-green-50 border border-green-300'
          : 'bg-red-50 border border-red-300'
      }`}>
        <p className={`text-xs font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          Change
        </p>
        <p className={`font-bold text-lg ${change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
          Rp {Math.abs(change).toLocaleString('id-ID')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 border-coffee-300 text-coffee-700 hover:bg-coffee-50 text-sm"
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-sm"
          disabled={disabled || paidAmount < total}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
