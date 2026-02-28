'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { productService } from '@/services/products';
import { useCart } from '@/hooks/useCart';
import { Product, Receipt, PaymentMethod, Category } from '@/types';
import { ProductGrid } from './product-grid';
import { CartFloating } from './cart-floating';
import { ReceiptModal } from './receipt-modal';
import { Sidebar } from './sidebar';
import { CashierLayout } from './layout';
import { Button } from '@/components/ui/button';

export function CashierPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
    fetchInitialData();
  }, [router]);

  const fetchInitialData = async () => {
    try {
      setProductsLoading(true);
      
      const [productRes, categoryRes] = await Promise.all([
        productService.getCashierProducts(),
        productService.getCashierCategories(),
      ]);
      
      const productsData = Array.isArray(productRes.data) 
        ? productRes.data 
        : (productRes.data?.data || []);
        
      const categoriesData = categoryRes.data?.data || categoryRes.data || [];
      
      const transformedProducts: Product[] = productsData.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        stock: p.stock,
        image: p.image || null,
        category: p.category,
      }));
      
      setProducts(transformedProducts);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('❌ Error fetching data:', err);
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
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCompleteOrder = (paymentMethod: PaymentMethod) => {
    if (cart.length === 0) return;

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

    setReceipt(newReceipt);
    setIsReceiptOpen(true);
    clearCart();
    setSelectedCategory('all');
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setReceipt(null);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => {
        const categoryId = typeof p.category === 'object' && p.category?.id 
          ? String(p.category.id) 
          : p.category;
        return String(categoryId) === selectedCategory;
      });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-coffee-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-coffee-600 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('Akses ditolak')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-50">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600 font-semibold text-lg mb-4">❌ {error}</p>
          <p className="text-coffee-700">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CashierLayout
        sidebar={
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            user={user}
            onLogout={handleLogout}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        }
        header={
          <div className="bg-gradient-to-r from-coffee-700 to-coffee-800 text-white px-6 py-4 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />
                <h1 className="text-2xl font-bold">Bean Coffee POS</h1>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm">{user?.name}</span>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        }
        main={
          <ProductGrid
            products={filteredProducts}
            isLoading={productsLoading}
            onAddToCart={handleAddToCart}
          />
        }
      />

      {/* Floating Cart */}
      <CartFloating
        items={cart}
        subtotal={getSubtotal()}
        tax={getTax()}
        total={getTotal()}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
        onClearCart={clearCart}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={receipt}
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
      />
    </>
  );
}
