# Quick Integration Guide - BeanStock Cashier

Panduan cepat untuk mengintegrasikan halaman kasir baru ke project BeanStock Anda yang existing.

## Yang Sudah Dilakukan ✓

1. **Buat file cashier**: `components/cashier-page.tsx` (671 baris, self-contained)
2. **Update page**: `app/page.tsx` sudah di-update untuk menggunakan CashierPage
3. **Add imports**: Toaster di layout.tsx sudah ditambahkan

## Langkah Integrasi

### Step 1: Copy File Kasir
File sudah ada di:
```
components/cashier-page.tsx
```

Tidak perlu copy file lagi, sudah tersedia di project Anda!

### Step 2: Cek Dependencies
Pastikan package.json memiliki:
```json
{
  "dependencies": {
    "react": "latest",
    "next": "latest",
    "lucide-react": "latest",
    "tailwindcss": "latest"
  }
}
```

Semua sudah ada di project Anda, tidak perlu install tambahan.

### Step 3: Run Development Server
```bash
npm run dev
```

Buka `http://localhost:3000` dan sistem kasir sudah siap!

## Integrasi dengan Backend

### Option A: Menggunakan Mock Data (Development)

Sistem sudah auto-fallback ke mock data jika API error. Cocok untuk:
- Development & testing
- Buat UI dulu sebelum backend
- Demo ke client

### Option B: Integrasi dengan Backend (Production)

#### Implement API Endpoint 1: GET /api/products

File yang biasanya perlu Anda update (sesuai backend stack Anda):
- **Node.js Express**: `routes/products.js` atau `controllers/productController.js`
- **Python Flask**: `routes/products.py`
- **Django**: `views.py`
- **Laravel**: `ProductController.php`

Endpoint harus return:
```json
{
  "products": [
    {
      "id": "1",
      "name": "Espresso",
      "price": 25000,
      "stock": 50,
      "image": "/coffee-1.jpg",
      "category": "Hot Drinks"
    }
  ]
}
```

#### Implement API Endpoint 2: POST /api/transactions

Endpoint untuk membuat transaksi baru.

Request body:
```json
{
  "items": [
    {
      "product_id": "1",
      "qty": 2,
      "price": 25000
    }
  ],
  "payment_method": "CASH",
  "paid_amount": 60000,
  "total_amount": 50000
}
```

Response:
```json
{
  "success": true,
  "invoice_number": "INV-1234567890",
  "message": "Transaction successful"
}
```

#### Update API Client

Di `cashier-page.tsx`, ganti endpoint URLs sesuai backend Anda:

```typescript
// Line ~145 - Fetch products
const data = await apiClient.get('/api/products'); // Sesuaikan URL

// Line ~270 - Checkout
response = await apiClient.post('/api/transactions', payload); // Sesuaikan URL
```

Contoh jika backend di port berbeda:
```typescript
const data = await apiClient.get('http://localhost:5000/api/products');
response = await apiClient.post('http://localhost:5000/api/transactions', payload);
```

Atau setup di environment variable:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
const data = await apiClient.get(`${API_BASE}/api/products`);
```

## Testing

### Test dengan Mock Data (No Backend)
```bash
npm run dev
# Buka http://localhost:3000
# Sistem siap digunakan!
```

### Test Add to Cart
1. Klik produk di grid
2. Lihat item muncul di cart panel kanan

### Test Quantity Control
1. Click +/− button di cart item
2. Atau type angka langsung di input

### Test Payment Methods
1. Pilih Cash/QRIS/Debit
2. Untuk Cash, ketik paid amount
3. Lihat change auto-calculate

### Test Checkout
1. Click Checkout button
2. Lihat receipt modal muncul
3. Click Print Receipt untuk test print

## Common Issues & Solutions

### Issue: "Cart is empty" error padahal sudah tambah item

**Solution:**
- Refresh page
- Check console untuk error message
- Pastikan network request tidak error

### Issue: Produk tidak load

**Solution:**
- Check console logs (cari `[v0] Using mock data for demo`)
- Jika backend belum siap, mock data akan digunakan
- Pastikan CORS settings jika backend di domain lain

### Issue: Checkout tidak berhasil

**Solution:**
- Pastikan cart tidak kosong
- Untuk Cash, pastikan paid_amount >= total
- Check network request di browser dev tools
- Lihat error message di toast notification

### Issue: Receipt tidak print

**Solution:**
- Pastikan browser support `window.print()`
- Try print preview dulu sebelum print actual
- Check print dialog settings

### Issue: Images tidak load

**Solution:**
- Mock data uses placeholder paths (`/coffee-1.jpg` etc)
- Jika real image path berbeda, update di backend response
- Check console untuk image 404 errors

## Customization Tips

### Mengubah Layout Products Grid
Cari di cashier-page.tsx:
```typescript
<div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max">
```

Ubah `grid-cols-2 md:grid-cols-3` sesuai kebutuhan.

### Mengubah Tax Rate
Cari:
```typescript
const tax = subtotal * 0.1; // 10%
```

Ubah 0.1 ke rate yang diinginkan.

### Mengubah Warna Tema
Edit `globals.css` untuk mengubah design tokens seperti:
- `--primary` (warna tombol)
- `--background` (warna background)
- `--foreground` (warna text)

### Menambah Product Fields
Jika ingin tambah field (misal: description, allergens):
1. Update `Product` interface
2. Update backend response
3. Update product card display

## File Structure Anda Setelah Integrasi

```
your-project/
├── app/
│   ├── layout.tsx          (✓ sudah update - Toaster added)
│   ├── page.tsx            (✓ sudah update - gunakan CashierPage)
│   └── globals.css
├── components/
│   ├── cashier-page.tsx    (✓ baru - file utama kasir)
│   └── ui/                 (✓ existing - semua UI components)
├── lib/
│   └── api-client.ts       (✓ existing - API helper)
├── types/
│   └── pos.ts              (✓ existing - types)
├── package.json
└── tsconfig.json
```

## Next Steps

### Short Term (Development)
1. ✓ Run sistem dengan mock data
2. ✓ Test UI dan functionality
3. ✓ Customize warna/branding
4. ✓ Discuss dengan backend team tentang API spec

### Medium Term (Backend Integration)
1. Backend team implement `/api/products` endpoint
2. Backend team implement `/api/transactions` endpoint
3. Update API URLs di cashier-page.tsx
4. Test integration end-to-end

### Long Term (Production Ready)
1. Setup proper error handling & logging
2. Add analytics untuk transaction tracking
3. Setup payment gateway untuk non-cash methods
4. Add user authentication jika needed
5. Setup invoice storage & reporting
6. Performance optimization
7. Security audit

## Support & Resources

**Documentation:**
- CASHIER_README.md - Lengkap dokumentasi fitur
- API_REQUIREMENTS.md - Detail API spec (jika ada)
- BACKEND_EXAMPLE.md - Contoh backend implementation (jika ada)

**External Docs:**
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- shadcn/ui: https://ui.shadcn.com
- TailwindCSS: https://tailwindcss.com

## Itu Saja!

Sistem kasir Anda sudah siap digunakan. Hanya perlu:
1. ✓ Run `npm run dev`
2. ✓ Buka http://localhost:3000
3. ✓ Test kasir
4. ✓ Nanti integrate backend ketika siap

Enjoy! ☕️
