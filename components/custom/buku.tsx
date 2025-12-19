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
  {
    id: 1,
    title: "A Smart Bunny",
    author: "Jonathan Miles",
    publisher: "Kids World",
    year: 2022,
    category: "Anak-anak",
    stock: 12,
    image: "/img/foto1.jpg",
  },
  {
    id: 2,
    title: "The Clever Bee",
    author: "Laura White",
    publisher: "Edu Press",
    year: 2021,
    category: "Edukasi",
    stock: 8,
    image: "/img/foto2.jpg",
  },
];

export default function BukuPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex bg-[#111] text-white min-h-screen">
      <aside className="fixed top-0 left-0 h-screen w-64 bg-[#111] border-r border-[#D4AF37]/40 p-4">
        <h2 className="text-3xl font-bold mb-8 text-[#D4AF37]">LIBRAVA</h2>
        <nav className="flex flex-col gap-4">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2 rounded-lg hover:bg-[#D4AF37]/20"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 p-6 w-full">
        <div className="flex justify-between mb-6">
          <h3 className="text-3xl font-bold text-[#D4AF37]">Data Buku</h3>

          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black border border-[#D4AF37]/40 rounded-full px-4"
              placeholder="Cari buku..."
            />
            <button
              onClick={() => {
                setSelectedBook(null);
                setPreview(null);
                setShowAdd(true);
              }}
              className="bg-[#D4AF37] text-black px-5 py-2 rounded-full font-semibold"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((item) => (
            <div
              key={item.id}
              className="bg-[#222] border border-[#D4AF37]/40 p-5 rounded-2xl"
            >
              <img
                src={item.image}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />

              <h3 className="font-bold text-xl text-[#D4AF37]">
                {item.title}
              </h3>

              <p className="text-sm">Penulis: {item.author}</p>
              <p className="text-sm">Penerbit: {item.publisher}</p>
              <p className="text-sm">Tahun: {item.year}</p>
              <p className="text-sm">Kategori: {item.category}</p>
              <p className="text-sm">Stok: {item.stock}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setSelectedBook(item);
                    setPreview(item.image);
                    setShowEdit(true);
                  }}
                  className="bg-[#D4AF37] text-black px-3 py-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedBook(item);
                    setShowDelete(true);
                  }}
                  className="bg-red-600 px-3 py-2 rounded-lg"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {(showAdd || showEdit) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#222] p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">
              {showAdd ? "Tambah Buku" : "Edit Buku"}
            </h2>

            <div className="space-y-3">
              <input defaultValue={selectedBook?.title || ""} placeholder="Judul Buku" className="w-full p-3 bg-black border border-[#D4AF37]/40 rounded-lg" />
              <input defaultValue={selectedBook?.author || ""} placeholder="Penulis" className="w-full p-3 bg-black border border-[#D4AF37]/40 rounded-lg" />
              <input defaultValue={selectedBook?.publisher || ""} placeholder="Penerbit" className="w-full p-3 bg-black border border-[#D4AF37]/40 rounded-lg" />
              <input type="number" defaultValue={selectedBook?.year || ""} placeholder="Tahun Terbit" className="w-full p-3 bg-black border border-[#D4AF37]/40 rounded-lg" />

              <select defaultValue={selectedBook?.category || ""} className="w-full p-3 bg-black border border-[#D4AF37]/40 rounded-lg">
                <option value="">Pilih Kategori</option>
                <option>Anak-anak</option>
                <option>Edukasi</option>
                <option>Fiksi</option>
                <option>Non-Fiksi</option>
                <option>Ilmu Pengetahuan</option>
                <option>Puisi</option>
              </select>

              <input type="number" defaultValue={selectedBook?.stock || ""} placeholder="Jumlah Stok" className="w-full p-3 bg-black border border-[#D4AF37]/40 rounded-lg" />
              <input type="file" accept="image/*" onChange={handleImage} />

              {preview && (
                <img src={preview} className="h-40 w-full object-cover rounded-xl" />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowAdd(false); setShowEdit(false); }} className="bg-gray-500 px-4 py-2 rounded-lg">
                Batal
              </button>
              <button className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#222] p-6 rounded-2xl max-w-sm text-center">
            <h3 className="text-xl font-bold text-red-500 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="mb-6">Yakin ingin menghapus buku ini?</p>

            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDelete(false)} className="bg-gray-500 px-4 py-2 rounded-lg">
                Tidak
              </button>
              <button onClick={() => setShowDelete(false)} className="bg-red-600 px-4 py-2 rounded-lg">
                Iya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
