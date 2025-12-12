'use client';

import { useState } from 'react';

export default function AnggotaPage() {
  const [search, setSearch] = useState('');

  const anggotaData = [
    {
      id: 1,
      nama: 'Rina Putri',
      nomor: 'AG001',
      alamat: 'Jakarta Selatan',
      email: 'rina@gmail.com'
    },
    {
      id: 2,
      nama: 'Bagas Pratama',
      nomor: 'AG002',
      alamat: 'Bandung',
      email: 'bagas@gmail.com'
    },
    {
      id: 3,
      nama: 'Siti Marlina',
      nomor: 'AG003',
      alamat: 'Depok',
      email: 'siti@gmail.com'
    }
  ];

  const filtered = anggotaData.filter((a) =>
    a.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <h1 className="mb-6 text-3xl font-bold text-green-700">Data Anggota</h1>

      {/* Search + Tambah — SAMA dengan halaman Buku */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <input
          type="text"
          placeholder="Cari nama anggota..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="w-full rounded-full bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700 sm:w-auto">
          Tambah Anggota
        </button>
      </div>

      {/* Card List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-xl border border-green-300 bg-white p-4 shadow-sm"
          >
            <h2 className="mb-1 text-xl font-bold text-green-800">
              {item.nama}
            </h2>
            <p className="text-gray-500">Nomor Anggota: {item.nomor}</p>
            <p className="text-gray-500">Alamat: {item.alamat}</p>
            <p className="mb-4 text-gray-500">Email: {item.email}</p>

            {/* Button Actions */}
            <div className="mt-2 flex items-center gap-3">
              <button className="rounded-lg bg-[#CFE8FF] px-3 py-2 text-sm font-medium text-[#1E4A7B] hover:bg-[#B7DBFF]">
                Lihat Peminjaman
              </button>

              <button className="rounded-lg bg-[#FFF3C4] px-3 py-2 text-sm font-medium text-[#7A5C00] hover:bg-[#FFE9A1]">
                Edit
              </button>

              <button className="rounded-lg bg-[#FFD6D6] px-3 py-2 text-sm font-medium text-[#7A1F1F] hover:bg-[#FFBFBF]">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
