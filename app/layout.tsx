import "./globals.css";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";

export const metadata = {
  title: "WarungFlow",
  description: "Sistem kasir & stok sederhana untuk UMKM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100">
        <div className="flex min-h-screen">
          {/* Sidebar (disederhanakan) */}
          <aside className="hidden md:flex md:flex-col w-52 bg-slate-900 text-white p-4">
            <h1 className="text-lg font-semibold mb-4">WarungFlow</h1>
            <nav className="space-y-2 text-sm">
              <Link href="/dashboard" className="block hover:text-slate-300">
                Dashboard
              </Link>
              <Link href="/products" className="block hover:text-slate-300">
                Produk
              </Link>
              <Link href="/sales" className="block hover:text-slate-300">
                Transaksi
              </Link>
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 flex flex-col">
            <AppHeader />
            <div className="p-4 max-w-5xl mx-auto w-full">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
