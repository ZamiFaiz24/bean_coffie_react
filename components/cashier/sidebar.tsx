'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LogOut, Home, BarChart3, History, Coffee } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface SidebarProps {
  user?: any;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  user,
  onLogout,
  isCollapsed,
  onToggle,
}: SidebarProps) {

  const pathname = usePathname();

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-charcoal-200 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={onToggle}
          className="hover:bg-emerald-50 rounded-lg p-2 transition"
          title="Expand"
        >
          <ChevronRight className="w-6 h-6 text-emerald-700" />
        </button>

        {/* Logo */}
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
          <Coffee className="w-6 h-6" />
        </div>

        {/* Menu Items - Icons Only */}
        <div className="flex-1 flex flex-col space-y-2">
          <Link href="/cashier" title="Dashboard">
            <button className="hover:bg-emerald-50 text-charcoal-600 rounded-lg p-2 transition">
              <Home className="w-5 h-5" />
            </button>
          </Link>

          <Link href="/cashier/sales-report" title="Sales Report">
            <button className="hover:bg-emerald-50 text-charcoal-600 rounded-lg p-2 transition">
              <BarChart3 className="w-5 h-5" />
            </button>
          </Link>

          <Link href="/cashier/transactions" title="Transaction History">
            <button className="hover:bg-emerald-50 text-charcoal-600 rounded-lg p-2 transition">
              <History className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="hover:bg-red-100 text-red-600 rounded-lg p-2 transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Full sidebar
  return (
    <div className="w-64 bg-white border-r border-charcoal-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-charcoal-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-charcoal-900">Bean Coffee</h1>
              <p className="text-xs text-charcoal-500">POS System</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="hover:bg-emerald-50 rounded-lg p-2 transition"
            title="Collapse"
          >
            <ChevronLeft className="w-5 h-5 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-emerald-600 px-3 py-2 uppercase tracking-wide">
          Menu
        </div>
        
        <Link href="/cashier" className="block">
          <Button
            variant="ghost"
            className={`
              w-full justify-start transition-all duration-200

              ${
                pathname === '/cashier'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white'
                  : 'text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-700'
              }
            `}
          >
            <Home className="w-4 h-4 mr-3" />
            Dashboard
          </Button>
        </Link>

        <Link href="/cashier/sales-report" className="block">
          <Button
            variant="ghost"
            className={`
              w-full justify-start rounded-xl font-medium
              transition-all duration-200

              ${
                pathname === '/cashier/sales-report'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white'
                  : 'text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-700'
              }
            `}
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            Sales Report
          </Button>
        </Link>

        {/* History Section */}
        <div className="text-xs font-semibold text-emerald-650 px-3 py-2 uppercase tracking-wide mt-6">
          History
        </div>

        <Link href="/cashier/transactions" className="block">
          <Button
            variant="ghost"
            className={`
              w-full justify-start rounded-xl font-medium
              transition-all duration-200

              ${
                pathname === '/cashier/transactions'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white'
                  : 'text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-700'
              }
            `}
          >
            <History className="w-4 h-4 mr-3" />
            Transaction History
          </Button>
        </Link>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-charcoal-200 space-y-3">
        {user && (
          <div className="bg-emerald-200 p-3 rounded-lg">
            <p className="text-xs text-emerald-650">Logged in as</p>
            <p className="text-sm font-semibold text-charcoal-900">{user.name}</p>
            <p className="text-xs text-emerald-650 capitalize">{user.role}</p>
          </div>
        )}

        <Button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}