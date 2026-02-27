# BeanStock POS System - Quick Start Guide

## ⚡ 5 Menit Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser

**Cashier/POS Page**
```
http://localhost:3000
```

**Admin Dashboard**
```
http://localhost:3000/admin
```

Done! ✨

---

## 📱 Halaman Utama

### 1. Cashier/POS Page
**URL**: `http://localhost:3000`

**Fitur**:
- Jual produk dengan add to cart
- Kelola quantity (+ / −)
- Pilih metode pembayaran (Cash, QRIS, Debit)
- Hitung kembalian otomatis untuk Cash
- Tampilkan struk invoice
- Print receipt

**Test Data**: Sudah included - 12 produk coffee & food

---

### 2. Admin Dashboard
**URL**: `http://localhost:3000/admin`

**Fitur**:
- Lihat revenue & sales hari ini
- Monitor top selling products
- Alert untuk produk low stock
- Tabel transaksi terbaru
- Sidebar navigation
- Mobile responsive

**Test Data**: Sudah included - realistic dummy data

---

## 🎯 File Locations

```
Cashier Page:
components/cashier-page.tsx        (Main component - 671 lines)
app/page.tsx                       (Route - shows cashier-page)

Admin Dashboard:
components/admin-dashboard-page.tsx (Main component - 450 lines)
app/admin/page.tsx                 (Route - shows admin dashboard)
```

---

## ✨ Features Siap Pakai

### Cashier Features
✅ Product grid dengan image
✅ Shopping cart dengan qty control
✅ Delete item
✅ Calculate subtotal + tax + total
✅ Payment methods: Cash, QRIS, Debit
✅ Auto-calculate change (Cash only)
✅ Receipt modal with invoice
✅ Toast notifications
✅ Mobile responsive
✅ TypeScript typed

### Admin Dashboard Features
✅ Summary cards (4 KPI)
✅ Top selling products ranking
✅ Low stock alert
✅ Recent transactions table
✅ Sidebar navigation
✅ Mobile hamburger menu
✅ Clean minimalist design
✅ Coffee shop color theme
✅ Responsive layout
✅ TypeScript typed

---

## 🔧 Customization

### Ganti Warna/Brand

**Cashier Page Color Tokens**:
```typescript
// components/cashier-page.tsx
// Ubah warna di bagian className untuk styling
// Example: bg-amber-600 → bg-orange-600
```

**Admin Dashboard Color Tokens**:
```typescript
// components/admin-dashboard-page.tsx
// Ubah warna di bagian className untuk styling
// Example: bg-amber-600 → bg-blue-600
```

### Ganti Dummy Data

**Cashier Page Mock Data**:
```typescript
// components/cashier-page.tsx - Line ~30-80
const mockProducts = [...]

// Edit products: name, price, stock, image, category
```

**Admin Dashboard Mock Data**:
```typescript
// components/admin-dashboard-page.tsx - Line ~50-150
const mockSummaryCards = [...]
const mockTopProducts = [...]
const mockLowStockProducts = [...]
const mockTransactions = [...]

// Edit data sesuai kebutuhan
```

---

## 🚀 Next Steps

### 1. Test Current Features
```bash
npm run dev
# Visit http://localhost:3000
# Test cashier flow
# Visit http://localhost:3000/admin
# Check admin dashboard
```

### 2. Integrate Backend API
Update API URLs di components:
```typescript
// Replace mock data fetching dengan API calls
const fetchProducts = async () => {
  const response = await fetch('/api/products');
  return response.json();
};
```

### 3. Add Authentication
Implement login page & session management

### 4. Deploy
```bash
npm run build
npm run start
# atau deploy ke Vercel
```

---

## 📚 Documentation

Untuk detail lebih lengkap, baca:

- **COMPLETE_STRUCTURE.md** - File structure & overview
- **CASHIER_README.md** - Cashier page documentation
- **ADMIN_DASHBOARD_README.md** - Admin dashboard documentation
- **INTEGRATION_GUIDE.md** - Backend integration guide

---

## 🐛 Troubleshooting

### Port 3000 sudah digunakan?
```bash
npm run dev -- -p 3001
# Akses di http://localhost:3001
```

### Dependencies tidak terinstall?
```bash
npm install --force
npm run dev
```

### Build error?
```bash
rm -rf .next
npm run build
npm run dev
```

---

## 📞 Support

Untuk pertanyaan atau issue, lihat file dokumentasi yang relevan atau buat issue baru.

---

**Selamat menggunakan BeanStock POS System!** ☕️
