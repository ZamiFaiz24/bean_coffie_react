'use client';

import { Receipt } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Printer, Download } from 'lucide-react';

interface ReceiptModalProps {
  receipt: Receipt;
  isOpen: boolean; // ✅ Tambah ini
  onClose: () => void;
}

export function ReceiptModal({ receipt, isOpen, onClose }: ReceiptModalProps) {
  if (!isOpen) return null; // ✅ Tambah check ini

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=600,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${receipt.invoice_number}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { text-align: center; margin-bottom: 20px; }
              .receipt-item { display: flex; justify-content: space-between; margin: 10px 0; }
              .total { border-top: 1px solid #000; padding-top: 10px; font-weight: bold; }
            </style>
          </head>
          <body>
            <h2>☕ Bean Coffee Receipt</h2>
            <p><strong>Invoice:</strong> ${receipt.invoice_number}</p>
            <p><strong>Customer:</strong> ${receipt.customer_name || 'Walk-in'}</p>
            <p><strong>Date:</strong> ${receipt.date}</p>
            <p><strong>Cashier:</strong> ${receipt.cashier}</p>
            <hr>
            ${receipt.items.map(item => `
              <div class="receipt-item">
                <span>${item.name} x${item.quantity}</span>
                <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            `).join('')}
            <hr>
            <div class="receipt-item">
              <span>Subtotal:</span>
              <span>Rp ${receipt.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div class="receipt-item">
              <span>Tax (10%):</span>
              <span>Rp ${receipt.tax.toLocaleString('id-ID')}</span>
            </div>
            <div class="receipt-item total">
              <span>Total:</span>
              <span>Rp ${receipt.total.toLocaleString('id-ID')}</span>
            </div>
            <div class="receipt-item">
              <span>Paid:</span>
              <span>Rp ${receipt.paid_amount.toLocaleString('id-ID')}</span>
            </div>
            <div class="receipt-item">
              <span>Change:</span>
              <span>Rp ${receipt.change.toLocaleString('id-ID')}</span>
            </div>
            <p style="text-align: center; margin-top: 30px; font-size: 12px;">
              Payment Method: ${receipt.payment_method}
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white px-6 py-4 flex justify-between items-center sticky top-0">
          <h3 className="text-lg font-bold">✅ Order Successfully Created!</h3>
          <button
            onClick={onClose}
            className="hover:bg-coffee-500 rounded p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Invoice Number */}
          <div className="bg-coffee-50 p-4 rounded-lg text-center">
            <p className="text-sm text-coffee-600">Invoice Number</p>
            <p className="text-2xl font-bold text-coffee-800">{receipt.invoice_number}</p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-coffee-600">Customer:</span>
              <span className="font-semibold">{receipt.customer_name || 'Walk-in'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-coffee-600">Cashier:</span>
              <span className="font-semibold">{receipt.cashier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-coffee-600">Date:</span>
              <span className="font-semibold">{receipt.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-coffee-600">Payment:</span>
              <span className="font-semibold uppercase">{receipt.payment_method}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-coffee-200 pt-4">
            <p className="font-semibold text-coffee-800 mb-3">Items</p>
            <div className="space-y-2">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-coffee-600">x{item.quantity} @ Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-coffee-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">Rp {receipt.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span className="font-semibold">Rp {receipt.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold text-coffee-800 bg-coffee-50 p-2 rounded">
              <span>Total:</span>
              <span>Rp {receipt.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid Amount:</span>
              <span className="font-semibold">Rp {receipt.paid_amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-green-600 font-bold">
              <span>Change:</span>
              <span>Rp {receipt.change.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handlePrint}
              className="flex-1 bg-coffee-600 hover:bg-coffee-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
