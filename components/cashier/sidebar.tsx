'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LogOut, Home, BarChart3, History } from 'lucide-react';

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
  if (isCollapsed) {
    // Collapsed sidebar - icon only
    return (
      <div className="w-16 bg-white border-r border-coffee-200 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={onToggle}
          className="hover:bg-coffee-100 rounded-lg p-2 transition"
          title="Expand"
        >
          <ChevronRight className="w-6 h-6 text-coffee-700" />
        </button>

        {/* Logo */}
        <div className="w-10 h-10 bg-coffee-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          ☕
        </div>

        {/* Menu Items - Icons Only */}
        <div className="flex-1 flex flex-col space-y-2">
          <button
            className="hover:bg-coffee-100 text-coffee-700 rounded-lg p-2 transition"
            title="Dashboard"
          >
            <Home className="w-5 h-5" />
          </button>

          <button
            className="hover:bg-coffee-100 text-coffee-700 rounded-lg p-2 transition"
            title="Sales Report"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          <button
            className="hover:bg-coffee-100 text-coffee-700 rounded-lg p-2 transition"
            title="Transaction History"
          >
            <History className="w-5 h-5" />
          </button>
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
    <div className="w-64 bg-white border-r border-coffee-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-coffee-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-coffee-600 rounded-lg flex items-center justify-center text-white font-bold">
              ☕
            </div>
            <div>
              <h1 className="text-lg font-bold text-coffee-800">Bean Coffee</h1>
              <p className="text-xs text-coffee-600">POS System</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="hover:bg-coffee-100 rounded-lg p-2 transition"
            title="Collapse"
          >
            <ChevronLeft className="w-5 h-5 text-coffee-700" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-coffee-600 px-3 py-2 uppercase tracking-wide">
          Menu
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-coffee-800 hover:bg-coffee-100"
        >
          <Home className="w-4 h-4 mr-3" />
          Dashboard
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-coffee-800 hover:bg-coffee-100"
        >
          <BarChart3 className="w-4 h-4 mr-3" />
          Sales Report
        </Button>

        {/* History Section */}
        <div className="text-xs font-semibold text-coffee-600 px-3 py-2 uppercase tracking-wide mt-6">
          History
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-coffee-800 hover:bg-coffee-100"
        >
          <History className="w-4 h-4 mr-3" />
          Transaction History
        </Button>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-coffee-200 space-y-3">
        {user && (
          <div className="bg-coffee-50 p-3 rounded-lg">
            <p className="text-xs text-coffee-600">Logged in as</p>
            <p className="text-sm font-semibold text-coffee-800">{user.name}</p>
            <p className="text-xs text-coffee-600 capitalize">{user.role}</p>
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