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
    category: "Anak-anak",
    stock: 12,
    image: "/img/foto1.jpg",
  },
  {
    id: 2,
    title: "The Clever Bee",
    author: "Laura White",
    category: "Edukasi",
    stock: 8,
    image: "/img/foto2.jpg",
  },
  {
    id: 3,
    title: "As Green as a Leaf",
    author: "Maria Evans",
    category: "Alam",
    stock: 5,
    image: "/img/foto3.jpg",
  },
  {
    id: 4,
    title: "Delicious Mushroom",
    author: "Kevin Woods",
    category: "Fiksi",
    stock: 10,
    image: "/img/foto4.jpg",
  },
  {
    id: 5,
    title: "Calm Clouds",
    author: "Emma Brooks",
    category: "Puisi",
    stock: 7,
    image: "/img/foto5.jpg",
  },
  {
    id: 6,
    title: "Useful Tree",
    author: "Oliver Dean",
    category: "Ilmu Pengetahuan",
    stock: 4,
    image: "/img/foto6.jpg",
  },
];

const BukuPage = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-[#111] text-white min-h-screen">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#111] border-r border-[#D4AF37]/40 p-4 z-30
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <button
          className="md:hidden absolute top-3 right-3 text-2xl"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-8 text-[#D4AF37]">LIBRAVA</h2>

        <nav className="flex flex-col gap-4">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2 rounded-lg hover:bg-[#D4AF37]/20"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="ml-0 md:ml-64 p-6 w-full">
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
              onClick={() => setShowPopup(true)}
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
              <p className="text-sm">Kategori: {item.category}</p>
              <p className="text-sm">Stok: {item.stock}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setSelectedBook(item);
                    setShowEditPopup(true);
                  }}
                  className="bg-[#D4AF37] text-black px-3 py-2 rounded-lg"
                >
                  Edit
                </button>

                {/* HAPUS DI CARD */}
                <button
                  onClick={() => {
                    setSelectedBook(item);
                    setShowDeleteConfirm(true);
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

      {/* POPUP TAMBAH */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#222] p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">
              Tambah Buku
            </h2>

            <div className="flex flex-col space-y-3">
              <input className="p-3 bg-black border border-[#D4AF37]/40 rounded-lg" placeholder="Judul Buku" />
              <input className="p-3 bg-black border border-[#D4AF37]/40 rounded-lg" placeholder="Penulis" />
              <input type="number" className="p-3 bg-black border border-[#D4AF37]/40 rounded-lg" placeholder="Stok" />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP EDIT */}
      {showEditPopup && selectedBook && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#222] p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">
              Edit Buku
            </h2>

            <div className="flex flex-col space-y-3">
              <input defaultValue={selectedBook.title} className="p-3 bg-black border border-[#D4AF37]/40 rounded-lg" />
              <input defaultValue={selectedBook.author} className="p-3 bg-black border border-[#D4AF37]/40 rounded-lg" />
              <select defaultValue={selectedBook.category} className="p-3 bg-black border border-[#D4AF37]/40 rounded-lg">
                <option>Anak-anak</option>
                <option>Edukasi</option>
                <option>Fiksi</option>
                <option>Non-Fiksi</option>
                <option>Ilmu Pengetahuan</option>
                <option>Puisi</option>
              </select>
              <input type="number" defaultValue={selectedBook.stock} className="p-3 bg-black border border-[#D4AF37]/40 rounded-lg" />
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                Hapus
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-500 px-4 py-2 rounded-lg"
                >
                  Batal
                </button>
                <button className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KONFIRMASI HAPUS */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#222] p-6 rounded-2xl w-full max-w-sm text-center border border-red-500/40">
            <h3 className="text-xl font-bold text-red-500 mb-4">
              Konfirmasi Hapus
            </h3>

            <p className="mb-6">
              Apakah anda yakin untuk menghapus ini?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 px-4 py-2 rounded-lg"
              >
                Tidak
              </button>

              <button
                onClick={() => {
                  console.log("Hapus buku:", selectedBook);
                  setShowDeleteConfirm(false);
                  setShowEditPopup(false);
                }}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                Iya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BukuPage;
