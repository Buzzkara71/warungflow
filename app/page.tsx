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

          {/* Short line for recruiters (English) */}
          <p className="mt-2 text-xs md:text-sm text-slate-400 max-w-xl">
            Built as a full-stack case study to demonstrate real-world problem
            solving: authentication, role-based access, inventory logic, and
            daily sales analytics.
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
                <span className="font-medium">Dashboard harian</span> — pantau
                omzet dan jumlah transaksi per hari.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                <span className="font-medium">Alert stok rendah</span> —
                dapatkan daftar produk yang perlu di-restock sebelum kehabisan.
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
            For recruiters & hiring managers
          </p>
          <p className="mt-2 text-xs text-slate-500">
            This project showcases end-to-end skills: full-stack Next.js,
            PostgreSQL with Prisma, JWT auth with refresh tokens, role-based
            access, and a business-oriented dashboard instead of a simple CRUD
            demo.
          </p>
        </div>
      </section>

      {/* Recruiter-focused English section */}
      <section className="mt-2 rounded-2xl border bg-white px-5 py-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-[0.18em]">
            For recruiters
          </p>
          <h2 className="mt-2 text-sm md:text-base font-semibold text-slate-900">
            A practical case study instead of a toy project.
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-500 max-w-xl">
            WarungFlow is designed as a real-world scenario: small retailers,
            inventory constraints, and simple but secure access control. I use it
            to demonstrate how I approach requirements, data modelling, and
            trade-offs in a production-like environment.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <Link
            href="https://github.com/Buzzkara71/warungflow#readme"
            target="_blank"
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            View Case Study
          </Link>
          <p className="text-[11px] text-slate-400 max-w-xs">
            The case study explains the problem, reasoning, architecture, and
            key technical decisions behind this project.
          </p>
        </div>
      </section>
    </main>
  );
}
