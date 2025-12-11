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
        className={`fixed top-0 left-0 h-screen w-64 bg-[#111] border-r border-[#D4AF37]/40 p-6 z-30
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h3 className="text-3xl font-bold tracking-wide">Dashboard</h3>

          <input
            type="text"
            placeholder="Cari buku..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-[#D4AF37]/40 rounded-full p-3 w-full sm:w-80
            focus:ring-2 focus:ring-[#D4AF37] outline-none transition"
          />
        </div>

        <section className="mb-12">
          <h4 className="text-2xl font-semibold mb-4 text-[#D4AF37]">
            Statistik Perpustakaan
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Buku", value: 125 },
              { label: "Buku Tersedia", value: 85 },
              { label: "Dipinjam Hari Ini", value: 52 },
              { label: "Pengembalian Hari Ini", value: 35 },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#222] border border-[#D4AF37]/40 p-6 rounded-2xl text-center shadow-md"
              >
                <p className="text-4xl font-extrabold text-[#D4AF37] mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-1 space-y-10">

            <section>
              <h4 className="text-2xl font-semibold mb-3 text-[#D4AF37]">
                Data Peminjaman
              </h4>

              <div className="bg-[#222] p-6 rounded-2xl border border-[#D4AF37]/40 shadow-md">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#D4AF37] border-b border-[#D4AF37]/40">
                      <th className="pb-2">Nama</th>
                      <th className="pb-2">Buku</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowData.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#333]">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-gray-300">{item.book}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h4 className="text-2xl font-semibold mb-3 text-[#D4AF37]">
                Data Pengembalian
              </h4>

              <div className="bg-[#222] p-6 rounded-2xl border border-[#D4AF37]/40 shadow-md">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#D4AF37] border-b border-[#D4AF37]/40">
                      <th className="pb-2">Nama</th>
                      <th className="pb-2">Buku</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnData.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#333]">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-gray-300">{item.book}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>

          <div className="lg:col-span-2">
            <h5 className="text-3xl font-bold mb-6 text-[#D4AF37] tracking-wide">
              Koleksi Buku
            </h5>

            {filteredBooks.length === 0 && (
              <p className="text-center text-gray-400 text-lg mt-10">
                Maaf, buku tidak ditemukan.
              </p>
            )}

            <div
              className={`min-h-[200px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transition-opacity duration-300 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
            >
              {filteredBooks.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#222] border border-[#D4AF37]/40 p-6 rounded-3xl shadow-lg hover:shadow-xl transition"
                >

                  <div className="w-full aspect-[3/4] overflow-hidden rounded-2xl mb-4 border border-[#D4AF37]/40">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-bold text-xl mb-1 text-[#D4AF37]">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 mb-1">Stok: {item.stock}</p>

                  <p
                    className={`font-semibold ${
                      item.stock > 0 ? "text-green-400" : "text-red-400"
                    }`}
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

