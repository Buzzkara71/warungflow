"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login gagal");
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-center">Login</h1>
          <p className="text-xs text-slate-500 text-center">
            Masuk untuk mengelola kasir & stok.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-slate-900 text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-slate-700 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
