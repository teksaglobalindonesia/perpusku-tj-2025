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
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedBorrow, setSelectedBorrow] = useState<any>(null);

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
        <div className="mb-8 flex justify-between">
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
              <h3 className="text-xl font-bold text-[#D4AF37]">{item.title}</h3>
              <p className="text-sm">Peminjam: {item.borrower}</p>
              <p className="text-sm">Pinjam: {item.borrowDate}</p>
              <p className="text-sm">Kembali: {item.returnDate}</p>
              <button
                onClick={() => {
                  setSelectedBorrow(item);
                  setShowConfirm(true);
                }}
                className="mt-4 w-full rounded-lg bg-green-600 py-2 text-sm"
              >
                Kembalikan
              </button>
            </div>
          ))}
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md rounded-2xl border border-[#D4AF37]/40 bg-[#111] p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#D4AF37]">
              Tambah Peminjaman
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setShowBookPopup(true)}
                className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3 text-left"
              >
                {selectedBook ? selectedBook.title : "Pilih Buku"}
              </button>

              <button
                onClick={() => setShowMemberPopup(true)}
                className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3 text-left"
              >
                {selectedMember ? selectedMember.name : "Pilih Anggota"}
              </button>

              <input type="date" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
              <input type="date" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg bg-gray-600 px-4 py-2"
              >
                Batal
              </button>
              <button className="rounded-lg bg-[#D4AF37] px-4 py-2 font-semibold text-black">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showBookPopup && (
        <PopupPilihBuku
          onClose={() => setShowBookPopup(false)}
          onSelect={(b: any) => {
            setSelectedBook(b);
            setShowBookPopup(false);
          }}
        />
      )}

      {showMemberPopup && (
        <PopupPilihAnggota
          onClose={() => setShowMemberPopup(false)}
          onSelect={(m: any) => {
            setSelectedMember(m);
            setShowMemberPopup(false);
          }}
        />
      )}

      {showConfirm && selectedBorrow && (
        <ConfirmPopup
          title={selectedBorrow.title}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

function PopupPilihBuku({ onClose, onSelect }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-xl rounded-2xl border border-[#D4AF37]/40 bg-[#111] p-6 text-white">
        <div className="mb-4 flex justify-between border-b border-[#D4AF37]/30 pb-2">
          <h2 className="font-bold text-[#D4AF37]">Pilih Buku</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-3">
          {books.map((b) => (
            <div
              key={b.id}
              className="flex justify-between rounded-lg border border-[#D4AF37]/20 bg-[#1c1c1c] p-4"
            >
              <div>
                <p className="font-semibold text-[#D4AF37]">{b.title}</p>
                <p className="text-sm">{b.genre}</p>
                <p className="text-sm">{b.author}</p>
              </div>
              <div className="text-right">
                <p className="text-xs">Stok: {b.stock}</p>
                <button
                  onClick={() => onSelect(b)}
                  className="mt-2 rounded bg-green-600 px-4 py-1 text-sm"
                >
                  PILIH
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PopupPilihAnggota({ onClose, onSelect }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-xl rounded-2xl border border-[#D4AF37]/40 bg-[#111] p-6 text-white">
        <div className="mb-4 flex justify-between border-b border-[#D4AF37]/30 pb-2">
          <h2 className="font-bold text-[#D4AF37]">Pilih Anggota</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex justify-between rounded-lg border border-[#D4AF37]/20 bg-[#1c1c1c] p-4"
            >
              <div>
                <p className="font-semibold text-[#D4AF37]">{m.name}</p>
                <p className="text-sm">{m.nis}</p>
                <p className="text-sm">{m.email}</p>
              </div>
              <button
                onClick={() => onSelect(m)}
                className="rounded bg-green-600 px-4 py-1 text-sm"
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

function ConfirmPopup({ title, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md rounded-2xl border border-[#D4AF37]/40 bg-[#111] p-6 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold text-[#D4AF37]">
          Konfirmasi Pengembalian
        </h2>
        <p className="mb-6">
          Yakin mengembalikan <br />
          <span className="font-semibold text-[#D4AF37]">{title}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded bg-gray-600 px-4 py-2">
            Tidak
          </button>
          <button className="rounded bg-green-600 px-4 py-2">
            Kembalikan
          </button>
        </div>
      </div>
    </div>
  );
}
