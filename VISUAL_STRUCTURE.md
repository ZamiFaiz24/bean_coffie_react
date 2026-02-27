# BeanStock - Visual Project Structure

## Project Folder Tree

```
beanstock-frontend/
│
├── 📁 app/
│   ├── 📄 layout.tsx                    [Root Layout with Theme Provider]
│   ├── 📄 page.tsx                      [Home Page - Role Selector]
│   ├── 📄 globals.css                   [Coffee Color Theme]
│   │
│   ├── 📁 admin/
│   │   └── 📄 page.tsx                  [Admin Dashboard Route]
│   │
│   └── 📁 cashier/
│       └── 📄 page.tsx                  [Cashier Route (Optional)]
│
├── 📁 components/
│   ├── 📄 admin-dashboard-page.tsx      [Self-Contained Admin Dashboard]
│   │   ├─ Sidebar Navigation
│   │   ├─ Top Navbar
│   │   ├─ Dashboard Summary Cards
│   │   ├─ Products Table
│   │   ├─ Transactions Table
│   │   ├─ Reports Section
│   │   └─ Modals (Create/Edit/Detail)
│   │
│   ├── 📄 cashier-page.tsx              [Self-Contained Cashier/POS]
│   │   ├─ Product Grid
│   │   ├─ Shopping Cart
│   │   ├─ Payment Section
│   │   ├─ Receipt Modal
│   │   └─ Toast Notifications
│   │
│   ├── 📄 theme-provider.tsx            [Theme/Dark Mode Provider]
│   │
│   └── 📁 ui/
│       ├── 📄 button.tsx
│       ├── 📄 card.tsx
│       ├── 📄 input.tsx
│       ├── 📄 table.tsx
│       ├── 📄 dialog.tsx
│       ├── 📄 sidebar.tsx
│       ├── 📄 dropdown-menu.tsx
│       ├── 📄 form.tsx
│       ├── 📄 badge.tsx
│       ├── 📄 tabs.tsx
│       ├── 📄 select.tsx
│       ├── 📄 popover.tsx
│       ├── 📄 alert.tsx
│       ├── 📄 avatar.tsx
│       ├── 📄 scroll-area.tsx
│       ├── 📄 separator.tsx
│       ├── 📄 toast.tsx
│       ├── 📄 toaster.tsx
│       ├── 📄 skeleton.tsx
│       ├── 📄 chart.tsx
│       ├── 📄 pagination.tsx
│       ├── 📄 spinner.tsx
│       └── ... [40+ other UI components]
│
├── 📁 services/                         [API Service Layer with Axios]
│   ├── 📄 api.ts                        [Base Axios Client Config]
│   │   ├─ Axios instance
│   │   ├─ Request interceptor (add token)
│   │   ├─ Response interceptor (handle errors)
│   │   └─ CORS & Headers setup
│   │
│   ├── 📄 auth.ts                       [Authentication Service]
│   │   ├─ login(email, password)
│   │   ├─ logout()
│   │   ├─ getCurrentUser()
│   │   ├─ getStoredUser()
│   │   ├─ getToken()
│   │   ├─ isAuthenticated()
│   │   └─ hasRole(role)
│   │
│   ├── 📄 products.ts                   [Product Management Service]
│   │   ├─ getProducts()
│   │   ├─ getProduct(id)
│   │   ├─ getProductsByCategory(id)
│   │   ├─ getCategories()
│   │   ├─ createProduct(data)
│   │   ├─ updateProduct(id, data)
│   │   └─ deleteProduct(id)
│   │
│   └── 📄 transactions.ts               [Transaction/POS Service]
│       ├─ createTransaction(data)
│       ├─ getTransactions(page, limit)
│       ├─ getTransaction(id)
│       ├─ getTransactionsByDateRange()
│       └─ getDailyRevenue(date)
│
├── 📁 lib/
│   └── 📄 utils.ts                      [Utility Functions]
│       └─ cn() for class merging
│
├── 📁 public/
│   └── 📁 images/
│       └── 📁 products/                 [12 Product Images]
│           ├── 📸 espresso.jpg
│           ├── 📸 americano.jpg
│           ├── 📸 cappuccino.jpg
│           ├── 📸 latte.jpg
│           ├── 📸 iced-coffee.jpg
│           ├── 📸 mocha.jpg
│           ├── 📸 green-tea.jpg
│           ├── 📸 black-tea.jpg
│           ├── 📸 croissant.jpg
│           ├── 📸 chocolate-cake.jpg
│           ├── 📸 ham-cheese-sandwich.jpg
│           └── 📸 chicken-sandwich.jpg
│
├── 📁 types/                            [TypeScript Interfaces]
│   ├── 📄 auth.ts (optional)
│   ├── 📄 products.ts (optional)
│   └── 📄 transactions.ts (optional)
│
├── 📄 .env.example                      [Environment Variables Template]
├── 📄 package.json                      [Dependencies + Scripts]
├── 📄 tsconfig.json                     [TypeScript Configuration]
├── 📄 next.config.mjs                   [Next.js Configuration]
├── 📄 tailwind.config.ts                [Tailwind Configuration]
├── 📄 postcss.config.js                 [PostCSS Configuration]
│
├── 📄 LARAVEL_API_SETUP.md              [API Integration Guide]
├── 📄 PROJECT_ARCHITECTURE.md           [Architecture Documentation]
├── 📄 SETUP_AND_DEVELOPMENT.md          [Development Guide]
├── 📄 IMPLEMENTATION_SUMMARY.md         [What's Included]
├── 📄 VISUAL_STRUCTURE.md               [This File]
│
├── 📄 package-lock.json                 [Dependency Lock File]
├── 📄 .gitignore                        [Git Ignore]
└── 📄 README.md                         [Project Readme]
```

