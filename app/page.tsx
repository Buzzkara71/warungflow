"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <p className="font-semibold uppercase tracking-[0.15em] text-emerald-600 text-[11px] flex items-center gap-1">
          <span>WarungFlow •</span>
          <span className="text-[9px] opacity-80">POS &amp; Inventory System</span>
        </p>

        {/* Bento Grid */}
        <section className="grid auto-rows-[minmax(160px,auto)] gap-4 md:grid-cols-4">
          {/* Hero card */}
          <div className="md:col-span-3 border border-slate-200 bg-white/80 px-5 py-5 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
                Kendalikan penjualan &amp; stok warung{" "}
                <span className="text-emerald-600">tanpa file Excel yang ribet.</span>
              </h1>
              <p className="mt-3 text-sm md:text-base text-slate-500 max-w-xl">
                WarungFlow membantu pemilik warung dan kasir mencatat transaksi,
                memantau stok, dan melihat performa penjualan harian dalam satu
                tampilan yang rapi dan mudah dipahami.
              </p>

              <p className="mt-2 text-xs md:text-sm text-slate-400 max-w-xl">
                Built as a full-stack case study to demonstrate real-world problem
                solving: authentication, role-based access, inventory logic, and
                daily sales analytics.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Buka Dashboard
              </Link>
              <Link
                href="/sales"
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
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

          {/* Snapshot card */}
          <div className="md:col-span-1 border border-slate-200 bg-white/80 px-4 py-4 flex flex-col justify-between text-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-[0.18em]">
                Snapshot
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Real-case POS for small warungs with dashboard, stock alerts, cart-based
                sales, and simple role-based access.
              </p>
            </div>
            <p className="mt-4 text-[11px] text-slate-400">
              Designed as a portfolio piece to show practical problem-solving, not just CRUD.
            </p>
          </div>

          {/* Features bento */}
          <div className="md:col-span-4 border border-slate-200 bg-white/80 px-5 py-5">
            <p className="text-xs font-semibold text-slate-700">
              Fitur yang fokus ke kebutuhan warung
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  <span className="font-medium">Dashboard harian</span> — omzet
                  dan jumlah transaksi per hari dalam sekali pandang.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  <span className="font-medium">Alert stok rendah</span> —
                  daftar produk yang perlu di-restock sebelum kehabisan.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  <span className="font-medium">Role-based access</span> — admin
                  dan kasir punya akses yang berbeda &amp; lebih aman.
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

          <div className="md:col-span-4 grid gap-4 md:grid-cols-3">
            {/* Owner card */}
            <div className="border border-slate-200 bg-white/80 px-4 py-4">
              <p className="text-xs font-semibold text-slate-700">
                Untuk pemilik warung
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Lihat performa harian tanpa harus menghitung manual. Cocok untuk
                pemilik warung yang ingin tahu omzet dan stok kritis dengan cepat.
              </p>
            </div>

            {/* Cashier card */}
            <div className="border border-slate-200 bg-white/80 px-4 py-4">
              <p className="text-xs font-semibold text-slate-700">
                Untuk kasir
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Tampilan sederhana untuk input transaksi. Kasir cukup pilih produk,
                isi jumlah, dan simpan — stok akan ikut ter-update di belakang.
              </p>
            </div>

            {/* Recruiter mini card */}
            <div className="border border-slate-200 bg-white/80 px-4 py-4">
              <p className="text-xs font-semibold text-slate-700">
                For recruiters &amp; hiring managers
              </p>
              <p className="mt-2 text-xs text-slate-500">
                End-to-end skills: full-stack Next.js, PostgreSQL with Prisma,
                JWT auth with refresh tokens, role-based access, and a
                business-oriented dashboard instead of a simple CRUD demo.
              </p>
            </div>
          </div>

          {/* Recruiter-focused wide card */}
          <div className="border border-slate-200 bg-white/80 px-5 py-5 md:col-span-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                View Case Study
              </Link>
              <p className="text-[11px] text-slate-400 max-w-xs">
                The case study explains the problem, reasoning, architecture, and
                key technical decisions behind this project.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-slate-700 text-xs">
              Tech stack
            </span>
            <span>
              Next.js • TypeScript • PostgreSQL • Prisma • Tailwind CSS • Vercel
            </span>
            <span className="w-full md:w-auto text-slate-400">
              Auth: JWT + Refresh Token • Role-based access: Admin &amp; Kasir
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
