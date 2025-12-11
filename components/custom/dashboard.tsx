"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const nav_items = [
  { name: "Dashboard", href: "/" },
  { name: "Buku", href: "/buku" },
  { name: "Anggota", href: "/anggota" },
  { name: "Peminjaman", href: "/peminjaman" },
  { name: "Pengembalian", href: "/pengembalian" },
];

const booksData = [
  { id: 1, title: "A Smart Bunny", stock: 12, image: "/img/foto1.jpg" },
  { id: 2, title: "The Clever Bee", stock: 8, image: "/img/foto2.jpg" },
  { id: 3, title: "As Green as a Leaf", stock: 0, image: "/img/foto3.jpg" },
  { id: 4, title: "Delicious Mushroom", stock: 10, image: "/img/foto4.jpg" },
  { id: 5, title: "Calm Clouds", stock: 7, image: "/img/foto5.jpg" },
  { id: 6, title: "Useful Tree", stock: 4, image: "/img/foto6.jpg" },
];

const borrowData = [
  { name: "Sunghoon", book: "A Smart Bunny" },
  { name: "Minggyu", book: "The Clever Bee" },
  { name: "DK", book: "Delicious Mushroom" },
];

const returnData = [
  { name: "Kimberly", book: "Delicious Mushroom" },
  { name: "Sheyln", book: "Calm Clouds" },
  { name: "Joshua", book: "Useful Tree" },
];

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [fade, setFade] = useState(false);

  const filteredBooks = booksData.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setFade(false);
    const timer = setTimeout(() => setFade(true), 150);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex bg-[#111] min-h-screen text-white">

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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
            Dashboard
          </h3>
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari buku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black border border-[#D4AF37]/40 rounded-full p-2 sm:p-3 w-full text-sm sm:text-base focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
            />
          </div>
        </div>

        <section className="mb-6">
          <h4 className="text-lg md:text-2xl font-semibold mb-3 text-white">
            Statistik Perpustakaan
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: "Total Buku", value: 125 },
              { label: "Buku Tersedia", value: 85 },
              { label: "Dipinjam Hari Ini", value: 52 },
              { label: "Pengembalian Hari Ini", value: 35 },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#222] border border-[#D4AF37]/40 p-2 md:p-4 rounded-xl text-center"
              >
                <p className="text-lg md:text-3xl font-extrabold text-[#D4AF37]">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <section>
              <h4 className="text-lg md:text-2xl font-semibold mb-2 text-white">
                Data Peminjaman
              </h4>
              <div className="bg-[#222] p-2 md:p-4 rounded-xl border border-[#D4AF37]/40">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="text-[#D4AF37] border-b border-[#2a2a2a]">
                      <th className="pb-1 text-left">Nama</th>
                      <th className="pb-1 text-left">Buku</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowData.map((it, idx) => (
                      <tr key={idx} className="border-b border-[#2a2a2a]">
                        <td className="py-1">{it.name}</td>
                        <td className="py-1 text-gray-300">{it.book}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h4 className="text-lg md:text-2xl font-semibold mb-2 text-white">
                Data Pengembalian
              </h4>
              <div className="bg-[#222] p-2 md:p-4 rounded-xl border border-[#D4AF37]/40">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="text-[#D4AF37] border-b border-[#2a2a2a]">
                      <th className="pb-1 text-left">Nama</th>
                      <th className="pb-1 text-left">Buku</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnData.map((it, idx) => (
                      <tr key={idx} className="border-b border-[#2a2a2a]">
                        <td className="py-1">{it.name}</td>
                        <td className="py-1 text-gray-300">{it.book}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            <h5 className="text-lg md:text-2xl font-bold mb-4 text-white tracking-wide">
              Koleksi Buku
            </h5>

            {filteredBooks.length === 0 && (
              <p className="text-center text-gray-400 text-sm md:text-base mt-4">
                Maaf, buku tidak ditemukan.
              </p>
            )}

            <div
              className={`grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-opacity duration-200 ${fade ? "opacity-100" : "opacity-0"}`}
            >
              {filteredBooks.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#222] border border-[#D4AF37]/40 p-3 sm:p-5 rounded-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-36 sm:h-56 object-cover rounded-xl mb-3 sm:mb-4 border border-[#D4AF37]/30"
                  />

                  <h3 className="font-bold text-base sm:text-xl text-[#D4AF37] leading-tight mb-1">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 text-xs sm:text-sm mb-1">Stok: {item.stock}</p>
                  <p
                    className={`text-xs sm:text-sm font-semibold ${item.stock > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {item.stock > 0 ? "Tersedia" : "Habis"}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
