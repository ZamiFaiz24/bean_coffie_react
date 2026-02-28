'use client';

import { ReactNode } from 'react';

interface CashierLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  header: ReactNode;
}

export function CashierLayout({ sidebar, main, header }: CashierLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="flex-shrink-0 transition-all duration-300">
        {sidebar}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {main}
        </div>
      </div>
    </div>
  );
}