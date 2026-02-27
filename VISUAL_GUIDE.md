# BeanStock POS System - Visual Guide

## 🎨 Visual Preview & Layout Guide

Ini adalah panduan visual untuk memahami layout & design kedua halaman.

---

## 1️⃣ CASHIER/POS PAGE (http://localhost:3000)

### Layout Struktur

```
┌─────────────────────────────────────────────────────────────────┐
│  ☰  BeanStock Cashier                          Welcome, Admin   │  TOP NAVBAR
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────┐  ┌──────────────────────────┐  │
│  │  PRODUCT GRID (LEFT SIDE)   │  │   CART PANEL (RIGHT)     │  │
│  │  (Products: 4-12 items)     │  │   (Sticky)               │  │
│  │                             │  │                          │  │
│  │ ┌─────────────────────────┐ │  │  🛒 CART (3 items)       │  │
│  │ │  Espresso               │ │  │  ┌────────────────────┐  │  │
│  │ │  Rp 25.000  ⭐⭐⭐⭐⭐  │ │  │  │ Item 1 x2          │  │  │
│  │ │  In Stock 12            │ │  │  │ Rp 50.000          │  │  │
│  │ └─────────────────────────┘ │  │  │ [-] 2 [+] Delete   │  │  │
│  │                             │  │  ├────────────────────┤  │  │
│  │ ┌─────────────────────────┐ │  │  │ Item 2 x1          │  │  │
│  │ │  Latte                  │ │  │  │ Rp 35.000          │  │  │
│  │ │  Rp 30.000  ⭐⭐⭐⭐⭐  │ │  │  │ [-] 1 [+] Delete   │  │  │
│  │ │  In Stock 15            │ │  │  ├────────────────────┤  │  │
│  │ └─────────────────────────┘ │  │  │ Subtotal: 85.000   │  │  │
│  │                             │  │  │ Tax (10%): 8.500   │  │  │
│  │ ... (more products)         │  │  │ TOTAL: 93.500      │  │  │
│  │                             │  │  └────────────────────┘  │  │
│  │                             │  │                          │  │
│  │                             │  │ 💳 PAYMENT METHOD        │  │
│  │                             │  │ ◉ Cash                   │  │
│  │                             │  │ ○ QRIS                   │  │
│  │                             │  │ ○ Debit                  │  │
│  │                             │  │                          │  │
│  │                             │  │ Paid Amount: [Input] Rp  │  │
│  │                             │  │ Change: Rp 6.500         │  │
│  │                             │  │                          │  │
│  │                             │  │  [CHECKOUT]              │  │
│  │                             │  │                          │  │
│  └─────────────────────────────┘  └──────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)

```
┌──────────────────────────────────┐
│ ☰  BeanStock Cashier             │  TOP NAVBAR (compact)
├──────────────────────────────────┤
│                                   │
│  PRODUCT GRID (Stacked)           │
│  ┌────────────────────────────┐   │
│  │ Espresso                   │   │
│  │ Rp 25.000                  │   │
│  │ In Stock 12                │   │
│  └────────────────────────────┘   │
│                                   │
│  CART PANEL (Below products)      │
│  ┌────────────────────────────┐   │
│  │ 🛒 CART (3 items)          │   │
│  │ Item 1 x2: Rp 50.000       │   │
│  │ Item 2 x1: Rp 35.000       │   │
│  │ TOTAL: Rp 93.500           │   │
│  │ [CHECKOUT]                 │   │
│  └────────────────────────────┘   │
│                                   │
└──────────────────────────────────┘
```

### Color Palette

- **Primary**: Amber-600 (#D97706) - Buttons, active states
- **Background**: White/Gray-50 - Main bg
- **Cards**: White - Product cards
- **Text**: Gray-900 (headings), Gray-600 (body)
- **Success**: Green-600 - Paid status
- **Alert**: Red-600 - Out of stock
- **Warning**: Yellow-600 - Low stock

### Key Interactions

```
1. Click Product Card
   → Product added to cart
   → Toast notification: "Added to cart"

2. Qty Controls (+/-)
   → Cart total updates in real-time
   → Prevent qty < 1

3. Delete Button
   → Remove item dari cart
   → Update total

4. Payment Method Selection
   → Cash: Show paid amount & change input
   → QRIS/Debit: Hide change calculation

