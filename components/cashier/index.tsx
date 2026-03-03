'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Receipt, CartItem } from '@/types';
import { authService } from '@/services/auth';
import { productService } from '@/services/products';
import { transactionService } from '@/services/transactions';
import { useCart } from '@/hooks/useCart';
import { CashierLayout } from './layout';
import { CategoryFilter } from './category-filter';
import { ProductGrid } from './product-grid';
import { CartFloating } from './cart-floating';
import { ReceiptModal } from './receipt-modal';
import { Search, Menu, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/context/SidebarContext';

export function CashierPage() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar(); // ✅ Gunakan dari context
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  // Hapus: const [sidebarOpen, setSidebarOpen] = useState(false);

  // Receipt state
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Cart hook
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    // ✅ HAPUS: getTotal, getSubtotal, getTax
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
        productService.getCashierProducts() as Promise<{ data: any[] }>,
        productService.getCashierCategories() as Promise<{ data: any[] }>,
      ]);

      const productsData = productRes.data || [];
      const categoriesData = categoryRes.data || [];

      const transformedProducts: Product[] = productsData.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        stock: p.stock,
        image: p.image_url || null,
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
      console.error('Error logging out:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      alert('Product out of stock');
      return;
    }
    addToCart(product);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    console.log('Handle Update quantity:', productId, quantity);
    if (quantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    // ✅ Pastikan call langsung ke hook function
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    console.log('Handle Remove item:', productId);
    removeFromCart(productId);
  };

  const handleCompleteOrder = async (
    paymentMethod: 'cash' | 'card' | 'transfer',
    paidAmount: number,
    customerName?: string
  ) => {
    if (cart.length === 0) return;

    try {
      setProductsLoading(true);

      const orderItems = cart.map(item => ({
        product_id: Number(item.id),
        quantity: item.quantity,
        price: item.price,
      }));

      // ✅ Calculate sendiri di sini atau gunakan dari CartFloating
      const subtotal = cart.reduce((sum, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return sum + (price * item.quantity);
      }, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      const response = await transactionService.createTransaction({
        customer_name: customerName || 'Walk-in Customer',
        items: orderItems,
        payment_method: paymentMethod,
        paid_amount: paidAmount,
      });

      const now = new Date();
      const newReceipt: Receipt = {
        invoice_number: response.data.invoice_number,
        customer_name: customerName || 'Walk-in Customer',
        date: now.toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        cashier: user?.name || 'Unknown',
        items: cart,
        subtotal: subtotal, // ✅ Gunakan nilai yang baru dihitung
        tax: tax,
        total: total,
        payment_method: paymentMethod,
        paid_amount: paidAmount,
        change: paidAmount - total,
      };

      setReceipt(newReceipt);
      setIsReceiptOpen(true);

      clearCart();
      setSelectedCategory('all');

      console.log('✅ Order created successfully:', response.data);
    } catch (error: any) {
      console.error('❌ Error creating order:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setReceipt(null);
  };

  // Filter products by category & search
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category?.id === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4">☕</div>
          <p className="text-coffee-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('Akses ditolak')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <p className="text-coffee-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <CashierLayout user={user} onLogout={handleLogout}>
      <div className="p-6 space-y-6">
        {/* ✅ Alert Banner */}
        {showAlert && (
          <div className="animate-slide-up bg-gradient-to-r from-coffee-600 to-coffee-700 text-white rounded-lg p-4 flex justify-between items-center shadow-lg">
            <div>
              <p className="font-semibold">Welcome, {user?.name}! 👋</p>
              <p className="text-sm text-coffee-100">Ready to serve? Let's start taking orders!</p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="text-white hover:bg-coffee-500 p-2 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ✅ Search Header - Search Besar dengan Filter */}
        <div className="grid grid-cols-12 gap-4">
          {/* Center Box: Search Bar - 11 kolom (lebih besar) */}
          <div className="col-span-11 bg-white rounded-lg p-4 border border-coffee-200 flex items-center">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Product Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-coffee-50 border border-coffee-300 rounded-lg focus:outline-none focus:border-coffee-600 text-sm"
              />
            </div>
          </div>

          {/* Right Box: Filter Button - 1 kolom */}
          <div className="col-span-1 bg-white rounded-lg p-4 border border-coffee-200 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-coffee-800 hover:bg-coffee-100"
              title="Filter by price (coming soon)"
            >
              <Filter className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg p-4 border border-coffee-200">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Product Grid */}
        <div className="bg-white rounded-lg p-6 border border-coffee-200">
          <ProductGrid
            products={filteredProducts}
            isLoading={productsLoading}
            cartItems={cart}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Cart Floating */}
      {cart.length > 0 && (
        <CartFloating
          items={cart} // ✅ Pastikan ini tetap ter-update
          onUpdateQuantity={handleUpdateQuantity} // ✅ Pass handler yang benar
          onRemove={handleRemoveItem} // ✅ Pass handler yang benar
          onClearCart={clearCart}
          onCompleteOrder={handleCompleteOrder}
        />
      )}

      {/* Receipt Modal */}
      {isReceiptOpen && receipt && (
        <ReceiptModal
          receipt={receipt}
          isOpen={isReceiptOpen}
          onClose={handleCloseReceipt}
        />
      )}
    </CashierLayout>
  );
}
