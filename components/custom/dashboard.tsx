"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BASE_URL, TOKEN, MEMBER_NAME } from "../../lib/constant";

const Dashboard = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [returns, setReturns] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalBuku: 0,
    bukuTersedia: 0,
    dipinjamHariIni: 0,
    pengembalianHariIni: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      };

      const params = new URLSearchParams({
        page: "1",
        page_size: "5000",
      });

      const [bookRes, loanRes, returnRes] = await Promise.all([
        fetch(`${BASE_URL}/api/book/list?${params}`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${BASE_URL}/api/loan/list?${params}`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${BASE_URL}/api/return/list?${params}`, {
          headers,
          cache: "no-store",
        }),
      ]);

      const bookJson = await bookRes.json();
      const loanJson = await loanRes.json();
      const returnJson = await returnRes.json();

      const bookList = bookJson?.data ?? [];
      const loanList = loanJson?.data ?? [];
      const returnList = returnJson?.data ?? [];

      setBooks(bookList);
      setLoans(loanList);
      setReturns(returnList);

      const today = new Date().toISOString().split("T")[0];

      const availableBooks = bookList.reduce(
        (total: number, b: any) => total + (b.stock > 0 ? b.stock : 0),
        0
      );

      const todayLoans = loanList.filter(
        (l: any) => l.loan_date === today
      );

      const todayReturns = returnList.filter(
        (r: any) => r.return?.actual_return_date === today
      );

      setSummary({
        totalBuku: bookJson?.meta?.pagination?.total ?? bookList.length,
        bukuTersedia: availableBooks,
        dipinjamHariIni: todayLoans.length,
        pengembalianHariIni: todayReturns.length,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const MAX_DASHBOARD_BOOKS = 6;

  const dashboardBooks = books
    .filter((b) => b.stock > 0)
    .slice(0, MAX_DASHBOARD_BOOKS);

  const today = new Date().toISOString().split("T")[0];

  const todayLoans = loans.filter(
    (l: any) => l.loan_date === today
  );

  const todayReturns = returns.filter(
    (r: any) => r.return?.actual_return_date === today
  );

if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f5fb]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        <p className="text-sm text-gray-600">Memuat data perpustakaan...</p>
      </div>
    </div>
  );
}

  return (
    <main className="min-h-screen w-full bg-[#f3efff] px-8 py-10">
      <div className="w-full space-y-14">

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-40 rounded-3xl bg-white p-8 shadow-lg border border-purple-200 flex flex-col justify-center items-center text-center">
            <p className="text-base text-purple-500">Total Buku</p>
            <p className="mt-3 text-4xl font-bold text-purple-700">
              {loading ? "..." : summary.totalBuku}
            </p>
          </div>

          <div className="h-40 rounded-3xl bg-white p-8 shadow-lg border border-purple-200 flex flex-col justify-center items-center text-center">
            <p className="text-base text-purple-500">Buku Tersedia</p>
            <p className="mt-3 text-4xl font-bold text-purple-700">
              {loading ? "..." : summary.bukuTersedia}
            </p>
          </div>

          <div className="h-40 rounded-3xl bg-white p-8 shadow-lg border border-purple-200 flex flex-col justify-center items-center text-center">
            <p className="text-base text-purple-500">Dipinjam Hari Ini</p>
            <p className="mt-3 text-4xl font-bold text-purple-700">
              {loading ? "..." : summary.dipinjamHariIni}
            </p>
          </div>

          <div className="h-40 rounded-3xl bg-white p-8 shadow-lg border border-purple-200 flex flex-col justify-center items-center text-center">
            <p className="text-base text-purple-500">Pengembalian Hari Ini</p>
            <p className="mt-3 text-4xl font-bold text-purple-700">
              {loading ? "..." : summary.pengembalianHariIni}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-10 shadow-lg border border-purple-200">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-purple-700">
              Stok Buku
            </h3>
            <Link
              href="/buku"
              className="text-base text-purple-600 hover:text-purple-800 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {dashboardBooks.map((b: any) => (
              <div
                key={b.id}
                className="rounded-2xl border border-purple-200 bg-purple-50 p-6 shadow-md hover:shadow-lg transition"
              >
                <img
                  src={
                    b.cover?.url
                      ? `${BASE_URL}${b.cover.url}`
                      : "/placeholder-book.jpg"
                  }
                  className="h-48 w-full rounded-xl object-cover"
                />
                <p className="mt-4 text-base font-semibold text-purple-800 truncate">
                  {b.title}
                </p>
                <p className="mt-2 text-sm text-purple-600">
                  Stok: {b.stock}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid w-full gap-10 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-10 shadow-lg border border-purple-200">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-purple-700">
                Peminjaman Hari Ini
              </h3>
              <Link
                href="/peminjaman"
                className="text-base text-purple-600 hover:text-purple-800 hover:underline"
              >
                Detail
              </Link>
            </div>

            {todayLoans.length === 0 && (
              <p className="text-base text-purple-400">
                Tidak ada peminjaman hari ini
              </p>
            )}

            {todayLoans.map((p: any) => (
              <div key={p.id} className="mb-5 border-b border-purple-100 pb-4">
                <p className="text-base font-semibold text-purple-800">
                  {p.member?.name}
                </p>
                <p className="text-sm text-purple-600">
                  {p.book?.title}
                </p>
                <p className="text-sm text-purple-400">
                  {p.loan_date}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-lg border border-purple-200">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-purple-700">
                Pengembalian Hari Ini
              </h3>
              <Link
                href="/pengembalian"
                className="text-base text-purple-600 hover:text-purple-800 hover:underline"
              >
                Detail
              </Link>
            </div>

            {todayReturns.length === 0 && (
              <p className="text-base text-purple-400">
                Tidak ada pengembalian hari ini
              </p>
            )}

            {todayReturns.map((p: any) => (
              <div key={p.id} className="mb-5 border-b border-purple-100 pb-4">
                <p className="text-base font-semibold text-purple-800">
                  {p.member?.name}
                </p>
                <p className="text-sm text-purple-600">
                  {p.book?.title}
                </p>
                <p className="text-sm text-purple-400">
                  {p.return?.actual_return_date}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
};

export default Dashboard;
