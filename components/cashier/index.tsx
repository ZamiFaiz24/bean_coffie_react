'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { productService } from '@/services/products';
import { useCart } from '@/hooks/useCart';
import { Product, Receipt, PaymentMethod } from '@/types';
import { ProductGrid } from './product-grid';
import { CartItems } from './cart-items';
import { PaymentSection } from './payment-section';
import { ReceiptModal } from './receipt-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const TAX_RATE = 0.1;

export function CashierPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Receipt state
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Cart hook
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getSubtotal,
    getTax,
  } = useCart();

  // Check auth & fetch products
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = authService.getStoredUser();
    
    if (storedUser?.role !== 'cashier' && storedUser?.role !== 'admin') {
      setError('Akses ditolak: Anda harus login sebagai cashier');
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    setUser(storedUser);
    setLoading(false);
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productService.getCashierProducts();
      
      // Transform data untuk match Product interface
      const transformedProducts: Product[] = (response.data || []).map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        stock: p.stock,
        image: p.image_url || null,
        category: p.category?.name || '',
      }));
      
      setProducts(transformedProducts);
      console.log('✅ Products loaded:', transformedProducts.length);
    } catch (err: any) {
      console.error('❌ Error fetching products:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) return;
    addToCart(product);
    console.log('✅ Added to cart:', product.name);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCompleteOrder = (paymentMethod: PaymentMethod) => {
    console.log('🔵 [handleCompleteOrder] Called with method:', paymentMethod);
    console.log('🔵 [handleCompleteOrder] Cart length:', cart.length);
    
    if (cart.length === 0) {
      console.log('❌ [handleCompleteOrder] Cart is empty, returning');
      return;
    }

    // Generate receipt
    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    const newReceipt: Receipt = {
      invoice_number: invoiceNumber,
      date: now.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      cashier: user?.name || 'Unknown',
      items: cart,
      subtotal: getSubtotal(),
      tax: getTax(),
      total: getTotal(),
      payment_method: paymentMethod,
      paid_amount: getTotal(),
      change: 0,
    };

    console.log('✅ [handleCompleteOrder] Receipt created:', newReceipt);
    
    // Show receipt
    setReceipt(newReceipt);
    console.log('✅ [handleCompleteOrder] Receipt set, isReceiptOpen will be true');
    
    setIsReceiptOpen(true);
    console.log('✅ [handleCompleteOrder] isReceiptOpen set to true');
    
    // Clear cart
    clearCart();
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setReceipt(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-orange-600 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && error.includes('Akses ditolak')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <Card className="max-w-md p-6">
          <div className="text-center">
            <p className="text-red-600 font-semibold text-lg mb-4">❌ {error}</p>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">☕</div>
              <div>
                <h1 className="text-3xl font-bold text-white">Bean Coffee POS</h1>
                <p className="text-orange-100 text-sm">Cashier System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-white font-semibold">{user?.name}</p>
                <p className="text-orange-100 text-sm">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                🚪 Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && !error.includes('Akses ditolak') && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Grid - 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>📦 Products</span>
                  {productsLoading && (
                    <span className="text-sm font-normal text-orange-600">
                      Loading...
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductGrid
                  products={products}
                  isLoading={productsLoading}
                  onAddToCart={handleAddToCart}
                />
              </CardContent>
            </Card>
          </div>

          {/* Cart & Payment - 1 column */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🛒 Cart</span>
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                    {cart.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="max-h-64 overflow-y-auto">
                  <CartItems
                    items={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-semibold">{formatPrice(getTax())}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">{formatPrice(getTotal())}</span>
                  </div>
                </div>

                <Separator />

                {/* Payment Section */}
                <PaymentSection
                  subtotal={getSubtotal()}
                  tax={getTax()}
                  total={getTotal()}
                  onClearCart={clearCart}
                  onCompleteOrder={handleCompleteOrder}
                  disabled={cart.length === 0}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={receipt}
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
      />
    </div>
  );
}
