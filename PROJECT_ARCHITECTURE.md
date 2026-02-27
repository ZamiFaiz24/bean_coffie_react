# BeanStock Project Architecture

## Overview
BeanStock is a professional Point of Sale (POS) system for coffee shops with Admin Dashboard and Cashier interface. Built with Next.js, React, TypeScript, and TailwindCSS. Integrated with Laravel REST API backend.

## Folder Structure

```
beanstock-frontend/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home page (redirects to role-based page)
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard page
│   ├── cashier/
│   │   └── page.tsx              # Cashier/POS page
│   └── globals.css               # Global styles with coffee theme
│
├── components/
│   ├── admin-dashboard-page.tsx   # Admin dashboard (self-contained)
│   ├── cashier-page.tsx           # Cashier page (self-contained)
│   ├── theme-provider.tsx         # Theme provider component
│   └── ui/                        # shadcn/ui components (auto-generated)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── table.tsx
│       ├── dialog.tsx
│       ├── sidebar.tsx
│       ├── toaster.tsx
│       └── ... (40+ other components)
│
├── services/                      # API service layer (Axios integration)
│   ├── api.ts                     # Base Axios client with interceptors
│   ├── auth.ts                    # Authentication service
│   ├── products.ts                # Product management service
│   └── transactions.ts            # Transaction/POS service
│
├── lib/
│   └── utils.ts                   # Utility functions (cn, etc)
│
├── types/                         # TypeScript interfaces (if needed)
│   └── (optional - types are in service files)
│
├── public/
│   └── images/
│       └── products/              # Product images
│           ├── espresso.jpg
│           ├── americano.jpg
│           ├── cappuccino.jpg
│           ├── latte.jpg
│           ├── iced-coffee.jpg
│           ├── mocha.jpg
│           ├── green-tea.jpg
│           ├── black-tea.jpg
│           ├── croissant.jpg
│           ├── chocolate-cake.jpg
│           ├── ham-cheese-sandwich.jpg
│           └── chicken-sandwich.jpg
│
├── .env.example                   # Environment variables example
├── LARAVEL_API_SETUP.md          # Laravel API integration guide
├── PROJECT_ARCHITECTURE.md        # This file
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── next.config.mjs               # Next.js config
└── tailwind.config.ts            # Tailwind CSS config
```

## Component Architecture

### Admin Dashboard Page (`components/admin-dashboard-page.tsx`)
Self-contained component with:
- Sidebar navigation
- Top navbar with user dropdown
- Summary cards (Revenue, Orders, Products, Low Stock)
- Data tables (Products, Transactions, Reports)
- Modals for CRUD operations
- Charts for analytics

**Key Features:**
- Role-based access control
- Responsive design
- Real-time data fetching
- Form validation
- Error handling

### Cashier Page (`components/cashier-page.tsx`)
Self-contained component with:
- Product grid display
- Shopping cart management
- Payment method selection
- Receipt modal
- Toast notifications

**Key Features:**
- Quick product selection
- Real-time cart calculation
- Multiple payment methods (Cash, QRIS, Debit)
- Automatic change calculation
- Print receipt functionality

## Service Layer Architecture

### API Client (`services/api.ts`)
- Axios instance configuration
- Global request/response interceptors
- Authentication token management
- Error handling middleware
- CORS and header configuration

### Authentication Service (`services/auth.ts`)
```typescript
Methods:
- login(email, password)
- logout()
- getCurrentUser()
- getStoredUser()
- getToken()
- isAuthenticated()
- hasRole(role)
```

### Product Service (`services/products.ts`)
```typescript
Methods:
- getProducts()
- getProduct(id)
- getProductsByCategory(categoryId)
- getCategories()
- createProduct(data)
- updateProduct(id, data)
- deleteProduct(id)
```

### Transaction Service (`services/transactions.ts`)
```typescript
Methods:
- createTransaction(data)
- getTransactions(page, limit)
- getTransaction(id)
- getTransactionsByDateRange(start, end)
- getDailyRevenue(date)
```

## Data Flow

### Authentication Flow
```
Login Form → authService.login() → API → 
  Store Token & User → Update UI → Redirect
```

### Product Listing Flow
```
Component Mount → productService.getProducts() → API → 
  Update State → Render Product Grid
```

### Transaction Flow
```
Add to Cart → Calculate Total → Payment Selection → 
  Create Transaction → transactionService.createTransaction() → 
  API → Success Notification → Clear Cart → Receipt Modal
```

## Color Theme (Coffee Palette)

