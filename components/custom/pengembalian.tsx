'use client';

import { useEffect, useState } from 'react';
import { BASE_URL, TOKEN, MEMBER_NAME } from '../../lib/constant';

const PengembalianPage = () => {
  const [search, setSearch] = useState('');
  const [returns, setReturns] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/return/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
            'x-member-name': MEMBER_NAME
          },
          cache: 'no-store'
        });

        const json = await res.json();
        setReturns(json?.data || []);
      } catch (err) {
        console.error('Gagal ambil pengembalian:', err);
      }
    })();
  }, []);

  const filtered = returns.filter((item) =>
    (item.book?.title ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const isLate = (dueDate?: string, actualReturnDate?: string) => {
    if (!dueDate || !actualReturnDate) return false;

    const due = new Date(dueDate);
    const returned = new Date(actualReturnDate);

    return returned > due;
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-green-700">Pengembalian</h1>

      {/* SEARCH */}
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
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-green-800">
                  {item.book?.title}
                </p>
                <p className="text-gray-600">Peminjam: {item.member?.name}</p>
                <p className="text-gray-600">Peminjaman: {item.loan_date}</p>
                <p className="text-gray-600">
                  Jatuh Tempo: {item.return?.actual_return_date}
                </p>
                <p className="text-gray-600">
                  Dikembalikan: {item.return_date}
                </p>

                {isLate(item.return_date, item.return?.actual_return_date) && (
                  <span className="mt-2 inline-block rounded-lg bg-[#FFD6D6] px-3 py-1 text-xs font-semibold text-[#7A1F1F]">
                    TERLAMBAT
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-gray-600">
          Data pengembalian tidak ditemukan.
        </p>
      )}
    </div>
  );
};

export default PengembalianPage;
