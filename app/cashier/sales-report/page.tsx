'use client';

import { CashierLayout } from '@/components/cashier/layout';
import { SalesReport } from '@/components/cashier/sales-report';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth';

export default function SalesReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(storedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (loading) return null;

  return (
    <CashierLayout user={user} onLogout={handleLogout}>
      <div className="p-6">
        <SalesReport />
      </div>
    </CashierLayout>
  );
}