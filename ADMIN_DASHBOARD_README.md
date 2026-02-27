# Admin Dashboard - BeanStock POS System

## Overview

Admin Dashboard adalah halaman administrasi untuk mengelola sistem POS Coffee Shop BeanStock. Dashboard menyediakan analitik real-time, manajemen produk, dan monitoring transaksi.

---

## Features

### 1. **Dashboard Overview**
   - 4 Summary Cards dengan KPI utama:
     - Today's Revenue (Rp format)
     - Total Orders Today
     - Total Products
     - Low Stock Items
   - Masing-masing card memiliki icon dan trend percentage

### 2. **Top Selling Products This Week**
   - List 5 produk terlaris
   - Menampilkan: Ranking badge, nama produk, jumlah sold, revenue
   - Format: #1, #2, #3 badge dengan warna amber

### 3. **Low Stock Alert**
   - List produk dengan stok <= 5
   - Status badge: 
     - Red: Out of Stock
     - Yellow: Low Stock
   - Quick reference untuk restocking

### 4. **Recent Transactions**
   - 5 transaksi terbaru
   - Columns: Invoice number, Cashier name, Amount, Status, Time
   - Status badge: Paid (hijau), Cancelled (abu-abu)
   - Responsive table dengan horizontal scroll di mobile

### 5. **Sidebar Navigation**
   - Menu items:
     - Overview (currently active)
     - Product Management
     - Category Management
     - Transactions
     - Users
   - Logo/brand section
   - Logout button
   - Mobile responsive dengan hamburger menu

### 6. **Top Navbar**
   - Judul "Admin Dashboard"
   - Welcome text: "Welcome, Admin"
   - Logout button
   - Mobile menu toggle

---

## File Structure

```
components/
└── admin-dashboard-page.tsx      (450 lines)

app/admin/
└── page.tsx                      (12 lines)
```

---

## How to Use

### Accessing the Dashboard

```bash
# Kasir page (main)
http://localhost:3000

# Admin Dashboard
http://localhost:3000/admin
```

### Features Implemented

✅ Dashboard Overview dengan 4 summary cards  
✅ Top Selling Products section  
✅ Low Stock Alert section  
✅ Recent Transactions table  
✅ Responsive Sidebar navigation  
✅ Mobile-friendly hamburger menu  
✅ Clean & minimalist design  
✅ Coffee shop color scheme (amber/brown)  
✅ Dummy data dengan format realistic  
✅ Currency formatting (Rp)  

---

## Data

### Mock Data Included

- **Summary Cards**: 4 KPI dengan realistic values
- **Top Products**: 5 produk terlaris (Espresso, Latte, Cappuccino, dll)
- **Low Stock Products**: 5 produk dengan stok rendah
- **Transactions**: 5 transaksi terbaru dengan mixed status

Semua data sudah diformat dengan currency Rp dan waktu realistic.

---

## Styling

### Design System

- **Primary Color**: Amber (#D97706) - untuk active state & highlights
- **Background**: White & Gray-50 untuk contrast
- **Cards**: White dengan subtle border & shadow
- **Text**: Gray-900 (heading), Gray-600 (body)

### Responsive

- **Mobile**: Full-width dengan stacked layout
- **Tablet**: 2-column grid untuk summary cards
- **Desktop**: 4-column grid untuk summary cards

---

## Components Used

- `Button` - shadcn/ui
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle` - shadcn/ui
- `lucide-react` - Icons (BarChart3, ShoppingCart, Package, AlertCircle, etc)

---

## API Integration (Future)

Dashboard saat ini menggunakan dummy data. Untuk production, update API endpoints:

```typescript
// Example: Fetch dashboard data
const fetchDashboardData = async () => {
  // GET /api/dashboard/summary
  // GET /api/dashboard/top-products
  // GET /api/dashboard/low-stock
  // GET /api/transactions/recent
};
```

---

## Next Steps

1. **Connect to Backend**
   - Integrate API endpoints untuk fetch real data
   - Replace mock data dengan API calls

2. **Add More Pages**
   - Product Management page
   - Category Management page
   - Transactions detail page
   - Users management page

3. **Add Authentication**
   - Login page
   - Session management
   - Role-based access control

4. **Add Charts/Graphs**
   - Revenue chart (daily/weekly/monthly)
   - Sales trend chart
   - Product performance chart

---

## Quick Start

```bash
# 1. Dev server sudah berjalan
npm run dev

# 2. Akses dashboard
http://localhost:3000/admin

# 3. Test responsiveness
# Ubah browser window size untuk melihat responsive behavior
```

---

## Notes

- Admin Dashboard adalah halaman standalone dengan dummy data
- Sidebar navigation berfungsi untuk visual purposes (belum navigasi real)
- Mobile hamburger menu sudah fully functional
- Semua styling menggunakan Tailwind CSS + shadcn/ui
- TypeScript untuk full type safety

---

## Support

Untuk pertanyaan atau bantuan implementasi backend, lihat file `INTEGRATION_GUIDE.md`
