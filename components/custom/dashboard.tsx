"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const nav_items = [
  { name: "Dashboard", href: "/" },
  { name: "Buku", href: "/buku" },
  { name: "Anggota", href: "/anggota" },
  { name: "Peminjaman", href: "/peminjaman" },
  { name: "Pengembalian", href: "/pengembalian" },
];

const booksData = [
  { id: 1, title: "A Smart Bunny", stock: 12, image: "/img/foto1.jpg" },
  { id: 2, title: "The Clever Bee", stock: 8, image: "/img/foto2.jpg" },
  { id: 3, title: "As Green as a Leaf", stock: 0, image: "/img/foto3.jpg" },
  { id: 4, title: "Delicious Mushroom", stock: 10, image: "/img/foto4.jpg" },
  { id: 5, title: "Calm Clouds", stock: 7, image: "/img/foto5.jpg" },
  { id: 6, title: "Useful Tree", stock: 4, image: "/img/foto6.jpg" },
];

const borrowData = [
  { name: "Sunghoon", book: "A Smart Bunny" },
  { name: "Minggyu", book: "The Clever Bee" },
  { name: "DK", book: "Delicious Mushroom" },
];

const returnData = [
  { name: "Kimberly", book: "Delicious Mushroom" },
  { name: "Sheyln", book: "Calm Clouds" },
  { name: "Joshua", book: "Useful Tree" },
];

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [fade, setFade] = useState(false);

  const filteredBooks = booksData.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setFade(false);
    const t = setTimeout(() => setFade(true), 120);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="flex min-h-screen bg-[#f6f5fb] text-[#2b2540]">

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#2b2540] text-white
        border-r border-purple-800/40 p-6 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-2xl md:hidden"
        >
          ✕
        </button>

        <h1 className="mb-10 text-3xl font-extrabold tracking-wide text-purple-300">
          LIBRAVA
        </h1>

        <nav className="flex flex-col gap-2">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-700/40 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-30"
        />
      )}

      <main className="ml-0 md:ml-64 w-full p-4 sm:p-6">

        <div className="mb-5 flex items-center justify-between md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-purple-700 px-4 py-2 text-white font-semibold"
          >
            ☰
          </button>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-[#2b2540]">Dashboard</h2>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari buku..."
            className="w-full sm:w-80 rounded-full border border-purple-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <section className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Buku", value: 125 },
              { label: "Buku Tersedia", value: 85 },
              { label: "Dipinjam Hari Ini", value: 52 },
              { label: "Pengembalian Hari Ini", value: 35 },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-4 shadow-sm border border-purple-200 text-center"
              >
                <p className="text-3xl font-extrabold text-purple-700">
                  {s.value}
                </p>
                <p className="text-sm text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-4 border border-purple-200">
              <h3 className="mb-3 text-lg font-bold text-purple-700">
                Data Peminjaman
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  {borrowData.map((b, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 font-medium">{b.name}</td>
                      <td className="py-2 text-gray-600">{b.book}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-purple-200">
              <h3 className="mb-3 text-lg font-bold text-purple-700">
                Data Pengembalian
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  {returnData.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 font-medium">{r.name}</td>
                      <td className="py-2 text-gray-600">{r.book}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xl font-bold text-[#2b2540]">
              Koleksi Buku
            </h3>

            <div
              className={`grid grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
            >
              {filteredBooks.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-white border border-purple-200 p-4 shadow-sm"
                >
                  <img
                    src={b.image}
                    className="h-40 w-full rounded-xl object-cover mb-3"
                  />

                  <h4 className="font-bold text-purple-700">{b.title}</h4>

                  <p className="text-sm text-gray-600">Stok: {b.stock}</p>
                  <p
                    className={`text-sm font-semibold ${
                      b.stock > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {b.stock > 0 ? "Tersedia" : "Habis"}
                  </p>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <p className="mt-6 text-center text-gray-500">
                Buku tidak ditemukan
              </p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
