'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio } from '@/components/ui/radio';

interface PaymentSectionProps {
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: (method: 'CASH' | 'QRIS' | 'DEBIT', paidAmount: number) => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export function PaymentSection({
  subtotal,
  tax,
  total,
  onCheckout,
  isLoading,
  isDisabled,
}: PaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS' | 'DEBIT'>('CASH');
  const [paidAmount, setPaidAmount] = useState<number>(total);

  const change = paymentMethod === 'CASH' ? Math.max(0, paidAmount - total) : 0;

  const handleCheckout = () => {
    if (paymentMethod === 'CASH' && paidAmount < total) {
      alert('Paid amount must be >= total');
      return;
    }
    onCheckout(paymentMethod, paidAmount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totals */}
        <div className="space-y-2 border-b pb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>Rp {tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">Rp {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <p className="font-semibold text-sm">Payment Method</p>
          {(['CASH', 'QRIS', 'DEBIT'] as const).map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Radio
                id={method}
                checked={paymentMethod === method}
                onCheckedChange={() => setPaymentMethod(method)}
              />
              <label htmlFor={method} className="text-sm cursor-pointer">{method}</label>
            </div>
          ))}
        </div>

        {/* Cash Input */}
        {paymentMethod === 'CASH' && (
          <div className="space-y-2 pt-2 border-t">
            <label className="text-sm font-semibold">Paid Amount</label>
            <Input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="text-lg"
            />
            <div className="bg-muted p-2 rounded">
              <div className="flex justify-between text-sm">
                <span>Change</span>
                <span className="font-bold text-primary">Rp {change.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={isDisabled || isLoading}
          className="w-full h-10 text-base font-semibold"
          size="lg"
        >
          {isLoading ? 'Processing...' : 'Checkout'}
        </Button>
      </CardContent>
    </Card>
  );
}
