import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import {AppHeader} from "@/components/layout/AppHeader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1">
          <AppHeader />
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
