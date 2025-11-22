# WarungFlow
`Please read the English version at README_eng.md`
###Akses disini [Warung Flow](https://warungflow-nh8g.vercel.app/)
Sistem kasir & manajemen stok sederhana untuk UMKM, dibangun dengan **Next.js Fullstack + PostgreSQL** dan didesain dengan mindset **problem solving**, bukan sekadar CRUD.

---

## Latar Belakang Masalah

Banyak warung / UMKM kecil masih mencatat:

- stok barang di buku tulis,
- penjualan di kertas atau catatan HP,
- dan hanya mengecek barang habis **ketika sudah benar-benar kosong**.

Akibatnya:

- Owner sulit menjawab pertanyaan sederhana:
  - “Hari ini omzet berapa?”
  - “Produk apa yang sering habis duluan?”
- Stok sering habis di waktu ramai (Indomie, minuman dingin, rokok, dsb)
- Tidak ada sistem yang mengingatkan jika stok sudah di bawah batas aman.

**Problem utama yang ingin dipecahkan:**

> Bagaimana membuat sistem sederhana yang:
>
> - mudah dipakai pemilik warung,
> - membantu mencatat penjualan,
> - memantau stok,
> - dan memberi sinyal ketika stok mulai menipis.

---

## Solusi: WarungFlow

WarungFlow adalah aplikasi web sederhana yang fokus pada:

1. **Pencatatan penjualan** (multi-item / keranjang)
2. **Manajemen stok** (produk, harga, stok, batas stok rendah)
3. **Dashboard harian** (omzet, jumlah transaksi, produk stok rendah)
4. **Role-based access** (Admin vs Kasir)
5. **Auth yang “serius”**: access token pendek + refresh token, HttpOnly cookie

Bukan hanya “CRUD biasa”, tapi:

- stok akan **otomatis berkurang** saat transaksi,
- dashboard akan **otomatis menandai** produk yang stoknya di bawah batas aman,
- sistem auth mempertimbangkan **keamanan dasar** yang biasa dipakai di backend modern.

---

## 🧠 Mindset Problem Solving & Alur Berpikir 🧠

### 1. Identifikasi Kebutuhan Nyata

Dari sudut pandang pemilik warung, kebutuhan utama:

- **Ingin tahu**:
  - hari ini jualan berapa,
  - berapa kali transaksi,
  - produk mana yang hampir habis.
- **Ingin bisa mencatat** penjualan dengan cepat (tanpa ribet).
- **Tidak ingin pusing** dengan istilah teknis.

Dari sudut pandang developer:

- Butuh data yang rapi: **Product, Sale, SaleItem, User**.
- Butuh relasi yang jelas: 1 `Sale` → banyak `SaleItem`, 1 `User` → banyak `Sale`.
- Butuh autentikasi supaya data tidak bisa dilihat sembarang orang (role admin/kasir).

---

### 2. Translasi Masalah → Desain Sistem

**Masalah:** Sulit tahu stok mana yang mulai habis.  
**Solusi:**

- Di setiap produk, tambahkan field `lowStockThreshold`.
- Buat query di dashboard untuk mencari semua produk `stock <= lowStockThreshold`.
- Tampilkan jelas dengan label **“Perlu Restock”**.

---

**Masalah:** Owner butuh ringkasan harian, bukan sekadar list transaksi.  
 **Solusi:**

- Buat endpoint khusus: `/api/dashboard/today?date=YYYY-MM-DD`
- Hitung:
  - `_sum(totalPrice)` → total penjualan hari itu
  - `count(*)` → jumlah transaksi
- Tampilkan di dashboard sebagai **3 kartu**:
  - Total Penjualan
  - Jumlah Transaksi
  - Produk Stok Rendah

---

**Masalah:** Admin dan kasir punya hak akses berbeda.  
**Solusi:**

- Tambahkan `role` di tabel `User` (`admin` / `cashier`).
- Di API:
  - `/api/products` → `GET` boleh admin & kasir, `POST` hanya admin.
  - `/api/dashboard/*` → hanya admin.
  - `/api/sales` → admin & kasir boleh membuat transaksi.

---

**Masalah:** Token auth sebaiknya tidak long-lived.  
**Solusi:**

- Pakai 2 jenis token:
  - **Access token** (masa hidup pendek, 15 menit).
  - **Refresh token** (masa hidup lebih panjang, 7 hari).
- Access token disimpan di cookie `access_token` (HttpOnly).
- Refresh token disimpan di:
  - cookie `refresh_token`, dan
  - kolom `refreshToken` di tabel `User`.
- Jika `/api/auth/me` mengembalikan `401`, frontend akan:
  - memanggil `/api/auth/refresh`,
  - kalau sukses, mencoba `/api/auth/me` lagi.

Ini memberi kesan bahwa sistem sudah mempertimbangkan **security & session management**, bukan sekadar “login pakai token yang tidak pernah expire”.

---

### 3. Microcopy: Biar App Lebih Manusiawi

Di beberapa bagian UI, saya sengaja menambahkan microcopy:

- Di halaman **Produk**:
  - “Masukkan produk baru yang akan dijual di warung.”
  - “Digunakan untuk memunculkan peringatan stok menipis di dashboard.”
- Di halaman **Sales**:
  - “Keranjang masih kosong. Tambahkan produk di atas.”
  - “Stok akan otomatis berkurang sesuai jumlah yang terjual.”
