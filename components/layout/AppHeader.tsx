"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Produk" },
  { href: "/sales", label: "Transaksi" },
];

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    } finally {
      setMobileOpen(false);
      router.push("/login");
      router.refresh();
    }
  }

  function handleNav(href: string) {
    setMobileOpen(false);
    router.push(href);
  }
  return (
    <>

  <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
    <div className="flex w-full items-center justify-between px-4 py-3 md:px-6">

    {/* Logo */}
    <div className="flex gap-2">
      <Link
        href="/"
        className="text-sm font-semibold tracking-tight text-slate-900 hover:text-slate-700"
      >
        WarungFlow
      </Link>
      <span className="hidden md:inline rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
        Portfolio Project
      </span>
    </div>

    {/* Nav + Login */}
    <div className="hidden items-center gap-4 md:flex">
      <nav className="flex items-center gap-3">
  {navItems.map((item) => {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`group relative px-3 py-1.5 text-xs md:text-sm font-medium transition-colors ${
          active
            ? "text-slate-900"
            : "text-slate-700 hover:text-slate-900"
        }`}
      >
        <span>{item.label}</span>
        <span
          className={`pointer-events-none absolute inset-x-1 -bottom-[2px] h-[2px] origin-center rounded-full bg-slate-900 transition-transform duration-200 ${
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </Link>
    );
  })}
</nav>


      
      {isLoggedIn ? (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-700 font-medium">
      {user?.name} 
      <span className="uppercase text-[10px] ml-1 text-emerald-600">
        ({user?.role})
      </span>
    </span>

    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
    >
      Logout
    </button>
  </div>
) : (
  <Link
    href="/login"
    className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
  >
    Login
  </Link>
)}
    </div>

    {/* Mobile hamburger */}
    <button
      onClick={() => setMobileOpen(true)}
      className="md:hidden rounded-md border border-slate-300 p-1.5 text-slate-700 hover:bg-slate-100"
    >
      <Bars3Icon className="h-5 w-5" />
    </button>
  </div>
</header>

      {/* Mobile slide-over menu */}
      <Transition show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setMobileOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/30" />
          </TransitionChild>

          <div className="fixed inset-0 flex justify-end">
            <TransitionChild
              as={Fragment}
              enter="transition ease-out duration-200 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-150 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <DialogPanel className="flex h-full w-64 flex-col border-l bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="flex flex-col">
                    <DialogTitle className="text-sm font-semibold text-slate-900">
                      Navigation
                    </DialogTitle>
                    {user && (
                      <p className="text-[11px] text-slate-500">
                        {user.name}{" "}
                        <span className="uppercase text-[10px] text-emerald-600">
                          ({user.role})
                        </span>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Nav list */}
                  <nav className="flex-1 px-3 py-4 text-sm space-y-1">
                    {navItems.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <button
                          key={item.href}
                          onClick={() => handleNav(item.href)}
                          className="group relative flex w-full items-center justify-between px-3 py-2 text-left"
                        >
                          <span
                            className={`text-sm font-medium ${
                              active ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                            }`}
                          >
                            {item.label}
                          </span>

                          <span
                            className={`
                              pointer-events-none
                              absolute inset-x-3 -bottom-[1px] h-[2px]
                              origin-center rounded-full bg-slate-900
                              transition-transform duration-200
                              ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                            `}
                          />
                        </button>
                      );
                    })}
                  </nav>

                {/* Bottom actions */}
                <div className="border-t px-4 py-3 space-y-2">
                  {isLoggedIn && user ? (
                    <>
                      <p className="text-[11px] text-slate-500">
                        Logged in as{" "}
                        <span className="font-medium text-slate-800">
                          {user.name}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNav("/login")}
                      className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      Login
                    </button>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
