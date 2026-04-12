'use client';

import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, AlertCircle, TrendingUp, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarNav({ activeTab, onTabChange, isOpen = true, onClose }: SidebarNavProps) {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'low-stock', label: 'Low Stock', icon: AlertCircle },
    { id: 'top-sales', label: 'Top Sales', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-slate-800 text-slate-100 flex flex-col border-r border-slate-700">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center text-slate-900">
            <span className="text-lg">☕</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Bean Coffee</h2>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-amber-500 text-slate-900 font-medium'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <Button
          className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
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
