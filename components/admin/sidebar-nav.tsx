'use client';

import { Button } from '@/components/ui/button';
import { BarChart3, Package, AlertTriangle, TrendingUp, Settings, LogOut } from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const MENU_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'low-stock', label: 'Low Stock', icon: AlertTriangle },
  { id: 'top-sales', label: 'Top Sales', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ activeTab, onTabChange, isOpen = true, onClose }: SidebarNavProps) {
  return (
    <div className={`w-64 border-r bg-sidebar p-6 space-y-2 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-foreground">BeanStock</h1>
        <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
      </div>

      <nav className="space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                onTabChange(item.id);
                onClose?.();
              }}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="pt-4 border-t mt-auto">
        <Button variant="ghost" className="w-full justify-start text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
