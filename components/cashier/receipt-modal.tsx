'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt } from '@/types';
import { Printer } from 'lucide-react';

interface ReceiptModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ receipt, isOpen, onClose }: ReceiptModalProps) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm print:text-xs">
          {/* Header */}
          <div className="text-center border-b pb-3">
            <h3 className="text-lg font-bold">BeanStock Coffee</h3>
            <p className="text-muted-foreground text-xs">Professional Coffee Shop</p>
          </div>

          {/* Invoice Info */}
          <div className="space-y-1 text-xs border-b pb-3">
            <div className="flex justify-between">
              <span>Invoice:</span>
              <span className="font-mono font-bold">{receipt.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{receipt.date}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-1 border-b pb-3">
            {receipt.items.map((item) => (
              <div key={item.product_id} className="flex justify-between text-xs">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 border-b pb-3">
            <div className="flex justify-between text-xs">
              <span>Subtotal</span>
              <span>Rp {receipt.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Tax (10%)</span>
              <span>Rp {receipt.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {receipt.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-1 border-b pb-3 text-xs">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-bold">{receipt.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid Amount</span>
              <span>Rp {receipt.paid_amount.toLocaleString()}</span>
            </div>
            {receipt.change > 0 && (
              <div className="flex justify-between text-primary font-bold">
                <span>Change</span>
                <span>Rp {receipt.change.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Thank you for your purchase!</p>
            <p>Enjoy your coffee!</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
