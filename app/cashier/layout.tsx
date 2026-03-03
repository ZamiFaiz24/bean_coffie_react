import { ReactNode } from 'react';
import { SidebarProvider } from '@/context/SidebarContext';

export default function CashierLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}