- Di **Dashboard**:
  - “Produk yang stoknya berada di bawah batas aman.”

Tujuannya: menunjukkan bahwa aplikasi ini **dipikirkan dari sudut pandang user**, bukan cuma dari sisi developer.

---

##  Fitur Utama

### 1. Manajemen Produk

- Tambah produk dengan:
  - Nama
  - Kategori
  - Harga
  - Stok
  - Batas stok rendah
- Tabel produk dengan:
  - Harga dalam Rupiah
  - Label **“Stok rendah”** atau **“Aman”**
  - Ringkasan info: total produk & berapa yang stok rendah

**Role-based:**

- Admin:
  - Bisa menambah produk.
- Kasir:
  - Hanya bisa melihat daftar produk (untuk keperluan transaksi).

---

### 2. Transaksi Penjualan

- Fitur keranjang (cart) untuk:
  - memilih produk,
  - mengisi quantity,
  - menambahkan ke keranjang.
- Validasi:
  - Tidak bisa menjual lebih dari stok yang tersedia.
- Saat transaksi disimpan:
  - Dibuat record di tabel `Sale` (total harga, user).
  - Dibuat beberapa `SaleItem` (detail produk & jumlah).
  - Stok produk dikurangi secara otomatis.
- Riwayat transaksi harian:
  - Ditampilkan di kanan, dengan:
    - nomor transaksi,
    - total harga,
    - waktu,
    - list item → “Indomie x2, Aqua x1, ...”

**Role-based:**

- Admin & kasir boleh membuat transaksi.

---

### 3. Dashboard Harian

- Filter berdasarkan tanggal (`input type="date"`).
- Menampilkan:
  - **Total penjualan** (dalam Rupiah).
  - **Jumlah transaksi**.
  - **Jumlah produk stok rendah**.
- Tabel detail produk stok rendah:
  - Nama
  - Stok
  - Batas stok rendah
  - Label **“Perlu restock”**

**Role-based:**

- Hanya **admin** yang boleh mengakses dashboard.

---

### 4. Auth & Security

- Register:
  - name, email, password, role (admin / cashier).
- Login:
  - verifikasi password dengan bcrypt.
  - set:
    - `access_token` di cookie (15 menit).
    - `refresh_token` di cookie + DB (7 hari).
- Logout:
  - hapus kedua cookie.
  - bersihkan `refreshToken` di database.

Endpoint:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET  /api/auth/me`
- `POST /api/auth/refresh`

---

### 5. Role-based Access (Authorization)

- Implementasi di level API:
  - `getCurrentUser()` membaca `access_token` dari HttpOnly cookie.
  - Validasi role di setiap endpoint yang butuh batasan.
- Implementasi di level UI:
  - Header menampilkan:
    - “Halo, Nama (role)” jika user login.
    - “Login” saja jika belum login.
  - `proxy.ts` (Next.js 15) melindungi route:
    - `/dashboard/*`
    - `/products/*`
    - `/sales/*`

---

## Arsitektur & Tech Stack

- **Framework**: Next.js (App Router, Next 15)
- **Bahasa**: TypeScript
- **UI**: React + Tailwind CSS (utility-first, clean & minimal)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**:
  - JWT Access Token (15m)
  - JWT Refresh Token (7d)
  - HttpOnly cookies
- **Role**: Admin / Kasir
- **Routing Proteksi**:
  - `proxy.ts` (pengganti `middleware.ts` di Next 15)

---

## Desain Data (Prisma)

Contoh bagian penting `schema.prisma`:

```prisma
model User {
  id                  Int      @id @default(autoincrement())
  name                String
  email               String   @unique
  passwordHash        String
  role                String   @default("admin")
  createdAt           DateTime @default(now())

  refreshToken        String?
  refreshTokenExpires DateTime?

  sales               Sale[]
}

model Product {
  id                Int      @id @default(autoincrement())
  name              String
  category          String?
  price             Int
  stock             Int
  lowStockThreshold Int      @default(0)
  createdAt         DateTime @default(now())

  saleItems         SaleItem[]
}

model Sale {
  id         Int        @id @default(autoincrement())
  userId     Int
  totalPrice Int
  createdAt  DateTime   @default(now())

  user       User       @relation(fields: [userId], references: [id])
  items      SaleItem[]
}

model SaleItem {
  id        Int     @id @default(autoincrement())
  saleId    Int
  productId Int
  quantity  Int
  price     Int

  sale      Sale    @relation(fields: [saleId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

## Cara menjalankan secara lokal

```bash
git clone <repo-url>
cd warungflow
npm install
```

Set environment variables:
```env
DATABASE_URL=postgresql://<user>:<pass>@localhost:5432/warungflow
JWT_ACCESS_SECRET=<random-string>
JWT_REFRESH_SECRET=<random-string>
```

Run database setup:
```bash
npx prisma db push
```

Start development server:
```bash
npm run dev
```

Open browser: `http://localhost:3000`

---

## Ringkasan untuk Recruiter

Project ``Next.js + Prisma`` ini saya desain untuk:
- Menggunakan problem statement yang jelas (stok & penjualan warung).
- Menerapkan relasi data yang wajar untuk bisnis retail kecil.
- Menggunakan role-based access (admin & kasir).
- Mengimplementasikan access token pendek + refresh token untuk auth yang lebih aman.
- Menambahkan microcopy dan tampilan minimalis agar terasa seperti aplikasi “beneran”.

### If this project interests you, feel free to reach out or open an issue.

