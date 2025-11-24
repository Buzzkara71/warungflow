import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/layout/AppHeader";

{/* SEO and Metadata purpose */}
export const metadata: Metadata = {
  metadataBase: new URL("https://warungflow-nh8g.vercel.app"),
  title: "WarungFlow — POS & Inventory App",
  description:
    "WarungFlow membantu pemilik warung mencatat transaksi, memantau stok, dan melihat performa penjualan harian hanya dalam satu tampilan sederhana.",
  keywords: [
    "POS App",
    "Inventory System",
    "Next.js Project",
    "Portfolio Project",
    "Kasir App",
    "WarungFlow",
  ],
  authors: [{ name: "Buzzkara", url: "https://github.com/Buzzkara71" }],
  creator: "Baskara",
  publisher: "Baskara",
  openGraph: {
    title: "WarungFlow — POS & Inventory App",
    description:
      "A full-stack real-world portfolio project demonstrating authentication, inventory logic, role-based access, and business dashboard.",
    url: "https://warungflow-nh8g.vercel.app",
    siteName: "WarungFlow",
    images: [
      {
        url: "/publlic/og-warungflow.png",
        width: 1200,
        height: 630,
        alt: "WarungFlow App Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WarungFlow — POS & Inventory App",
    description:
      "A full-stack business app built with Next.js, PostgreSQL, Prisma, JWT Auth & role-based access.",
    images: ["/public/og-warungflow.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
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

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "WarungFlow",
      description:
        "A POS and Inventory system built with Next.js as a portfolio case-study demonstrating real business features.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      creator: {
        "@type": "Person",
        name: "Buzzkara",
        sameAs: "https://github.com/Buzzkara71",
      },
    }),
  }}
/>