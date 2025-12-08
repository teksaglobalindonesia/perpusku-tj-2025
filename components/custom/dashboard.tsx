"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Dashboard = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

  const books = [
    { id: 1, title: "Laskar Pelangi", stock: 5, status: "Tersedia" },
    { id: 2, title: "Bumi Manusia", stock: 0, status: "Habis" },
    { id: 3, title: "Negeri 5 Menara", stock: 3, status: "Tersedia" },
    { id: 4, title: "Dilan 1990", stock: 0, status: "Habis" },
  ];

  const borrowings = [
    { id: 1, name: "Andi", book: "Laskar Pelangi", date: "08 Des 2025" },
    { id: 2, name: "Siti", book: "Bumi Manusia", date: "08 Des 2025" },
    { id: 3, name: "Budi", book: "Negeri 5 Menara", date: "08 Des 2025" },
  ];

  const returns = [
    { id: 1, name: "Rina", book: "Dilan 1990", date: "08 Des 2025" },
    { id: 2, name: "Tono", book: "Laskar Pelangi", date: "08 Des 2025" },
  ];

  useEffect(() => {
    // Header animation
    gsap.from(headerRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    // Statistik cards

    // Stok buku
    gsap.from(bookRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: "power2.out",
    });

    // Aktivitas
    gsap.from(activityRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav
        ref={headerRef}
        className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-50"
      >
        <h1 className="text-2xl font-bold text-blue-600">PerpusKu 📚</h1>

        <div className="flex gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600 border-b-2 border-blue-600 pb-1">
            Dashboard
          </Link>
          <Link href="/buku" className="hover:text-blue-600">Buku</Link>
          <Link href="/anggota" className="hover:text-blue-600">Anggota</Link>
          <Link href="/peminjaman" className="hover:text-blue-600">Peminjaman</Link>
          <Link href="/pengembalian" className="hover:text-blue-600">Pengembalian</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Statistik */}
        <section
          ref={statRef}
          className="grid grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: "Total Buku", value: 120 },
            { title: "Buku Tersedia", value: 95 },
            { title: "Dipinjam Hari Ini", value: 15 },
            { title: "Pengembalian Hari Ini", value: 10 },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {stat.value}
              </h3>
            </div>
          ))}
        </section>

        {/* Konten utama */}
        <section className="grid grid-cols-3 gap-6">
          {/* Stok buku */}
          <div
            ref={bookRef}
            className="col-span-2 bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Stok Buku</h2>
              <Link href="/buku" className="text-sm text-blue-600 hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="border rounded-xl p-4 hover:shadow transition"
                >
                  <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                    {book.title}
                  </h3>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Stok: {book.stock}</span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        book.status === "Tersedia"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aktivitas */}
          <div ref={activityRef} className="space-y-6">
            {/* Peminjaman */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Peminjaman Hari Ini</h2>
                <Link href="/peminjaman" className="text-sm text-blue-600 hover:underline">
                  Detail
                </Link>
              </div>

              <div className="space-y-4">
                {borrowings.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-3 last:border-none"
                  >
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.book}</p>
                    </div>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengembalian */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Pengembalian Hari Ini</h2>
                <Link href="/pengembalian" className="text-sm text-blue-600 hover:underline">
                  Detail
                </Link>
              </div>

              <div className="space-y-4">
                {returns.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-3 last:border-none"
                  >
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.book}</p>
                    </div>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
