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

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

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

        // Kalau access token expired → coba refresh
        if (res.status === 401) {
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
          });

          if (!refreshRes.ok) {
            setUser(null);
            return;
          }

          // coba lagi
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

  return (
    <header className="bg-white border-b px-4 py-3 flex justify-between items-center">
      <span className="text-sm font-medium text-slate-800">
        WarungFlow
      </span>
      <div className="flex items-center gap-3">
        {!loading && user && (
          <span className="text-xs md:text-sm text-slate-600">
            Halo,{" "}
            <span className="font-medium">{user.name}</span>{" "}
            <span className="text-[10px] md:text-xs uppercase text-slate-400 ml-1">
              ({user.role})
            </span>
          </span>
        )}

        {!loading && !user && (
          <Link
            href="/login"
            className="text-xs md:text-sm text-slate-700 hover:underline"
          >
            Login
          </Link>
        )}

        {!loading && user && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-xs md:text-sm text-slate-700 hover:underline disabled:opacity-60"
          >
            {loggingOut ? "Keluar..." : "Logout"}
          </button>
        )}
      </div>
    </header>
  );
}
