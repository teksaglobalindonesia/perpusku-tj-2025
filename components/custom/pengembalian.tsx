'use client';

import { useEffect, useState } from 'react';
import { BASE_URL, TOKEN, MEMBER_NAME } from '../../lib/constant';

const PengembalianPage = () => {
  const [search, setSearch] = useState('');
  const [returns, setReturns] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;
  const [totalPages, setTotalPages] = useState(1);

  const fetchReturns = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
        search: search
      });

      const res = await fetch(
        `${BASE_URL}/api/return/list?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
            'x-member-name': MEMBER_NAME
          },
          cache: 'no-store'
        }
      );

      const json = await res.json();

      setReturns(json?.data || []);

      if (json?.meta?.pagination?.page_count) {
        setTotalPages(json.meta.pagination.page_count);
      }
    } catch (err) {
      console.error('Gagal ambil pengembalian:', err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const renderPagination = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => setPage(p)}
        className={`rounded-lg px-4 py-2 text-sm ${
          page === p
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {p}
      </button>
    ));
  };

  const isLate = (dueDate?: string, actualReturnDate?: string) => {
    if (!dueDate || !actualReturnDate) return false;

    const due = new Date(dueDate);
    const returned = new Date(actualReturnDate);

    return returned > due;
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-green-700">Pengembalian</h1>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <input
          type="text"
          placeholder="Cari judul buku..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {returns.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-green-800">
                {item.book?.title}
              </p>

              <div className="flex items-center gap-x-3 overflow-x-auto whitespace-nowrap text-sm text-gray-600">
                <span>
                  Peminjam:{' '}
                  <span className="font-medium">{item.member?.name}</span>
                </span>

                <span className="text-gray-400">•</span>
                <span>Tanggal Pinjam: {item.loan_date}</span>

                <span className="text-gray-400">•</span>
                <span>Dikembalikan: {item.return?.actual_return_date}</span>

                <span className="text-gray-400">•</span>
                <span>Estimasi Kembali: {item.return_date}</span>
              </div>

              {isLate(item.return_date, item.return?.actual_return_date) && (
                <div className="mt-1">
                  <span className="inline-block rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                    TERLAMBAT
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/*PAGINATION*/}
      <div className="mt-8 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg bg-gray-200 px-3 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        {renderPagination()}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg bg-gray-200 px-3 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {returns.length === 0 && (
        <p className="mt-10 text-center text-gray-600">
          Data pengembalian tidak ditemukan.
        </p>
      )}
    </div>
  );
};

export default PengembalianPage;
