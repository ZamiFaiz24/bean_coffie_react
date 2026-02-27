'use client';

import { Receipt } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ReceiptModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ receipt, isOpen, onClose }: ReceiptModalProps) {
  if (!receipt) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto print:text-black">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            ☕ Bean Coffee Shop
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Receipt Header */}
          <div className="text-center space-y-1 text-sm border-b pb-3">
            <p className="font-bold text-lg">RECEIPT</p>
            <p className="font-mono">Invoice: {receipt.invoice_number}</p>
            <p className="text-xs text-gray-600">{receipt.date}</p>
            <p className="text-xs text-gray-600">Cashier: {receipt.cashier}</p>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="font-bold text-sm">Items:</p>
            <div className="space-y-2 border-b pb-3">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600 text-xs">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(receipt.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%)</span>
              <span className="font-semibold">{formatPrice(receipt.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL</span>
              <span className="text-orange-600">{formatPrice(receipt.total)}</span>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="space-y-1 text-sm border-b pb-3">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-semibold">{receipt.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid</span>
              <span className="font-semibold">{formatPrice(receipt.paid_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Change</span>
              <span className="font-semibold">{formatPrice(receipt.change)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 border-b pb-3">
            <p>Thank you for your purchase!</p>
            <p>Please come again ☕</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 print:hidden">
            <Button 
              onClick={handlePrint} 
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              🖨️ Print
            </Button>
            <Button 
              onClick={onClose} 
              className="bg-orange-600 hover:bg-orange-700"
            >
              ✅ Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
