# BeanStock POS - Component Structure

## Cashier Module (`components/cashier/`)

### Main Page
- **`index.tsx`** - Orchestrator component that manages cart state and checkout logic

### Sub-Components
1. **`product-grid.tsx`** - Displays products in a responsive grid
   - Props: `products`, `isLoading`, `onAddToCart`
   - Handles product display with image, name, price, stock

2. **`cart-items.tsx`** - Shows items in cart with quantity controls
   - Props: `items`, `onUpdateQuantity`, `onRemoveItem`
   - +/- buttons and trash icon for removal

3. **`payment-section.tsx`** - Payment method selection and amount handling
   - Props: `subtotal`, `tax`, `total`, `onCheckout`, `isLoading`, `isDisabled`
   - Supports Cash (with change calculation), QRIS, Debit

4. **`receipt-modal.tsx`** - Receipt display and print functionality
   - Props: `receipt`, `isOpen`, `onClose`
   - Shows invoice, items, totals, payment info

## Admin Module (`components/admin/`)

### Main Page
- **`index.tsx`** - Orchestrator with sidebar navigation and tab management

### Sub-Components
1. **`sidebar-nav.tsx`** - Side navigation menu
   - Props: `activeTab`, `onTabChange`, `isOpen`, `onClose`
   - Menu items: Overview, Products, Low Stock, Top Sales, Settings

2. **`summary-cards.tsx`** - KPI cards showing metrics
   - Props: `cards` (array of SummaryCard)
   - Displays revenue, orders, products, low stock

3. **`top-products.tsx`** - Top 5 selling products
   - Props: `products` (array of TopProduct)
   - Shows rank badge, product name, units sold, revenue

4. **`low-stock-alerts.tsx`** - Products with low/out of stock
   - Props: `products` (array of LowStockProduct)
   - Shows status badges and stock quantities

5. **`recent-transactions.tsx`** - Recent transaction history
   - Props: `transactions` (array of Transaction)
   - Shows invoice, cashier, amount, status

## Shared Types (`types/index.ts`)

```typescript
- Product
- CartItem
- Receipt
- TransactionPayload
- SummaryCard
- TopProduct
- LowStockProduct
- Transaction
```

## Usage Example

### Cashier
```tsx
import { CashierPage } from '@/components/cashier';

export default function Home() {
  return <CashierPage />;
}
```

### Admin
```tsx
import { AdminDashboard } from '@/components/admin';

export default function AdminPage() {
  return <AdminDashboard />;
}
```

## Integration with Laravel API

Each component receives mock data. To integrate with Laravel:

1. Replace mock data in `components/cashier/index.tsx` with API calls
2. Replace mock data in `components/admin/index.tsx` with API calls
3. Use services from `/services/` folder for API communication

Example:
```tsx
import { productsService } from '@/services/products';

useEffect(() => {
  productsService.getAll().then(setProducts);
}, []);
```

## Component Communication

- Components communicate via props (unidirectional)
- Main orchestrator (index.tsx) handles state
- No context/Redux - kept simple for easy maintenance
- Easy to add state management later if needed

## Customization

Each component can be customized independently:
- Update colors in `app/globals.css`
- Modify component styles locally
- Add new features without affecting others
- Reuse components in other pages
