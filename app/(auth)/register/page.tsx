"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "cashier">("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("Nama, email, dan password wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registrasi gagal");
      }

      setSuccess("Registrasi berhasil. Mengarahkan ke login...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-center">Register</h1>
          <p className="text-xs text-slate-500 text-center">
            Buat akun admin atau kasir untuk WarungFlow.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium">Nama</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin Warung"
            />
          </div>

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
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Role</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "admin" | "cashier")
              }
            >
              <option value="admin">Admin</option>
              <option value="cashier">Kasir</option>
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          {success && (
            <p className="text-xs text-emerald-600">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-slate-900 text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-slate-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