---

## Component Hierarchy

### Admin Dashboard Structure
```
AdminDashboardPage
├── Sidebar
│   ├── Logo
│   ├── NavLinks
│   │   ├── Dashboard
│   │   ├── Products
│   │   ├── Categories
│   │   ├── Transactions
│   │   ├── Reports
│   │   └── Users
│   └── ToggleSidebar
│
├── MainContent
│   ├── Navbar
│   │   ├── Breadcrumb
│   │   ├── SearchBar
│   │   └── UserDropdown
│   │
│   └── PageContent
│       ├── DashboardPage
│       │   ├── SummaryCards (4)
│       │   ├── Charts
│       │   └── RecentActivity
│       │
│       ├── ProductsPage
│       │   ├── SearchBar
│       │   ├── ProductsTable
│       │   ├── Pagination
│       │   └── CreateProductModal
│       │
│       ├── TransactionsPage
│       │   ├── DateRangeFilter
│       │   ├── TransactionsTable
│       │   └── DetailModal
│       │
│       └── ReportsPage
│           ├── DateRangeFilter
│           ├── RevenueChart
│           └── SummaryStats
```

### Cashier Page Structure
```
CashierPage
├── Header
│   ├── Logo
│   ├── Title
│   └── LogoutButton
│
├── MainContainer (Flex Row)
│   ├── LeftSection (Products Grid)
│   │   ├── SearchBar
│   │   ├── CategoryFilter
│   │   └── ProductsGrid
│   │       └── ProductCard (12 items)
│   │           ├── Image
│   │           ├── Name
│   │           ├── Price
│   │           ├── Stock
│   │           └── AddButton
│   │
│   └── RightSection (Cart Panel - Sticky)
│       ├── CartHeader
│       ├── CartItems
│       │   └── CartItem (repeated)
│       │       ├── ProductImage
│       │       ├── Name
│       │       ├── Price
│       │       ├── QtyControls
│       │       └── DeleteButton
│       ├── Divider
│       ├── Totals
│       │   ├── Subtotal
│       │   ├── Tax
│       │   └── GrandTotal
│       ├── Divider
│       ├── PaymentSection
│       │   ├── PaymentMethodButtons
│       │   ├── CashInput (if cash selected)
│       │   └── ChangeDisplay
│       ├── Divider
│       └── ActionButtons
│           ├── CheckoutButton
│           └── ResetButton
│
└── Modals
    ├── ReceiptModal
    │   ├── InvoiceNumber
    │   ├── DateTime
    │   ├── Items
    │   ├── Totals
    │   ├── PaymentInfo
    │   └── PrintButton
    │
    └── ConfirmationModal (optional)
```

