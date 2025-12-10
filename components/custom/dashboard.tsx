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

const booksData = [
  { 
    id: 1, 
    title: "A Smart Bunny", 
    author: "Jonathan Miles",
    category: "Anak-anak",
    stock: 12,
    image: "/img/foto1.jpg" 
  },
  { 
    id: 2, 
    title: "The Clever Bee", 
    author: "Laura White",
    category: "Edukasi",
    stock: 8,
    image: "/img/foto2.jpg" 
  },
  { 
    id: 3, 
    title: "As Green as a Leaf", 
    author: "Maria Evans",
    category: "Alam",
    stock: 0,
    image: "/img/foto3.jpg" 
  },
  { 
    id: 4, 
    title: "Delicious Mushroom", 
    author: "Kevin Woods",
    category: "Fiksi",
    stock: 10,
    image: "/img/foto4.jpg" 
  },
  { 
    id: 5, 
    title: "Calm Clouds", 
    author: "Emma Brooks",
    category: "Puisi",
    stock: 7,
    image: "/img/foto5.jpg" 
  },
  { 
    id: 6, 
    title: "Useful Tree", 
    author: "Oliver Dean",
    category: "Ilmu Pengetahuan",
    stock: 4,
    image: "/img/foto6.jpg" 
  },
];

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredBooks = booksData.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100 font-sans min-h-screen">
      
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#B77466] text-white p-6 
        z-30 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-64"}
        md:translate-x-0`}
      >
        <h2 className="text-3xl font-semibold mb-8">Librava</h2>

        <nav className="flex flex-col space-y-4">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="p-3 rounded-lg text-left transition-all hover:bg-white/20 hover:translate-x-1"
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

      <main className="ml-0 md:ml-64 p-6 w-full transition-all">

        <button
          className="md:hidden mb-4 p-2 bg-[#FD7979] text-white rounded-lg"
          onClick={() => setOpen(true)}
        >
          ☰ Menu
        </button>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Dashboard</h3>

          <input
            className="border rounded-full p-3 w-80 shadow-sm outline-none focus:ring-2 focus:ring-[#B77466]"
            type="text"
            placeholder="Cari buku, penulis, kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#C4A484] p-6 rounded-xl shadow text-center">
            <h2 className="text-3xl text-white font-bold">125</h2>
            <p className="text-white">Total Buku</p>
          </div>

          <div className="bg-[#C4A484] p-6 rounded-xl shadow text-center">
            <h2 className="text-3xl text-white font-bold">85</h2>
            <p className="text-white">Buku Tersedia</p>
          </div>

          <div className="bg-[#C4A484] p-6 rounded-xl shadow text-center">
            <h2 className="text-3xl text-white font-bold">52</h2>
            <p className="text-white">Dipinjam Hari Ini</p>
          </div>

          <div className="bg-[#C4A484] p-6 rounded-xl shadow text-center">
            <h2 className="text-3xl text-white font-bold">35</h2>
            <p className="text-white">Pengembalian Hari Ini</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <section className="lg:col-span-2">
            <h5 className="text-xl font-semibold mb-4">Koleksi Buku</h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBooks.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-72 object-cover object-top rounded-lg mb-3"
                  />

                  <h3 className="font-semibold">{item.title}</h3>

                  <p className="text-gray-600 text-sm">Penulis: {item.author}</p>
                  <p className="text-gray-600 text-sm">Kategori: {item.category}</p>
                  <p className="text-gray-600 text-sm">Stok: {item.stock}</p>

                  <p
                    className={`mt-2 font-semibold ${
                      item.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.stock > 0 ? "Tersedia" : "Habis"}
                  </p>
                </div>
              ))}

              {filteredBooks.length === 0 && (
                <p className="text-gray-500 italic">Tidak ada buku ditemukan.</p>
              )}
            </div>
          </section>

          <div className="space-y-6">

            <section className="bg-white p-6 rounded-xl shadow">
              <h5 className="text-xl font-semibold mb-4">Data Peminjaman Buku</h5>
              <ul className="space-y-3">
                <li className="p-3 border rounded-lg flex justify-between">
                  <span>Prabanatha</span>
                  <span className="text-gray-500 text-sm">A Smart Bunny</span>
                </li>
                <li className="p-3 border rounded-lg flex justify-between">
                  <span>Minggyu</span>
                  <span className="text-gray-500 text-sm">The Clever Bee</span>
                </li>
                <li className="p-3 border rounded-lg flex justify-between">
                  <span>Jihoon</span>
                  <span className="text-gray-500 text-sm">As Green as a Leaf</span>
                </li>
              </ul>
            </section>

            <section className="bg-white p-6 rounded-xl shadow">
              <h5 className="text-xl font-semibold mb-4">Data Pengembalian Buku</h5>
              <ul className="space-y-3">
                <li className="p-3 border rounded-lg flex justify-between">
                  <span>Kimberly</span>
                  <span className="text-gray-500 text-sm">Delicious Mushroom</span>
                </li>
                <li className="p-3 border rounded-lg flex justify-between">
                  <span>Sheyln</span>
                  <span className="text-gray-500 text-sm">Calm Clouds</span>
                </li>
                <li className="p-3 border rounded-lg flex justify-between">
                  <span>Carmen</span>
                  <span className="text-gray-500 text-sm">Useful Tree</span>
                </li>
              </ul>
            </section>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
