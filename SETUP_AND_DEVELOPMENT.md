# BeanStock Frontend - Setup & Development Guide

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Git

### 2. Installation
```bash
# Clone repository
git clone <your-repo-url>
cd beanstock-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update API URL if needed (default is localhost:8000)
# nano .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in browser.

### 4. Access Different Roles
- **Cashier/POS**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

---

## Environment Configuration

### `.env.local` File
```env
# Laravel API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Application Info
NEXT_PUBLIC_APP_NAME=BeanStock
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### For Production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Project Structure

### Key Directories

**`/app`** - Next.js pages and routing
- `page.tsx` - Home page
- `admin/page.tsx` - Admin dashboard
- `cashier/page.tsx` - Cashier/POS page
- `layout.tsx` - Root layout
- `globals.css` - Global styles

**`/components`** - React components
- `admin-dashboard-page.tsx` - Self-contained admin dashboard
- `cashier-page.tsx` - Self-contained cashier/POS page
- `ui/` - shadcn/ui components

**`/services`** - API service layer
- `api.ts` - Axios configuration
- `auth.ts` - Authentication
- `products.ts` - Product management
- `transactions.ts` - Transaction/POS

**`/public`** - Static assets
- `images/products/` - Product images

**`/lib`** - Utilities
- `utils.ts` - Helper functions

---

## Development Workflow

### Adding a New Feature

#### 1. Create API Service (if needed)
```typescript
// services/new-feature.ts
import apiClient from './api';

export const newFeatureService = {
  async getFeatures() {
    const response = await apiClient.get('/features');
    return response.data;
  },
};
```

#### 2. Create Component
```typescript
// components/new-feature.tsx
'use client';

import { useEffect, useState } from 'react';
import { newFeatureService } from '@/services/new-feature';

export function NewFeature() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await newFeatureService.getFeatures();
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render component */}</div>;
}
```

#### 3. Use in Page
```typescript
// app/page.tsx
import { NewFeature } from '@/components/new-feature';

export default function Page() {
  return <NewFeature />;
}
```

---

## API Integration

### Using Services in Components

**Example 1: Fetch Products**
```typescript
import { useEffect, useState } from 'react';
import { productService, Product } from '@/services/products';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

**Example 2: Create Transaction**
```typescript
import { transactionService } from '@/services/transactions';

async function handleCheckout(cart, paymentMethod, paidAmount) {
  try {
    const response = await transactionService.createTransaction({
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        price: item.price,
      })),
      payment_method: paymentMethod,
      paid_amount: paidAmount,
    });

    console.log('Transaction successful:', response.data);
    // Show success message, clear cart, show receipt, etc.
  } catch (error) {
    console.error('Transaction failed:', error);
    // Show error message
  }
}
```

**Example 3: Login**
```typescript
import { authService } from '@/services/auth';

async function handleLogin(email, password) {
  try {
    const response = await authService.login(email, password);
    // User and token are auto-stored in localStorage
    // Redirect to dashboard
    window.location.href = '/admin';
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

---

## Styling with TailwindCSS

### Color Scheme (Coffee Theme)

**Light Mode:**
- Background: `bg-background` (cream)
- Text: `text-foreground` (dark brown)
- Primary: `bg-primary` (coffee brown)
- Secondary: `bg-secondary` (light tan)
- Accent: `bg-accent` (warm coffee)

**Example:**
```tsx
<div className="bg-background text-foreground p-4">
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
    Click me
  </button>
</div>
```

### Common Tailwind Classes

```tsx
// Layout
<div className="flex items-center justify-between gap-4">
  <div className="grid grid-cols-3 gap-4">
    {items.map(item => (
      <div key={item.id} className="p-4 rounded-lg border">
        {item.name}
      </div>
    ))}
  </div>
</div>

// Typography
<h1 className="text-3xl font-bold text-foreground">Title</h1>
<p className="text-sm text-muted-foreground">Subtitle</p>

// Forms
<input className="w-full px-3 py-2 border rounded-md" />
<textarea className="w-full px-3 py-2 border rounded-md" />

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
```

---

## Component Library (shadcn/ui)

We use shadcn/ui components which are already installed.

### Import Components
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
```

### Example Usage
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => console.log('clicked')}>
          Click Me
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## Forms & Validation

### Using react-hook-form + zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be 6+ chars'),
});

type LoginFormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="Email"
        {...register('email')}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <Input
        type="password"
        placeholder="Password"
        {...register('password')}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <Button type="submit">Login</Button>
    </form>
  );
}
```

---

## State Management

### Local State (useState)
```typescript
const [cart, setCart] = useState([]);
const [total, setTotal] = useState(0);
```

### Effect Hook (useEffect)
```typescript
useEffect(() => {
  // Fetch data when component mounts
  productService.getProducts().then(setProducts);
}, []); // Empty dependency array = run once on mount
```

### Context (for shared state across pages)
```typescript
// create context
const AuthContext = createContext(null);

// provide context
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// use context
const { user } = useContext(AuthContext);
```

---

## Debugging

### Console Logging
```typescript
console.log('Data:', data);
console.error('Error:', error);
```

### React DevTools
Install React DevTools browser extension for debugging components.

### Network Tab
- Open DevTools → Network tab
- Make API calls
- Check request/response

### Checking API Responses
```typescript
const response = await productService.getProducts();
console.log('Response:', response);
console.log('Status:', response.status);
console.log('Data:', response.data);
```

---

## Building for Production

### Build
```bash
npm run build
```

### Test Production Build
```bash
npm run build
npm run start
```

### Deployment

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENV NODE_ENV production
CMD ["npm", "start"]
```

**Traditional Server:**
```bash
npm run build
npm run start
# Or use pm2, systemd, etc.
```

---

## Common Issues & Solutions

### Issue: API Connection Error
**Solution:**
1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Verify Laravel server is running
3. Check CORS configuration in Laravel

### Issue: Token Not Saving
**Solution:**
1. Check localStorage in DevTools
2. Verify login response includes token
3. Check auth service is storing token

### Issue: Styling Not Applied
**Solution:**
1. Check class name is correct
2. Restart dev server
3. Clear cache: `rm -rf .next`

### Issue: Build Fails
**Solution:**
1. Check TypeScript errors: `npm run type-check`
2. Check console for errors
3. Verify all imports are correct

---

## Testing

### Manual Testing
1. Test both dark and light mode
2. Test responsive design on mobile
3. Test all API endpoints
4. Test error scenarios

### Automated Testing (Optional)
Add Jest + React Testing Library:
```bash
npm install --save-dev jest @testing-library/react
```

---

## Performance Tips

1. **Memoization**
   ```typescript
   const Component = React.memo(() => { /* ... */ });
   ```

2. **Code Splitting**
   ```typescript
   const Component = dynamic(() => import('./Component'));
   ```

3. **Caching**
   Use SWR or React Query for intelligent caching

4. **Lazy Loading**
   ```tsx
   import Image from 'next/image';
   <Image src="..." loading="lazy" />
   ```

---

## Resources

- [Next.js Docs](https://nextjs.org)
- [React Docs](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Axios Docs](https://axios-http.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Getting Help

1. Check documentation files first
2. Review similar code in project
3. Search GitHub issues
4. Check console for error messages
5. Ask in team chat/Slack

---

**Happy coding!** ☕
