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
    borrowDate: "2025-01-12",
    returnDate: "2025-01-19",
  },
];

export default function PeminjamanPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const filtered = borrowList.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111] text-white">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-[#D4AF37]/40 bg-[#111] p-5">
        <h2 className="mb-10 text-3xl font-bold text-[#D4AF37]">LIBRAVA</h2>
        <nav className="flex flex-col gap-3">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 hover:bg-[#D4AF37]/20"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 w-full p-8">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-3xl font-bold text-[#D4AF37]">Peminjaman</h3>

          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul buku..."
              className="rounded-full border border-[#D4AF37]/40 bg-black px-4 py-2 text-sm"
            />
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-full bg-[#D4AF37] px-6 py-2 font-semibold text-black"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#D4AF37]/30 bg-[#1c1c1c] p-6"
            >
              <h3 className="mb-2 text-xl font-bold text-[#D4AF37]">
                {item.title}
              </h3>

              <p className="text-sm">Peminjam: {item.borrower}</p>
              <p className="text-sm">Tanggal Pinjam: {item.borrowDate}</p>
              <p className="text-sm">Tanggal Kembali: {item.returnDate}</p>

              <button
                onClick={() => {
                  setSelected(item);
                  setShowConfirm(true);
                }}
                className="mt-4 w-full rounded-lg bg-green-600 py-2 text-sm font-semibold"
              >
                Pengembalian
              </button>
            </div>
          ))}
        </div>
      </main>

      {(showAdd || showConfirm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-2xl bg-[#222] p-6">
            {showAdd && (
              <>
                <h2 className="mb-4 text-2xl font-bold text-[#D4AF37]">
                  Tambah Peminjaman
                </h2>

                <div className="space-y-3">
                  <input
                    placeholder="Judul Buku"
                    className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3"
                  />
                  <input
                    placeholder="Nama Peminjam"
                    className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3"
                  />
                  <input
                    type="date"
                    className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3"
                  />
                  <input
                    type="date"
                    className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3"
                  />
                </div>
              </>
            )}

            {showConfirm && selected && (
              <>
                <h2 className="mb-4 text-2xl font-bold text-[#D4AF37]">
                  Konfirmasi Pengembalian
                </h2>
                <p className="mb-6 text-center">
                  Yakin ini mengembalikkan <br />
                  <span className="font-semibold text-[#D4AF37]">
                    {selected.title}
                  </span>
                  ?
                </p>
              </>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAdd(false);
                  setShowConfirm(false);
                }}
                className="rounded-lg bg-gray-500 px-4 py-2"
              >
                Tidak
              </button>
              <button
                className={`rounded-lg px-4 py-2 ${
                  showConfirm
                    ? "bg-green-600"
                    : "bg-[#D4AF37] text-black"
                }`}
              >
                {showConfirm ? "Kembalikan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
