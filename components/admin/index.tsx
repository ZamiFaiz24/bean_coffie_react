'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarNav } from './sidebar-nav';
import { SummaryCards } from './summary-cards';
import { TopProducts } from './top-products';
import { LowStockAlerts } from './low-stock-alerts';
import { RecentTransactions } from './recent-transactions';
import { SummaryCard, TopProduct, LowStockProduct, Transaction } from '@/types';
import { DollarSign, ShoppingCart, Package, AlertCircle } from 'lucide-react';

const mockSummaryCards: SummaryCard[] = [
  {
    title: "Today's Revenue",
    value: 'Rp 4.850.000',
    subtitle: 'Total sales today',
    icon: <DollarSign className="w-8 h-8 text-amber-600" />,
    trend: 12,
  },
  {
    title: 'Total Orders Today',
    value: '42',
    subtitle: 'Number of transactions',
    icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
    trend: 8,
  },
  {
    title: 'Total Products',
    value: '24',
    subtitle: 'Items in inventory',
    icon: <Package className="w-8 h-8 text-green-600" />,
    trend: 0,
  },
  {
    title: 'Low Stock Items',
    value: '5',
    subtitle: 'Items need restocking',
    icon: <AlertCircle className="w-8 h-8 text-red-600" />,
    trend: -2,
  },
];

const mockTopProducts: TopProduct[] = [
  { id: 1, name: 'Espresso', sold: 38, revenue: 1900000, rank: 1 },
  { id: 2, name: 'Latte', sold: 35, revenue: 1750000, rank: 2 },
  { id: 3, name: 'Cappuccino', sold: 28, revenue: 1400000, rank: 3 },
  { id: 4, name: 'Iced Americano', sold: 24, revenue: 1200000, rank: 4 },
  { id: 5, name: 'Croissant', sold: 22, revenue: 550000, rank: 5 },
];

const mockLowStockProducts: LowStockProduct[] = [
  { id: 1, name: 'Caramel Syrup', stock: 0, status: 'out' },
  { id: 2, name: 'Vanilla Beans', stock: 2, status: 'low' },
  { id: 3, name: 'Chocolate Powder', stock: 1, status: 'low' },
  { id: 4, name: 'Milk Foam', stock: 3, status: 'low' },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    invoiceNumber: 'INV-20240127-001',
    cashierName: 'Budi',
    amount: 185000,
    status: 'paid',
    dateTime: '2024-01-27 09:30:00',
  },
  {
    id: '2',
    invoiceNumber: 'INV-20240127-002',
    cashierName: 'Siti',
    amount: 245000,
    status: 'paid',
    dateTime: '2024-01-27 09:45:00',
  },
  {
    id: '3',
    invoiceNumber: 'INV-20240127-003',
    cashierName: 'Ahmad',
    amount: 125000,
    status: 'paid',
    dateTime: '2024-01-27 10:15:00',
  },
  {
    id: '4',
    invoiceNumber: 'INV-20240127-004',
    cashierName: 'Dewi',
    amount: 305000,
    status: 'paid',
    dateTime: '2024-01-27 10:30:00',
  },
  {
    id: '5',
    invoiceNumber: 'INV-20240127-005',
    cashierName: 'Roni',
    amount: 165000,
    status: 'paid',
    dateTime: '2024-01-27 10:45:00',
  },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-50">
            <SidebarNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isOpen={true}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-background p-4 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold">BeanStock Admin</h1>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              <div>
                <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome to BeanStock Admin Panel</p>
              </div>

              <SummaryCards cards={mockSummaryCards} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopProducts products={mockTopProducts} />
                <LowStockAlerts products={mockLowStockProducts} />
              </div>

              <RecentTransactions transactions={mockTransactions} />
            </>
          )}

          {activeTab === 'products' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <p className="text-muted-foreground">Feature coming soon</p>
            </div>
          )}

          {activeTab === 'low-stock' && (
            <>
              <h2 className="text-2xl font-bold">Low Stock Management</h2>
              <LowStockAlerts products={mockLowStockProducts} />
            </>
          )}

          {activeTab === 'top-sales' && (
            <>
              <h2 className="text-2xl font-bold">Top Sales Report</h2>
              <TopProducts products={mockTopProducts} />
            </>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-muted-foreground">Feature coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
