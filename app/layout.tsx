import "./globals.css";
import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";

export const metadata: Metadata = {
  title: "WarungFlow",
  description: "Simple POS & inventory system for small shops",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto px-4 py-6 md:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}