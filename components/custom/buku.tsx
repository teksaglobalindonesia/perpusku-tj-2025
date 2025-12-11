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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-[#111] text-white font-sans min-h-screen">

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#111] border-r border-[#D4AF37]/40 text-white p-6 z-30 
        transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}
      >
        <h2 className="text-3xl font-bold mb-8 text-[#D4AF37] tracking-wide">
          LIBRAVA
        </h2>

        <nav className="flex flex-col space-y-4">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="p-3 rounded-lg hover:bg-[#D4AF37]/20 transition"
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

      <main className="ml-0 md:ml-64 p-6 w-full">

        <button
          className="md:hidden mb-4 p-2 bg-[#D4AF37] text-black rounded-lg font-semibold"
          onClick={() => setOpen(true)}
        >
          ☰ Menu
        </button>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h3 className="text-3xl font-bold tracking-wide text-[#D4AF37]">
            Data Buku
          </h3>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-[#D4AF37]/40 text-white rounded-full p-3 w-full sm:w-80
            focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
            type="text"
            placeholder="Cari buku..."
          />
        </div>

        {filteredBooks.length === 0 && (
          <p className="text-center text-gray-400 text-lg mt-10">
            Maaf, buku tidak ditemukan.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((item) => (
            <div
              key={item.id}
              className="bg-[#222] border border-[#D4AF37]/40 p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover object-top rounded-xl mb-4 border border-[#D4AF37]/30"
              />

              <h3 className="font-bold text-xl text-[#D4AF37]">{item.title}</h3>
              <p className="text-gray-300 text-sm">Penulis: {item.author}</p>
              <p className="text-gray-300 text-sm">Kategori: {item.category}</p>
              <p className="text-gray-300 text-sm">Stok: {item.stock}</p>

              <div className="flex justify-between mt-4">
                <button className="px-4 py-2 bg-[#D4AF37] text-black text-sm font-semibold rounded-lg hover:bg-[#b6912c] transition">
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default BukuPage;
