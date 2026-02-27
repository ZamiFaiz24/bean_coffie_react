import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin';

export const metadata: Metadata = {
  title: 'Admin Dashboard - BeanStock',
  description: 'Admin dashboard for BeanStock Coffee Shop POS system',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
