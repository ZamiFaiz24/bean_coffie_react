'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔵 Mencoba login dengan:', formData.email);
      const response = await authService.login(formData.email, formData.password);
      
      console.log('✅ Login berhasil:', response);
      
      // Sesuaikan dengan response yang sebenarnya (tanpa wrapper 'data')
      if (response.user) {
        const user = response.user;
        
        // Redirect berdasarkan role
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'cashier') {
          router.push('/cashier');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('❌ Error detail:', err.response?.data);
      console.error('❌ Error message:', err.message);
      
      const errorMsg = err.response?.data?.message || err.message || 'Login gagal. Silakan coba lagi.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-emerald-100">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at top left, rgba(6,95,70,0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(212,163,115,0.22), transparent 24%)',
        }}
      />
      <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-4xl border border-emerald-500 bg-emerald-800 shadow-card lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between bg-emerald-gradient p-8 text-white lg:flex xl:p-10">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <img src="/images/coffie.jpg" alt="Bean Coffee logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">
                    Bean Coffee
                  </h1>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/70 ">
                    Operations Portal
                  </p>
                </div>
              </div>

              <div className="max-w-md space-y-4">
                <p className="text-4xl font-bold leading-tight">
                  Built to support fast and organized café operations.
                </p>
                <p className="text-sm leading-6 text-white/75">
                  Everything your café needs — sales, products, materials, and stock management in one place.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-white/80">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                Monitor stock levels before ingredients run low.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                Designed for faster cashier and inventory workflows.
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <div className="mb-4 flex items-center justify-center lg:justify-start">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 lg:hidden">
                    <img src="/images/coffie.jpg" alt="Bean Coffee logo" className="h-full w-full object-contain" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Sign in to access Bean Coffee operations dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@coffeshop.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                      disabled={loading}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Demo Admin Access
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Email: <code className="rounded bg-white px-2 py-1 text-gray-800 shadow-sm">admin@coffeshop.com</code>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Password: <code className="rounded bg-white px-2 py-1 text-gray-800 shadow-sm">password123</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}