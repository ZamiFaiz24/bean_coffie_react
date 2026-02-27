'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export default function CashierPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cek apakah user sudah login
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Ambil user dari localStorage
    const storedUser = authService.getStoredUser();
    
    // Cek apakah user adalah cashier atau admin
    if (storedUser?.role !== 'cashier' && storedUser?.role !== 'admin') {
      setError('Akses ditolak: Anda harus login sebagai cashier');
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">💳 Cashier POS</h1>
            <p className="text-gray-600 text-sm">Welcome, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Cashier Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Nama</p>
              <p className="text-lg font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Role</p>
              <p className="text-lg font-medium">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {user?.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* POS System Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Placeholder for products */}
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">☕</div>
                  <p className="text-sm font-medium">Espresso</p>
                  <p className="text-xs text-gray-600">Rp 30.000</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">☕</div>
                  <p className="text-sm font-medium">Latte</p>
                  <p className="text-xs text-gray-600">Rp 40.000</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">☕</div>
                  <p className="text-sm font-medium">Cappuccino</p>
                  <p className="text-xs text-gray-600">Rp 40.000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="border-b pb-4 mb-4">
              <p className="text-gray-600 text-sm">Your cart is empty</p>
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span>Rp 0</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-600">Rp 0</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select className="w-full border border-gray-300 rounded-lg p-2 text-sm">
                <option>Cash</option>
                <option>Card</option>
                <option>QRIS</option>
              </select>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Complete Order
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}