'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BASE_URL, TOKEN, MEMBER_NAME } from '../../lib/constant';

const DashboardContent = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [returns, setReturns] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const headers = {
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        };

        const [bookRes, loanRes, returnRes] = await Promise.all([
          fetch(`${BASE_URL}/api/book/list`, { headers, cache: 'no-store' }),
          fetch(`${BASE_URL}/api/loan/list`, { headers, cache: 'no-store' }),
          fetch(`${BASE_URL}/api/return/list`, { headers, cache: 'no-store' })
        ]);

        const bookJson = await bookRes.json();
        const loanJson = await loanRes.json();
        const returnJson = await returnRes.json();

        setBooks(bookJson?.data ?? []);
        setLoans(loanJson?.data ?? []);
        setReturns(returnJson?.data ?? []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    })();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const totalBooks = books.length;
  const availableBooks = books.reduce(
    (total, b) => total + (b.stock > 0 ? b.stock : 0),
    0
  );

  const todayLoans = loans.filter((l) => l.loan_date === today);
  const todayReturns = returns.filter(
    (r) => r.return?.actual_return_date === today
  );

  const MAX_DASHBOARD_BOOKS = 4;

  const dashboardBooks = books
    .filter((b) => b.stock > 0)
    .slice(0, MAX_DASHBOARD_BOOKS);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* BOX SUMMARY */}
      <div className="mb-10 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded bg-white p-5 text-center shadow-md transition hover:shadow-lg">
          <p className="text-sm text-gray-600">Total Buku</p>
          <p className="text-2xl font-bold">{totalBooks}</p>
        </div>

        <div className="rounded bg-white p-5 text-center shadow-md transition hover:shadow-lg">
          <p className="text-sm text-gray-600">Buku Tersedia</p>
          <p className="text-2xl font-bold">{availableBooks}</p>
        </div>

        <div className="rounded bg-white p-5 text-center shadow-md transition hover:shadow-lg">
          <p className="text-sm text-gray-600">Dipinjam Hari Ini</p>
          <p className="text-2xl font-bold">{todayLoans.length}</p>
        </div>

        <div className="rounded bg-white p-5 text-center shadow-md transition hover:shadow-lg">
          <p className="text-sm text-gray-600">Pengembalian Hari Ini</p>
          <p className="text-2xl font-bold">{todayReturns.length}</p>
        </div>
      </div>

      {/* STOK BUKU */}
      <div className="mb-10 rounded bg-white p-6 transition hover:shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold md:text-xl">Stok Buku</h3>
          <Link
            href="/buku"
            className="text-sm text-green-600 hover:underline md:text-base"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {dashboardBooks.map((b, i) => (
            <div key={i} className="rounded border bg-white p-3 shadow-sm">
              <img
                src={
                  b.cover?.url
                    ? `${BASE_URL}${b.cover?.url}`
                    : '/placeholder-book.jpg'
                }
                className="h-32 w-full rounded object-cover md:h-40"
              />
              <p className="mt-2 text-sm font-semibold md:text-base">
                {b.title}
              </p>

              <p
                className={`mt-1 w-fit rounded px-2 py-1 text-xs md:text-sm ${
                  b.stock === 0
                    ? 'bg-red-100 text-red-700'
                    : b.stock <= 10
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {b.stock > 0 ? 'Tersedia' : 'Habis'}
              </p>

              <p className="mt-1 text-xs text-gray-600 md:text-sm">
                Stok: {b.stock}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* PEMINJAMAN */}
        <div className="rounded bg-white p-6 shadow-md transition hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold md:text-xl">
              Peminjaman Hari Ini
            </h3>
            <Link
              href="/peminjaman"
              className="text-sm text-green-600 hover:underline md:text-base"
            >
              Detail
            </Link>
          </div>

          {todayLoans.map((p, i) => (
            <div key={i} className="mb-4 border-b pb-3">
              <p className="text-sm font-semibold md:text-base">
                {p.member?.name}
              </p>
              <p className="text-xs text-gray-600 md:text-sm">
                {p.book?.title}
              </p>
              <p className="text-xs text-gray-500 md:text-sm">
                {p.loan?.loan_date}
              </p>
            </div>
          ))}
        </div>

        {/* PENGEMBALIAN */}
        <div className="rounded bg-white p-6 shadow-md transition hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold md:text-xl">
              Pengembalian Hari Ini
            </h3>
            <Link
              href="/pengembalian"
              className="text-sm text-green-600 hover:underline md:text-base"
            >
              Detail
            </Link>
          </div>

          {todayReturns.map((p, i) => (
            <div key={i} className="mb-4 border-b pb-3">
              <p className="text-sm font-semibold md:text-base">
                {p.member?.name}
              </p>
              <p className="text-xs text-gray-600 md:text-sm">
                {p.book?.title}
              </p>
              <p className="text-xs text-gray-500 md:text-sm">
                {p.return?.return_date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
