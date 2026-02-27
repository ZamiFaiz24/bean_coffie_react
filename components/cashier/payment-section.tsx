'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentSectionProps {
  total: number;
  onPayment?: (method: string, amount: number) => void;
}

export function PaymentSection({ total, onPayment }: PaymentSectionProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const method = formData.get('payment-method') as string;
    const amount = Number(formData.get('amount'));
    
    if (onPayment) {
      onPayment(method, amount);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="cash"
                  name="payment-method"
                  value="cash"
                  defaultChecked
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <Label htmlFor="cash" className="cursor-pointer font-normal">
                  💵 Cash
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="card"
                  name="payment-method"
                  value="card"
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <Label htmlFor="card" className="cursor-pointer font-normal">
                  💳 Card
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="qris"
                  name="payment-method"
                  value="qris"
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <Label htmlFor="qris" className="cursor-pointer font-normal">
                  📱 QRIS
                </Label>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-lg font-bold">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount Paid</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0"
              min={total}
              defaultValue={total}
              required
            />
          </div>

          {/* Process Button */}
          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
            Process Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
