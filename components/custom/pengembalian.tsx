"use client";

import { useState } from "react";

const books = [
  { id: 1, title: "A Smart Bunny", genre: "Fabel", author: "Anonim", stock: 2 },
  { id: 2, title: "The Clever Bee", genre: "Fabel", author: "Anonim", stock: 1 },
  { id: 3, title: "Little Red Fox", genre: "Fabel", author: "Anonim", stock: 3 },
];

const members = [
  { id: 1, name: "agatha celine jjavorkai", email: "agathavorka2@gmail.com" },
  { id: 2, name: "anak agung aldebaran", email: "aldebaranagung@gmail.com" },
  { id: 3, name: "i gede satria jati wibawa", email: "sajajaja08@gmail.com" },
  { id: 4, name: "lionel jastive mouel", email: "jastive35@gmail.com" },
];

const borrowList = [
  { id: 1, title: "Delicious Mushroom", borrower: "i gede satria jati wibawa", borrowDate: "01/17/2026", returnDate: "01/24/2026", status: "Dipinjam" },
  { id: 2, title: "As Green as a Leaf", borrower: "agatha celine jjavorka", borrowDate: "01/03/2026", returnDate: "01/10/2026", status: "Dipinjam" },
  { id: 3, title: "A Smart Bunny", borrower: "i gede satria jati wibawa", borrowDate: "01/03/2026", returnDate: "01/10/2026", status: "Dipinjam" },
  { id: 4, title: "Calm Clouds", borrower: "anak agung aldebaran", borrowDate: "01/10/2026", returnDate: "01/17/2026", status: "Dipinjam" },
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
      <main className="w-full px-8 py-10">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-purple-800">Peminjaman</h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul buku..."
              className="w-full sm:w-96 rounded-full border px-4 py-2 text-sm"
            />
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-full bg-purple-700 px-6 py-2 text-white font-semibold"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex w-full items-center justify-between rounded-2xl bg-white px-10 py-6 border shadow-sm"
            >
              <div className="flex items-center gap-10">
                <span className="rounded-full bg-yellow-100 px-5 py-1.5 text-sm font-semibold text-yellow-700">
                  {item.status}
                </span>

                <div>
                  <h3 className="text-lg font-bold text-purple-700">{item.title}</h3>
                  <p className="text-sm">Peminjam: {item.borrower}</p>
                </div>

                <div className="text-sm">
                  <p>Pinjam: {item.borrowDate}</p>
                  <p>Kembali: {item.returnDate}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedBorrow(item);
                  setShowConfirm(true);
                }}
                className="rounded-lg bg-green-600 px-8 py-2.5 text-sm text-white"
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
            <SelectButton label={selectedBook?.title || "Pilih Buku"} onClick={() => setShowBook(true)} />
            <SelectButton label={selectedMember?.name || "Pilih Anggota"} onClick={() => setShowMember(true)} />
            <input type="date" className="input" />
            <input type="date" className="input" />
          </div>
        </Modal>
      )}

      {showBook && (
        <Popup title="Pilih Buku" data={books} onClose={() => setShowBook(false)} onSelect={setSelectedBook} />
      )}

      {showMember && (
        <Popup title="Pilih Anggota" data={members} onClose={() => setShowMember(false)} onSelect={setSelectedMember} />
      )}

      {showConfirm && selectedBorrow && (
        <Modal title="Konfirmasi Pengembalian" onClose={() => setShowConfirm(false)}>
          <p className="text-center">
            Yakin mengembalikan
            <br />
            <span className="font-semibold text-purple-700">{selectedBorrow.title}</span>?
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="btn-outline" onClick={() => setShowConfirm(false)}>Tidak</button>
            <button className="btn-green">Kembalikan</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-purple-700">{title}</h2>
        {children}
        <div className="mt-6 text-center">
          <button onClick={onClose} className="btn-outline">Tutup</button>
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
          <div key={item.id} className="flex justify-between items-center border rounded-lg p-3">
            <div className="text-sm">
              {"title" in item ? item.title : item.name}
            </div>
            <button
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="btn-green"
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
    <button onClick={onClick} className="w-full rounded-lg border p-3 text-left text-sm">
      {label}
    </button>
  );
}
