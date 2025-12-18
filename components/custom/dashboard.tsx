"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { BASE_URL, TOKEN, MEMBER_NAME } from "@/lib/constant";

const Dashboard = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

const [books, setBooks] = useState<any[]>([]);
const [loans, setLoans] = useState<any[]>([]);
const [returns, setReturns] = useState<any[]>([]);


useEffect(() => {
  (async () => {
    try {
      const headers = {
        
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      };

      const [bookRes, loanRes, returnRes] = await Promise.all([
        fetch(`${BASE_URL}/api/book/list`, { headers, cache: "no-store" }),
        fetch(`${BASE_URL}/api/loan/list`, { headers, cache: "no-store" }),
        fetch(`${BASE_URL}/api/return/list`, { headers, cache: "no-store" }),
      ]);

      const bookJson = await bookRes.json();
      const loanJson = await loanRes.json();
      const returnJson = await returnRes.json();

      setBooks(bookJson?.data ?? []);
      setLoans(loanJson?.data ?? []);
      setReturns(returnJson?.data ?? []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  })();
}, []);

const today = new Date().toISOString().split("T")[0];

const totalBooks = books.length;
const availableBooks = books.filter(b => b.stock > 0).length;

const todayLoans = loans.filter(l => l.loan_date === today);
const todayReturns = returns.filter(
  r => r.return?.actual_return_date === today
);


;

return (
  <div className="min-h-screen bg-gray-100">
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Statistik */}
      <section
        ref={statRef}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        {[
          { title: "Total Buku", value: totalBooks },
          { title: "Buku Tersedia", value: availableBooks },
          { title: "Dipinjam Hari Ini", value: todayLoans.length },
          { title: "Pengembalian Hari Ini", value: todayReturns.length },
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
                    src={`${BASE_URL}${book.cover?.url}`}
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
              {todayLoans.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2 sm:pb-3 last:border-none"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-xs sm:text-sm">
                      {item.member?.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {item.book?.title}
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {item.loan?.loan_date}
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
                      {item.member?.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {item.book?.title}
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {item.return?.return_date}
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
