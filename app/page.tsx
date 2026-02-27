import { Metadata } from 'next';
import { CashierPage } from '@/components/cashier';

export const metadata: Metadata = {
  title: 'BeanStock Cashier - POS System',
  description: 'Professional POS system for BeanStock Coffee Shop',
};

export default function Home() {
  return <CashierPage />;
}
