import { ReactNode } from 'react';

export default function CashierLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}