### Light Mode
- **Background**: Warm white/cream (#FBF8F3)
- **Primary**: Coffee brown (#6B4423)
- **Secondary**: Light tan (#C4A57B)
- **Accent**: Warm coffee (#8B5A2B)
- **Sidebar**: Deep brown (#3E2723)

### Dark Mode
- **Background**: Very dark brown (#2D1810)
- **Primary**: Warm coffee (#A0826D)
- **Secondary**: Dark coffee (#5C4033)
- **Accent**: Light tan (#D4A574)
- **Sidebar**: Very dark (#1A0E0A)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=BeanStock
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Dependencies

### Core
- next: ^15.0.0
- react: ^19.0.0
- react-dom: ^19.0.0

### API & State
- axios: For REST API calls
- (Optional) SWR: For data fetching and caching

### UI Components
- @radix-ui: Base components
- tailwindcss: Styling
- lucide-react: Icons

### Forms & Validation
- react-hook-form: Form management
- zod: Schema validation

### Utilities
- clsx/classnames: Class names management
- date-fns: Date manipulation

## Authentication Flow

1. User logs in with email/password
2. Frontend sends credentials to `/api/auth/login`
3. Backend returns JWT token and user data
4. Frontend stores token in localStorage
5. Subsequent requests include token in Authorization header
6. Token is validated on each request by interceptor

## Data Fetching Strategy

**Currently using:** Direct Axios calls in useEffect
**Option 1:** React Query (TanStack Query) - for complex caching
**Option 2:** SWR (stale-while-revalidate) - for simple fetching
**Option 3:** Custom hooks with Axios

### Recommended: Add SWR for better UX

```typescript
import useSWR from 'swr';
import apiClient from '@/services/api';

const fetcher = (url: string) => apiClient.get(url).then(r => r.data);

export function useProducts() {
  const { data, error, isLoading } = useSWR('/products', fetcher);
  return { products: data?.data, error, isLoading };
}
```

## Scalability Considerations

### For Large Product Catalogs
- Implement pagination in product listing
- Add search/filter functionality
- Use virtual scrolling for long lists
- Implement lazy loading

### For Multiple Stores
- Add store selector in header
- Store-specific data filtering
- Multi-store analytics

### For Complex Workflows
- Add order status tracking
- Implement delivery management
- Add customer loyalty system
- Implement discounts/promotions

### For High Traffic
- Implement request caching
- Add request debouncing
- Optimize API calls
- Consider edge caching

## Development Workflow

### 1. Setup
```bash
npm install
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL in .env.local
npm run dev
```

### 2. Adding a New Feature
1. Create service method in `services/`
2. Create component in `components/`
3. Use service in component
4. Add styling with TailwindCSS

### 3. Testing Integration
1. Run both frontend and backend
2. Check Network tab in DevTools
3. Verify API responses
4. Test error scenarios

## Best Practices

### API Calls
- Always use services, never direct Axios
- Handle loading states
- Implement error handling with try-catch
- Use TypeScript interfaces for responses

### Components
- Keep components focused and single-responsibility
- Use composition for complex UIs
- Memoize expensive computations
- Avoid prop drilling (use Context if needed)

### Styling
- Use TailwindCSS utility classes
- Follow coffee color theme
- Ensure responsive design
- Test on mobile devices

### State Management
- Use React hooks (useState, useEffect, useContext)
- Keep state as local as possible
- Share state with Context only when necessary
- Consider SWR for global data state

## Performance Optimization

### Current
- Next.js built-in optimization
- Component code splitting
- Image optimization via Next.js

### Recommended
- Add React.memo() for heavy components
- Implement useMemo/useCallback
- Lazy load images
- Optimize bundle size

## Monitoring & Analytics (Optional)

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics, Mixpanel)
- Performance monitoring (Vercel Analytics)
- API monitoring (Postman)

## Deployment

### Vercel (Recommended for Next.js)
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

## Troubleshooting

### CORS Issues
- Check Laravel CORS configuration
- Verify frontend URL in allowed origins

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` in .env.local
- Verify Laravel server is running
- Check network tab in DevTools

### Authentication Issues
- Check token is being saved in localStorage
- Verify token is in Authorization header
- Check token expiration

## Future Enhancements

1. **Real-time Updates**: WebSocket for live product updates
2. **Offline Support**: PWA with service workers
3. **Mobile App**: React Native/Flutter
4. **Advanced Analytics**: Custom dashboards
5. **Multi-language**: i18n support
6. **Accessibility**: A11y improvements
7. **Performance**: Caching strategies
8. **Security**: 2FA, Role-based permissions

---

**Last Updated**: 2024
**Maintained by**: Development Team
