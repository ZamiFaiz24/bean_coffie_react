# BeanStock - Coffee Shop POS System

Sistem Point of Sale (Kasir) profesional untuk BeanStock Coffee Shop, dibangun dengan Next.js 16, React 19, TypeScript, dan TailwindCSS.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

Sistem kasir sudah siap digunakan dengan mock data!

## Fitur Utama

- ☕ Grid produk responsif dengan harga dan stok
- 🛒 Shopping cart dengan kontrol kuantitas
- 💳 3 metode pembayaran (Cash, QRIS, Debit)
- 🧾 Struk otomatis dengan nomor invoice
- 🖨️ Print receipt
- 📱 Mobile responsive
- ⚡ Fast & optimized dengan Next.js
- 🎨 Clean UI dengan shadcn/ui & TailwindCSS

## File Struktur

```
components/
└── cashier-page.tsx          # Halaman kasir utama (671 baris, self-contained)

app/
├── page.tsx                   # Main page
├── layout.tsx                 # Root layout
└── globals.css                # Global styles

lib/
└── utils.ts                   # Utility functions

public/
└── (assets & images)

CASHIER_README.md              # Dokumentasi lengkap kasir
INTEGRATION_GUIDE.md           # Panduan integrasi dengan backend
CASHIER_SUMMARY.txt            # Quick summary
```

## Dokumentasi

- **[CASHIER_README.md](./CASHIER_README.md)** - Lengkap fitur dan setup
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Panduan integrasi backend
- **[CASHIER_SUMMARY.txt](./CASHIER_SUMMARY.txt)** - Quick overview

## Integrasi Backend

Sistem mendukung 2 API endpoints:

### GET /api/products
Mengambil list produk dari database

### POST /api/transactions
Membuat transaksi pembayaran baru

Lihat `INTEGRATION_GUIDE.md` untuk detail implementasi.

## Development

Sistem sudah include mock data untuk development. Jika API tidak tersedia, otomatis menggunakan mock data sebagai fallback.

### Test Tanpa Backend
```bash
npm run dev
# Semua fitur berjalan dengan mock data!
```

### Integrasi dengan Backend
1. Backend team implement 2 API endpoints
2. Update API URLs di `components/cashier-page.tsx`
3. Test end-to-end
4. Deploy

## Technology Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **lucide-react** - Icons
- **React Hooks** - State management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

MIT

---

**BeanStock Coffee Shop** ☕️