5. Checkout Button
   → Validate cart not empty
   → Show loading state
   → Send POST /api/transactions
   → Show success toast
   → Display receipt modal
   → Clear cart

6. Print Button (in Receipt)
   → Print window.print()
   → Receipt details printed
```

---

## 2️⃣ ADMIN DASHBOARD PAGE (http://localhost:3000/admin)

### Layout Struktur (Desktop)

```
┌─────────────────┬────────────────────────────────────────────────────────┐
│   SIDEBAR       │  MAIN CONTENT                                          │
│   (256px)       ├────────────────────────────────────────────────────────┤
│                 │  ☰  Admin Dashboard          Welcome, Admin  [Logout]  │
├─────────────────┼────────────────────────────────────────────────────────┤
│ 🍕 BeanStock    │                                                         │
│                 │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│ 📊 Overview     │  │   Today's    │ │  Total       │ │ Total        │   │
│ ✓ (Active)     │  │   Revenue    │ │  Orders      │ │ Products     │   │
│                 │  │              │ │  Today       │ │              │   │
│ 📦 Products     │  │ Rp 4.85M     │ │              │ │ 24           │   │
│ 📁 Categories   │  │ +12%         │ │ 42           │ │ Total items  │   │
│ 💳 Transactions │  │ (4 more)     │ │ +8%          │ │ (4 more)     │   │
│ 👥 Users        │  │              │ │              │ │              │   │
│                 │  └──────────────┘ └──────────────┘ └──────────────┘   │
│                 │                                                         │
│ [Logout]        │  ┌─────────────────────────┐ ┌──────────────────────┐ │
│                 │  │ Top Selling Products    │ │ Low Stock Alert      │ │
│                 │  │                         │ │                      │ │
│                 │  │ #1 Espresso (38 sold)   │ │ Caramel Syrup        │ │
│                 │  │    Rp 1.9M              │ │ [OUT OF STOCK]       │ │
│                 │  │                         │ │                      │ │
│                 │  │ #2 Latte (35 sold)      │ │ Vanilla Beans: 2     │ │
│                 │  │    Rp 1.75M             │ │ [LOW STOCK]          │ │
│                 │  │                         │ │                      │ │
│                 │  │ #3 Cappuccino (28 sold) │ │ (5 more alerts)      │ │
│                 │  │    Rp 1.4M              │ │                      │ │
│                 │  └─────────────────────────┘ └──────────────────────┘ │
│                 │                                                         │
│                 │  ┌────────────────────────────────────────────────────┐ │
│                 │  │ Recent Transactions                                │ │
│                 │  ├─────────────┬─────────┬──────────┬────────┬────────┤ │
│                 │  │ Invoice     │ Cashier │ Amount   │ Status │ Time   │ │
│                 │  ├─────────────┼─────────┼──────────┼────────┼────────┤ │
│                 │  │ INV-001     │ Andi    │ 125K     │ Paid   │ 14:35  │ │
│                 │  │ INV-002     │ Siti    │ 85K      │ Paid   │ 14:28  │ │
│                 │  │ INV-003     │ Andi    │ 200K     │ Paid   │ 14:15  │ │
│                 │  │ INV-004     │ Budi    │ 65K      │ Cancel │ 14:02  │ │
│                 │  │ INV-005     │ Siti    │ 155K     │ Paid   │ 13:55  │ │
│                 │  └─────────────┴─────────┴──────────┴────────┴────────┘ │
│                 │                                                         │
└─────────────────┴────────────────────────────────────────────────────────┘
```

### Mobile View (< 1024px)

```
┌──────────────────────────────────┐
│ ☰  Admin Dashboard               │  TOP NAVBAR (with hamburger)
├──────────────────────────────────┤
│                                   │
│ [SIDEBAR OPENS ON CLICK]           │  (Overlay on mobile)
│                                   │
│ ┌──────────────┐ ┌──────────────┐ │  SUMMARY CARDS (2 columns)
│ │ Today's      │ │ Total        │ │
│ │ Revenue      │ │ Orders       │ │
│ │ Rp 4.85M     │ │ 42           │ │
│ └──────────────┘ └──────────────┘ │
│                                   │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ Total        │ │ Low Stock    │ │
│ │ Products     │ │ Items        │ │
│ │ 24           │ │ 5            │ │
│ └──────────────┘ └──────────────┘ │
│                                   │
│ ┌────────────────────────────────┐ │  SECTIONS (Stacked)
│ │ Top Selling Products           │ │
│ │ #1 Espresso (38) - Rp 1.9M     │ │
│ │ #2 Latte (35) - Rp 1.75M       │ │
│ │ #3 Cappuccino (28) - Rp 1.4M   │ │
│ └────────────────────────────────┘ │
│                                   │
│ ┌────────────────────────────────┐ │
│ │ Low Stock Alert                │ │
│ │ Caramel Syrup [OUT OF STOCK]   │ │
│ │ Vanilla Beans: 2 [LOW STOCK]   │ │
│ └────────────────────────────────┘ │
│                                   │
│ ┌────────────────────────────────┐ │
│ │ Recent Transactions (scroll)   │ │
│ │ INV-001 | Andi | 125K | Paid   │ │
│ │ INV-002 | Siti | 85K | Paid    │ │
│ └────────────────────────────────┘ │
│                                   │
└──────────────────────────────────┘
```

### Color Palette (Same as Cashier)

- **Primary**: Amber-600 - Active menu, highlights
- **Background**: White/Gray-50
- **Cards**: White - Summary cards
- **Borders**: Gray-200 - Subtle separators
- **Success**: Green-600 - Paid status
- **Error**: Red-600 - Out of stock
- **Warning**: Yellow-600 - Low stock

### Key Interactions

```
1. Sidebar Menu Click
   → Active state changes
   → (Currently visual only, can be extended)

