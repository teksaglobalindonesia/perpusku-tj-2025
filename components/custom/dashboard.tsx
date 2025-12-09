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
  { id: 1, title: "Dr. STONE", cover: "dr-stone.jpg", stock: 5, status: "Tersedia" },
  { id: 2, title: "Death Note", cover: "death-note.jpg", stock: 0, status: "Habis" },
  { id: 3, title: "How to Win at Chess", cover: "chess-guide.jpg", stock: 3, status: "Tersedia" },
  { id: 4, title: "Harry Potter", cover: "harry-potter.jpg", stock: 10, status: "Tersedia" },
];


  const borrowings = [
    { id: 1, name: "Andi", book: "Death Note", date: "08 Des 2025" },
    { id: 2, name: "Siti", book: "Hunter X Hunter", date: "08 Des 2025" },
    { id: 3, name: "Budi", book: "Dr. STONE", date: "08 Des 2025" },
  ];

  const returns = [
    { id: 1, name: "Rina", book: "Harry Potter", date: "08 Des 2025" },
    { id: 2, name: "Tono", book: "How to Win at Chess", date: "08 Des 2025" },
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Statistik */}
      <section
        ref={statRef}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        {[
          { title: "Total Buku", value: 120 },
          { title: "Buku Tersedia", value: 90 },
          { title: "Dipinjam Hari Ini", value: 15 },
          { title: "Pengembalian Hari Ini", value: 10 },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <p className="text-xs sm:text-sm text-gray-500">{stat.title}</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
              {stat.value}
            </h3>
          </div>
        ))}
      </section>

      {/* Konten utama */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stok buku */}
        <div
          ref={bookRef}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-semibold">Stok Buku</h2>
            <Link
              href="/buku"
              className="text-xs sm:text-sm text-blue-600 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="border rounded-xl p-3 sm:p-4 hover:shadow transition flex flex-col"
              >
                {/* Cover */}
                <div className="w-full h-32 sm:h-40 bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={`/images/${book.cover}`}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-2 line-clamp-2">
                  {book.title}
                </h3>

                <div className="mt-auto flex justify-between items-center text-[10px] sm:text-xs">
                  <span className="text-gray-500">
                    Stok: {book.stock}
                  </span>
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
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold">
                Peminjaman Hari Ini
              </h2>
              <Link
                href="/peminjaman"
                className="text-xs sm:text-sm text-blue-600 hover:underline"
              >
                Detail
              </Link>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {borrowings.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2 sm:pb-3 last:border-none"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-xs sm:text-sm">
                      {item.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {item.book}
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pengembalian */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold">
                Pengembalian Hari Ini
              </h2>
              <Link
                href="/pengembalian"
                className="text-xs sm:text-sm text-blue-600 hover:underline"
              >
                Detail
              </Link>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {returns.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2 sm:pb-3 last:border-none"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-xs sm:text-sm">
                      {item.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {item.book}
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {item.date}
                  </span>
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
