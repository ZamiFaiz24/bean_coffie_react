'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProductGrid } from './product-grid';
import { CartItems } from './cart-items';
import { PaymentSection } from './payment-section';
import { ReceiptModal } from './receipt-modal';
import { Product, CartItem, Receipt } from '@/types';

const TAX_RATE = 0.1;

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Espresso', price: 25000, stock: 30, image: '/images/products/espresso.jpg', category: 'coffee' },
  { id: '2', name: 'Americano', price: 30000, stock: 25, image: '/images/products/americano.jpg', category: 'coffee' },
  { id: '3', name: 'Cappuccino', price: 35000, stock: 20, image: '/images/products/cappuccino.jpg', category: 'coffee' },
  { id: '4', name: 'Latte', price: 38000, stock: 22, image: '/images/products/latte.jpg', category: 'coffee' },
  { id: '5', name: 'Iced Coffee', price: 32000, stock: 15, image: '/images/products/iced-coffee.jpg', category: 'coffee' },
  { id: '6', name: 'Mocha', price: 40000, stock: 18, image: '/images/products/mocha.jpg', category: 'coffee' },
  { id: '7', name: 'Green Tea', price: 25000, stock: 20, image: '/images/products/green-tea.jpg', category: 'beverage' },
  { id: '8', name: 'Black Tea', price: 25000, stock: 18, image: '/images/products/black-tea.jpg', category: 'beverage' },
  { id: '9', name: 'Croissant', price: 35000, stock: 12, image: '/images/products/croissant.jpg', category: 'food' },
  { id: '10', name: 'Chocolate Cake', price: 45000, stock: 10, image: '/images/products/chocolate-cake.jpg', category: 'food' },
  { id: '11', name: 'Ham & Cheese Sandwich', price: 55000, stock: 8, image: '/images/products/ham-cheese-sandwich.jpg', category: 'food' },
  { id: '12', name: 'Chicken Sandwich', price: 60000, stock: 10, image: '/images/products/chicken-sandwich.jpg', category: 'food' },
];

export function CashierPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
    toast({ title: `${product.name} added to cart` });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
    toast({ title: 'Item removed from cart', variant: 'destructive' });
  };

  const handleCheckout = async (method: 'CASH' | 'QRIS' | 'DEBIT', paidAmount: number) => {
    setIsLoading(true);
    try {
      const transactionPayload = {
        items: cart.map((item) => ({
          product_id: item.product_id,
          qty: item.quantity,
          price: item.price,
        })),
        payment_method: method,
        paid_amount: paidAmount,
        total_amount: total,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const invoiceNumber = `INV-${Date.now()}`;
      const change = method === 'CASH' ? paidAmount - total : 0;

      setReceipt({
        invoice_number: invoiceNumber,
        date: new Date().toLocaleString('id-ID'),
        items: cart,
        subtotal,
        tax,
        total,
        payment_method: method,
        paid_amount: paidAmount,
        change,
      });

      setShowReceipt(true);
      setCart([]);
      toast({ title: 'Transaction successful!', variant: 'default' });
    } catch (error) {
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-screen bg-background">
      {/* Products Section */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b sticky top-0 bg-background z-10">
          <h1 className="text-2xl font-bold">BeanStock Cashier</h1>
          <p className="text-sm text-muted-foreground">Select products to add to cart</p>
        </div>
        <ProductGrid
          products={products}
          isLoading={false}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Cart & Payment Section */}
      <div className="w-full lg:w-80 border-l overflow-auto p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold mb-3">Shopping Cart ({cart.length})</h2>
          <CartItems
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        <PaymentSection
          subtotal={subtotal}
          tax={tax}
          total={total}
          onCheckout={handleCheckout}
          isLoading={isLoading}
          isDisabled={cart.length === 0}
        />
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={receipt}
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
      />
    </div>
  );
}