---

## Data Flow Diagram

### Authentication Flow
```
┌─────────────────────────────────────────────────┐
│  User Login Form                                │
│  ┌─────────────────────────────────────────┐   │
│  │ Email: _______________________          │   │
│  │ Password: __________________            │   │
│  │ [Login Button]                          │   │
│  └─────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
       authService.login(email, password)
                       │
                       ▼
     POST /api/auth/login (Axios)
                       │
                       ▼
          ┌────────────────────────┐
          │ Laravel API Response   │
          │ { token, user }        │
          └────────────┬───────────┘
                       │
                       ▼
     localStorage.setItem('auth_token')
     localStorage.setItem('user')
                       │
                       ▼
          Redirect to Dashboard
                       │
                       ▼
       Display User Info + Role-based Content
```

### Product Fetching Flow
```
┌──────────────────────────────────┐
│ Component Mount (useEffect)      │
└──────────────────┬───────────────┘
                   │
                   ▼
    productService.getProducts()
                   │
                   ▼
     GET /api/products (Axios)
           with Authorization header
                   │
                   ▼
          ┌────────────────────────┐
          │ Laravel API Response   │
          │ { data: [Products] }   │
          └────────────┬───────────┘
                       │
                       ▼
           setState(response.data)
                       │
                       ▼
       Re-render with Products
                       │
                       ▼
          Display Product Grid
```

### Transaction (Checkout) Flow
```
┌──────────────────────────────┐
│ Customer Selects Products    │
│ (Adds to Cart)               │
└──────────────────┬───────────┘
                   │
                   ▼
        Calculate Totals
        (Subtotal + Tax)
                   │
                   ▼
    ┌─────────────────────────────┐
    │ Select Payment Method:      │
    │ ○ Cash ○ QRIS ○ Debit      │
    └─────────────────┬───────────┘
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
         If Cash       If QRIS/Debit
             │              │
             ▼              │
      Input Paid         Mark as
      Amount             Paid
             │              │
             ▼              ▼
      Calculate        Set Paid Amount
      Change           to Total
             │              │
             └───────┬──────┘
                     │
                     ▼
      ┌─────────────────────────────┐
      │ Click Checkout Button       │
      └─────────────────┬───────────┘
                        │
                        ▼
    transactionService.createTransaction({
      items, payment_method, paid_amount
    })
                        │
                        ▼
       POST /api/transactions (Axios)
                        │
                        ▼
         ┌──────────────────────────┐
         │ Laravel Creates Record   │
         │ Generates Invoice #      │
         │ Deducts Stock            │
         │ Returns Receipt Data     │
         └──────────────┬───────────┘
                        │
                        ▼
            ┌──────────────────────┐
            │ Show Receipt Modal   │
            │ - Invoice Number     │
            │ - Items              │
            │ - Totals             │
            │ - [Print Button]     │
            └──────────────┬───────┘
                           │
                           ▼
          ┌──────────────────────────┐
          │ Clear Cart & Reset Form  │
          │ Show Success Toast       │
          └──────────────────────────┘
```

---

## State Management Flow

