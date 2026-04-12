'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarNav } from './sidebar-nav';
import { SummaryCards } from './summary-cards';
import { TopProducts } from './top-products';
import { LowStockAlerts } from './low-stock-alerts';
import { RecentTransactions } from './recent-transactions';
import { ProductsManagement } from './products-management';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { summaryCardsData, topProducts, lowStockProducts, transactions, loading, error } =
    useAdminDashboard();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Mobile Sidebar Overlay */}
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
        <header className="bg-slate-800 text-slate-100 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-100 hover:bg-slate-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">☕ Bean Coffee POS</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-amber-500">Admin User</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50">
          <div className="p-6 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
                  <p className="text-slate-600 mt-1">Welcome back to BeanStock Admin Panel</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-12 text-slate-600">Loading dashboard...</div>
                ) : (
                  <>
                    <SummaryCards cards={summaryCardsData} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <TopProducts products={topProducts} />
                      <LowStockAlerts products={lowStockProducts} />
                    </div>

                    <RecentTransactions transactions={transactions} />
                  </>
                )}
              </>
            )}

            {activeTab === 'products' && (
              <ProductsManagement />
            )}

            {activeTab === 'low-stock' && (
              <>
                <h2 className="text-3xl font-bold text-slate-900">Low Stock Management</h2>
                {loading ? (
                  <div className="text-center py-12 text-slate-600">Loading...</div>
                ) : (
                  <LowStockAlerts products={lowStockProducts} />
                )}
              </>
            )}

            {activeTab === 'top-sales' && (
              <>
                <h2 className="text-3xl font-bold text-slate-900">Top Sales Report</h2>
                {loading ? (
                  <div className="text-center py-12 text-slate-600">Loading...</div>
                ) : (
                  <TopProducts products={topProducts} />
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                <p className="text-slate-600">Feature coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
