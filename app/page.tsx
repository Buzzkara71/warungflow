"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col gap-8 px-6 py-8">
      {/* Hero Section */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr,1fr] items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-3">
            WarungFlow • POS & Inventory
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Kendalikan penjualan & stok warung{" "}
            <span className="text-emerald-600">tanpa file Excel yang ribet.</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-500 max-w-xl">
            WarungFlow membantu pemilik warung dan kasir mencatat transaksi,
            memantau stok, dan melihat performa penjualan harian dalam satu
            tampilan yang rapi dan mudah dipahami.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
            >
              Buka Dashboard
            </Link>
            <Link
              href="/sales"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Mulai Transaksi
            </Link>
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            Login sebagai <span className="font-medium">Admin</span> untuk
            mengelola produk dan melihat dashboard;{" "}
            <span className="font-medium">Kasir</span> fokus ke transaksi saja.
          </p>
        </div>

        {/* Highlight Card */}
        <div className="rounded-2xl border bg-white px-5 py-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-700">
            Ringkasan fitur utama
          </p>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                <span className="font-medium">Dashboard harian</span> —
                pantau omzet dan jumlah transaksi per hari.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                <span className="font-medium">Alert stok rendah</span> — dapatkan
                daftar produk yang perlu di-restock sebelum kehabisan.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                <span className="font-medium">Role-based access</span> — admin
                dan kasir punya akses yang berbeda & lebih aman.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                <span className="font-medium">Transaksi dengan keranjang</span>{" "}
                — stok otomatis berkurang setiap penjualan tercatat.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Secondary Section */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-700">
            Untuk pemilik warung
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Lihat performa harian tanpa harus menghitung manual. Cocok untuk
            pemilik warung yang ingin tahu omzet dan stok kritis dengan cepat.
          </p>
        </div>
        <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-700">
            Untuk kasir
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Tampilan sederhana untuk input transaksi. Kasir cukup pilih produk,
            isi jumlah, dan simpan — semua stok di belakang akan ikut ter-update.
          </p>
        </div>
        <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-700">
            Untuk recruiter
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Project ini menunjukkan kemampuan fullstack: Next.js, Prisma,
            PostgreSQL, JWT (access & refresh token), dan role-based access yang
            mendekati kebutuhan sistem produksi.
          </p>
        </div>
      </section>
    </main>
  );
}
