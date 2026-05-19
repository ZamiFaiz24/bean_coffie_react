'use client';

import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, TrendingUp, Settings, LogOut, Boxes } from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarNav({ activeTab, onTabChange, isOpen = true, onClose }: SidebarNavProps) {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Materials', icon: Boxes },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'top-sales', label: 'Top Sales', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-emerald-100 bg-white/95 text-emerald-900 shadow-[0_0_0_1px_rgba(16,185,129,0.06)] backdrop-blur-sm">
      {/* Logo Section */}
      <div className="border-b border-emerald-100 px-6 py-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 shadow-sm ring-1 ring-emerald-100">
            <img src="/images/coffie.jpg" alt="Bean Coffee logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Bean Coffee</h2>
            <p className="text-xs text-gray-500">Operations Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose?.();
              }}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                isActive
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-sm'
                  : 'border-transparent text-gray-700 hover:border-emerald-100 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-700' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-emerald-100 p-4">
        <Button
          className="w-full gap-2 rounded-xl bg-red-600 text-white shadow-sm transition hover:bg-red-700"
          onClick={() => {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
