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

const books = [
  { id: 1, title: "A Smart Bunny", genre: "Fabel", author: "Anonim", stock: 2 },
  { id: 2, title: "The Clever Bee", genre: "Fabel", author: "Anonim", stock: 1 },
  { id: 3, title: "Little Red Fox", genre: "Fabel", author: "Anonim", stock: 3 },
];

const members = [
  { id: 1, name: "Shela Putri", nis: "11111", email: "shela@gmail.com" },
  { id: 2, name: "Dimas Pratama", nis: "22222", email: "dimas@gmail.com" },
  { id: 3, name: "Rina Aulia", nis: "33333", email: "rina@gmail.com" },
];

const borrowList = [
  {
    id: 1,
    title: "A Smart Bunny",
    borrower: "Shela Putri",
    borrowDate: "2025-01-10",
    returnDate: "2025-01-17",
  },
];

export default function PeminjamanPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedBorrow, setSelectedBorrow] = useState<any>(null);

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

        <h1 className="mb-10 text-3xl font-extrabold text-purple-300">
          LIBRAVA
        </h1>

        <nav className="flex flex-col gap-2">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                item.name === "Peminjaman"
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
        <div className="mb-5 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-purple-700 px-4 py-2 text-white font-semibold"
          >
            ☰
          </button>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Peminjaman</h2>

          <div className="flex gap-3 w-full sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul buku..."
              className="w-full sm:w-72 rounded-full border border-purple-300 bg-white px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-full bg-purple-700 px-6 py-2 text-white font-semibold"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-purple-200 p-5 shadow-sm"
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
                Kembali: {item.returnDate}
              </p>
              <button
                onClick={() => {
                  setSelectedBorrow(item);
                  setShowConfirm(true);
                }}
                className="mt-4 w-full rounded-lg bg-green-600 py-2 text-sm text-white"
              >
                Kembalikan
              </button>
            </div>
          ))}
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-purple-300">
            <h2 className="mb-4 text-xl font-bold text-purple-700">
              Tambah Peminjaman
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setShowBook(true)}
                className="w-full rounded-lg border border-purple-300 p-3 text-left text-sm"
              >
                {selectedBook ? selectedBook.title : "Pilih Buku"}
              </button>

              <button
                onClick={() => setShowMember(true)}
                className="w-full rounded-lg border border-purple-300 p-3 text-left text-sm"
              >
                {selectedMember ? selectedMember.name : "Pilih Anggota"}
              </button>

              <input type="date" className="w-full rounded-lg border border-purple-300 p-3 text-sm" />
              <input type="date" className="w-full rounded-lg border border-purple-300 p-3 text-sm" />
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg border border-purple-300 px-6 py-2"
              >
                Batal
              </button>
              <button className="rounded-lg bg-purple-700 px-6 py-2 text-white">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showBook && (
        <Popup
          title="Pilih Buku"
          data={books}
          onClose={() => setShowBook(false)}
          onSelect={(b: any) => {
            setSelectedBook(b);
            setShowBook(false);
          }}
          render={(b: any) => (
            <>
              <p className="font-semibold text-purple-700">{b.title}</p>
              <p className="text-sm">{b.genre}</p>
              <p className="text-sm">{b.author}</p>
              <p className="text-xs">Stok: {b.stock}</p>
            </>
          )}
        />
      )}

      {showMember && (
        <Popup
          title="Pilih Anggota"
          data={members}
          onClose={() => setShowMember(false)}
          onSelect={(m: any) => {
            setSelectedMember(m);
            setShowMember(false);
          }}
          render={(m: any) => (
            <>
              <p className="font-semibold text-purple-700">{m.name}</p>
              <p className="text-sm">{m.nis}</p>
              <p className="text-sm">{m.email}</p>
            </>
          )}
        />
      )}

      {showConfirm && selectedBorrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-purple-300 text-center">
            <h2 className="mb-4 text-xl font-bold text-purple-700">
              Konfirmasi Pengembalian
            </h2>
            <p className="mb-6 text-sm">
              Yakin mengembalikan
              <br />
              <span className="font-semibold text-purple-700">
                {selectedBorrow.title}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-purple-300 px-6 py-2"
              >
                Tidak
              </button>
              <button className="rounded-lg bg-green-600 px-6 py-2 text-white">
                Kembalikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Popup({ title, data, onClose, onSelect, render }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 border border-purple-300">
        <div className="mb-4 flex justify-between border-b border-purple-200 pb-2">
          <h2 className="font-bold text-purple-700">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-3">
          {data.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between rounded-lg border border-purple-200 p-4"
            >
              <div className="text-sm">{render(item)}</div>
              <button
                onClick={() => onSelect(item)}
                className="rounded bg-green-600 px-4 py-1 text-sm text-white"
              >
                PILIH
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
