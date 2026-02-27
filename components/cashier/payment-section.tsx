'use client';

import { useState } from 'react';
import { PaymentMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface PaymentSectionProps {
  subtotal: number;
  tax: number;
  total: number;
  onClearCart: () => void;
  onCompleteOrder: (paymentMethod: PaymentMethod) => void;
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  return (
    <div className="space-y-4">
      {/* Payment Method */}
      <div className="space-y-2">
        <Label htmlFor="payment-method" className="text-sm font-bold text-gray-700">
          Payment Method
        </Label>
        <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
          <SelectTrigger id="payment-method" className="w-full border-2 border-orange-300 focus:border-orange-600">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">💵 Cash</SelectItem>
            <SelectItem value="QRIS">📱 QRIS</SelectItem>
            <SelectItem value="DEBIT">💳 Debit Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={onClearCart}
          disabled={disabled}
          variant="secondary"
          className="w-full bg-gray-400 hover:bg-gray-500 text-white"
        >
          🗑️ Clear Cart
        </Button>

        <Button
          onClick={() => onCompleteOrder(paymentMethod)}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-bold"
        >
          ✅ Complete Order
        </Button>
      </div>
    </div>
  );
}
