import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import {AppHeader} from "@/components/layout/AppHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col md:flex-row">
          {/* Sidebar */}
          <Sidebar />

        {/* Main content */}
        <div className="flex flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 overflow-auto px-4 py-4 md:px-6 md:py-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
