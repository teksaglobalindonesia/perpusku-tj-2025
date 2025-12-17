'use client';

import { useState } from 'react';

export default function PengembalianPage() {
  const [search, setSearch] = useState('');

  const pengembalianData = [
    {
      id: 1,
      judul: 'Narasi Perihal Ayah',
      peminjam: 'Rina Putri',
      pinjam: '17 Juli 2025, 08.00',
      jatuhTempo: '24 Juli 2025',
      dikembalikan: '24 Juli 2025',
      status: 'normal'
    },
    {
      id: 2,
      judul: 'Laut Bercerita',
      peminjam: 'Bagas Pratama',
      pinjam: '10 Juli 2025, 08.00',
      jatuhTempo: '17 Juli 2025',
      dikembalikan: '24 Juli 2025',
      status: 'terlambat'
    },
    {
      id: 3,
      judul: 'Sisi Tergelap Surga',
      peminjam: 'Siti Marlina',
      pinjam: '17 Juli 2025, 08.00',
      jatuhTempo: '24 Juli 2025',
      dikembalikan: '24 Juli 2025',
      status: 'normal'
    },
    {
      id: 4,
      judul: 'Bandung After Rain',
      peminjam: 'Rendi',
      pinjam: '10 Juli 2025, 08.00',
      jatuhTempo: '17 Juli 2025',
      dikembalikan: '24 Juli 2025',
      status: 'terlambat'
    }
  ];

  const filtered = pengembalianData.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-green-700">Pengembalian</h1>

      {/* SEARCH */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
        <input
          type="text"
          placeholder="Cari judul buku..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:max-w-xs"
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
                  Judul Buku: {item.judul}
                </p>
                <p className="text-gray-600">Peminjam: {item.peminjam}</p>
                <p className="text-gray-600">Peminjaman: {item.pinjam}</p>
                <p className="text-gray-600">Jatuh Tempo: {item.jatuhTempo}</p>
                <p className="text-gray-600">
                  Dikembalikan: {item.dikembalikan}
                </p>

                {item.status === 'terlambat' && (
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
}
