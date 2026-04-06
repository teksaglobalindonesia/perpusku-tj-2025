"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!form.identifier || !form.password) {
    setError("Email/Username & Password wajib diisi");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      "https://cms-perpusku.widhimp.my.id/api/auth/local",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error?.message || "Gagal login bro");
      setLoading(false);
      return;
    }

    // Set cookie biar middleware bisa baca server-side
    document.cookie = `token=${data.jwt}; path=/; max-age=${60*60*24}`; // 1 hari
    document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=${60*60*24}`;

    router.push("/"); // langsung ke dashboard
  } catch (err) {
    console.error(err);
    setError("Server error bro");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Email / Username
            </label>
            <input
              type="text"
              placeholder="Email atau Username"
              value={form.identifier}
              onChange={(e) => {
                setForm({ ...form, identifier: e.target.value });
                if (error) setError(null);
              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 transition text-sm sm:text-base"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;