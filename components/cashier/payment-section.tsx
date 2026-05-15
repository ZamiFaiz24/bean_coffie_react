'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';

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
            className={`flex-1 py-2 px-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md ${
              paymentMethod === method
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-900 hover:bg-emerald-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {method === 'cash' && <Wallet className="w-4 h-4" />}
              {method === 'card' && <CreditCard className="w-4 h-4" />}
              {method === 'transfer' && <Smartphone className="w-4 h-4" />}

              <span className="capitalize">{method}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Paid Amount Input */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-emerald-600">Paid Amount</label>
        <input
          type="number"
          value={paidAmount}
          onChange={(e) => setPaidAmount(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 text-sm"
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
          className="flex-1 border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400 text-sm transition-all"
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all hover:shadow-md hover:scale-105"
          disabled={disabled || paidAmount < total}
        >
          ✅ Complete Order
        </Button>
      </div>
    </div>
  );
}
