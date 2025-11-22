"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const navItems = [
    ...(isAdmin ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    { href: "/products", label: "Produk" },
    { href: "/sales", label: "Transaksi" },
  ];

  return (
    <aside
      className="
        bg-slate-950 text-slate-100
        border-b border-slate-800
        md:border-b-0 md:border-r
        w-full md:w-56
        flex md:flex-col
        items-center md:items-stretch
        px-3 md:px-0
        py-2 md:py-4
        sticky top-0 z-20
      "
    >
      {/* Brand / logo */}
      <div className="flex items-center justify-between w-full md:block md:px-4 md:mb-4">
        <div className="text-sm md:text-lg font-semibold tracking-tight">
          WarungFlow
        </div>
      </div>

      {/* Nav items*/}
      <nav className="flex-1 w-full">
        <div className="flex md:hidden gap-2 w-full justify-center">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  active
                    ? "bg-slate-800 text-white"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex md:flex-col md:space-y-1 md:px-2 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User info */}
      {user && (
        <div className="hidden md:block border-t border-slate-800 px-4 py-3 text-[11px] text-slate-400">
          Logged in as{" "}
          <span className="font-medium text-slate-100">{user.name}</span>{" "}
          <span className="uppercase text-[10px] text-emerald-400">
            ({user.role})
          </span>
        </div>
      )}
    </aside>
  );
}
