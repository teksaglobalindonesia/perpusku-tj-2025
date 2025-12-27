"use client";

import { useState } from "react";
import Link from "next/link";

const nav_items = [
  { name: "Dashboard", href: "/" },
  { name: "Buku", href: "/buku" },
  { name: "Anggota", href: "/anggota" },
  { name: "Peminjaman", href: "/peminjaman" },
  { name: "Pengembalian", href: "/pengembalian" },
];

const borrowList = [
  {
    id: 1,
    title: "A Smart Bunny",
    borrower: "Shela Putri",
    borrowDate: "2025-01-10",
    returnDate: "2025-01-17",
  },
  {
    id: 2,
    title: "The Clever Bee",
    borrower: "Dimas Pratama",
    borrowDate: "2025-01-05",
    returnDate: "2025-01-12",
  },
];

function getLateDays(returnDate: string) {
  const today = new Date();
  const due = new Date(returnDate);
  const diff = Math.floor(
    (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
}

export default function PengembalianPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filtered = borrowList.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#2b2540] text-white border-r border-purple-800/40 p-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
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
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                item.name === "Pengembalian"
                  ? "bg-purple-700/40"
                  : "hover:bg-purple-700/40"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <main className="ml-0 md:ml-64 w-full p-4 sm:p-6">
        <div className="mb-5 flex justify-between md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-purple-700 px-4 py-2 text-white font-semibold"
          >
            ☰
          </button>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Pengembalian</h2>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul buku..."
            className="w-full sm:w-72 rounded-full border border-purple-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const lateDays = getLateDays(item.returnDate);

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-purple-200 p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-purple-700">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600">
                  Peminjam: {item.borrower}
                </p>
                <p className="text-sm text-gray-600">
                  Pinjam: {item.borrowDate}
                </p>
                <p className="text-sm text-gray-600">
                  Jatuh Tempo: {item.returnDate}
                </p>

                {lateDays > 0 ? (
                  <span className="mt-3 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    Terlambat {lateDays} hari
                  </span>
                ) : (
                  <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                    Tepat Waktu
                  </span>
                )}

                <button
                  onClick={() => setSelected(item)}
                  className="mt-4 w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Konfirmasi Pengembalian
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-purple-300">
            <h2 className="mb-4 text-xl font-bold text-purple-700">
              Konfirmasi Pengembalian
            </h2>

            <p className="mb-2 text-sm">
              Buku
              <span className="block font-semibold text-purple-700">
                {selected.title}
              </span>
            </p>

            <p className="mb-4 text-sm text-gray-600">
              Peminjam: {selected.borrower}
            </p>

            {getLateDays(selected.returnDate) > 0 && (
              <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                Terlambat{" "}
                <span className="font-semibold">
                  {getLateDays(selected.returnDate)} hari
                </span>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg border border-purple-300 px-4 py-2"
              >
                Batal
              </button>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg bg-purple-600 px-4 py-2 text-white"
              >
                Kembalikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
