"use client";

import { useState } from "react";

const books = [
  {
    id: 1,
    title: "A Smart Bunny",
    publisher: "Happy Kids",
    year: 2022,
    category: "Fabel",
    stock: 2,
    image: "https://via.placeholder.com/80x110",
    description: "Cerita kelinci pintar yang penuh pesan moral",
  },
  {
    id: 2,
    title: "The Clever Bee",
    publisher: "Story Land",
    year: 2021,
    category: "Fabel",
    stock: 1,
    image: "https://via.placeholder.com/80x110",
    description: "Petualangan lebah cerdas di taman bunga",
  },
  {
    id: 3,
    title: "Little Red Fox",
    publisher: "Kids World",
    year: 2023,
    category: "Fabel",
    stock: 3,
    image: "https://via.placeholder.com/80x110",
    description: "Kisah rubah kecil yang berani dan cerdik",
  },
];

const members = [
  { id: 1, name: "agatha celine jjavorkai", email: "agathavorka2@gmail.com" },
  { id: 2, name: "anak agung aldebaran", email: "aldebaranagung@gmail.com" },
  { id: 3, name: "i gede satria jati wibawa", email: "sajajaja08@gmail.com" },
  { id: 4, name: "lionel jastive mouel", email: "jastive35@gmail.com" },
];

const borrowList = [
  { id: 1, title: "Delicious Mushroom", borrower: "i gede satria jati wibawa", borrowDate: "01/17/2026", returnDate: "01/24/2026" },
  { id: 2, title: "As Green as a Leaf", borrower: "agatha celine jjavorka", borrowDate: "01/03/2026", returnDate: "01/10/2026" },
  { id: 3, title: "A Smart Bunny", borrower: "i gede satria jati wibawa", borrowDate: "01/03/2026", returnDate: "01/10/2026" },
  { id: 4, title: "Calm Clouds", borrower: "anak agung aldebaran", borrowDate: "01/10/2026", returnDate: "01/17/2026" },
];

export default function PeminjamanPage() {
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
    <div className="min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <main className="mx-auto max-w-full px-8 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-purple-800">Peminjaman</h1>
          <div className="flex w-full gap-3 sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul buku..."
              className="w-full rounded-full border px-4 py-2 text-sm sm:w-80"
            />
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-full bg-purple-700 px-6 py-2 text-sm font-semibold text-white"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold text-purple-700">
                  {item.title}
                </h3>
                <p className="text-sm">Peminjam: {item.borrower}</p>
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div>Pinjam: {item.borrowDate}</div>
                  <div>Kembali: {item.returnDate}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedBorrow(item);
                  setShowConfirm(true);
                }}
                className="rounded-lg bg-green-600 px-8 py-2 text-sm text-white"
              >
                Kembalikan
              </button>
            </div>
          ))}
        </div>
      </main>

      {showAdd && (
        <Modal title="Tambah Peminjaman" onClose={() => setShowAdd(false)}>
          <div className="space-y-3">
            <SelectButton
              label={selectedBook ? selectedBook.title : "Pilih Buku"}
              onClick={() => setShowBook(true)}
            />
            <SelectButton
              label={selectedMember ? selectedMember.name : "Pilih Anggota"}
              onClick={() => setShowMember(true)}
            />
            <input type="date" className="w-full rounded-lg border p-3 text-sm" />
            <input type="date" className="w-full rounded-lg border p-3 text-sm" />
            <button className="w-full rounded-lg bg-purple-700 py-2 text-sm font-semibold text-white">
              Simpan
            </button>
          </div>
        </Modal>
      )}

      {showBook && (
        <Modal title="Pilih Buku" onClose={() => setShowBook(false)}>
          <div className="space-y-4">
            {books.map((b) => (
              <div
                key={b.id}
                className="flex gap-4 rounded-xl border p-4"
              >
                <img
                  src={b.image}
                  className="h-[110px] w-[80px] rounded-md object-cover"
                />
                <div className="flex-1 space-y-1 text-sm">
                  <p className="font-semibold text-purple-700">{b.title}</p>
                  <p className="text-gray-600">{b.description}</p>
                  <p>Penerbit: {b.publisher}</p>
                  <p>Tahun: {b.year}</p>
                  <p>Kategori: {b.category}</p>
                  <p className="font-medium">Stok: {b.stock}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedBook(b);
                    setShowBook(false);
                  }}
                  className="h-fit rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
                >
                  Pilih
                </button>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {showMember && (
        <Popup title="Pilih Anggota" data={members} onClose={() => setShowMember(false)} onSelect={setSelectedMember} />
      )}

      {showConfirm && selectedBorrow && (
        <Modal title="Konfirmasi Pengembalian" onClose={() => setShowConfirm(false)}>
          <p className="text-center text-sm">
            Yakin mengembalikan
            <br />
            <span className="font-semibold text-purple-700">
              {selectedBorrow.title}
            </span>
            ?
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border px-8 py-2 text-sm"
            >
              Tidak
            </button>
            <button className="rounded-lg bg-green-600 px-8 py-2 text-sm text-white">
              Kembalikan
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-purple-700">{title}</h2>
        {children}
        <div className="mt-6 text-center">
          <button onClick={onClose} className="rounded-lg border px-6 py-2 text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function Popup({ title, data, onClose, onSelect }: any) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-3">
        {data.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="text-sm">
              {item.name}
              <div className="text-xs text-gray-500">{item.email}</div>
            </div>
            <button
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white"
            >
              Pilih
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function SelectButton({ label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border p-3 text-left text-sm"
    >
      {label}
    </button>
  );
}
