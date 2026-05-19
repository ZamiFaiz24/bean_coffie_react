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
import { MaterialsManagement } from './materials-management';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('materials');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { summaryCardsData, topProducts, lowStockProducts, transactions, loading, error } =
    useAdminDashboard();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
        <header className="bg-emerald-900 text-white border-b border-emerald-800 px-6 py-4 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 shadow-sm flex items-center justify-center">
              <img src="/images/coffie.jpg" alt="Bean Coffee logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">☕ Bean Coffee POS</h1>
              <p className="text-xs text-white/70">Admin Dashboard</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-amber-400">Admin User</p>
            <p className="text-xs text-white/70">Administrator</p>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                  <p className="text-gray-600 mt-1">Welcome back to BeanStock Admin Panel</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-12 text-gray-600">Loading dashboard...</div>
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

            {activeTab === 'materials' && (
              <MaterialsManagement />
            )}

            {activeTab === 'low-stock' && (
              <>
                <h2 className="text-3xl font-bold text-gray-900">Low Stock Management</h2>
                {loading ? (
                  <div className="text-center py-12 text-gray-600">Loading...</div>
                ) : (
                  <LowStockAlerts products={lowStockProducts} />
                )}
              </>
            )}

            {activeTab === 'top-sales' && (
              <>
                <h2 className="text-3xl font-bold text-gray-900">Top Sales Report</h2>
                {loading ? (
                  <div className="text-center py-12 text-gray-600">Loading...</div>
                ) : (
                  <TopProducts products={topProducts} />
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-600">Feature coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