2. Hamburger Menu (Mobile)
   → Sidebar appears as overlay
   → Click outside to close
   → Click item to close

3. Logout Button
   → (Ready for auth integration)

4. Hover Effects
   → Cards: Shadow increases
   → Rows: Background color changes
   → Buttons: Color transitions

5. Responsive Behavior
   → Desktop: 4-column grid, 2-column sections
   → Tablet: 2-column grid, stacked sections
   → Mobile: 1-column grid, stacked sections
```

---

## 📐 Responsive Breakpoints

### TailwindCSS Breakpoints Used

```
Mobile First:
  sm  (640px)   - Small phones
  md  (768px)   - Tablets
  lg  (1024px)  - Laptops/desktop
  xl  (1280px)  - Large screens
```

### Layout Changes

#### Cashier Page

| Device | Grid | Layout | Sidebar |
|--------|------|--------|---------|
| Mobile (<768px) | 1 col | Stacked (products above cart) | N/A |
| Tablet (768-1024px) | 2 col | Side by side | N/A |
| Desktop (>1024px) | 3-4 col | Side by side fixed | N/A |

#### Admin Dashboard

| Device | Summary | Products | Status |
|--------|---------|----------|--------|
| Mobile (<1024px) | 2 col | Below | Collapsed sidebar |
| Tablet (1024-1280px) | 2 col | Side by side | Visible sidebar |
| Desktop (>1280px) | 4 col | Side by side | Visible sidebar |

---

## 🎨 Design Components

### Cards

```
┌─────────────────────────────────┐
│ Title/Header                    │
├─────────────────────────────────┤
│ Content Area                    │
│ (Text, Numbers, Tables, etc)    │
│                                 │
│ Footer (Optional)               │
└─────────────────────────────────┘
```

- **Styling**: White bg, gray-200 border, subtle shadow
- **Padding**: 16px (p-4) to 32px (p-8)
- **Radius**: 10px (rounded-lg)
- **Hover**: Shadow increases slightly

### Buttons

```
Primary Button:        [  CHECKOUT  ]
  - Background: Amber-600
  - Text: White
  - Padding: 8-12px vertical, 20-32px horizontal
  - Radius: 8px
  - Hover: Darker shade

Secondary Button:      [ Logout ]
  - Background: Transparent/Gray
  - Text: Gray-600
  - Border: 1px gray
  - Hover: Light background

Disabled Button:       [ CHECKOUT ]
  - Background: Gray-300
  - Text: Gray-500
  - Not clickable
```

### Badges/Status

```
Success Badge:         [ Paid ]
  - Background: Green-100
  - Text: Green-700
  - Padding: 4-8px

Alert Badge:           [ Low Stock ]
  - Background: Yellow-100
  - Text: Yellow-700

Error Badge:           [ Out of Stock ]
  - Background: Red-100
  - Text: Red-700
