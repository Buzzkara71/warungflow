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
    <aside className="flex h-screen flex-col border-r bg-slate-950 text-slate-100 w-56">
      <div className="px-4 py-4 text-lg font-semibold border-b border-slate-800">
        WarungFlow
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1 text-sm">
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
      </nav>
      {user && (
        <div className="border-t border-slate-800 px-4 py-3 text-[11px] text-slate-400">
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