### Cart State (Client Side)
```
cart = [
  { id: 1, name: "Espresso", price: 25000, qty: 2 },
  { id: 2, name: "Latte", price: 45000, qty: 1 },
  ...
]

↓ (recalculate on change)

subtotal = sum(item.price * item.qty)
tax = subtotal * 0.1
total = subtotal + tax

↓ (display in UI)

Total: Rp. 150.000 + Rp. 15.000 = Rp. 165.000
```

### Payment State (Client Side)
```
paymentMethod = "cash" | "qris" | "debit"

If paymentMethod === "cash":
  - Show input for paid_amount
  - Calculate change = paid_amount - total
  - Validate paid_amount >= total
Else:
  - Mark as paid automatically
  - Set paid_amount = total
  - No change calculation
```

---

## API Integration Points

### Service ↔ Component Flow
```
Component
    ↓
useEffect(() => {
    productService.getProducts()  ← Calls Service
})
    ↓
Service (services/products.ts)
    ↓
apiClient.get('/products')  ← Calls API Client
    ↓
API Client (services/api.ts)
    ├─ Add Authorization Header
    ├─ Add Content-Type Header
    └─ Handle Errors
    ↓
HTTP Request via Axios
    ↓
Laravel REST API
    ↓
HTTP Response
    ↓
API Client
    ├─ Check for errors (401, 500, etc)
    ├─ Validate response format
    └─ Return data
    ↓
Service
    └─ Return response.data
    ↓
Component
    └─ setState(data)
    └─ Re-render UI
```

---

## URL Routes

```
Frontend Routes:
├── /                          → Home (Cashier by default)
├── /admin                     → Admin Dashboard
├── /admin/products            → Products Management
├── /admin/categories          → Categories Management
├── /admin/transactions        → Transactions History
├── /admin/reports             → Reports
└── /admin/users               → User Management

Backend API Endpoints:
├── /api/auth/
│   ├── POST   login
│   ├── POST   logout
│   └── GET    me
│
├── /api/products/
│   ├── GET    /
│   ├── GET    /{id}
│   ├── POST   /
│   ├── PUT    /{id}
│   └── DELETE /{id}
│
├── /api/categories/
│   ├── GET    /
│   ├── GET    /{id}/products
│   ├── POST   /
│   ├── PUT    /{id}
│   └── DELETE /{id}
│
└── /api/transactions/
    ├── GET    /
    ├── GET    /{id}
    ├── POST   /
    ├── GET    /report
    └── GET    /daily-revenue
```

---

## File Size Guide

| File | Size | Purpose |
|------|------|---------|
| admin-dashboard-page.tsx | ~450 lines | Admin interface |
| cashier-page.tsx | ~670 lines | POS interface |
| api.ts | ~40 lines | Axios config |
| auth.ts | ~100 lines | Auth service |
| products.ts | ~100 lines | Product service |
| transactions.ts | ~120 lines | Transaction service |
| globals.css | ~100 lines | Theme colors |
| Documentation | ~2000+ lines | 5 files |

---

## Color Reference

### Coffee Light Theme
```
Primary:        #6B4423
Secondary:      #C4A57B
Accent:         #8B5A2B
Background:     #FBF8F3
Foreground:     #3E2723
Sidebar:        #2D1810
Border:         #E8DFD5
```

### Coffee Dark Theme
```
Primary:        #A0826D
Secondary:      #5C4033
Accent:         #D4A574
Background:     #2D1810
Foreground:     #EDE7E1
Sidebar:        #1A0E0A
Border:         #4A3728
```

---

## Dependencies Map

```
React & Next.js
├── next
├── react
└── react-dom

Styling
├── tailwindcss
├── @tailwindcss/postcss
└── postcss

UI Components
├── @radix-ui/* (20+ packages)
├── lucide-react (icons)
└── recharts (charts)

API & State
└── axios

Forms
├── react-hook-form
└── zod

Utilities
├── date-fns
├── clsx
└── tailwind-merge

Other
├── sonner (toasts)
├── next-themes (dark mode)
└── class-variance-authority
```

---

**This visual structure helps understand how everything connects together!** ☕
