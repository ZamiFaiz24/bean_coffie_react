'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { AdminDashboard } from '@/components/admin';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = authService.getStoredUser();
    
    if (storedUser?.role !== 'admin') {
      setError('Akses ditolak: Anda harus login sebagai admin');
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
          <p className="text-brand-text/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="bg-brand-surface rounded-2xl shadow-card p-6 max-w-md border border-gray-200">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-brand-text/70 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}