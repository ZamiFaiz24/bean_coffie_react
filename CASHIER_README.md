# BeanStock Cashier Page

Halaman kasir profesional untuk BeanStock Coffee Shop yang dibangun dengan Next.js, React, TypeScript, dan TailwindCSS.

## Fitur

✅ **Product Grid** - Grid produk responsif dengan gambar, nama, harga, dan stock
✅ **Shopping Cart** - Keranjang belanja sticky di sisi kanan
✅ **Quantity Control** - Kontrol kuantitas dengan tombol +/− dan input langsung
✅ **Payment Methods** - 3 metode pembayaran: Cash, QRIS, Debit
✅ **Cash Calculation** - Hitung kembalian otomatis untuk pembayaran cash
✅ **Receipt Modal** - Struk pembayaran profesional dengan nomor invoice
✅ **Print Receipt** - Fungsi print untuk struk
✅ **Toast Notifications** - Notifikasi user feedback
✅ **Loading States** - Indikator loading saat fetch data & checkout
✅ **Validation** - Validasi cart tidak kosong, pembayaran cash cukup
✅ **Mobile Responsive** - Desain responsif untuk semua ukuran layar

## Setup

### 1. File Utama
- **`components/cashier-page.tsx`** - Satu file yang berisi semua komponen kasir (670+ baris)
- **`app/page.tsx`** - Main page yang menggunakan CashierPage component

### 2. Dependencies (Sudah termasuk di project)
```
- next
- react
- lucide-react (icons)
- tailwindcss
```

### 3. Tidak perlu install apapun!
Semua dependencies sudah tersedia di project Anda.

## Cara Menggunakan

### Untuk Testing Awal (Mock Data)
Sistem sudah include mock data default, jadi bisa langsung:

```bash
npm run dev
# Buka http://localhost:3000
```

Sistem akan otomatis menggunakan mock data jika API tidak tersedia.

### Untuk Integrasi dengan Backend Anda

Sistem ini expect 2 API endpoints:

#### 1. GET /api/products
Mengembalikan list produk

**Response:**
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

#### 2. POST /api/transactions
Membuat transaksi baru

**Request:**
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

**Response:**
```json
{
  "success": true,
  "invoice_number": "INV-1234567890",
  "message": "Transaction successful"
}
```

## Component Structure

File `cashier-page.tsx` berisi:

1. **Types & Interfaces**
   - `Product` - Tipe produk
   - `CartItem` - Item di keranjang
   - `TransactionPayload` - Payload checkout
   - `Receipt` - Data struk

2. **API Client**
   - `apiClient.get()` - GET request
   - `apiClient.post()` - POST request

3. **Sub-Components**
   - `ReceiptModal` - Modal struk pembayaran

4. **Main Component**
   - `CashierPage` - Komponen utama dengan logic

## State Management

Menggunakan React Hooks (useState, useEffect, useCallback):

- `products` - List produk dari API
- `cart` - List item di keranjang
- `loading` - Status loading fetch produk
- `checkoutLoading` - Status loading saat checkout
- `paymentMethod` - Metode pembayaran (CASH/QRIS/DEBIT)
- `paidAmount` - Jumlah uang yang dibayar
- `receipt` - Data struk terakhir
- `showReceipt` - Tampilkan/sembunyikan modal struk

## Fitur Detail

### 1. Add to Cart
- Click pada produk untuk menambah ke keranjang
- Cek stock sebelum menambah
- Toast notification saat berhasil

### 2. Cart Management
- Tampilkan di sticky panel di kanan
- Kontrol qty dengan +/− button atau input langsung
- Delete item dengan trash icon
- Auto-update subtotal, tax, total

### 3. Payment Methods
- **CASH**: Ketik jumlah uang yang dibayar, auto-hitung kembalian
- **QRIS**: Tampilkan total yang harus dibayar
- **DEBIT**: Tampilkan total yang harus dibayar

### 4. Checkout
- Validasi cart tidak kosong
- Validasi pembayaran cash harus >= total
- Loading indicator saat process
- Auto-clear cart saat berhasil
- Auto-show receipt modal

### 5. Receipt
- Tampilkan nomor invoice, tanggal, item, total
- Tampilkan metode pembayaran dan jumlah pembayaran
- Tampilkan kembalian untuk cash
- Button print untuk cetak struk
- Desain profesional dengan rupiah format

## Customization

### Mengubah Warna Tema
Edit di `globals.css` untuk mengubah color tokens

### Mengubah Mock Data
Edit mock data di dalam `useEffect` fetch products:

```typescript
setProducts([
  {
    id: '1',
    name: 'Your Product',
    price: 25000,
    stock: 50,
    image: '/your-image.jpg',
    category: 'Your Category',
  },
  // ... add more
]);
```

### Mengubah Tax Rate
Cari `subtotal * 0.1` dan ubah 0.1 ke nilai yang diinginkan

### Mengubah Format Rupiah
Format menggunakan `.toLocaleString('id-ID')`, bisa disesuaikan locale

## Error Handling

- Otomatis fallback ke mock data jika API error
- Toast notification untuk setiap error
- Validasi input untuk semua form
- Stock validation sebelum add to cart
- Payment amount validation sebelum checkout

## Performance

- Memoized callbacks dengan `useCallback` untuk prevent unnecessary re-renders
- Efficient cart updates menggunakan functional setState
- Image lazy loading dengan Next.js Image component
- Sticky panel dengan CSS `position: sticky`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Tips

1. **Untuk development**: Gunakan mock data yang sudah tersedia
2. **Untuk production**: Implement API endpoints sesuai spesifikasi
3. **Untuk print**: Bisa custom receipt template di `ReceiptModal`
4. **Untuk multi-currency**: Update format di toLocaleString()
5. **Untuk tracking**: Simpan invoice_number untuk audit trail

## Troubleshooting

### Mock data tidak muncul
- Pastikan console tidak ada error
- Check `[v0] Using mock data for demo` di console

### API tidak terkoneksi
- Check endpoint URL di `apiClient.get('/api/products')`
- Check CORS headers jika backend di domain berbeda
- Lihat network tab di browser dev tools

### Cart tidak update
- Refresh page jika ada issue state
- Check console untuk error message

### Receipt tidak print
- Pastikan browser support window.print()
- Try dengan print preview dulu

## File Yang Anda Butuh Update

Hanya 1 file yang perlu Anda integrasikan ke project:

```
components/cashier-page.tsx
```

Itu saja! Semua UI components sudah tersedia di project Anda.

## Kapan Siap untuk Production?

Checklist sebelum production:

- [ ] API endpoints sudah implemented di backend
- [ ] Test dengan data real dari database
- [ ] Test semua payment methods
- [ ] Test print receipt di printer nyata
- [ ] Customize UI sesuai brand Anda
- [ ] Set proper error handling & logging
- [ ] Test di berbagai device & browser
- [ ] Setup analytics/monitoring untuk transactions
- [ ] Security audit untuk payment flow

## Support

Untuk bantuan atau pertanyaan lebih lanjut, lihat:
- React docs: https://react.dev
- Next.js docs: https://nextjs.org
- shadcn/ui docs: https://ui.shadcn.com
- TailwindCSS docs: https://tailwindcss.com
