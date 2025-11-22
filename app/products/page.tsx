"use client";

import { useEffect, useState, FormEvent } from "react";
import { useCurrentUser } from "@/lib/useCurrentUser";

type Product = {
  id: number;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");

  const [search, setSearch] = useState("");

  const { user, loading: loadingUser } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Gagal mengambil data produk");
      }
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleAddProduct(e: FormEvent) {
    e.preventDefault();

    if (!isAdmin) {
      alert("Hanya admin yang dapat menambah produk.");
      return;
    }

    if (!name || !price || !stock) {
      alert("Nama, harga, dan stok wajib diisi.");
      return;
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);
    const lowStockNumber = lowStockThreshold ? Number(lowStockThreshold) : 0;

    if (isNaN(priceNumber) || isNaN(stockNumber) || isNaN(lowStockNumber)) {
      alert("Harga, stok, dan batas stok rendah harus berupa angka.");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category: category || null,
          price: priceNumber,
          stock: stockNumber,
          lowStockThreshold: lowStockNumber,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal menambah produk");
      }

      // Clear form
      setName("");
      setCategory("");
      setPrice("");
      setStock("");
      setLowStockThreshold("");

      await fetchProducts();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat menambah produk");
    }
  }

  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q)
    );
  });

  const totalLowStock = products.filter(
    (p) => p.lowStockThreshold > 0 && p.stock <= p.lowStockThreshold
  ).length;

  return (
    <main className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Produk
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola daftar produk, harga, dan stok warung Anda.
          </p>
          {!loadingUser && user && !isAdmin && (
            <p className="mt-1 text-xs text-amber-600">
              Anda login sebagai kasir. Halaman ini hanya dapat digunakan untuk{" "}
              <span className="font-semibold">melihat</span> produk dan stok.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <p className="text-xs text-slate-600">
            {products.length} produk, {totalLowStock} stok rendah
          </p>
        </div>
      </section>

      {/* Form + search / Kasir view-only */}
      {isAdmin ? (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          {/* Form admin */}
          <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">
              Tambah Produk
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Masukkan produk baru yang akan dijual di warung.
            </p>
            <form
              onSubmit={handleAddProduct}
              className="mt-4 grid gap-3 md:grid-cols-2"
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  Nama Produk<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Indomie Goreng"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  Kategori
                </label>
                <input
                  type="text"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Makanan, Minuman, Lainnya"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  Harga (Rp)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3500"
                  min={0}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  Stok<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  min={0}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  Batas Stok Rendah (opsional)
                </label>
                <input
                  type="number"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="3"
                  min={0}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>

          {/* Search & info */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-800">
                Cari Produk
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Filter berdasarkan nama atau kategori.
              </p>
              <input
                type="text"
                className="mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Contoh: indomie, minuman, snack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)]">
          <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">
              Mode kasir (view only)
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Anda tidak dapat menambah atau mengedit produk dari akun kasir.
              Gunakan akun admin untuk mengelola katalog produk dan stok.
            </p>
          </div>
          <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-800">
              Cari Produk
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Filter berdasarkan nama atau kategori.
            </p>
            <input
              type="text"
              className="mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Contoh: indomie, minuman, snack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>
      )}

      {/* Tabel Produk */}
      <section className="rounded-2xl border bg-white px-4 py-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Daftar Produk
          </h2>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">
            Memuat data produk...
          </p>
        ) : error ? (
          <p className="text-sm text-red-600">
            Terjadi kesalahan: {error}
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-sm text-slate-500">
            Tidak ada produk yang cocok dengan pencarian.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border px-3 py-2 text-left font-medium text-slate-600">
                    Nama
                  </th>
                  <th className="border px-3 py-2 text-left font-medium text-slate-600">
                    Kategori
                  </th>
                  <th className="border px-3 py-2 text-right font-medium text-slate-600">
                    Harga
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
                {filteredProducts.map((p) => {
                  const isLowStock =
                    p.lowStockThreshold > 0 &&
                    p.stock <= p.lowStockThreshold;

                  return (
                    <tr key={p.id}>
                      <td className="border px-3 py-2">
                        <div className="flex flex-col">
                          <span>{p.name}</span>
                          <span className="text-[11px] text-slate-400">
                            ID: {p.id}
                          </span>
                        </div>
                      </td>
                      <td className="border px-3 py-2">
                        {p.category || (
                          <span className="text-[11px] text-slate-400">
                            -
                          </span>
                        )}
                      </td>
                      <td className="border px-3 py-2 text-right">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="border px-3 py-2 text-right">
                        {p.stock}
                      </td>
                      <td className="border px-3 py-2 text-right">
                        {p.lowStockThreshold}
                      </td>
                      <td className="border px-3 py-2">
                        {isLowStock ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                            Stok rendah
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
