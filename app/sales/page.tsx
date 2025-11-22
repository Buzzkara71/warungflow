"use client";

import { useEffect, useState, FormEvent } from "react";

type Product = {
  id: number;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
};

type SaleItem = {
  id: number;
  quantity: number;
  price: number;
  product: Product;
};

type Sale = {
  id: number;
  totalPrice: number;
  createdAt: string;
  items: SaleItem[];
};

type CartItem = {
  productId: number;
  quantity: number;
};

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [errorSales, setErrorSales] = useState<string | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [creating, setCreating] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().slice(0, 10);
    return today;
  });

  async function fetchProducts() {
    try {
      setLoadingProducts(true);
      setErrorProducts(null);
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Gagal mengambil data produk");
      }
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setErrorProducts(
        err.message || "Terjadi kesalahan saat mengambil produk"
      );
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchSales(date?: string) {
    try {
      setLoadingSales(true);
      setErrorSales(null);
      const query = date ? `?date=${date}` : "";
      const res = await fetch(`/api/sales${query}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Gagal mengambil data transaksi");
      }
      const data: Sale[] = await res.json();
      setSales(data);
    } catch (err: any) {
      console.error(err);
      setErrorSales(
        err.message || "Terjadi kesalahan saat mengambil transaksi"
      );
    } finally {
      setLoadingSales(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchSales(selectedDate);
  }, [selectedDate]);

  function handleAddToCart(e: FormEvent) {
    e.preventDefault();

    if (!selectedProductId || !quantity) {
      alert("Pilih produk dan isi quantity.");
      return;
    }

    const productId = Number(selectedProductId);
    const qty = Number(quantity);

    if (isNaN(productId) || isNaN(qty) || qty <= 0) {
      alert("Quantity harus angka > 0.");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      alert("Produk tidak ditemukan.");
      return;
    }

    const existing = cart.find((item) => item.productId === productId);
    const currentQty = existing ? existing.quantity : 0;
    if (qty + currentQty > product.stock) {
      alert(
        `Stok tidak cukup untuk produk "${product.name}". Stok: ${product.stock}, diminta total: ${
          qty + currentQty
        }`
      );
      return;
    }

    setCart((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { productId, quantity: qty }];
    });

    setQuantity("");
  }

  function handleRemoveFromCart(productId: number) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  function calculateCartTotal() {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return total;
      return total + product.price * item.quantity;
    }, 0);
  }

  async function handleCreateSale() {
    if (cart.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal menyimpan transaksi");
      }

      setCart([]);
      setSelectedProductId("");
      setQuantity("");

      await Promise.all([fetchSales(selectedDate), fetchProducts()]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat menyimpan transaksi");
    } finally {
      setCreating(false);
    }
  }

  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatDateTime(value: string) {
    const date = new Date(value);
    return date.toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <main className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Transaksi Penjualan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Buat transaksi baru dan pantau penjualan harian.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs md:text-sm text-slate-500">
            Tanggal transaksi:
          </label>
          <input
            type="date"
            className="rounded-lg border bg-white px-3 py-1.5 text-xs md:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-200"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </section>

      {/* Grid 2 kolom: transaksi baru & daftar transaksi */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Kolom kiri: transaksi baru */}
        <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Transaksi Baru
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Tambahkan produk ke keranjang lalu simpan sebagai
                transaksi.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
              {cart.length} item di keranjang
            </div>
          </div>

          {loadingProducts ? (
            <p className="text-sm text-slate-500">
              Memuat data produk...
            </p>
          ) : errorProducts ? (
            <p className="text-sm text-red-600">
              {errorProducts}
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada produk. Tambahkan produk terlebih dahulu di
              menu <span className="font-medium">Produk</span>.
            </p>
          ) : (
            <>
              <form
                onSubmit={handleAddToCart}
                className="flex flex-col gap-3 md:flex-row md:items-end"
              >
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Produk
                  </label>
                  <select
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    <option value="">Pilih produk</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}{" "}
                        {p.stock <= (p.lowStockThreshold || 0)
                          ? "(Stok rendah)"
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-28 space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Qty
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Tambah
                  </button>
                </div>
              </form>

              {/* Keranjang */}
              <div className="rounded-xl border bg-slate-50 px-3 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-800">
                    Keranjang
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Total:{" "}
                    <span className="font-semibold">
                      {formatRupiah(calculateCartTotal())}
                    </span>
                  </p>
                </div>
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Keranjang masih kosong. Tambahkan produk di atas.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[11px] md:text-xs">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border px-2 py-1 text-left font-medium text-slate-600">
                            Produk
                          </th>
                          <th className="border px-2 py-1 text-right font-medium text-slate-600">
                            Harga
                          </th>
                          <th className="border px-2 py-1 text-right font-medium text-slate-600">
                            Qty
                          </th>
                          <th className="border px-2 py-1 text-right font-medium text-slate-600">
                            Subtotal
                          </th>
                          <th className="border px-2 py-1 text-center font-medium text-slate-600">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.productId
                          );
                          if (!product) return null;
                          const subtotal =
                            product.price * item.quantity;
                          return (
                            <tr key={item.productId}>
                              <td className="border px-2 py-1">
                                {product.name}
                              </td>
                              <td className="border px-2 py-1 text-right">
                                {formatRupiah(product.price)}
                              </td>
                              <td className="border px-2 py-1 text-right">
                                {item.quantity}
                              </td>
                              <td className="border px-2 py-1 text-right">
                                {formatRupiah(subtotal)}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveFromCart(item.productId)
                                  }
                                  className="text-[11px] text-red-600 hover:underline"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCreateSale}
                    disabled={creating || cart.length === 0}
                    className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-emerald-500"
                  >
                    {creating ? "Menyimpan..." : "Simpan Transaksi"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Kolom kanan: daftar transaksi */}
        <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Transaksi pada Tanggal Ini
            </h2>
          </div>

          {loadingSales ? (
            <p className="text-sm text-slate-500">
              Memuat data transaksi...
            </p>
          ) : errorSales ? (
            <p className="text-sm text-red-600">
              {errorSales}
            </p>
          ) : sales.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada transaksi pada tanggal ini.
            </p>
          ) : (
            <div className="space-y-2">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">
                        Transaksi #{sale.id}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {sale.items.length} item •{" "}
                        {formatDateTime(sale.createdAt)}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {formatRupiah(sale.totalPrice)}
                    </p>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-600">
                    {sale.items
                      .map(
                        (i) =>
                          `${i.product.name} x${i.quantity}`
                      )
                      .join(", ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