```

### Input Fields

```
[_________ Input Field ________]
Label Text
Placeholder: "Enter value..."
Border: Gray-200
Radius: 8px
Focus: Border color changes to amber-600
```

---

## 🎯 User Flows

### Cashier Flow

```
1. Page Load
   ↓
2. View Products Grid
   ↓
3. Click Product → Add to Cart
   ↓
4. Adjust Quantity (+/−)
   ↓
5. Review Cart Total
   ↓
6. Select Payment Method
   ↓
7. (If Cash) Enter Paid Amount → Auto-calculate Change
   ↓
8. Click Checkout
   ↓
9. Show Loading State
   ↓
10. Success Toast
    ↓
11. Show Receipt Modal
    ↓
12. Print or Close
    ↓
13. Clear Cart
    ↓
14. Ready for Next Transaction
```

### Admin Dashboard Flow

```
1. Page Load
   ↓
2. View Summary Cards
   ↓
3. View Top Products Section
   ↓
4. View Low Stock Alerts
   ↓
5. View Recent Transactions
   ↓
6. (Optional) Click Sidebar Items
   ↓
7. (Mobile) Click Hamburger for Sidebar
```

---

## 📊 Data Visualization

### Summary Card Example

```
┌─────────────────────────────────┐
│ 💰 Today's Revenue              │  ← Icon + Title
├─────────────────────────────────┤
│ Rp 4.850.000                    │  ← Large number
│                                 │
│ Total sales today  +12%         │  ← Subtitle + Trend %
└─────────────────────────────────┘
```

### Product Ranking Example

```
┌─────────────────────────────────┐
│ [#1] Espresso                   │
│      38 sold  |  Rp 1.900.000   │
├─────────────────────────────────┤
│ [#2] Latte                      │
│      35 sold  |  Rp 1.750.000   │
├─────────────────────────────────┤
│ [#3] Cappuccino                 │
│      28 sold  |  Rp 1.400.000   │
└─────────────────────────────────┘
```

### Transaction Table Example

```
┌──────────┬────────┬─────────┬────────┬────────┐
│ Invoice  │ Cashier│ Amount  │ Status │ Time   │
├──────────┼────────┼─────────┼────────┼────────┤
│ INV-001  │ Andi   │ 125K    │ Paid   │ 14:35  │
│ INV-002  │ Siti   │ 85K     │ Paid   │ 14:28  │
│ INV-003  │ Andi   │ 200K    │ Paid   │ 14:15  │
└──────────┴────────┴─────────┴────────┴────────┘
```

---

## 🎨 Design Tokens

### Colors

```css
--primary: #D97706 (Amber-600)
--primary-light: #FCD34D (Amber-200)
--primary-dark: #92400E (Amber-900)

--success: #16A34A (Green-600)
--warning: #EAB308 (Yellow-600)
--error: #DC2626 (Red-600)

--bg-white: #FFFFFF
--bg-light: #F9FAFB (Gray-50)
--bg-dark: #111827 (Gray-900)

--text-primary: #111827 (Gray-900)
--text-secondary: #4B5563 (Gray-600)
--text-muted: #9CA3AF (Gray-400)

--border: #E5E7EB (Gray-200)
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)
```

### Typography

```
Headings:
  h1: 28px, Weight 700
  h2: 24px, Weight 700
  h3: 20px, Weight 700
  h4: 18px, Weight 600

Body:
  Normal: 16px, Weight 400
  Small: 14px, Weight 400
  Tiny: 12px, Weight 500 (labels)

Font Family: Geist (sans-serif)
Line Height: 1.5-1.6 (body), 1.2-1.3 (headings)
```

### Spacing

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

---

## ✨ Summary

### Cashier Page Design
- Clean, focused on transactions
- Large product cards easy to click
- Sticky cart for easy access
- Simple payment controls
- Quick checkout flow

### Admin Dashboard Design
- Professional SaaS-like interface
- Multiple sections for quick overview
- Responsive sidebar navigation
- Clear data visualization
- Easy to scan tables

Both pages follow:
- **Mobile-first design** - Works great on all devices
- **Clear visual hierarchy** - Important info prominent
- **Consistent styling** - Same colors, spacing, fonts
- **Minimal design** - Clean & not cluttered
- **Accessibility** - Easy to read & interact

---

**Ready to use both pages! Open your browser and enjoy!** 🎉
