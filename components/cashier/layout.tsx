'use client';

import { ReactNode, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { Sidebar } from './sidebar';

interface CashierLayoutProps {
  children: ReactNode;
  user?: any;
  onLogout: () => void;
}

export function CashierLayout({ children, user, onLogout }: CashierLayoutProps) {
  const { isOpen, closeSidebar } = useSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-coffee-50">
      {/* Sidebar - Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Component */}
      <div
        className={`fixed md:relative z-40 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar
          user={user}
          onLogout={onLogout}
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}