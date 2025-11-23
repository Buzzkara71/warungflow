"use client";

import { useEffect, useState } from "react";

type LowStockProduct = {
  id: number;
  name: string;
  stock: number;
  lowStockThreshold: number;
};

type DashboardData = {
  date: string;
  total_sales_amount: number;
  total_transactions: number;
  low_stock_products: LowStockProduct[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().slice(0, 10);
    return today;
  });

  async function fetchDashboard(date?: string) {
    try {
      setLoading(true);
      setError(null);
      const query = date ? `?date=${date}` : "";
      const res = await fetch(`/api/dashboard/today${query}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Gagal mengambil data dashboard");
      }
      const json: DashboardData = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Bukan admin");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard(selectedDate);
  }, [selectedDate]);

  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatDate(value: string) {
    const date = new Date(value);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const totalSales = data?.total_sales_amount ?? 0;
  const totalTransactions = data?.total_transactions ?? 0;
  const lowStockProducts = data?.low_stock_products ?? [];

  return (
    <main className="space-y-6">
      {/* Header + filter tanggal */}
      <section className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dashboard Penjualan
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-200/80">
              Lihat performa penjualan dan pantau stok produk yang mulai
              menipis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs md:text-sm text-slate-200/80">
              Tanggal:
            </label>
            <input
              type="date"
              className="rounded-lg border border-slate-500 bg-slate-900/60 px-3 py-1.5 text-xs md:text-sm text-white outline-none focus:ring-2 focus:ring-slate-300/60"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        {data && (
          <p className="mt-3 text-[11px] md:text-xs text-slate-300/80">
            Data untuk{" "}
            <span className="font-medium">
              {formatDate(data.date)}
            </span>
          </p>
        )}
      </section>

      {loading ? (
        <p className="text-sm text-slate-500">Memuat data dashboard...</p>
      ) : error ? (
        <p className="text-sm text-red-600">
          Terjadi kesalahan: {error}
        </p>
      ) : (
        <>
          {/* Cards ringkasan */}
          <section className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="rounded-xl border bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Total Penjualan
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {formatRupiah(totalSales)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Omzet kotor pada tanggal yang dipilih.
              </p>
            </div>

            <div className="rounded-xl border bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Jumlah Transaksi
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {totalTransactions}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Total transaksi yang tercatat di sistem.
              </p>
            </div>

            <div className="rounded-xl border bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Produk Stok Rendah
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {lowStockProducts.length}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Produk yang stoknya berada di bawah batas aman.
              </p>
            </div>
          </section>

          {/* List produk stok rendah */}
          <section className="rounded-2xl border bg-white px-4 py-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Produk dengan Stok Rendah
              </h2>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-slate-500">
                Tidak ada produk dengan stok rendah. Semua stok dalam
                kondisi aman 👍
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border px-3 py-2 text-left font-medium text-slate-600">
                        Nama
                      </th>
                      <th className="border px-3 py-2 text-right font-medium text-slate-600">
                        Stok
                      </th>
                      <th className="border px-3 py-2 text-right font-medium text-slate-600">
                        Batas Stok Rendah
                      </th>
                      <th className="border px-3 py-2 text-left font-medium text-slate-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((p) => (
                      <tr key={p.id}>
                        <td className="border px-3 py-2">
                          {p.name}
                        </td>
                        <td className="border px-3 py-2 text-right">
                          {p.stock}
                        </td>
                        <td className="border px-3 py-2 text-right">
                          {p.lowStockThreshold}
                        </td>
                        <td className="border px-3 py-2">
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                            Perlu restock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
