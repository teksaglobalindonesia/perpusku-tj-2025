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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-[#111] text-white font-sans min-h-screen">

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#111] border-r border-[#D4AF37]/40 p-4 md:p-6 z-30
        transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <button
          className="md:hidden absolute top-3 right-3 text-white text-2xl font-bold"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-[#D4AF37] tracking-wide">
          LIBRAVA
        </h2>

        <nav className="flex flex-col gap-2 md:gap-4">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2 rounded-lg hover:bg-[#D4AF37]/20 text-sm md:text-base transition"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-20"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="ml-0 md:ml-64 p-4 sm:p-6 w-full">

        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            className="p-2 bg-[#D4AF37] text-black rounded-lg font-semibold active:scale-95"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
          <h3 className="text-xl md:text-3xl font-bold tracking-wide">Dashboard</h3>
          <div className="w-8" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-8 gap-3">

          <h3 className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
            Data Buku
          </h3>

          <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black border border-[#D4AF37]/40 text-white rounded-full 
              p-2 sm:p-3 text-sm sm:text-base w-full sm:w-80 focus:ring-2 focus:ring-[#D4AF37]"
              type="text"
              placeholder="Cari buku..."
            />

            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-2 sm:px-5 sm:py-3 bg-[#D4AF37] text-black rounded-full 
              text-sm sm:text-base font-semibold hover:bg-[#b6912c] transition"
            >
              + Tambah
            </button>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm sm:text-lg mt-10">
            Maaf, buku tidak ditemukan.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {filteredBooks.map((item) => (
              <div
                key={item.id}
                className="bg-[#222] border border-[#D4AF37]/40 
                p-3 sm:p-5 rounded-2xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-36 sm:h-56 object-cover rounded-xl 
                  mb-3 sm:mb-4 border border-[#D4AF37]/30"
                />

                <h3 className="font-bold text-base sm:text-xl text-[#D4AF37] leading-tight">
                  {item.title}
                </h3>

                <p className="text-gray-300 text-xs sm:text-sm">Penulis: {item.author}</p>
                <p className="text-gray-300 text-xs sm:text-sm">Kategori: {item.category}</p>
                <p className="text-gray-300 text-xs sm:text-sm">Stok: {item.stock}</p>

                <div className="flex justify-between mt-3 sm:mt-4">
                  <button className="px-2 py-1 sm:px-3 sm:py-2 bg-[#D4AF37] text-black 
                  text-xs sm:text-sm font-semibold rounded-lg">
                    Edit
                  </button>

                  <button className="px-2 py-1 sm:px-3 sm:py-2 bg-red-600 text-white 
                  text-xs sm:text-sm font-semibold rounded-lg">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#222] border border-[#D4AF37]/40 
          p-5 sm:p-8 rounded-2xl w-full max-w-xs sm:max-w-md">

            <h2 className="text-xl sm:text-2xl font-bold text-[#D4AF37] mb-4">
              Tambah Buku
            </h2>

            <div className="flex flex-col space-y-2 sm:space-y-3">
              <input className="p-2 sm:p-3 rounded-lg bg-black border border-[#D4AF37]/40 text-white text-sm" placeholder="Judul Buku" />
              <input className="p-2 sm:p-3 rounded-lg bg-black border border-[#D4AF37]/40 text-white text-sm" placeholder="Penulis" />
              <input className="p-2 sm:p-3 rounded-lg bg-black border border-[#D4AF37]/40 text-white text-sm" placeholder="Penerbit" />
              <input className="p-2 sm:p-3 rounded-lg bg-black border border-[#D4AF37]/40 text-white text-sm" placeholder="Tahun Terbit" />

              <select className="p-2 sm:p-3 rounded-lg bg-black border border-[#D4AF37]/40 text-white text-sm">
                <option>Pilih Kategori</option>
                <option>Anak-anak</option>
                <option>Edukasi</option>
                <option>Fiksi</option>
                <option>Non-Fiksi</option>
                <option>Ilmu Pengetahuan</option>
                <option>Puisi</option>
              </select>

              <input type="number" className="p-2 sm:p-3 rounded-lg bg-black border border-[#D4AF37]/40 text-white text-sm" placeholder="Jumlah Stok" />
            </div>

            <div className="flex justify-end gap-2 sm:gap-3 mt-5">
              <button
                onClick={() => setShowPopup(false)}
                className="px-3 sm:px-4 py-2 bg-gray-500 rounded-lg text-sm hover:bg-gray-600"
              >
                Batal
              </button>
              <button className="px-3 sm:px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg text-sm">
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default BukuPage;
