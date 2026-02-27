'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { productService, Product } from '@/services/products';
import { useCart } from '@/hooks/useCart';

export default function Page() {
  return <CashierPage />;
}

function CashierPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart hook
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getSubtotal, getTax } = useCart();

  // Fetch products saat component mount
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
      setProducts(response.data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
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

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  // Filter products berdasarkan search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-orange-200 mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('Akses ditolak')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-600">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <p className="text-red-600 font-semibold text-lg mb-4">❌ {error}</p>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 shadow-2xl sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-lg"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
        {error && !error.includes('Akses ditolak') && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded mb-4 shadow">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Product Grid - 3 columns */}
          <div className="xl:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-600 bg-white shadow-md"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📦 Available Products</h2>
                {productsLoading && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-600 border-t-transparent"></div>
                    <span className="font-semibold">Loading...</span>
                  </div>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-600 text-lg">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 rounded-xl p-4 hover:shadow-xl hover:border-orange-400 transition-all hover:scale-105 flex flex-col cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '☕';
                            }}
                          />
                        ) : (
                          <span className="text-4xl">☕</span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 truncate line-clamp-2 mb-1">
                          {product.name}
                        </p>

                        {product.category && (
                          <p className="text-xs text-orange-600 font-semibold mb-2 bg-orange-100 px-2 py-1 rounded inline-block">
                            {product.category.name}
                          </p>
                        )}

                        <p className="text-lg font-bold text-orange-600 mb-2">
                          {formatPrice(product.price)}
                        </p>

                        {/* Stock Indicator */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600 font-semibold">Stock</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              product.stock > 10
                                ? 'bg-green-100 text-green-700'
                                : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {product.stock}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                product.stock > 10
                                  ? 'bg-green-500'
                                  : product.stock > 0
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full py-2 rounded-lg text-sm font-bold transition transform ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 active:scale-95'
                        }`}
                      >
                        {product.stock === 0 ? '❌ Out' : '➕ Add'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar - 1 column */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-24">
              {/* Cart Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <span>🛒</span>
                  <span>Cart</span>
                  <span className="ml-auto bg-white text-orange-600 px-3 py-1 rounded-full text-lg font-bold">
                    {cart.length}
                  </span>
                </h2>
              </div>

              {/* Cart Items */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3">🛒</div>
                    <p className="text-gray-600 font-semibold">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product_id}
                        className="bg-gradient-to-r from-orange-50 to-white border-2 border-orange-200 rounded-lg p-3 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-orange-600 font-semibold">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-red-600 hover:text-red-700 text-lg font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-orange-100 font-bold"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const qty = parseInt(e.target.value);
                                if (qty > 0) updateQuantity(item.product_id, qty);
                              }}
                              className="w-8 text-center text-sm font-bold border-0 focus:outline-none"
                            />
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-orange-100 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-bold text-orange-600">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Divider */}
              <div className="h-1 bg-gradient-to-r from-orange-300 to-orange-100"></div>

              {/* Totals */}
              <div className="p-4 bg-orange-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-semibold">Subtotal</span>
                    <span className="font-bold text-gray-800">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-semibold">Tax (10%)</span>
                    <span className="font-bold text-gray-800">{formatPrice(getTax())}</span>
                  </div>
                  <div className="border-t-2 border-orange-300 pt-3 flex justify-between">
                    <span className="font-bold text-lg text-gray-800">TOTAL</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select className="w-full border-2 border-orange-300 rounded-lg p-2 text-sm font-semibold focus:outline-none focus:border-orange-600 bg-white">
                    <option>💵 Cash</option>
                    <option>💳 Card</option>
                    <option>📱 QRIS</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => clearCart()}
                    disabled={cart.length === 0}
                    className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🗑️ Clear
                  </button>

                  <button
                    disabled={cart.length === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    ✅ Complete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}