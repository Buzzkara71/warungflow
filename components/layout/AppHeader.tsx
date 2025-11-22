"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MeResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (isAuthPage) {
      setUser(null);
      setLoading(false);
      return;
    }

    async function fetchUserWithRefresh() {
      try {
        setLoading(true);
        let res = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        if (res.status === 401) {
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
          });

          if (!refreshRes.ok) {
            setUser(null);
            return;
          }
          res = await fetch("/api/auth/me", {
            cache: "no-store",
          });
        }

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data: MeResponse = await res.json();
        setUser(data);
      } catch (e) {
        console.error(e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserWithRefresh();
  }, [pathname, isAuthPage]);

  if (isAuthPage) return null;

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  }

  const navItems = [
    { href: "/products", label: "Produk" },
    { href: "/sales", label: "Transaksi" },
  ];

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:px-8">
      <div className="text-sm font-semibold text-slate-900">
        WarungFlow
      </div>

      {/* Middle Nav  */}
      <nav className="flex items-center gap-2 text-xs md:text-sm">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info + login/logout */}
      <div className="flex items-center gap-2 text-xs md:text-sm">
        {!loading && user && (
          <span className="hidden text-slate-600 sm:inline">
            Halo,{" "}
            <span className="font-medium text-slate-800">
              {user.name}
            </span>{" "}
            <span className="ml-1 text-[10px] uppercase text-emerald-600">
              ({user.role})
            </span>
          </span>
        )}

        {!loading && !user && (
          <Link
            href="/login"
            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Login
          </Link>
        )}
        {!loading && user && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {loggingOut ? "Keluar..." : "Logout"}
          </button>
        )}
      </div>
    </header>
  );
}
