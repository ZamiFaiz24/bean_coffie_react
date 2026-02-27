import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Admin Dashboard - BeanStock',
  description: 'Admin dashboard for BeanStock Coffee Shop POS system',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}